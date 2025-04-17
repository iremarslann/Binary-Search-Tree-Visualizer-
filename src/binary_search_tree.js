/* 
*File:    binary_search_tree.js
*Project: CSIS 3750 Software Engineering Team Projects
*Author:  Nicolas, Carol, Irem
*History: Version 2.0 04/26/24
*Program: BST Logic
*/ 

// Enum for comparison results
const COMPARISON =
{
  EQUAL: 0, // Comparison result for equality
  SMALLER: -1, // Comparison result for smaller
  GREATER: 1, // Comparison result for greater
};

// Default comparison function
const defaultCompareFn = (a, b) => {
  const strA = a;
  const strB = b;

  if (strA === strB) {
    return COMPARISON.EQUAL;
  } else if (!isNaN(strA) && !isNaN(strB)) {
    // Both are numbers
    const numA = parseFloat(strA);
    const numB = parseFloat(strB);
    if (numA < numB) {
      return COMPARISON.SMALLER;
    } else if (numA > numB) {
      return COMPARISON.GREATER;
    } else {
      return COMPARISON.EQUAL;
    }
  } else {
    // At least one is not a number, compare as strings
    return strA < strB ? COMPARISON.SMALLER : COMPARISON.GREATER;
  }
};

// TreeNode class representing a node in the binary search tree
class TreeNode {
  constructor(value, parent) {
    this.value = String(value);
    this.parent = parent || null;
    this.left = null;
    this.right = null;
  }

  // Check if the node is a leaf node
  get isLeaf() {
    return this.left === null && this.right === null;
  }

  // Check if the node has children
  get hasChildren() {
    return !this.isLeaf;
  }
}

// BinarySearchTree class representing the binary search tree
class BinarySearchTree {
  root;
  compareFn;

  constructor(compareFn = defaultCompareFn) {
    this.root = null;
    this.compareFn = compareFn;
  }

  // Insert a value into the binary search tree
  insert(value) {
    if (this.root === null) {
      this.root = new TreeNode(value);
      return this.root;
    }

    let node = this.root;
    while (true) {
      const comparison = this.compareFn(value, node.value);
      if (comparison === COMPARISON.SMALLER || comparison === COMPARISON.EQUAL) {
        if (node.left === null) {
          node.left = new TreeNode(value, node);
          return node.left;
        }
        node = node.left;
      } else {
        if (node.right === null) {
          node.right = new TreeNode(value, node);
          return node.right;
        }
        node = node.right;
      }
    }
  }

  // Remove a value from the binary search tre
  remove(value, node) {
    node = node ? node : this.search(value);
    if (!node) return null;

    const nodeIsRoot = node.parent === null;
    const hasBothChildren = node.left !== null && node.right !== null;
    const isLeftChild = !nodeIsRoot ? node.parent.left === node : false;

    if (node.isLeaf) {
      if (nodeIsRoot) {
        this.root = null;
      } else if (isLeftChild) {
        node.parent.left = null;
      } else {
        node.parent.right = null;
      }
      return node;
    }
    if (!hasBothChildren) {
      const child = node.left !== null ? node.left : node.right;
      if (nodeIsRoot) {
        this.root = child;
      } else if (isLeftChild) {
        node.parent.left = child;
      } else {
        node.parent.right = child;
      }
      child.parent = node.parent;
      return node;
    }

    const minRightLeaf = this.min(node.right);
    if (minRightLeaf.parent.left === minRightLeaf) {
      minRightLeaf.parent.left = null;
    } else {
      minRightLeaf.parent.right = null;
    }
    const clone = { ...node };
    node.value = minRightLeaf.value;
    return clone;
  }

  // Search for a value in the binary search tree
  search(value) {
    return this.postOrderTraverse().find((node) => node.value === value);
  }

  // Find the minimum value in the binary search tree
  min(node = this.root) {
    let current = node;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  // Find the maximum value in the binary search tree
  max(node = this.root) {
    let current = node;
    while (current !== null && current.right !== null) {
      current = current.right;
    }
    return current;
  }

  // Perform an in-order traversal of the binary search tree
  inOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    if (node.left) {
      traversed.push(...this.inOrderTraverse(node.left));
    }
    traversed.push(node);
    if (node.right) {
      traversed.push(...this.inOrderTraverse(node.right));
    }
    return traversed;
  }

  // Perform a pre-order traversal of the binary search tree
  preOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    traversed.push(node);
    if (node.left) {
      traversed.push(...this.preOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.preOrderTraverse(node.right));
    }
    return traversed;
  }

  // Perform a post-order traversal of the binary search tree
  postOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    if (node.left) {
      traversed.push(...this.postOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.postOrderTraverse(node.right));
    }
    traversed.push(node);
    return traversed;
  }
}

export default BinarySearchTree;