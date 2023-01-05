import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import {Input, Button, Radio, Tree } from 'antd';
import dashLine from '@imgs/line.png'

export default function Index(){
    const { Search } = Input;

    const [treeData, setTreeData] = useState([{
      title:'正泰物联滨江园区总进线',
      key:'正泰物联滨江园区总进线',
      children:[{
        title:'研发1号楼进线总表',
        key:'研发1号楼进线总表',
        children:[{
          title:'1层回路',
          key:'1',
        },{
          title:'2层回路',
          key:'2',
        },{
          title:'3层回路',
          key:'3',
        },]
      },{
        title:'研发2号楼进线总表',
        key:'研发2号楼进线总表',
        children:[{
          title:'1层回路',
          key:'1层回路',
        },{
          title:'2层回路',
          key:'2层回路',
        },{
          title:'3层回路',
          key:'3层回路',
        },]
      }]
    }])

    const options = [
        {
          label: '按回路',
          value: 1,
        },
        {
          label: '按建筑',
          value: 2,
        },
      ];
      
    
    
      
    
      let dataList = [];
      const generateList = data => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key, title } = node;
          dataList.push({ key, title: title });
          if (node.children) {
            generateList(node.children);
          }
        }
      };
      generateList(treeData);
     
      const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some(item => item.key === key)) {
              parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
              parentKey = getParentKey(key, node.children);
            }
          }
        }
        return parentKey;
      };
     
      const [state, setstate] = useState({
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: false,
      });
     
      const onExpand = expandedKeys => {
        setstate({
          expandedKeys: expandedKeys,
          searchValue: '',
          autoExpandParent: false,
        });
      };
     
      const onSearch = e => {
        const { value } = e.target;
        const expandedKeys = dataList
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return getParentKey(item.key, treeData);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        setstate({
          expandedKeys: expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
      };
     
      const { searchValue, expandedKeys, autoExpandParent } = state;
    //搜索结果重新渲染Treenode，存在一个问题，如果搜索功能和编辑树功能同时需要的话，树组件中
    //tree={loop(treeData)}会造成编辑树功能无法重新渲染树，node中input渲染不出来
      const loop = data =>
        data.map(item => {
          const index = item.title.indexOf(searchValue);
          const beforeStr = item.title.substr(0, index);
          const afterStr = item.title.substr(index + searchValue.length);
          const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{item.title}</span>
            );
          if (item.children) {
            return { title, key: item.key, children: loop(item.children) };
          }
     
          return {
            title,
            key: item.key,
          };
        });
    
      
        const [value, setValue] = useState(1);
      const onChange = ({target:{value}})=>{
        setValue(value)
        if(value == 1){
          setTreeData([{
            title:'正泰物联滨江园区总进线',
            key:'正泰物联滨江园区总进线',
            children:[{
              title:'研发1号楼进线总表',
              key:'研发1号楼进线总表',
              children:[{
                title:'1层回路',
                key:'1',
              },{
                title:'2层回路',
                key:'2',
              },{
                title:'3层回路',
                key:'3',
              },]
            },{
              title:'研发2号楼进线总表',
              key:'研发2号楼进线总表',
              children:[{
                title:'1层回路',
                key:'1层回路',
              },{
                title:'2层回路',
                key:'2层回路',
              },{
                title:'3层回路',
                key:'3层回路',
              },]
            }]
          }])
        }else if(value == 2){
          setTreeData([{
            title:'正泰物联滨江园区',
            key:'正泰物联滨江园区',
            children:[{
              title:'研发1号楼',
              key:'研发1号楼',
              children:[{
                title:'1层',
                key:'1-1',
                children:[{
                  title:'101',
                  key:'1-1-1'
                },{
                  title:'102',
                  key:'1-1-2'
                },{
                  title:'103',
                  key:'1-1-3'
                }]
              },{
                title:'2层',
                key:'1-2',
                children:[{
                  title:'201',
                  key:'1-2-1'
                },{
                  title:'202',
                  key:'1-2-2'
                },{
                  title:'203',
                  key:'1-2-3'
                }]
              },]
            },{
              title:'研发2号楼',
              key:'研发2号楼',
              children:[{
                title:'1层',
                key:'2-1',
                children:[{
                  title:'101',
                  key:'2-1-1'
                },{
                  title:'102',
                  key:'2-1-2'
                },{
                  title:'103',
                  key:'2-1-3'
                }]
              },{
                title:'2层',
                key:'2-2',
                children:[{
                  title:'201',
                  key:'2-2-1'
                },{
                  title:'202',
                  key:'2-2-2'
                },{
                  title:'203',
                  key:'2-2-3'
                }]
              },]
            }]
          }])
        }
        dataList = [];
        generateList(treeData)
      }  
      return(
        <div className={style.contentLeft}>
          <Radio.Group className={style.radioCss} options={options} onChange={onChange} value={value} />
          <img src={dashLine} className={style.radioLine}></img>
          <Search
            placeholder="请输入关键字查询"
            size="middle"
            onChange={onSearch}
            style={{
              width: 264,
              margin:'12px'
            }}
          />
          <Tree
            style={{height:'636px',overflow:'auto',marginLeft:'12px'}}
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(treeData)}
          />
        </div>
      )
}