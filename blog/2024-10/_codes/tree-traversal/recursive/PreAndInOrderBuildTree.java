public class PreAndInOrderBuildTree {

  public TreeNode buildTree(int[] preorder, int[] inorder) {
      return splitter(preorder, 0, preorder.length, inorder, 0, inorder.length);
  }

  public TreeNode splitter(int[] preorder, int preStart, int preEnd, int[] inorder, int inStart, int inEnd) {
      if(preStart == preEnd) {
        return null;
      } 

      if (inEnd - inStart == 1) {
        return new TreeNode(inorder[inStart]);
      }

      TreeNode root = new TreeNode(preorder[preStart]);
      
      int splitter = inStart;

      while (splitter <= inEnd && inorder[splitter] != root.val) {
        splitter++;
      }

      // 构造左子树 全局统一左闭右开
        // 拆分左子树的先序序列：[preStart + 1, preStart + 1 + splitter - inStart]
        // 解释： 
        // preStart + 1：跳过根节点
        // preStart + 1 + splitter - inStart：preStart + 1 是左子树先序序列的起始位置，splitter - inStart 是左子树的节点数
        // 拆分左子树的中序序列：[inStart, splitter]
        // 解释：
        // inStart：左子树中序序列的起始位置
        // splitter：左子树中序序列的结束位置
      root.left = splitter(preorder, preStart + 1, preStart + 1 + splitter - inStart, inorder, inStart, splitter);
      // 构造右子树 全局统一左闭右开
        // 拆分右子树的先序序列：[preStart + 1 + splitter - inStart, preEnd]
        // 解释：
        // preStart + 1 + splitter - inStart：与左子树先序序列的结束位置相同
        // preEnd：右子树先序序列的结束位置
        // 拆分右子树的中序序列：[splitter + 1, inEnd]
        // 解释：
        // splitter + 1：右子树中序序列的起始位置
        // inEnd：右子树中序序列的结束位置
      root.right = splitter(preorder, preStart + 1 + splitter - inStart, preEnd, inorder, splitter + 1, inEnd);
      return root;
  }
}
