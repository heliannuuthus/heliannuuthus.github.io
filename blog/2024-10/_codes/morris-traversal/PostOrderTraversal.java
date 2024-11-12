public class PostOrderTraversal {
    /**
     * morris 后序遍历
     * 1. 如果当前节点的左子树为空，则将当前节点加入结果集，并将其右子节点作为当前节点
     * 2. 如果当前节点的左子树不为空，则找到当前节点左子树的最右节点
     * 3. 如果最右节点的右子节点为空，则将最右节点的右子节点指向当前节点，并将当前节点指向其左子节点
     * 4. 如果最右节点的右子节点为当前节点，则将最右节点的右子节点指向空，将当前节点值加入结果集，并将当前节点指向其右子节点
     *
     * @param root 根节点
     * @return 后序遍历结果
     */
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) {
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
                    // 在第二次到达时，将左子树的右节点反转后添加到结果集
                    addPath(cur.left, result);
                    cur = cur.right;
                }
            }
        }
        // 将最后的根节点的右子树反转后添加到结果集
        addPath(root, result);
        return result;
    }

    /**
     * 将树的右节点反转后添加到结果集
     *
     * @param node 树的右节点
     * @param result 结果集
     */
    private void addPath(TreeNode node, List<Integer> result) {
        TreeNode tail = reverse(node);
        TreeNode cur = tail;
        while (cur != null) {
            result.add(cur.val);
            cur = cur.right;
        }
        reverse(tail);
    }

    /**
     * 反转链表，将树的右节点反转打印，因为后续遍历总是自底向上打印
     *
     * @param node 链表头节点
     * @return 反转后的链表头节点
     */
    private TreeNode reverse(TreeNode node) {
        TreeNode pre = null;
        TreeNode next = null;
        while (node != null) {
            next = node.right;
            node.right = pre;
            pre = node;
            node = next;
        }
        return pre;
    }
}
  