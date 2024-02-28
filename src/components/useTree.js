import React,{useEffect, useState,useRef,memo} from 'react'
import {useSelector } from 'react-redux'

import styled from 'styled-components'

import { energyShare, Monitoring, EnergyPublicRuntime } from '@api/api'
import {selectProjectId,selectOneLevel} from '@redux/systemconfig.js'
import { message,Input,Tree, Radio } from 'antd'
 
import Titlelayout from "@com/titlelayout";
 
const { Search } = Input;
 
const {QuerySpaceTrees} = energyShare
const {LineManagerQuery} = Monitoring.LineManager // 线路查询
const {queryEnergyCategoryTree} = EnergyPublicRuntime
const Treebox = styled.div`
       display: grid;
       grid-template-rows: ${(props) => props.showline == "false" ? '32px 1fr' : '32px 32px 556px'};
       row-gap: 16px;
       .ant-tree{
        overflow-y: auto;
       }
`
 
export default memo(function Index({areaId, setTreeId,  setLine, showline=true, datatype=NaN, energytype}) {
  console.log(datatype)
  
  const [treeData,setTreeData] =useState([])
  
  
  const [checkedKeys, setCheckedKeys] = useState([])
 
  const [keyword, setKeyword] = useState('')
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(0)
  
  const treekey = isFinite(datatype) ? 'id' :  typeTree == 0 ?  "areaId" : "id" ;
  const [expandedKeys, setExpandedKeys] = useState([]);
 
/*   const [preAreaId, setPreAreaId] = useState(areaId)
  if(areaId !== preAreaId) {
    setPreAreaId(areaId)
    setTreeId([])
  }
  */
 let arr = []
 const getId = (nodes, type, child='nodes') => {
     if(Array.isArray(nodes)) {
        for(let node of nodes) {          
           arr.push(node[type])
           if(node[child] && Array.isArray(node[child]) && node[child]?.length > 0) {
             getId(node[child], type, child)
           }
        }
     }
 }
 const fieldNames=isNaN(datatype) ? {title:'name',key: treekey,children:'nodes'} : {title:'name',key: treekey,children:'childs'}
  //获取树的数据，0 网格, 1 线路, 2 公共能耗分类
 const getTreeData= async (name='')=>{
    
    let idx = isFinite(datatype) ? datatype : typeTree;

    try {
       if(name!=keyword) setKeyword(name)
      let params =[{
        projectId,
        areaId,
        areaName: name,
      }, 
      {
        projectId,
        areaId,
        type:0,
        lineName: name
      },
      {
        projectId,    
        categoryType: energytype,
        name
      }

    ][idx]
      console.log(params)
      let hander = [ QuerySpaceTrees, LineManagerQuery, queryEnergyCategoryTree][idx]
    
     /*  if(lineType == "3") {
        hander = QuerySpaceTrees
        params = {
            projectId,
            areaId,
            areaName:name,
          }
      } */

      const {success, data, errMsg} = await hander(params)
      if(success && Array.isArray(data)){

         switch (idx) {
            case 0:
              getId(data, 'areaId');
              break;
            case 1:
              getId(data, 'id');
              break;
            case 2:
              console.log(idx);
              getId(data, 'id', 'childs')
              break;
            default:
              break
            
         }
        console.log(arr)
       
         setTreeData(data)  
         setCheckedKeys(arr);
         setTreeId(arr);
         console.log(arr);
        /*  if(name) {
             setTreeId(arr)
             setCheckedKeys(arr)
         }else {
          setTreeId([])
          setCheckedKeys([])
         }
       */
      }else{
        setTreeData([]) 
        setCheckedKeys([])
       // message.error(errMsg || '数据出错')
      }
     
    } catch (error) {
      console.log(error)
    }
   
    
  } 
 // 根据区域查询
 const onCheck = (ids=[]) => {
     
    setTreeId(ids)
    setCheckedKeys(ids)
     
 } 
 // 树搜索
 const onExpand = (newExpandedKeys) => {
  setExpandedKeys(newExpandedKeys);
  
};

  
  useEffect(()=>{
     if(isNaN(areaId) || !energytype) return;
     // setTreeId([])
     getTreeData()
     
  },[areaId, typeTree, datatype, energytype, projectId])
   
   const radiosty = {
    display: 'grid',   
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',
    borderBottom: '1px dotted #d7d7d7',
   }
  const switchLine = (e) => {  
    setTypeTree(e.target.value)
    setLine(e.target.value)
    setTreeId([])
    setCheckedKeys([])
    setKeyword('')
  }
  const onChange = (e) => {
    setKeyword(e.target.value)
  }
  console.log('render')
  return (
  
        <Titlelayout key="line" layout="flex">
        <Treebox showline={showline.toString()}>
       { showline && <Radio.Group onChange={switchLine} style={radiosty} value={typeTree}>
          <Radio value={0}>按网格</Radio>
          <Radio value={1}>按线路</Radio>
         
        </Radio.Group>
        }
          <Search 
          placeholder='请输入关键字查询' 
          allowClear
          value={keyword}
          onChange={onChange}
          onSearch={getTreeData}
          />
          <Tree 
          treeData={treeData} 
          checkable 
          defaultExpandAll
          
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          fieldNames={fieldNames}
          />
        </Treebox>
        </Titlelayout>
       
  )
})



