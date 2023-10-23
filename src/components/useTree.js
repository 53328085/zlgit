import React,{useEffect, useState,useRef,useMemo} from 'react'
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
       grid-template-rows: ${(props) => props.lineType == "3" ? '32px 636px' : '32px 32px 604px'};
       row-gap: 16px;
`
 

 

export default function Index({areaId, setTreeId, setLine, lineType}) {
  
  const [treeData,setTreeData] =useState([])
  
 
  const [selectkeys, setSelectkeys] = useState([])
 
 
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
 

  //获取树的数据， 1 线路 0 网格
 const getTreeData= async (name='')=>{
    try {
    
     
      let params =typeTree == 1 ? {
        projectId,
        areaId,
        type:0,
        lineName: name
      } : typeTree == 0 ? {
        projectId,
        areaId,
        areaName:name,
      } : {}
      let hander = [ QuerySpaceTrees, LineManagerQuery][typeTree]
    
      if(lineType == "3") {
        hander = QuerySpaceTrees
        params = {
            projectId,
            areaId,
            areaName,
          }
      }

      const {success, data, errMsg} = await hander(params)
      if(success && Array.isArray(data)){
         setTreeData(data)       
      }else{
        message.error(errMsg || '数据出错')
      }
     
    } catch (error) {
      console.log(error)
    }
   
    
  } 
 // 根据区域查询
 const onCheck = (ids=[]) => {
     
    setTreeId(ids)
    
     
 } 
 // 树搜索
 const onExpand = (newExpandedKeys) => {
  setExpandedKeys(newExpandedKeys);
  
};

  
  useEffect(()=>{
     if(!areaId) return;
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
  }
 
  return (
  
        <Titlelayout key="line">
        <Treebox lineType={lineType}>
       { lineType!="3" && <Radio.Group onChange={switchLine} style={radiosty} value={typeTree}>
          <Radio value={0}>按网格</Radio>
          <Radio value={1}>按线路</Radio>
         
        </Radio.Group>
        }
          <Search 
          placeholder='请输入关键字查询' 
          allowClear
          onSearch={getTreeData}
          />
          <Tree 
          treeData={treeData} 
          checkable 
          onExpand={onExpand}
          expandedKeys={expandedKeys}
         
          onCheck={onCheck}
          fieldNames={{title:'name',key: treekey,children:'nodes'}}
          />
        </Treebox>
        </Titlelayout>
       
  )
}



