public class InOrderTraversal {
    /**
     * 中序遍历
     * 1. 分别说明第一次遍历左节点以及遍历右节点的流程
     * 2. 下方的高亮代码块(18 - 25)是三种遍历的差异所在
     *
     * @param root 根节点
     * @return 中序遍历结果
     */
    public List<Integer> inorderTraversal(TreeNode root) {
        if (root == null) {
            return null;
        }
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            // 1. 第一次遍历根节点
            TreeNode curr = stack.pop();
            // 2. 中序遍历为左中右，故而入栈顺序为右中左
            if (curr != null) {
                // highlight-start
                if (curr.right != null) {
                    stack.push(curr.right);
                }
                stack.push(curr);
                // 3. 利用 null 值标记遍历过但是没取值的节点，保证下次 curr 出栈一定是在下方 else 取值，而不是在当前位置重新入栈
                stack.push(null);
                if (curr.left != null) {
                    stack.push(curr.left);
                }
                // highlight-end
            } else {
                // 5. 当遍历到 null 值时，说明当前节点为局部根节点，记录值
                result.add(stack.pop().val);
            }
        }
        return result;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 76883ed (cc)
