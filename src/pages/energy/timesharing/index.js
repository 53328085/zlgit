import React,{useEffect, useState,useRef,useMemo} from 'react'
import {useSelector } from 'react-redux'

import styled from 'styled-components'
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";

import { energyShare, Monitoring } from '@api/api'
import {selectProjectId, selectOneLevel, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import { Form, Select, DatePicker, message,Input,Tree ,Button, Space, Radio, Empty } from 'antd'
import moment from 'moment';
import UserSearch from "@com/useSerach";
import Titlelayout from "@com/titlelayout";
import UseTable from '@com/useTable'
import {getTime, numberformat} from "@com/usehandler"
const { Search } = Input;
const {Item} = Form
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
    }
    .rightlayout {
      display: grid;
      grid-template-rows: 504px 1fr;
      row-gap: 16px;
    }
  }

`
 

export default function Index() {
  const [form] =Form.useForm()
  const [treeData,setTreeData] =useState([])
 
 
  const onelevel = useSelector(selectOneLevel)
  const areaId = useSelector(selectOneLevelDefaultId)

  const pieRef = useRef()
  const stackRef =useRef()
  const [selectkeys, setSelectkeys] = useState([])
  const selectRef=useRef()
  selectRef.current=selectkeys
 
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(1)
  
  const treekey =  typeTree == 1 ? "id" : "areaId"
  const selectedId = useRef([])
 
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
      getDataByLine()
    } catch (error) {
      console.log(error)
    }
   
    
  } 
 // 根据区域查询
 const getDataByLine = async () => {
     let ids = selectedId.current
    try {
      let {type, date} = form.getFieldsValue()
     
      let time = getTime(date, type)
      
      let params = typeTree == 1 ? {
        projectId,
        shift: 0,
        type,
        date: time,
        lineIds: ids,
        
       } : {
        projectId,
        shift: 0,
        type,
        date: time,
        areaIds: ids,
       }
      let hander = ['', queryLine, queryArea][typeTree]
      let {success, data} = await hander(params, areaId)
      if(success && data.constructor === Object) {
          setDatas({...data}) 
      }else {
        setDatas({}) 
      }
    } catch (error) {
      console.log(error)
    }
   
     
 } 
 

 


useEffect(() => {
  try {
    let {detail={}, proportion = []} = datas  
    const {x=[], y=[], y1=[], y2=[], y3=[]} = detail;

  drawEcharts(stackRef.current, {
    dataset: {
    
      source: [
        ['日期',...x],
        ['尖能耗(kWh)',...y],
     //   ['峰',...y1],
        ['平能耗(kWh)',...y2],
        ['谷能耗(kWh)', ...y3],
      ]
    },
    series: [
        {
          type: 'bar',seriesLayoutBy: 'row', stack: 'Ad', 
        },
        {
          type: 'bar',seriesLayoutBy: 'row', stack: 'Ad', 
        },
        {
          type: 'bar',seriesLayoutBy: 'row', stack: 'Ad', 
        }
    ]
  })  
  drawEcharts(pieRef.current, {
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
  
  })
  } catch (error) {
     console.log(error)
  }
  



}, [datas])

 
 


  

  
  useEffect(()=>{
     if(!areaId) return;
     selectedId.current = []
     getTreeData()
     
  },[areaId, typeTree])
  const [timetype, setTimetype] = useState(1) // 日、月、年 1,2,3
 
  
  const picker= ['','date', 'month', 'year'][timetype];
  const timechange = (e) => {
    console.log(e)
    setTimetype(e);
    getDataByLine()
 }
 const onSelect = (e) => {
  console.log(e);
  selectedId.current = e;
  getDataByLine()
 }
  const CustView = () => {
    
     return (
        <Space size={16} style={{marginLeft: "auto"}}>
         <Item  name="type" initialValue={1}>
            <Select style={{width: '80px'}}   options={[
             {value: 1, label: '日'},
             {value: 2, label: '月'},
             {value: 3, label: '年'},
            ]}
            onChange={timechange}
            ></Select>
         </Item>
 
         <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
           <DatePicker placeholder="请选择日期" picker={picker}  style={{width: '160px'}} onChange={() => getDataByLine()} />
         </Item>       
       </Space>
       
     )
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
  const boxsty = {
    height: "100%",
    paddingTop: '16px',
  }
  return (
    <CustContext.Provider
    value={{
      form,
      custview: <CustView />,
    }}
  >
    <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px', flex: 1}}>
     <UserSearch></UserSearch>
     
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
         selectedKeys={selectedId.current}
          onSelect={onSelect}
          
          fieldNames={{title:'name',key: treekey,children:'nodes'}}
          />
          : <Empty />
         }
        </div>
        </Titlelayout>
         <Titlelayout title="分时能耗" key="stack">
               <div ref={stackRef} style={boxsty}></div>
         </Titlelayout>
         <div className='rightlayout'>
           <Titlelayout title="分时占比" key="pie">
              <div ref={pieRef} style={boxsty}></div>
           </Titlelayout>
           <Titlelayout title="分时能耗同环比" key="momyoy">
               <div style={boxsty}>
              <UseTable 
                columns={columns} 
                dataSource={datas.momYoy}
               

              ></UseTable>
              </div>
           </Titlelayout>
         </div>

      
        
      </Mainbox>
      
    </div>
    </CustContext.Provider>
  )
}



