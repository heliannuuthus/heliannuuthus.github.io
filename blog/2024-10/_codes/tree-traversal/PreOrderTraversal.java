public class PreOrderTraversal {
    /**
     * 前序遍历
     * 1. 分别说明第一次遍历左节点以及遍历右节点的流程
     * 2. 下方的高亮代码块(18 - 25)是三种遍历的差异所在
     *
     * @param root 根节点
     * @return 遍历结果
     */
    public List<Integer> preorderTraversal(TreeNode root) {
        if (root == null) {
            return null;
        }
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            // 1. 第一次遍历根节点
            TreeNode curr = stack.pop();
            // 2. 前序遍历为中左右，故而入栈顺序为右左中
            if (curr != null) {
                // highlight-start
                if (curr.right != null) {
                    stack.push(curr.right);
                }
                if (curr.left != null) {
                    stack.push(curr.left);
                }
                stack.push(curr);
                // 3. 利用 null 值标记遍历过但是没取值的节点
                stack.push(null);
                // highlight-end
            } else {
                // 4. 当遍历到 null 值时，说明当前节点为局部根节点，记录值
                result.add(stack.pop().val);
            }
        }
        return result;
    }
}