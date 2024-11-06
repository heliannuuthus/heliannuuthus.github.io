public class PostAndInOrderBuildTree {

  public TreeNode buildTree( int[] inorder, int[] postorder) {
      return splitter(inorder, 0, inorder.length, postorder, 0, postorder.length);
  }

  public TreeNode splitter(int[] inorder, int inStart, int inEnd, int[] postorder, int postStart, int postEnd) {
      if(inStart == inEnd) {
        return null;
      } 

      if (inEnd - inStart == 1) {
        return new TreeNode(inorder[inStart]);
      }

      TreeNode root = new TreeNode(postorder[postEnd - 1]);
      
      int splitter = inStart;

      while (splitter <= inEnd && inorder[splitter] != root.val) {
        splitter++;
      }

      // 构造左子树 全局统一左闭右开
        // 拆分左子树的先序序列：[postStart, postStart + splitter - inStart]
        // 解释： 
        // postStart：跳过根节点
        // postStart + splitter - inStart：postStart 是左子树先序序列的起始位置，splitter - inStart 是左子树的节点数
        // 拆分左子树的中序序列：[inStart, splitter]
        // 解释：
        // inStart：左子树中序序列的起始位置
        // splitter：左子树中序序列的结束位置
      root.left = splitter(inorder, inStart, splitter, postorder, postStart, postStart + splitter - inStart);
      // 构造右子树 全局统一左闭右开
        // 拆分右子树的先序序列：[postStart + splitter - inStart, postEnd]
        // 解释：
        // postStart + splitter - inStart：与左子树先序序列的结束位置相同
        // postEnd：右子树先序序列的结束位置
        // 拆分右子树的中序序列：[splitter + 1, inEnd]
        // 解释：
        // splitter + 1：右子树中序序列的起始位置
        // inEnd：右子树中序序列的结束位置
      root.right = splitter(inorder, splitter + 1, inEnd, postorder, postStart + splitter - inStart, postEnd - 1);
      return root;
  }
}
