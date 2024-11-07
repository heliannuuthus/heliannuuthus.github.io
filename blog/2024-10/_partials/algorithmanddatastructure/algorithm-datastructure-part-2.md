## 二叉树

### 数据结构

1. 存储：非连续内存，通常使用链表存储
2. 查询：需要遍历所有父节点
3. 增删：需要遍历父节点

### 二叉树的遍历

:::note

- 前序遍历：根节点在所有节点之前被遍历，顺序为根-左-右
- 中序遍历：根节点在所有节点中间被遍历，顺序为左-根-右
- 后序遍历：根节点在所有节点之后被遍历，顺序为左-右-根
- 层序遍历：从上到下逐层遍历，顺序为根-左-右
  :::

##### 递归

> 较为简单，不赘述

1. 递归通常用于树的遍历，通过递归可以快速遍历所有节点
2. 递归的终止条件通常是节点为空
3. 递归的返回值通常是当前节点的值

##### 迭代

> 较为复杂，详细解释一下

1. 迭代通常用于树的遍历，通过迭代可以快速遍历所有节点
2. 迭代通常使用栈或队列实现

import Tabs from "@site/src/components/Tabs";
import Image from "@site/src/components/Image";
import Flex from "@site/src/components/Flex";
import Collapse from "@site/src/components/Collapse";
import PreOrderRecursiveContent from "../../\_contents/tree-traversal/recursive/preorder-traversal.mdx";
import InOrderRecursiveContent from "../../\_contents/tree-traversal/recursive/inorder-traversal.mdx";
import PostOrderRecursiveContent from "../../\_contents/tree-traversal/recursive/postorder-traversal.mdx";
import PreOrderLoopContent from "../../\_contents/tree-traversal/loop/preorder-traversal.mdx";
import InOrderLoopContent from "../../\_contents/tree-traversal/loop/inorder-traversal.mdx";
import PostOrderLoopContent from "../../\_contents/tree-traversal/loop/postorder-traversal.mdx";
import LevelOrderRecursiveContent from "../../\_contents/tree-traversal/recursive/levelorder-traversal.mdx";
import LevelOrderLoopContent from "../../\_contents/tree-traversal/loop/levelorder-traversal.mdx";
import PreAndInOrderBuildTreeContent from "../../\_contents/tree-traversal/recursive/preandinorder-build-tree.mdx";
import PostAndInOrderBuildTreeContent from "../../\_contents/tree-traversal/recursive/postandinorder-build-tree.mdx";

<Collapse label="代码块以及图例">
<Tabs
items={[
{
label: "前序遍历",
key: "preOrder",
forceRender: true,
children: [
<Flex justify="center">
<Image
            src="https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-10-29/二叉树前序遍历-2024-10-29-21-30-38.png"
            alt="二叉树前序遍历"
          />
</Flex>,
<Tabs
items={[
{
label: "递归遍历",
key: "recursive",
children: <PreOrderRecursiveContent />,
forceRender: true,
},
{
label: "迭代遍历",
key: "loop",
children: <PreOrderLoopContent />,
forceRender: true,
}
]}
/>
].map((item) => ({
...item,
forceRender: true,
})),
},
{
label: "中序遍历",
key: "inOrder",
forceRender: true,
children: [
<Flex justify="center">
<Image
            src="https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-10-29/二叉树中序遍历.drawio-2024-10-29-21-44-24.png"
            alt="二叉树中序遍历"
          />
</Flex>,
<Tabs
items={[
{
label: "递归遍历",
key: "recursive",
children: (
<>
<InOrderRecursiveContent />
</>
),
forceRender: true,
},
{
label: "迭代遍历",
key: "loop",
children: <InOrderLoopContent />,
forceRender: true,
}
]}
/>
].map((item) => ({
...item,
forceRender: true,
})),
},
{
label: "后序遍历",
key: "postOrder",
forceRender: true,
children: [
<Flex justify="center">
<Image
            src="https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-10-29/二叉树后序遍历.drawio-2024-10-29-21-44-37.png"
            alt="二叉树后序遍历"
          />
</Flex>,
<Tabs
items={[
{
label: "递归遍历",
key: "recursive",
children: <PostOrderRecursiveContent />,
forceRender: true,
},
{
label: "迭代遍历",
key: "loop",
children: <PostOrderLoopContent />,
forceRender: true,
}
]}
/>
].map((item) => ({
...item,
forceRender: true,
})),
},
{
label: "层序遍历",
key: "levelOrder",
forceRender: true,
children: [
<Flex justify="center">
<Image
            src="https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-11-03/二叉树的层序遍历.drawio-2024-11-03-23-00-59.png"
            alt="二叉树层序遍历"
          />
</Flex>,
<Tabs
items={[
{
label: "递归遍历",
key: "recursive",
children: <LevelOrderRecursiveContent />,
forceRender: true,
},
{
label: "迭代遍历",
key: "loop",
children: <LevelOrderLoopContent />,
forceRender: true,
}
]}
/>
].map((item) => ({
...item,
forceRender: true,
})),
}
]}
/>
</Collapse>
### 二叉树的深度和高度

- 二叉树的深度：从根节点到叶子节点的最长路径，可使用后续遍历
- 二叉树的高度：从叶子节点到根节点的最长路径，可使用前序遍历

<Flex justify="center">
  <Image
    src="https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-11-03/二叉树的深度和高度.drawio-2024-11-03-19-49-45.png"
    alt="二叉树的深度和高度示意图"
  />
</Flex>

### 通过序列构造二叉树

:::note

- 通过序列构造二叉树一定需要中序序列
- 前序和后序序列无法唯一确定一棵二叉树

  e.g.

  - 前序：[1, 2, 3] 后序：[3, 2, 1]
  - 3 的节点无法确定是 2 节点的左节点还是右节点

:::

<Collapse label="代码块以及正在画的图例">
<Tabs
items={[
{
label: "前序和中序",
key: "preAndInOrder",
children: <PreAndInOrderBuildTreeContent />,
forceRender: true,
},
{
label: "后序和中序",
key: "postAndInOrder",
children: <PostAndInOrderBuildTreeContent />,
forceRender: true,
}
]}
/>
</Collapse>

大致步骤为

1. 通过前序或者后序的**第一个节点**或者**最后一个节点**确定根节点
2. 从中序查找对应的根节点并将该节点的左右子树分割开 [左子树, 根节点, 右子树]
   1. 注意划分左右子树的区间（左闭右开，其他可视情况而定）
   2. 左子树以**序列最左**为起点，以**根节点**为终点（此时右边界不可达）
   3. 右子树以**根节点 + 1** 为起点，以**序列最右 + 1** 为终点（此时右边界亦不可达）
3. 通过递归的手段可以轻松构造左右子树
