//creates a sample tree. This sample tree is for testing purposes 
export default function sample_tree(tree) {
  tree.insert(21);
  tree.insert(17);
  tree.insert(15);
  tree.insert(13);
  tree.insert(16);
  tree.insert(19);
  tree.insert(18);
  tree.insert(20);
  tree.insert(25);
  console.log(tree.insert(23));
  tree.insert(22);
  tree.insert(24);
  tree.insert(30);
  tree.insert(28);
  tree.insert(35);
  console.log('inOrderTraverse');
  console.log(tree.inOrderTraverse());
  console.log('preOrderTraverse');
  console.log(tree.preOrderTraverse());
  console.log('postOrderTraverse');
  console.log(tree.postOrderTraverse());
  console.log('min', tree.min());
  console.log('max', tree.max());
  console.log(tree.search(22));
}
