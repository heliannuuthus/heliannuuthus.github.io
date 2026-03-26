import { getBlogPosts, type PostMeta } from "@/lib/content";
import { Card } from "@heroui/react/card";
import PostCard from "@/components/post-card";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <section className="flex flex-col-reverse sm:flex-row items-center gap-12 sm:gap-20">
      <div className="flex-1 flex flex-col gap-5">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            heliannuuthus
          </span>
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
          Backend Engineer. Writing about distributed systems, authentication,
          cloud-native, and everything in between.
        </p>
        <div className="flex gap-3 mt-3">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-85 hover:scale-[1.02] active:scale-[0.98]"
          >
            Read Blog
          </Link>
          <Link
            href="/essay"
            className="inline-flex items-center justify-center h-11 px-7 rounded-full text-sm font-medium tracking-wide text-zinc-600 dark:text-zinc-300 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98]"
          >
            Essays
          </Link>
        </div>
      </div>
      <div className="relative">
        <div className="surface rounded-full p-3">
          <Image
            src="/img/heliannuuthus-256.svg"
            alt="heliannuuthus avatar"
            width={160}
            height={160}
            className="rounded-full"
            priority
          />
        </div>
        <div className="absolute -z-10 inset-[-20%] bg-gradient-to-br from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl" />
      </div>
    </section>
  );
}

const aboutItems = [
  {
    title: "Backend",
    description:
      "Distributed systems, microservices, Go, Java, and cloud-native development.",
    gradient: "from-violet-500/10 to-blue-500/10 dark:from-violet-500/5 dark:to-blue-500/5"
  },
  {
    title: "Security",
    description:
      "OAuth 2.1, FIDO2/WebAuthn, identity management, and zero-trust architecture.",
    gradient: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5"
  },
  {
    title: "Cloud Native",
    description:
      "Kubernetes, container orchestration, service mesh, and infrastructure as code.",
    gradient: "from-orange-500/10 to-rose-500/10 dark:from-orange-500/5 dark:to-rose-500/5"
  }
];

function AboutCards() {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        What I Do
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {aboutItems.map((card) => (
          <Card
            key={card.title}
            className={`surface rounded-[20px] p-7 transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)] hover:surface-raised hover:-translate-y-1 bg-gradient-to-br ${card.gradient}`}
          >
            <Card.Content className="flex flex-col gap-3 p-0">
              <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {card.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {card.description}
              </p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}

function RecentPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="flex flex-col gap-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Recent Posts
        </h2>
        <Link
          href="/blog"
          className="text-[13px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          View all &rarr;
        </Link>
      </div>
      <div className="flex flex-col gap-3.5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} basePath="/blog" />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const posts = getBlogPosts().slice(0, 5);

  return (
    <div className="flex flex-col gap-24 py-10">
      <Hero />
      <AboutCards />
      <RecentPosts posts={posts} />
    </div>
  );
}
