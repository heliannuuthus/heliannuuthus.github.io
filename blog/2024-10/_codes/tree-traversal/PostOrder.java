public class PostOrderTraversal {
    /**
     * 后序遍历
     * 在回溯时，如果当前节点有右节点，不可直接记录值，需要先进入右节点遍历，再回溯记录值
     * 故而回溯后，局部根节点需要再次入栈，第二次出栈的时候不可重复进入右节点遍历
     *
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
  