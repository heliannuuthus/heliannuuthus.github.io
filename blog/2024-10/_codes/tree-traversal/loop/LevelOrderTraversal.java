public class LevelOrderTraversal {

  /**
   * 层序遍历
   * 
   * 1. 使用队列存储当前层节点
   * 2. 遍历当前层节点，记录值
   * 3. 将下一层节点入队
   * 
   * @param root
   * @return
   */
  public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) {
      return result;
    }
    
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
      int size = queue.size();
      List<Integer> level = new ArrayList<>();
      // 1. 遍历当前层节点
      for (int i = 0; i < size; i++) {
        TreeNode curr = queue.poll();
        level.add(curr.val);
        // 2. 将下一层节点入队
        if (curr.left != null) {
          queue.offer(curr.left);
        }
        if (curr.right != null) {
          queue.offer(curr.right);
        }
      }
      // 3. 记录当前层节点值
      result.add(level);
    }
    return result;
  }
}
