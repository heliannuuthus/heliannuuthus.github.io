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

> 较为复杂，详细解释一下

1. 迭代通常用于树的遍历，通过迭代可以快速遍历所有节点
2. 迭代通常使用栈或队列实现

import Tabs from "@site/src/components/Tabs";
import PreOrderContent from "../../\_contents/tree-traversal/preorder.mdx";
import InOrderContent from "../../\_contents/tree-traversal/inorder.mdx";
import PostOrderContent from "../../\_contents/tree-traversal/postorder.mdx";

<Tabs
items={[
{
label: "前序遍历",
key: "preOrder",
children: <PreOrderContent />,
forceRender: true,
},
{
label: "中序遍历",
key: "inOrder",
children: <InOrderContent />,
forceRender: true,
},
{
label: "后序遍历",
key: "postOrder",
children: <PostOrderContent />,
forceRender: true,
},
]}
/>
