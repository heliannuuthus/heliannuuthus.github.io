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
import PreOrderRecursiveContent from "../../_contents/tree-traversal/recursive/preorder-traversal.mdx";
import InOrderRecursiveContent from "../../_contents/tree-traversal/recursive/inorder-traversal.mdx";
import PostOrderRecursiveContent from "../../_contents/tree-traversal/recursive/postorder-traversal.mdx";
import PreOrderLoopContent from "../../_contents/tree-traversal/loop/preorder-traversal.mdx";
import InOrderLoopContent from "../../_contents/tree-traversal/loop/inorder-traversal.mdx";
import PostOrderLoopContent from "../../_contents/tree-traversal/loop/postorder-traversal.mdx";

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
    }
  ]}
/>

### 二叉树的深度和高度

- 二叉树的深度：从根节点到叶子节点的最长路径，可使用后续遍历
- 二叉树的高度：从叶子节点到根节点的最长路径，可使用前序遍历

<Flex justify="center">
  <Image
    src="https://cdn.jsdelivr.net/gh/heliannuuthus/heliannuuthus.github.io@assets/static/img/2024-11-03/二叉树的深度和高度.drawio-2024-11-03-19-49-45.png"
    alt="二叉树的深度和高度示意图"
  />
</Flex>
