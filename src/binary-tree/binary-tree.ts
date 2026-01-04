type TreeNode = {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
} | null;

export const invertBinaryTree = (node: TreeNode): TreeNode => {
    if (!node) return null;
    const temp = node.left;

    node.left = invertBinaryTree(node.right);
    node.right = invertBinaryTree(temp);

    return node;
}

const tree = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 4,
            left: null,
            right: null
        },
        right: null
    },
    right: null
}

console.log(invertBinaryTree(tree));