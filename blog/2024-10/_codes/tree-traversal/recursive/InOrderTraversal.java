public class InOrderTraversal {
    /**
     * 中序遍历
     * 1. 递归遍历左节点
     * 2. 记录当前节点值
     * 3. 递归遍历右节点
     *
     * @param root 根节点
     * @return 中序遍历结果
     */
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }

    private void dfs(TreeNode root, List<Integer> result) {
        if (root == null) {
            return;
        }
        // 1. 递归遍历左节点
        // highlight-start
        dfs(root.left, result);
        // 2. 记录当前节点值
        result.add(root.val);
        // 3. 递归遍历右节点
        dfs(root.right, result);
        // highlight-end
    }
}
