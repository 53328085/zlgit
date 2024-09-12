import React, { useState, useRef ,useMemo, useEffect } from 'react'
import { Select ,Space,Divider,DatePicker,Radio, Button, message } from 'antd'
import styled from 'styled-components'
import {useSelector,  } from 'react-redux'
import { selectcurlRommid } from "@redux/systemconfig";
import {useOutletContext} from 'react-router-dom'
 
 
import UseTable from '@com/useTable'
import { columns } from './columns'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
 
import { drawEcharts } from "@com/useEcharts"
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import  imgurl from '@imgs'
import moment from 'moment'
import CEmpty from '@com/useEmpty.js'
import Transform from './transData.js'
import Chartbox from './chartbox.js'
const Mainbox=styled.div`
background-color: #fff;
flex: 1;
 padding: 16px;
display: flex;
 flex-direction: column;
row-gap: 16px;
.upbox {
   
  padding-bottom: 16px;
  border-bottom: 1px dotted #d7d7d7;
}
.trancss{
  display: flex;
  .ant-table-thead .ant-table-cell{
    padding: 3px;
  }
  .ant-table-tbody .ant-table-placeholder .ant-table-cell{
    padding: 3px
  }
  .ant-empty-normal{
    margin: 0;
  }
  .ant-empty{
    .ant-empty-image{
      height: 20px;
    }
    .ant-empty-description{
      font-size: 10px;
    }
    
  }
  .tablecss{
    display:flex;
    justify-content:space-between;
    flex:1
  }
}
.datastyle{
  flex: 1;
  display: flex;
  flex-direction: column;
  .filters{
    display: flex;
    justify-content: space-between;
    background-color: #f9f9f9;
    height: 63px;
    padding:0 12px;
    .title{
      display: flex;
      align-items: center;
    }
  }
  .filterdate{
    display: flex;
    align-items: center;
    width: 650px;
    justify-content: space-between;
  }
}
`
const chartOpt= {
  title: {
    // text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top:'2%',
    icon:'roundRect',
    itemHeight:2,
    itemWidth:16,
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '1%',
    right: '1%',
    bottom: '3%',
    top:'8%',
    containLabel: true
  },
  //保存图片
  toolbox: {
    // feature: {
    //   saveAsImage: {}
    // }
  },
  xAxis: {
    axisLine:{
      lineStyle:{
        color:"#D8D8D8",
      }
    },
    axisLabel:{
      color:"#333"
    },
  },

  dataZoom:{
    type: 'inside',
    start:'50',
    end:'100',
  },
  yAxis: {
    type: 'value'
  },
  series: [
   
  ]
};
const CustomTable =styled.div`
  display:grid;
  grid-template-rows:repeat(${props=>props.rows},33px);
  grid-template-columns:repeat(${props=>props.cols/2},101px 121px);
  .item1{
    grid-column:1/${props=>props.cols+1};
    background:#237ae4;
    color:#fff;
    text-align:center;
    line-height:33px;
  }
  div{
    border:1px solid #e4e4e4;
    margin-right:-1px;
    margin-bottom:-1px;
    line-height:33px;
    text-align:center
  }
  div:nth-child(2n){
    background:#ecf5ff;
    /* margin-left:-1px; */
    //width
  }
`
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)  
  const chartRef =useRef()
  const roomId = useSelector(selectcurlRommid)
  const [pattern,setPattern]=useState(1)
  const [tabs,setTabs] =useState([])
  const {setCustview} = useOutletContext()
  const [value, setvalue] =useState(0)
  const [tabledata,setTableData]=useState([])
  const [type,setType] =useState(1)
  const [timeRanger,setTimeRanger] = useState([moment().subtract(6,'day'), moment()])
  const [header,setHeader] = useState([])
  const [tabletrend,setTabletrend] = useState([])
  const [disableDate,setDisableDate] = useState([])
  const chartsRef =useRef()
  const tableRef=useRef()
  const initchartRef =useRef()
  const device = tabs?.[value]
  const transprop ={
     device,
     projectId
  }

  // 获取配电房设备列表
  const [deviceStyle, setDeviceStyle] = useState(5)
  const devicechange=(e) => {
    console.log(e)
    setDeviceStyle(e)
  }
  const custoptions = (<Select value={deviceStyle} style={{width: 200}} options={[
    {label: '变压器',value: 5},
    {label: '直流屏',value: 15},
    {label: '出线柜',value: 16}

  ]} onChange={devicechange}></Select>)
  useEffect(() => {
    setCustview(custoptions)
    return()=> {
      setCustview(null)
    }
  }, [])
  const transInfo =useRef({
    capacity:null
  })
  const dataprop={
    tabs,
  //  setTabs,
    value,
    setvalue,
    initialval: '0'
  }


  const getDeviceList =async() => {
    try {
      let body ={
        projectId,
        roomId,
        deviceStyle
      }
      let {success, data} = await   DistributionRoomRuntime.DeviceList(body)
      if(success && Array.isArray(data) && data?.length >0) {
        const items = data.map((it,i)=>({
            key:i,
            label:it.name,
            ...it,
          }))
        setTabs(items)
        
      }else {
        setTabs([])
      
      
      }
    } catch (error) {
       
    }
   
  }
 
 
  useEffect(() => {
    if([projectId, roomId, deviceStyle].every(n => Number.isInteger(parseInt(n)))) {
       getDeviceList() 
    }

  }, [projectId, roomId, deviceStyle])

  const opts = [
    {
      value:1,
      label:'电压(V)'},
    {
      value:2,
      label:'电流(A)'},
    {
      value:3,
      label:'总负荷(kW)'},
    {
      value:4,
      label:'总有功功率(kW)'},
    {
      value:5,
      label:'总无功功率(kVar)'},
    {
      value:6,
      label:'总视在功率(kVA)'},
    {
      value:7,
      label:'总功率因数'},
  ]

  
  return (
    <>
 
        {
          tabs.length>0?(
            <CustContext.Provider value={dataprop}>
            <Pagecount pd="0"> 
            <Mainbox>
               <div className='upbox'>
                   <Transform  {...transprop} />
               </div>
               <Chartbox {...transprop}  />
            </Mainbox>
         </Pagecount>
         </CustContext.Provider>
          ):
           <CEmpty />
        
        }
   
    </>
    
  )
}