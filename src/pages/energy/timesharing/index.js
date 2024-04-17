import React,{useEffect, useState,useRef,useMemo} from 'react'
import {useSelector } from 'react-redux'
import {useOutletContext} from 'react-router-dom' 
import styled from 'styled-components'

import Ichart  from '@com/useEcharts/Ichart';
import { energyShare, Monitoring } from '@api/api'
import {selectProjectId} from '@redux/systemconfig.js'
import {Tree ,Radio, Empty, Input } from 'antd'
 
import Titlelayout from "@com/titlelayout";
import Pagecount from "@com/pagecontent";
import UseTable from '@com/useTable'
import {getTime, numberformat} from "@com/usehandler"
 
const {Search} = Input
const {QuerySpaceTrees, queryArea, queryLine} = energyShare
const {LineManagerQuery} = Monitoring.LineManager // 线路查询
 
const Mainbox = styled.div`
  && {
    display: grid;
    grid-template-columns: 296px 952px 1fr;
    column-gap: 16px;
    .treebox {
       display: grid;
       grid-template-rows: 32px 32px 604px;
       row-gap: 32px;
       .ant-tree {
        overflow-y: auto;
      }
    }
    .rightlayout {
      display: grid;
      grid-template-rows: 504px 1fr;
      row-gap: 16px;
    }
    .chart {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

`
 

