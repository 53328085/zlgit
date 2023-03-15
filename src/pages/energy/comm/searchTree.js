import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import {Input, Button, Radio, Tree } from 'antd';
import dashLine from '@imgs/line.png'

export default function Index(props){
    const { Search } = Input;

      const [treeData, setTreeData] = useState([
        {
        title:'照明插座用电',
        key:'1',
        children:[{
          title:'照明与插座',
          key:'1-1',
        },{
            title:'照明',
            key:'1-2',
          },{
            title:'公共区域照明(含应急)',
            key:'1-3',
          },{
            title:'室外景观照明',
            key:'1-4',
          }]
      },{
        title:'空调用电',
        key:'2',
        children:[{
          title:'冷热站',
          key:'2-1',
        },{
            title:'空调末端',
            key:'2-2',
          },{
            title:'净化系统',
            key:'2-3',
          },{
            title:'大型独立空调',
            key:'2-4',
          }]
      },{
        title:'动力用电',
        key:'3'
      },{
        title:'特殊区域用电',
        key:'4'
      }])
    
    
      
    
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
    
       
      return(
        <div className={style.contentLeft}>
          {props.title ? <div className={style.title}>{props.title}</div> : null}
          <Search
            placeholder="请输入关键字查询"
            size="middle"
            onChange={onSearch}
            style={{
              width: 264,
              margin:'16px'
            }}
          />
          <img src={dashLine} className={style.radioLine}></img>
          <Tree
            style={{height:'636px',overflow:'auto',marginLeft:'16px'}}
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(treeData)}
          />
        </div>
      )
}