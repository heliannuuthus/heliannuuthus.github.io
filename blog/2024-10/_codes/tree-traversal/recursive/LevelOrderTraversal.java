public class LevelOrderTraversal {

  /**
   * 层序遍历
   *
   * 1. 记录当前节点值
   * 2. 递归遍历左节点
   * 3. 递归遍历右节点
   * 
   * @param root
   * @return
   */
  public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) {
      return result;
    }
    dfs(root, result, 0);
    return result;
  }

  private void dfs(TreeNode root, List<List<Integer>> result, int level) {
    if (root == null) {
      return;
    }
    // 1. 记录当前节点值
    if (result.size() == level) {
      result.add(new ArrayList<>());
    }
    result.get(level).add(root.val);
    // 2. 递归遍历左节点
    dfs(root.left, result, level + 1);
   
    // 3. 递归遍历右节点
    dfs(root.right, result, level + 1);
  }
}
