public class InOrderTraversal {
    /**
     * 中序遍历
     * 在回溯后记录值，每个节点都是局部根节点
     *
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
