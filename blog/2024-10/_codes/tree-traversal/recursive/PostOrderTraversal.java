public class PostOrderTraversal {
    /**
     * 后序遍历
     * 1. 递归遍历左节点
     * 2. 递归遍历右节点
     * 3. 记录当前节点值
     *
     * @param root 根节点
     * @return 后序遍历结果
     */
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }

    private void dfs(TreeNode root, List<Integer> result) {
        if (root == null) {
            return;
        }
        // 1. 递归遍历左节点
        dfs(root.left, result);
        // 2. 递归遍历右节点
        dfs(root.right, result);
        // 3. 记录当前节点值
        result.add(root.val);
    }
}
  