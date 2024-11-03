public class PostOrderTraversal {
    /**
     * 后序遍历
     * 1. 分别说明第一次遍历左节点以及遍历右节点的流程
     * 2. 下方的高亮代码块(18 - 25)是三种遍历的差异所在
     *
     * @param root 根节点
     * @return 后序遍历结果
     */
    public List<Integer> postorderTraversal(TreeNode root) {
        if (root == null) {
            return null;
        }
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            // 1. 第一次遍历根节点
            TreeNode curr = stack.pop();
            // 2. 后序遍历为左右中，故而入栈顺序为中右左
            if (curr != null) {
                // 3. 当前节点再次入栈，第二次出栈时记录值
                // highlight-start
                stack.push(curr);
                // 4. 利用 null 值标记遍历过但是没取值的节点，保证下次 curr 出栈一定是在下方 else 取值，而不是在当前位置重新入栈
                stack.push(null);
                if (curr.right != null) {
                    stack.push(curr.right);
                }
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
}
  