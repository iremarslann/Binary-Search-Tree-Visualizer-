/* 
*File:    binary_search_tree_ui.js
*Project: CSIS 3750 Software Engineering Team Projects
*Author:  Nicolas, Carol, Irem
*History: Version 2.0 04/26/24
*Program: BST Logic
*/

// Default configuration for the BST UI
export const defaultBSTUIConfig = {
  HIGHLIGHT_CLASS: 'node__element--highlight',
  HIGHLIGHT_TIME: 300,
};

// Class representing the Binary Search Tree UI
class BinarySearchTreeUI
{
   // Instance variables
  highlightTimer = null;
  actionsContainerSelector;

  // Constructor
  constructor(
    tree,
    render,
    treeContainerSelector = '.tree',
    actionsContainerSelector = '.bst-actions-container',
    config = defaultBSTUIConfig
  ) {
    this.treeContainerSelector = treeContainerSelector;
    this.actionsContainerSelector = actionsContainerSelector;
    this.config = { ...defaultBSTUIConfig, ...config };
    this.tree = tree;
    this.render = render || this.renderTree;
    // Set CSS animation timing based on config
    document.documentElement.style.setProperty(
      '--animation-timing',
      `${this.config.HIGHLIGHT_TIME / 1000}s`
    );
  }

  // Method to toggle highlighting on a node
  toggleHighlight(nodeElement, add) {
    if (add) {
      // Add highlight class and disable buttons
      nodeElement.classList.add(this.config.HIGHLIGHT_CLASS);
      document.querySelectorAll('button').forEach(btn => btn.setAttribute('disabled', true));
      // Set a timer to remove highlight
      this.highlightTimer = setTimeout(() => {
        this.toggleHighlight(nodeElement, false);
      }, this.config.HIGHLIGHT_TIME);
    } else {
      // Remove highlight and enable buttons
      if (this.highlightTimer !== null) {
        clearTimeout(this.highlightTimer);
        this.highlightTimer = null;
      }
      nodeElement.classList.remove(this.config.HIGHLIGHT_CLASS);
      document.querySelectorAll('button').forEach(btn => btn.removeAttribute('disabled'));
    }
  }
  
  // Method to highlight a node with animation
  highlightNode({ value }) {
    const nodeElement = document.querySelector(`[data-node-id="${value}"]`);
    return new Promise(resolve => {
      this.toggleHighlight(nodeElement, true);
      setTimeout(() => {
        this.toggleHighlight(nodeElement, false);
        resolve();
      }, this.config.HIGHLIGHT_TIME);
    });
  }
  
