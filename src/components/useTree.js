import React,{useEffect, useState,useRef,memo} from 'react'
import {useSelector } from 'react-redux'

import styled from 'styled-components'

import { energyShare, Monitoring } from '@api/api'
import {selectProjectId,selectOneLevel} from '@redux/systemconfig.js'
import { message,Input,Tree, Radio } from 'antd'
 
import Titlelayout from "@com/titlelayout";
 
const { Search } = Input;
 
const {QuerySpaceTrees} = energyShare
const {LineManagerQuery} = Monitoring.LineManager // 线路查询
const Treebox = styled.div`
       display: grid;
       grid-template-rows: ${(props) => props.lineType == "3" ? '32px 1fr' : '32px 32px 556px'};
       row-gap: 16px;
       .ant-tree{
        overflow-y: auto;
       }
`
 
export default memo(function Index({areaId, setTreeId,  setLine, lineType}) {
  
  const [treeData,setTreeData] =useState([])
  
  
  const [checkedKeys, setCheckedKeys] = useState([])
 
  const [keyword, setKeyword] = useState('')
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(0)
  
  const treekey =  typeTree == 0 ?  "areaId" : "id" ;
  const [expandedKeys, setExpandedKeys] = useState([]);
 
/*   const [preAreaId, setPreAreaId] = useState(areaId)
  if(areaId !== preAreaId) {
    setPreAreaId(areaId)
    setTreeId([])
  }
  */
 let arr = []
 const getId = (nodes, type) => {
     if(Array.isArray(nodes)) {
        for(let node of nodes) {
           console.log(node[type])
           arr.push(node[type])
           if(node.nodes && Array.isArray(node.nodes)) {
             getId(node.nodes, type)
           }
        }
       
        
     }

 }
  //获取树的数据，0 网格, 1 线路
 const getTreeData= async (name='')=>{
    console.log('name', name)
    try {
       if(name!=keyword) setKeyword(name)
     
      let params =typeTree == 1 ? {
        projectId,
        areaId,
        type:0,
        lineName: name
      } : typeTree == 0 ? {
        projectId,
        areaId,
        areaName: name,
      } : {}
      let hander = [ QuerySpaceTrees, LineManagerQuery][typeTree]
    
      if(lineType == "3") {
        hander = QuerySpaceTrees
        params = {
            projectId,
            areaId,
            areaName:name,
          }
      }

      const {success, data, errMsg} = await hander(params)
      if(success && Array.isArray(data)){

        
         if(typeTree == 1) { // 线路        
           getId(data, 'id')
         }else if(typeTree == 0) {
           getId(data, 'areaId')
         }
       
         setTreeData(data)  
         setCheckedKeys(arr);
         setTreeId(arr);

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
     if(isNaN(areaId)) return;
     // setTreeId([])
     getTreeData()
     
  },[areaId, typeTree])
   
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
        <Treebox lineType={lineType}>
       { lineType!="3" && <Radio.Group onChange={switchLine} style={radiosty} value={typeTree}>
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
          fieldNames={{title:'name',key: treekey,children:'nodes'}}
          />
        </Treebox>
        </Titlelayout>
       
  )
})



