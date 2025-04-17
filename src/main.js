/* 
*File:    main.js
*Project: CSIS 3750 Software Engineering Team Projects
*Author:  Nicolas, Carol, Irem
*History: Version 1.0 03/20/24
*Program: BST Logic
*/

// All Styles
// Import CSS styles for the binary search tree
import './binary_search_tree.css';
// Import the BinarySearchTree class from binary_search_tree.js
import BinarySearchTree from './binary_search_tree';
// Import the BinarySearchTreeUI class from binary_search_tree_ui.js
import BinarySearchTreeUI from './binary_search_tree_ui';
// Import function to create sample tree data from sample_tree.js
import createSampleTreeData from './sample_tree';
// Import necessary polyfills for older browsers
import '@babel/polyfill';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Define the main function
const main = () =>
{
  // Event listener to execute code after the DOM content is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const myTree = new BinarySearchTree();
    // Create sample tree data and insert it into the binary search tree
    createSampleTreeData(myTree);
    console.log('treeData', myTree);
    // Create a new instance of the BinarySearchTreeUI class
    const bstUI = new BinarySearchTreeUI(myTree, null, '.tree');
    // Initialize the binary search tree UI
    bstUI.init();
    // Render the binary search tree UI
    bstUI.render();
  });
};

// Call the main function to start the application
main();
