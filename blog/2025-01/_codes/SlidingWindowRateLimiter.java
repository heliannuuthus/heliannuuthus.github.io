public class SlidingWindowRateLimiter {
    private final RedissonReactiveClient redissonClient;
    private final int windowSize; // 窗口大小（秒）
    private final int maxRequests; // 窗口内最大请求数
    private final int bucketSize; // 单个桶大小

    public SlidingWindowRateLimiter(RedissonReactiveClient client, String key, 
            int windowSize, int maxRequests) {
        this.redissonClient = client;
        this.windowSize = windowSize;
        this.maxRequests = maxRequests;
        this.bucketSize = maxRequests / windowSize;
    }

    public Mono<Boolean> tryAcquire() {
        return tryAcquire(1);
    }

    public Mono<Boolean> tryAcquire(int permits) {
        long now = System.currentTimeMillis() / 1000 * bucketSize; // bucket size 本质是将窗口精度缩小
        long windowStart = now - windowSize * bucketSize;
        RMapReactive<Long, Integer> buckets = redissonClient.getMap(key);
        return buckets.getAll()
            // 1. 获取所有桶并过滤掉过期的
            .map(map -> map.entrySet().stream()
                .filter(entry -> entry.getKey() > windowStart)
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue)))
            // 2. 计算当前窗口内的总请求数
            .flatMap(currentBuckets -> {
                AtomicInteger totalRequests = new AtomicInteger(0);
                Map<Long, Integer> currentBuckets = currentBuckets.entrySet().stream()
                .filter(entry -> {
                  if (entry.getKey() > windowStart) {
                    totalRequests.addAndGet(entry.getValue());
                    return true;
                  }
                  return false;
                }).collect(Collectors.toMap(
                  Map.Entry::getKey,
                  Map.Entry::getValue
                ));
               
                // 检查是否超过窗口限制
                if (totalRequests >= maxRequests) {
                    return Mono.just(false);
                }
                currentBuckets.compute(now, (k, v) -> v == null ? permits : v + permits);
                return buckets.fastPutAll(currentBuckets)
                    .then(Mono.just(true));
            })
            .map(b -> {
                // customized exception
                if (!b) {
                    throw new TooManyRequestsException("Rate limit exceeded");
                }
                return true;
            })
            .doOnError(e -> {
                // alter
                e.printStackTrace();
            });
    }
}