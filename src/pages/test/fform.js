import { Tree } from 'antd';
import React from 'react';
const dig = (path = '0', level = 3) => {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`;
    const treeNode = {
      title: key,
      key,
    };
    if (level > 0) {
      treeNode.children = dig(key, level - 1); // 0-0
    }
    list.push(treeNode);
  }
  return list;
};
const treeData = dig();
console.log(treeData)
const App = () => <Tree treeData={treeData} height={233} defaultExpandAll />;
export default App;