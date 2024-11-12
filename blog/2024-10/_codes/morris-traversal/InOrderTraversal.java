public class InOrderTraversal {
    /**
     * morris 中序遍历
     * 1. 如果当前节点的左子树为空，则将当前节点加入结果集，并将其右子节点作为当前节点
     * 2. 如果当前节点的左子树不为空，则找到当前节点左子树的最右节点
     * 3. 如果最右节点的右子节点为空，则将最右节点的右子节点指向当前节点，并将当前节点指向其左子节点
     * 4. 如果最右节点的右子节点为当前节点，则将最右节点的右子节点指向空，将当前节点值加入结果集，并将当前节点指向其右子节点
     *
     * @param root 根节点
     * @return 中序遍历结果
     */
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) {
                result.add(cur.val);
                cur = cur.right;
            } else {
                TreeNode mostRight = cur.left;
                while (mostRight.right != null && mostRight.right != cur) {
                    mostRight = mostRight.right;
                }
                if (mostRight.right == null) {
                    mostRight.right = cur;
                    cur = cur.left;
                } else {
                    mostRight.right = null;
                    result.add(cur.val);
                    cur = cur.right;
                }
            }
        }
        return result;
    }
}
