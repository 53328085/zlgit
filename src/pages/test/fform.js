import React from 'react';
import { Tree, Button, Space } from 'antd';
import {LayoutFilled} from '@ant-design/icons'
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title:  '前端框架',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'react',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'vue',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {  
            title: 'sss',
          
             key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];
const {DirectoryTree} = Tree
const App = () => {
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  const fnitem =(item) => {
    console.dir(item)
    let {title, key, children} = item
    
    const custtitle =  <Space><Button>{title}</Button><Button>新增子项</Button><Button>编辑</Button><Button>删除</Button> </Space>
    item.title = custtitle;

    if(Array.isArray(children) && children.length >0) {
      item.children = item.children.map(c => fnitem)
      
    }
  }
  
   
 
  const custitem =(item) => {
    
    let {title, key, children} = item
    if(Array.isArray(children) && children.length >0) {
       custitem(children)
     }

    return   <Space><Button>{title}</Button><Button>新增子项</Button><Button>编辑</Button><Button>删除</Button> </Space>
    
    
    
  }
  return (
    <Tree
     
      onSelect={onSelect}
      onCheck={onCheck}
      treeData={treeData}
      titleRender={item =>  custitem(item)} 
    />
  );
};
export default App;