export default function Index() {
  const [treeData,setTreeData] =useState([])
 
  let {exparams} = useOutletContext() 
 
  const {areaId, date, type} =  exparams
 
  const [selectkeys, setSelectkeys] = useState([])
  const selectRef=useRef()
  selectRef.current=selectkeys
 
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(1)
  
  const treekey =  typeTree == 1 ? "id" : "areaId"
  //const selectedId = useRef([])
   const [selectedId, setSelectedId] = useState()
   const [datas, setDatas] = useState({})
 
   const columns = [
    {
        title: '分时能耗',
        dataIndex: 'name',
        key: 'name',
        onCell: ()=> ({style: {textAlign: "center" }}),
        onHeaderCell: ()=> ({style: {textAlign: "center" }}),
    },
    {
      title: '用电量',
      dataIndex: 'value',
      key: 'value',
      onCell: ()=> ({style: {textAlign: "center" }}),
      onHeaderCell: ()=> ({style: {textAlign: "center" }}),
    },
    {
      title: '环比',
      dataIndex: 'mom',
      key: 'mom',
      render: numberformat,
      onCell: ()=> ({style: {textAlign: "center" }}),
      onHeaderCell: ()=> ({style: {textAlign: "center" }}),
    },
    {
      title: '同比',
      dataIndex: 'yoy',
      key: 'yoy',
      render: numberformat,
      onCell: ()=> ({style: {textAlign: "center" }}),
      onHeaderCell: ()=> ({style: {textAlign: "center" }}),
    },
    
  ]
  //获取树的数据， 1 线路 2 网格
 const getTreeData= async (name)=>{
    try {
      let params =typeTree == 1 ? {
        projectId,
        areaId,
        type:1,
        lineName: name
      } : typeTree == 2 ? {
        projectId,
        areaId,
        areaName: name,
      } : {}
      let hander = ['', LineManagerQuery, QuerySpaceTrees][typeTree]
      const {success, data} = await hander(params)
      if(success && Array.isArray(data)){
         setTreeData(data)
        
      }else{
        setTreeData([])
        // message.error(errMsg)
      }
      setSelectedId([])
      //getDataByLine()
    } catch (error) {
      console.log(error)
    }
   
    
  } 
 // 根据区域查询
 const getDataByLine = async () => {     
    // let ids = selectedId.current
   //  let node = e.map(n => n.toString())
    
   //  setSelectedId(node)
  //   let ids = e;
    try {
      let time = getTime(date, type)
      
      let params = typeTree == 1 ? {
        projectId,
        shift: 0,
        type,
        date: time,
        ids: selectedId,
        
       } : {
        projectId,
        shift: 0,
        type,
        date: time,
        ids: selectedId,
       }
      let hander = ['', queryLine, queryArea][typeTree]
      let {success, data} = await hander(params)
      if(success && data.constructor === Object) {
          setDatas({...data}) 
      }else {
        setDatas({}) 
      }
    } catch (error) {
      console.log(error)
    }
   
     
 } 
 
 const options = {
  series: [ {
    type: 'bar',seriesLayoutBy: 'row', stack: 'Ad', 
  },
  {
    type: 'bar',seriesLayoutBy: 'row', stack: 'Ad', 
  },
  {
    type: 'bar',seriesLayoutBy: 'row', stack: 'Ad', 
  }],  
  grid:{
    left: "0px",
    right: "0",
    top: "35px",
    bottom: "0px",
    containLabel: true,
  },
  legend: {
    top: "5px",
  },
  

}
 
const [baropt, pieopt, momYoy] = useMemo(() => {
 let {detail={}, proportion = [], momYoy=[]} =  Object.prototype.toString.call(datas).slice(8,-1) === 'Object' ? datas : {}  
 const {x=[], y=[], y1=[], y2=[], y3=[]} = detail;
 return [
  {
    ...options,
    dataset: {
      dimensions: [
        {name: 'x', type: 'time'},
        {name: 'y', displayName: '尖能耗(kWh)'},
        {name: 'y2', displayName: '平能耗(kWh)'},
        {name: 'y3', displayName: '谷能耗(kWh)'},
      ],
      source: [x, y, y2, y3]
    }
  },
  {
    pieData: { data: proportion, total: 100 },
    type: 3,
    legend: {
      bottom: 0,
      top: 'auto',
      itemGap: 5
    },
    grid: {
      bottom: 20
    }
},
momYoy
 ]

}, [datas])
  useEffect(()=>{
     if(!Number.isFinite(areaId) || !Number.isFinite(type)) return;
   //  selectedId.current = []
  
   
     getTreeData()
     
  },[areaId, typeTree,  type])
 
 useEffect(() => {
   
   if(date && Array.isArray(selectedId))  {
     getDataByLine()
   
   }

 }, [date, selectedId])
  
 
 const onSelect = (e) => {  
   setSelectedId(e)
 // selectedId.current = e;
 // getDataByLine(e)
 }
  
   const radiosty = {
    display: 'grid',   
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',
    borderBottom: '1px dotted #d7d7d7',
   }
  const switchLine = (e) => {
   
    setTypeTree(e.target.value)
  }
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <Titlelayout key="line">
        <div className="treebox">
        <Radio.Group onChange={switchLine} style={radiosty} value={typeTree}>
          <Radio value={1}>按线路</Radio>
          <Radio value={2}>按网格</Radio>
         
        </Radio.Group>
          <Search 
          placeholder='请输入关键字查询' 
          allowClear
          onSearch={getTreeData}
          />
         { treeData.length > 0 ? <Tree 
          treeData={treeData} 
         // checkable 
          defaultExpandParent
        //  expandedKeys={expandedKeys}
         // autoExpandParent={autoExpandParent}
         selectedKeys={selectedId}
          onSelect={onSelect}
          
          fieldNames={{title:'name',key: treekey,children:'nodes'}}
          />
          : <Empty />
         }
        </div>
        </Titlelayout>
         <Titlelayout title="分时能耗" key="stack" layout="flex">
          <div className='chart'>
              <Ichart {...baropt} />
          </div>
           

         </Titlelayout>
         <div className='rightlayout'>
           <Titlelayout title="分时占比" key="pie" layout="flex">
           <div className='chart'>
              <Ichart {...pieopt} />
          </div>
           </Titlelayout>
           <Titlelayout title="分时能耗同环比" key="momyoy">
               <div className='chart' style={{paddingTop: '16px'}}>
              <UseTable 
                columns={columns} 
                dataSource={momYoy}
              ></UseTable>
              </div>
           </Titlelayout>
         </div>
      </Mainbox>
      
    </Pagecount>
  )
    
}



