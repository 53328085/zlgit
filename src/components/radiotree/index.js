import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import {Input, Button, Radio, Tree } from 'antd';
import dashLine from '@imgs/line.png'
import { cloneDeep } from 'lodash';

export default function Index(props){
    const { Search } = Input;
    const { getTreeType, getValues } = props;
    const [treeData, setTreeData] = useState([])
    const [value, setValue] = useState('line');
    const arr = cloneDeep(props.treeData)
    const [fieldNames, setFieldNames] = useState({
      title:'name',
      key: 'id',
      children: 'nodes'
    })
    const changeTitle = data => {
      for(let i =0; i < data.length;i++){
         let node = data[i]
         node.title = cloneDeep(node[fieldNames.title])
         node.key = cloneDeep(node[fieldNames.key])
         node.children = node[fieldNames.children] ? cloneDeep(node[fieldNames.children]) : []
         Reflect.deleteProperty(node, fieldNames.title) 
         Reflect.deleteProperty(node, fieldNames.key)
         Reflect.deleteProperty(node, fieldNames.children)
         if(node.children.length > 0) {
          changeTitle(node.children)
         }
      }
    }
    const changeBuildTitle = data => {
      for(let i =0; i < data.length;i++){
         let node = data[i]
         node.title = cloneDeep(node.name)
         node.key = cloneDeep(node.areaId)
         node.children = node.nodes ? cloneDeep(node.nodes) : []
         Reflect.deleteProperty(node, 'name') 
         Reflect.deleteProperty(node, 'areaId')
         Reflect.deleteProperty(node, 'nodes')
         if(node.children.length > 0) {
          changeTitle(node.children)
         }
      }
    }
    
    
    useEffect(()=>{
      changeTitle(arr)
      setTimeout(()=>{
        setTreeData(arr)
      }, 100)
    },[])
    useEffect(()=> {
      if(value == 'line'){
        changeTitle(arr)
        console.log(123) 
        }else{
        changeBuildTitle(arr)
        console.log(456) 
      }
      setTimeout(()=>{
        setTreeData(arr)
      }, 100)
    }, [value])

    const options = [
        {
          label: '按回路',
          value: 'line',
        },
        {
          label: '按建筑',
          value: 'building',
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
    
      
        
      const onChange = ({target:{value}})=>{
        setValue(value)
        setSelectKeys([])
        getTreeType(value)
      }
      const [selectKeys, setSelectKeys] = useState([])
      const onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        setSelectKeys(checkedKeys)
        getValues(checkedKeys)
      };
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
            checkedKeys={selectKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(treeData)}
            onCheck={onCheck}
          />
        </div>
      )
}