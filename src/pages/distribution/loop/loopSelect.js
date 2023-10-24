import React, {useState, useEffect,useRef, Fragment} from 'react'
import style from './style.module.less';
import {Input, Tree, message } from 'antd';
import dashLine from '@imgs/line.png'
import {DistributionRoomRuntime} from '@api/api.js'
export default function Index({form,projectId}){
    const { Search } = Input;

      const [treeData, setTreeData] = useState([
      //   {
      //   title:'总出线1',
      //   key:'1',
      //   children:[{
      //     title:'回路1-1',
      //     key:'1-1',
      //   },{
      //       title:'回路1-2',
      //       key:'1-2',
      //       children:[{
      //           title:'回路1-2-1',
      //           key:'1-2-1',
      //       },{
      //           title:'回路1-2-2',
      //           key:'1-2-2',
      //       },{
      //           title:'回路1-2-3',
      //           key:'1-2-3',
      //       }]
      //   }]
      // },{
      //   title:'总出线2',
      //   key:'2',
      //   children:[{
      //     title:'回路2-1',
      //     key:'2-1',
      //   },{
      //       title:'回路2-2',
      //       key:'2-2',
      //       children:[{
      //           title:'回路2-2-1',
      //           key:'2-2-1',
      //       },{
      //           title:'回路2-2-2',
      //           key:'2-2-2',
      //       },{
      //           title:'回路2-2-3',
      //           key:'2-2-3',
      //       }]
      //   }]
      // },
    ])
    
      const getTreeData=async (roomId)=>{
        const res =  await DistributionRoomRuntime.LineTree(projectId,roomId)
        if(res.success){
          setTreeData(res.data)
          generateList(res.data);
        }else{
          message.error(res.errMsg)
        }
      } 
      
    
      let dataList = useRef([]);
      const generateList = data => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { id, name } = node;
          dataList.current.push({ id, name });
          if (node.nodes) {
            generateList(node.nodes);
          }
        }
      };
     
   
      const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.nodes) {
            if (node.nodes.some(item => item.id === key)) {
              parentKey = node.id;
            } else if (getParentKey(key, node.nodes)) {
              parentKey = getParentKey(key, node.nodes);
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
        console.log(dataList)
        const { value } = e.target;
        const expandedKeys = dataList.current
          .map(item => {
            if (item.name.indexOf(value) > -1) {
              return getParentKey(item.id, treeData);
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
      {
        if(data.length>0){
          return  data.map(item => {
            // console.log(item)
            const index = item.name.indexOf(searchValue);
            const beforeStr = item.name.substr(0, index);
            const afterStr = item.name.substr(index + searchValue.length);
            const title =
              index > -1 ? (
                <span>
                  {beforeStr}
                  <span style={{ color: '#f50' }}>{searchValue}</span>
                  {afterStr}
                </span>
              ) : (
                <span>{item.name}</span>
              );
            if (item.nodes) {
              return { title, key: item.id, children: loop(item.nodes) };
            }
       
            return {
              title,
              key: item.id,
            };
          });
        }
        
      }
        
    
      useEffect(()=>{
        const {roomId} = form.getFieldsValue()
        getTreeData(roomId)
      },[])   
      return(
        <div className={style.contentLeft}>
            <div className={style.title}>回路选择</div>
          <Search
            placeholder="请输入关键字查询"
            size="middle"
            onChange={onSearch}
            style={{
              width: 224,
              margin:'16px'
            }}
          />
          <img src={dashLine} className={style.radioLine}></img>
          <Tree
            style={{height:'636px',overflow:'auto',marginLeft:'12px'}}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(treeData)}
          />
        </div>
      )
}