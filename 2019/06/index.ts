import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';
const tree:KeyVal<any> = {};

getInput('input2.txt').then((ls) => {
  const lines = ls.map(x => x.split(')'));
  lines.forEach(l => {
    const parentKey = l[0];
    const childKey = l[1];
    if(!tree[parentKey]) {
      tree[parentKey] = {
        children: [],
        value: parentKey
      };
    }
    tree[parentKey].children.push(childKey)

    if(!tree[childKey]) {
      tree[childKey] = {
        value: childKey,
        children: []
      }
    }
    tree[childKey].parentKey = parentKey;
  });

  function a() {
    let total = 0;
    Object.values(tree).forEach(n => {
      let level = 0
      let node = n;
      while (node.parentKey !== undefined) {
        level++;
        node = tree[node.parentKey];
      }
      console.log(`${n.value}: ${level}`);
      total += level;
    });
    console.log('Number of nodes: ', Object.values(tree).length);
    console.log('Total number of orbits: ', total);
  }

  function checkForSanta(node: any, distance: number):any {
    if (node.value === 'SAN') {
      return distance;
    } else if (node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        const childKey = node.children[i];
        const childNode = tree[childKey];
        if (childNode.isChecked) {
          //continue;
        }
        const childDistance = checkForSanta(childNode, distance + 1);
        if (childDistance !== false) {
          return childDistance;
        }
      }
    } 
    node.isChecked = true;
    return false;
  }

  function b() {
    const youNode = tree['YOU'];
    const parentNode = tree[youNode.parentKey]
    let distance = 0;
    let node = parentNode;
    while(node) {
      console.log('Checking ', node.value);
      const d = checkForSanta(node, distance)
      if (d !== false) {
        return d - 1;
      }
      node = tree[node.parentKey];
      distance++;
    }
    return -1;
  }
  console.log(b());
});