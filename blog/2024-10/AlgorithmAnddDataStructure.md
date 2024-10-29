---
slug: 算法数据结构总结
title: 算法数据结构总结
authors: [heliannuuthus]
tags: [Java]
---

根据[代码随想录](https://programmercarl.com/)以及 [LeetCode 官方题解](https://leetcode.cn/problemset/all/)总结的，主要记录一些常见的数据结构与算法。

<!-- truncate -->

# 算法数据结构总结

## 数组

### 数据结构

> 二维数组在某些语言内的存储可能是不连续的

1. 存储：连续内存，根据不同的语言可能实现稍有不同
   - 连续内存意味着，方便查询，难于删除和插入
2. 查询：根据索引可直接获取
3. 增删：需要挪动索引位置往后的所有元素

### 算法思路

> 介绍了二分查找，双指针（包括遍历双指针，滑动窗口，遍历填充），前缀和

#### 二分查找

1. 循环不变量： 在循环中，某些值是可以确定的，这些值不会随着循环改变
2. 二分查找的区间定义十分重要，通常为`左闭右开`或者`左闭右闭`
   - `左闭右开`：对于 `left == right` 的条件是**没意义**的，如果右区间缩短，可调整为 right = middle
   - `左闭右闭`：对于 `left == right` 的条件是**有意义**的，如果右区间缩短，可调整为 right = middle - 1
3. 二分查找可用于寻找边界，能迅速缩短区间范围

#### 双指针

1. `快慢指针`： 多用于删除元素，覆盖元素
2. `滑动窗口`： 单层 for 循环一定是滑动窗口的`终止指针`，而左边则是`动态（起始）指针`
   - 确定窗口内是什么
   - 如何移动起始指针
   - 如何移动终止指针
3. `遍历填充`：多用于画各种螺旋矩阵，不多说，按照四边分别遍历然后缩边即可。
   - 注意跳出的条件，在`非中心对称的矩阵`中可于`每次缩边`时判断返回条件

#### 前缀和

1. 多用于重复计算的场景，或者是多次`回溯依赖条件`的计算

## 链表

### 数据结构

> 分为单链表，双链表以及循环链表

1. 存储: 可不连续内存
2. 查询：需遍历索引之前的元素
3. 增删：直接删除或添加即可

### 算法思路

#### 虚拟头节点

针对`单独处理头节点`的特殊场景都可以使用虚拟头节点将头节点 **归一化**

#### 操作链表

可使用 head 以及 tail 增加效率（难度有所上升，但是效率较高）

- head 为 dummy 单链表节点
- tail 为 dummy 双链表节点，当然也可以将 next 视为 prev
- 添加 length 规避无效操作

#### 翻转链表

1. 思路一：递归回溯
   1. 递归到最后方的节点作为 head 返回
   2. 到下一层重置 next 为 current
   3. 最外层重置 next 为 null，否则是循环链表，没有 null
2. 思路二：三指针正序遍历
   1. 将 prev 指定为 null，当前操作链表节点指定为 current ，next 为 current.next
   2. 将 current.next 指向 prev，将 current 指向 next 开始下一轮遍历
   3. 在每次遍历结束时更新 prev 为 current，current 为 next
   4. 每次遍历开始时更新 next 为 current.next

#### 两两交换链表

单节点不用判断，故而需要得知下两个节点的情况

- 借助 dummy node，可实现头部的转换
  1. 将 current.next 指向 next.next（即下次交换的点）
  2. 将 next.next 指向 current
  3. 将 prev.next 指向 next
  4. 将 prev 指向 current 进入下次循环

#### 删除链表的倒数第 N 个节点

1. 思路一：快慢指针
   1. 将 fast 前移 N + 1 个节点处（+1 是为了方便删除）
   2. 移动 fast 和 slow，当 fast 到达 NULL 节点时 slow.next 即为删除的元素
2. 思路二：递归回溯
   1. 递归到最后方的节点，开始返回，并且减少 n 的值（数倒数第几个）
   2. 数到 n + 1 时可停下，current.next 即为待删除的节点

#### 链表相交

> 这道题很抽象，感觉很多条件都有边界，但是实际又没有

1. 遍历两个链表获得长度差值，利用快慢指针
2. 两个链表一起遍历，如果遇到一样的值可直接返回（题中提到不会有环型链表，故而不用在意后面是否还有相同的数）

#### 环形链表

> 重点在于公式的推导，利用快慢指针可解

1. 快指针步长为 2，慢指针步长为 1
2. 设 head 到环入口长度为 x
3. 快指针在慢指针走完一圈之前肯定能追上慢指针，慢指针从入口到被追上距离设置为 y
4. 环长度设置为 z
5. 快指针追上慢指针时刚好为一圈（步长 1 和 2 的优势），故而可得 x + y + z == 2 (x + y) ==> x = z - y，即慢指针跑完一圈，刚好是慢指针从 head 到入口的距离

## 字符串

> 这对这个版本的我来说，库函数都是在害我（打基础 ing）

### 数据结构

1. 存储：连续内存，Java 11 及以下版本是 char[]，Java 11 及以上版本是 byte[]
2. 查询：根据索引可直接获取
3. 增删：需要挪动索引位置往后的所有元素
4. Java 中字符串是不可变的，每次操作都会生成新的字符串

### 算法思路

#### 双指针

1. 判断是否可以使用双指针，字符串转 `char[]` 原地操作
   - 类似反转字符串，旋转字符串等
2. 填充类可以预先计算总长，观察是否会存在破坏性填充（数组的插入是需要成本的）
   - 可观察是否可以从后向前填充
3. 反转类对寻找规律，判断边界如果跳过记得在下一行 cover 住

#### KMP

> 这个我好像看懂了，反复观摩了很多遍。短期记忆内理解这个问题不大

1. 搞清楚前缀后缀分别是什么
   - **前缀**：除了字符串的最后一个字符其他的顺序子串
   - **后缀**：除了字符串的第一个字符其他的顺序子串
2. 最长相等前后缀是什么？有什么用？怎么用？
   - 是什么：记录着当前位置目标串与模式串匹配失败时，目标串回退的位置（非 KMP 会从头开始）
   - 有什么用：在不回退模式串的情况下，回退目标串即可继续匹配
   - 怎么用：匹配失败的时候搞个 `while` 循环回退一下吧

:::tip
在我看 [LeetCode-459 题解](https://leetcode.cn/problems/repeated-substring-pattern/solutions/)的时候（看了将近一天时间），深刻的了解了上面的全部概念，在 carl 哥的训导以及 LeetCode 官方的指教下看明白了。

carl 哥更多的是以一种最容易懂的方式讲题

LeetCode 官方题解直接上数学概念（不过不怎么难，也就看了那么 1234 遍吧）。

短期内我肯定还会反复看，加深映像以及彻底理解 KMP。
:::

## 栈与队列

### 数据结构

> 底层的实现通常是数组、链表或堆，堆最优

1. 栈：先进后出，针对 Java 内栈的实现，底层是数组，Stack 类继承了 Vector 类，内部均为同步方法，**不推荐使用**
2. 队列：先进先出，针对 Java 内队列的实现，底层是链表或者数组
   - LinkedList 类继承了 Queue 类，内部均为链表实现
   - ArrayDeque 类继承了 Deque 类，内部均为数组实现

### 算法思路

#### 括号匹配

1. 括号匹配问题通常使用栈来解决，因为栈的先进后出特性，可以方便地解决成对出现的括号

#### 字符串去重

1. 字符串双指针去重也是匹配问题，通过当前元素与栈顶元素比较，相同则出栈，不同则入栈
   - 社区提供了一套原地覆盖的方法，可以使用快慢指针覆盖重复项
   - 解法大致是，快指针遍历，进入循环时快指针赋值给慢指针
   - 慢指针判断当前位置和前一位置值是否相同（重复），相同即回退，不同即前进，快指针每次遍历都前进
   - 最后慢指针的位置即为去重后的字符串长度（substring 的 length）

#### 单调队列

1. 单调队列的本质是空间换时间，通过记录元素的索引，在遍历的过程中将不符合条件的元素出栈，从而达到优化时间复杂度的效果
2. 通常结合滑动窗口，用于寻找区间内的最大值，最小值等
3. 分为单调递增队列和单调递减队列
   - 单调递增队列：队列内元素从队首到队尾是递增的
     - 遇到比队尾元素大的元素，则从队尾开始出队，直到遇到比当前元素大的元素
   - 单调递减队列：队列内元素从队首到队尾是递减的
     - 遇到比队尾元素小的元素，则从队尾开始出队，直到遇到比当前元素小的元素

#### 优先级队列

1. 优先级队列的本质是堆，通过堆的性质，可以快速找到最大值或最小值
2. 通常用于查找热点数据，前 K 大数据等。
3. 优先级队列可由三种数据结构实现

| 数据结构 | 查询时间复杂度 | 插入时间复杂度 |
| :------: | :------------: | :------------: |
|   数组   |      O(1)      |      O(n)      |
|   链表   |      O(n)      |      O(1)      |
|  树(堆)  |    O(logn)     |    O(logn)     |

:::tip
Java 内优先级队列可使用 `PriorityQueue` ，默认**小顶堆**，可通过传入 `Comparator` 实现**大顶堆**。当元素为复合类型时，可使用自定义结构，最好重写 `equals` 和 `hashCode` 方法，或者直接使用数组这种复合元素存储。
:::

## 树

### 数据结构

1. 存储：非连续内存，通常使用链表存储
2. 查询：需要遍历所有父节点
3. 增删：需要遍历父节点

### 算法思路

#### 二叉树遍历

:::tip

- 前序遍历：根节点在第一次遍历
- 中序遍历：根节点在第二次遍历
- 后序遍历：根节点在最后一次遍历
  :::

##### 递归

> 较为简单，不赘述

1. 递归通常用于树的遍历，通过递归可以快速遍历所有节点
2. 递归的终止条件通常是节点为空
3. 递归的返回值通常是当前节点的值

##### 迭代

> 有点复杂，贴段代码理解一下

1. 迭代通常用于树的遍历，通过迭代可以快速遍历所有节点
2. 迭代通常使用栈或队列实现

###### 前序遍历

![二叉树前序遍历-2024-10-29-21-30-38](https://cdn.jsdelivr.net/gh/heliannuuthus/
heliannuuthus.github.io@assets/static/img/2024-10-29/二叉树前序遍历-2024-10-29-21-30-38.png)

```java title="/src/com/github/heliannuuthus/PreOrderTraversal.java" showLineNumbers
public class PreOrderTraversal {

   /**
    * 前序遍历
    * 核心逻辑是先记录值，再遍历左节点，最后遍历右节点
    * 在回溯时，如果当前节点有右节点，则需要先记录值，再进入右节点遍历
    * @param root 根节点
    * @return 前序遍历结果
    */
   public List<Integer> preorderTraversal(TreeNode root) {
      TreeNode curr = root;
      List<Integer> result = new ArrayList<>();
      Stack<TreeNode> stack = new Stack<>();
      // 5. 因为涉及遍历右节点，当从左节点遍历进行回溯时 curr 是有可能为 null 的，此时可通过出栈来回溯
      while (curr != null || !stack.isEmpty()) {
         // 1. 遍历到最左节点，将节点入栈，并记录值（前序为中左右）
         // 4. 此处切换为遍历右节点，也是先找到最左节点，然后可用栈回溯
         if (curr != null) {
            stack.push(curr);
            // 2. 记录值，当前节点的情况无非两种
            // 2.1 当前节点有左节点，则记录值，进入下次循环到达 line 15
            // 2.2 当前节点无左节点，则记录值，进入下次循环到达 line 22
            result.add(curr.val);
            curr = curr.left;
         } else {
            // 3. 无论何时都是率先遍历左节点，当遍历到当前开始的节点的最左节点时，开始遍历右节点
            curr = stack.pop().right;
         }
      }
      return result;
   }
}
```

###### 中序遍历

![二叉树中序遍历.drawio-2024-10-29-21-44-24](https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-10-29/二叉树中序遍历.drawio-2024-10-29-21-44-24.png)

```java title="/src/com/github/heliannuuthus/InOrderTraversal.java" showLineNumbers
public class InOrderTraversal {

   /**
    * 中序遍历
    * 在回溯后记录值，每个节点都是局部根节点
    * @param root 根节点
    * @return 中序遍历结果
    */
   public List<Integer> inorderTraversal(TreeNode root) {
      TreeNode curr = root;
      List<Integer> result = new ArrayList<>();
      Stack<TreeNode> stack = new Stack<>();
      while (curr != null || !stack.isEmpty()) {
         // 1. 遍历到最左节点，将节点入栈，并记录值（中序为左中右）
         // 4. 当前是右节点，视为新的局部根节点，先找到最左节点，然后回溯到父节点记录值，再进入右节点遍历
         if (curr != null) {
            stack.push(curr);
            curr = curr.left;
         } else {
            curr = stack.pop();
            // 2. 记录值，在回溯时（左边的节点已经遍历完）记录当前节点的值，当前节点有四种可能
            // 2.1 当前节点有左节点无右节点，当前从左节点回溯，记录值，并下次迭代回溯到父节点
            // 2.2 当前节点无左节点有右节点，即为局部根节点，需先于右节点记录值
            // 2.3 当前节点有左有右节点，当前为从左子节点回溯后的根节点，需先记录值，再进入右子节点遍历
            // 2.4 当前节点无左无右节点，当前为叶子节点（可记录），在下次进入循环时直接回溯到父节点
            result.add(curr.val);
            // 3. 进入右节点遍历
            curr = curr.right;
         }
      }
      return result;
   }
}
```

###### 后序遍历

![二叉树后序遍历.drawio-2024-10-29-21-44-37](https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-10-29/二叉树后序遍历.drawio-2024-10-29-21-44-37.png)

```java title="/src/com/github/heliannuuthus/PostOrderTraversal.java" showLineNumbers
public class PostOrderTraversal {

   /**
    * 后序遍历
    * 在回溯时，如果当前节点有右节点，不可直接记录值，需要先进入右节点遍历，再回溯记录值
    * 故而回溯后，局部根节点需要再次入栈，第二次出栈的时候不可重复进入右节点遍历
    * @param root 根节点
    * @return 后序遍历结果
    */
   public List<Integer> postorderTraversal(TreeNode root) {
      TreeNode curr = root, last = null;
      List<Integer> result = new ArrayList<>();
      Stack<TreeNode> stack = new Stack<>();
      while (curr != null || !stack.isEmpty()) {
         // 1. 遍历到最左节点，将节点入栈，并记录值（后序为左右中）
         // 5. 当前遍历的是第一个右节点，需要先遍历到最左节点
         if (curr != null) {
            stack.push(curr);
            curr = curr.left;
         } else {
            curr = stack.pop();
            // 2. 当前节点是回溯后的根节点，并且没有右节点
            // 6. 当前存在右节点，进入 line 29
            if (curr.right == null || curr.right == last) {
               // 3. 记录局部根节点的值
               result.add(curr.val);
               last = curr;
               // 4. 当前节点已记录，下次循环时可直接回溯到局部根的父节点
               curr = null;
            } else {
               // 3. 当前节点有右节点，且右节点未遍历，则将当前节点再次入栈
               // 7. 进入右节点遍历，需要等右节点遍历完再回溯记录值，故而当前值需要再次入栈
               stack.push(curr);
               // 8. 这一步是为了从右节点回溯到当前节点后，再次进入右节点遍历
               last = curr;
               // 9. 当不存在右节点时，下次循环时可直接回溯到局部根的父节点，否则继续遍历右节点
               curr = curr.right;
            }
         }
      }
      return result;
   }
}
```