  // Method to set up speed change for animation
  setupSpeedChange() {
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', () => {
      const newSpeed = parseInt(speedSlider.max) - parseInt(speedSlider.value);
      this.config.HIGHLIGHT_TIME = newSpeed;
      document.documentElement.style.setProperty(
        '--animation-timing',
        `${newSpeed / 1000}s`
      );
    });
  }

  //  HTML template for the UI
  template() {
    return `
    <style>
  :root {
    --main-bg-color: #2a2d34; 
    --primary-color: #4F7942; 
    --hover-color: #6B9B58; 
    --text-color: #ffffff; 
    --secondary-text-color: #cfd2d6; 
    --slider-thumb-color: #FFB700; 
    --button-border-radius: 5px; 
    --animation-duration: ${this.config.HIGHLIGHT_TIME / 1000}s; 
    --transition-duration: 0.3s;
  }

  .app-bar {
    background-color: var(--main-bg-color);
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px; 
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2);
  }

  .app-bar .btn-group {
    display: flex;
    align-items: center;
    gap: 12px; /* increased gap for better spacing */
  }

  .app-bar button {
    background-color: var(--primary-color);
    border: none;
    padding: 12px 20px; /* increased padding for a larger clickable area */
    margin: 0;
    border-radius: var(--button-border-radius);
    color: var(--text-color);
    font-weight: 600; /* less boldness for a more modern look */
    cursor: pointer;
    transition: background-color var(--transition-duration);
    text-transform: uppercase; /* modern touch with uppercase */
    letter-spacing: 0.05em; /* spacing out letters for better readability */
  }

  .app-bar button:hover {
    background-color: var(--hover-color);
    /* subtle scale increase on hover for interactive feedback */
    transform: scale(1.05);
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15); /* shadow for depth */
  }

  .app-bar .slider {
    background-color: transparent;
    -webkit-appearance: none;
    width: 150px; /* increased width for better usability */
    height: 8px;
  }

  .app-bar .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--slider-thumb-color);
    cursor: pointer;
  }

  .app-bar label {
    color: var(--secondary-text-color);
    font-weight: 500; /* adjusted for visual hierarchy */
    margin-right: 10px; /* spacing before the slider */
  }
</style>

<div class="app-bar">
  <div class="btn-group">
    <!-- Semantic button elements with accessible labels -->
    <button id="insertBtn" class="btn" aria-label="Insert Node">Insert</button>
    <button id="removeElementBtn" class="btn" aria-label="Remove Node">Remove</button>
    <button id="searchBtn" class="btn" aria-label="Search Node">Search</button>
    <button id="minValueBtn" class="btn" aria-label="Find Minimum Value">Min Value</button>
    <button id="maxValueBtn" class="btn" aria-label="Find Maximum Value">Max Value</button>
    <button id="inOrderTravBtn" class="btn" aria-label="In Order Traversal">In Order</button>
    <button id="postOrderTravBtn" class="btn" aria-label="Post Order Traversal">Post Order</button>
    <button id="preOrderTravBtn" class="btn" aria-label="Pre Order Traversal">Pre Order</button>
    <button id="resetBtn" class="btn" aria-label="Delete Tree">Reset</button>
    <button id="saveBtn" class="btn" aria-label="Save Tree">Save</button>
  </div>
  <div class="btn-group">
    <!-- Associated label with the input using 'for' attribute -->
    <label for="speedSlider">Speed:</label>
    <input type="range" min="100" max="1000" value="300" class="slider" id="speedSlider">
  </div>
</div>

    `;
  }
  
  // Method to traverse UI nodes with animation
  traverseUINodes(nodes, traversalType) {
    nodes.reduce((pr, node) => {
      return pr.then(() => this.highlightNode(node));
    }, Promise.resolve())
    .then(() => {
      // Display traversal order after animation completes
      const traversalOrder = nodes.map(node => node.value);
      const traversalOrderString = traversalOrder.join(', ');
      alert(`Traversal Order (${traversalType}): ${traversalOrderString}`);
    });
  }

  // Method to get HTML for a tree node
  getTreeUI(node) {
    const { left, right, value } = node;
    if (!node) {
      return '';
    }
    return `
      <div class="node__element" data-node-id="${value}">${value}</div>
      ${
        left || right
          ? `
            <div class="node__bottom-line"></div>
            <div class="node__children">
            <div class="node node--left">
              ${left ? this.getTreeUI(left) : ''}
            </div>
            <div class="node node--right">
              ${right ? this.getTreeUI(right) : ''}
            </div>
            </div>
          `
          : ''
      }
    `;
  }

  // Method to render the UI tree
  renderTree(
    node = this.tree.root,
    containerSelector = this.treeContainerSelector
  ) {
    const treeContainer = document.querySelector(containerSelector);
    if (!node) {
      return (treeContainer.innerHTML = '');
    }
    const template = this.getTreeUI(node);
    treeContainer.innerHTML = template;
  }

  highlightNode({ value }) {
    const nodeElement = document.querySelector(`[data-node-id="${value}"]`);
    if (!nodeElement) {
      console.error(`Node with value ${value} does not exist in the DOM.`);
      return Promise.resolve(); // Return a resolved promise to avoid breaking promise chains.
    }
    return new Promise(resolve => {
      this.toggleHighlight(nodeElement, true);
      setTimeout(() => {
        this.toggleHighlight(nodeElement, false);
        resolve();
      }, this.config.HIGHLIGHT_TIME);
    });
  }
  

  // Method to handle remove element button click
  onRemoveElementBtnClick() {
    // Remove element from tree
    const element = prompt('Enter element to remove from the tree');
    const removedEl = this.tree.remove(element);
    if (removedEl) {
      this.highlightNode(removedEl).then(() => {
        this.render(this.tree.root);
      });
    } else {
      alert('Element not found');
    }
  }

  // Method to set up the UI template
  setTemplate() {
    // Set up template and speed change
    console.log('Setting up the template');
    const actionsContainer = document.querySelector(
      this.actionsContainerSelector
    );
    actionsContainer.innerHTML = this.template();

    this.setupSpeedChange();
  }

  // Method to handle insert button click
  onInsertBtnClick() {
    // Insert element to tree
    const element = prompt('Enter element to add to tree (DO NOT ADD THE SAME NUMBER)');
    if (!element) {
      return;
    }
    const node = this.tree.insert(element);
    this.render(this.tree.root);
    this.highlightNode(node);
  }

  // Method to handle min value button click
  onMinValueBtnClick() {
    // Find minimum value in tree
    const node = this.tree.min();
    if (node) {
      this.highlightNode(node);
    } else {
      alert('Node not found');
    }
  }

  // Method to handle search button click
  onSearchBtnClick() {
    // Search for a node in the tree
    const searchVal = prompt('Enter the node value to search in the tree');
    const searchedNode = this.tree.search(searchVal);
    if (searchedNode) {
      this.highlightNode(searchedNode);
    } else {
      alert('Node not found');
    }
  }

   // Method to handle max value button click
  onMaxValueBtnClick() {
    // Find maximum value in tree
    const node = this.tree.max();
    if (node) {
      this.highlightNode(node);
    } else {
      alert('Node not found');
    }
  }

  // Method to handle pre-order traversal button click
  onPreOrderTravBtnClick() {
    // Perform pre-order traversal
    const array = this.tree.preOrderTraverse();
    console.log(array);
    this.traverseUINodes(array, 'Pre-order');
  }

  // Method to handle in-order traversal button click
  onInOrderTravBtnClick() {
    // Perform in-order traversal
    const array = this.tree.inOrderTraverse();
    console.log(array);
    this.traverseUINodes(array, 'Order-In');
  }

  // Method to handle post-order traversal button click
  onPostOrderTravBtnClick() {
    // Perform post-order traversal
    const array = this.tree.postOrderTraverse();
    console.log(array);
    this.traverseUINodes(array, 'Post-order');
  }

   // Method to handle reset button click
  onResetBtnClick() {
    //reset the tree
    this.highlightNode(this.tree.root).then(() => {
      this.tree.root = null;
      this.render(this.tree.root);
    });
  }


  getTreeJSON(node = this.tree.root) {
    if (!node) return null;
    return {
      value: node.value,
      left: this.getTreeJSON(node.left),
      right: this.getTreeJSON(node.right)
    };
  }

  // Method to handle save button click
  onSaveBtnClick() {
    // Save tree data
    const treeDataJSON = this.getTreeJSON();
    fetch('http://localhost:5000/saveTree', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nodes: treeDataJSON })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save the tree to the database.');
        }
        return response.json();
    })
    .then(data => {
        alert('Tree has been saved to the database!');
        const savedTrees = JSON.parse(localStorage.getItem('savedTrees')) || [];
        savedTrees.push(treeDataJSON);
        localStorage.setItem('savedTrees', JSON.stringify(savedTrees));
        this.displaySavedTrees();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

  // Method to display saved trees
  displaySavedTrees(trees = JSON.parse(localStorage.getItem('savedTrees')) || []) {
     // Display saved trees in UI
    const savedTreesList = document.getElementById('savedTreesList');
    savedTreesList.innerHTML = ''; // Clear the list before displaying updated data
    trees.forEach((treeData, index) => {
        const treeItem = document.createElement('div');
        const treeValues = this.getTreeValues(treeData).join(', '); // Assuming getTreeValues can handle your tree data structure
        treeItem.textContent = `Tree ${index + 1}: [${treeValues}]`;
        savedTreesList.appendChild(treeItem);
    });
}

  getTreeValues(node) {
    if (!node) return [];
    return [...this.getTreeValues(node.left), node.value, ...this.getTreeValues(node.right)];
  }

   // Method to retrieve trees from database
  onRetrieveBtnClick() {
    // Retrieve trees from database
    fetch('http://localhost:5000/api/retrieve-trees', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch trees from the database');
        }
        return response.json();
    })
    .then(trees => {
        this.displaySavedTrees(trees); // Update this method if necessary to handle the argument
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
  }

   // Method to initialize the UI
  init() {
      // Set template, set up event listeners, and display saved trees
    this.setTemplate();

    const deleteAllTreesBtn = document.getElementById('delete-all-trees');

    const insert = document.querySelector('#insertBtn');

    const removeElementBtn = document.querySelector('#removeElementBtn');

    const minValueBtn = document.querySelector('#minValueBtn');

    const maxValueBtn = document.querySelector('#maxValueBtn');

    const searchBtn = document.querySelector('#searchBtn');

    const preOrderTravBtn = document.querySelector('#preOrderTravBtn');

    const inOrderTravBtn = document.querySelector('#inOrderTravBtn');

    const postOrderTravBtn = document.querySelector('#postOrderTravBtn');

    const resetBtn = document.querySelector('#resetBtn');

    const saveBtn = document.querySelector('#saveBtn');

    const deleteAllTrees = async () => {
      try {
          const response = await fetch('http://localhost:5000/api/delete-all-trees', {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          console.log('All trees have been deleted:', data);
  
          // Clear local storage
          localStorage.removeItem('savedTrees');
  
          // UI update to reflect the deletion
          const savedTreesList = document.getElementById('savedTreesList');
          if (savedTreesList) {
              savedTreesList.innerHTML = ''; // Clears the list in the UI
          }
  
          // Notify the user of the successful deletion
          alert(data.message || 'All trees have been deleted successfully.');
  
      } catch (error) {
          console.error('Network error when trying to delete all trees:', error);
          alert(error.message || 'An error occurred while trying to delete all trees.');
      }
  };

    removeElementBtn.addEventListener('click',this.onRemoveElementBtnClick.bind(this));

    insert.addEventListener('click', this.onInsertBtnClick.bind(this));

    minValueBtn.addEventListener('click', this.onMinValueBtnClick.bind(this));

    searchBtn.addEventListener('click', this.onSearchBtnClick.bind(this));

    maxValueBtn.addEventListener('click', this.onMaxValueBtnClick.bind(this));

    preOrderTravBtn.addEventListener('click', this.onPreOrderTravBtnClick.bind(this));

    inOrderTravBtn.addEventListener('click',this.onInOrderTravBtnClick.bind(this));

    postOrderTravBtn.addEventListener('click', this.onPostOrderTravBtnClick.bind(this));

    resetBtn.addEventListener('click', this.onResetBtnClick.bind(this));

    saveBtn.addEventListener('click', this.onSaveBtnClick.bind(this));

    this.displaySavedTrees();
  
    // Add event listener to the button
    deleteAllTreesBtn.addEventListener('click', deleteAllTrees);

    document.getElementById('retrieveBtn').addEventListener('click', this.onRetrieveBtnClick.bind(this));
    
  }
  
}

export default BinarySearchTreeUI;
