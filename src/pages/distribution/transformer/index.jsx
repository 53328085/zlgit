import React, { useState, useRef ,useMemo, useEffect } from 'react'
import { Select ,Space,Divider,DatePicker,Radio, Button, message } from 'antd'
 
import {useSelector,  } from 'react-redux'
import { selectcurlRommid,adaptation, site } from "@redux/systemconfig"; 
import TranCard from './transcard'
import UseTable from '@com/useTable'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {useRequest} from "ahooks"
import { drawEcharts } from "@com/useEcharts"
import {DistributionRoomRuntime} from '@api/api.js'
import  imgurl from '@imgs'
import moment from 'moment'
import {isObject} from "@com/usehandler" 
import Titlelayout from '@com/titlelayout' 
import Ichart from '@com/useEcharts/Ichart';
import { cloneDeep } from 'lodash';
import {tabs,opts,columns } from './data' 
import {MainDiv} from './style'
import Load from './load'
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
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)  
  const chartRef =useRef()
  const roomId = useSelector(selectcurlRommid)
  const siteData = useSelector(site)
  console.log("siteData",siteData)
  const [pattern,setPattern]=useState(1)
  
 
  const [value, setvalue] =useState("1")
  const [tabledata,setTableData]=useState([])
  const [type,setType] =useState(1)
  const [timeRanger,setTimeRanger] = useState([moment().subtract(6,'day'), moment()])
  const [header,setHeader] = useState([])
  const [tabletrend,setTabletrend] = useState([])
  const [disableDate,setDisableDate] = useState([])
  const chartsRef =useRef()
  const tableRef=useRef()
  const initchartRef =useRef()
  const transInfo =useRef({
    capacity:null
  })
 const [lastSampleTime, setLastSampleTime] =useState(null)

 
  const changeRadio=(e)=>{
    setPattern(e.target.value)
  }
  const changeTime=(time)=>{
    console.log('onChange',time)
    setTimeRanger(time)
  }
  let copytime =useRef()
  const onOpenChange=(open)=>{
    
   
    if(open){
      setTimeRanger([null,null])
      setDisableDate([null,null])
      copytime.current =[...timeRanger]
      console.log(copytime)
    }else{
      if(!timeRanger[0] || !timeRanger[1]){
        console.log(copytime=== timeRanger)
        setTimeRanger(copytime.current)
      }
     
      setDisableDate(null)
    }
  }
  const disabledDate = (current)=>{
    if(!disableDate){
      return false
    }
    const tooLate = disableDate[0]&& current.diff(disableDate[0],'days')>6
    const tooEarly = disableDate[1] && disableDate[1].diff(current,'days')>6
    return tooLate || tooEarly ||(current && current > moment().endOf('day'))
    
  }
 
  //单个变压器信息
  const TransformerOne=async()=>{
    try {
     const {success,errMsg,data} = await DistributionRoomRuntime.RoomOne(projectId,roomId)
     if(success){
      transInfo.current =  data
     }else{
      message.error(errMsg)
     }
    } catch (error) {
      console.log(error)
    }
  }
 
  //变压器 表格数据
  const RuntimePoints =async( )=>{
    if(!siteData) return;
    if(!Number.isInteger(parseInt(projectId))) return
    const res = await DistributionRoomRuntime.RuntimePoints(projectId,siteData?.sn)
 
    if(res.success){
      setLastSampleTime(res.data?.lastSampleTime)
      if(res.data.data){
        const dataes = cloneDeep(res.data)
        dataes.data?.forEach((it, i) => {
          if(it.name){
            dataes[it.name] = it.value
          }
          if(it.name==='Load' && transInfo.current.capacity){
            dataes['LoadPer'] =(parseFloat(it.value)/transInfo.current.capacity*100).toFixed(2)
          }
           })
      
        setTableData([dataes])
      }else{
        setTableData([])
      }
    }else{
      message.error(res.errMsg)
    }
  }
useRequest(RuntimePoints, {
  refreshDeps: [siteData, projectId]
})
 
  //数据趋势（echarts）
  const HistoryTrends =async ()=>{
    if(!siteData?.sn) return
    try{
      let startTime ,endTime;
      if(Array.isArray(timeRanger)&&timeRanger.length>0){
        startTime =  moment(timeRanger[0]).format('YYYY-MM-DD 00:00:00')
        endTime=moment(timeRanger[1]).format('YYYY-MM-DD 23:59:59')
      }else{
        message.error('请选择日期！')
      }
     
     
   
   
    let params = {
      projectId,
      sn:siteData?.sn,
      type,
      start:startTime,
      end:endTime
    }
    const res = await DistributionRoomRuntime.HistoryTrends(params)
    if(res.success){
      if(res.data&&res.data.length>0){
        chartsRef.current = res.data[0]
        if(res.data[0]['data']){
          const xAxis = res.data[0]['data'][0]['data'].map(it=>it.time)
          const sdata = res.data[0]['data'].map(it=>{
            const data = it.data.map(item=>item.value)
            return {
                name: it.point,
                type: 'line',
              //  stack: 'Total',
                stack: null,
                lineStyle:{
                  width:1
                },
                symbol:'circle',
                symbolSize: 6,
                data,
                areaStyle: null,
            }
          })
          chartOpt.xAxis.data =xAxis
          chartOpt.series=sdata
          initchartRef.current = drawEcharts(chartRef.current,{...chartOpt,type:2})
        }else{
          chartOpt.xAxis.data =[]
          chartOpt.series=[]
          initchartRef.current = drawEcharts(chartRef.current,{...chartOpt,type:2})
        }
       
      }else{
          chartOpt.xAxis.data =[]
          chartOpt.series=[]
          initchartRef.current= drawEcharts(chartRef.current,{...chartOpt,type:2})
      }
    }else{
      message.error(res.errMsg)
    }
    }catch(e){console.log(e)}
    
  }
  //数据趋势（table）
  const HistoryTable = async () => {
    if(!siteData?.sn) return
    try {
      let startTime, endTime;
      startTime = moment(timeRanger[0]).format('YYYY-MM-DD 00:00:00')
      endTime = moment(timeRanger[1]).format('YYYY-MM-DD 23:59:59')
      console.log(startTime)
      let params = {
        projectId,
        sn:siteData?.sn,
        // type,
        start: startTime,
        end: endTime
      }
      const res = await DistributionRoomRuntime.HistoryTable(params)
      if(res.success){
        const header = res.data.header.map(item=>{
          return {
            title:item.display,
            dataIndex:item.name,
            algin:'center'
          }
        })
        setHeader(header)
        setTabletrend(res.data.data)
      }else{
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }
  }
 
 
 
  //数据导出
  const exportData=()=>{
    pattern ===1 &&Export()
    pattern ===2 &&tableRef.current.download()
   
    

  }
  const search=()=>{
    HistoryTrends()
  }
  useEffect(()=>{
    if(roomId) { 
      TransformerOne()
    }
  },[roomId])
  useEffect(()=>{
    chartRef.current&& drawEcharts(chartRef.current,{...chartOpt,type:2})
  },[tabs,pattern])

  useEffect(()=>{
    if(isObject(siteData) && siteData.sn){
      pattern===1&& HistoryTrends()
      pattern===2&& HistoryTable()
    }
  },[type,pattern, siteData])

  let dataProps = {
    value,
    setvalue,
    tabs,
     
  }
  return (
    <>
 
        {
          isObject(siteData) ?( 
            <Pagecount bgcolor="#eeeff3" pd="0px"   > 
            <MainDiv>
             <div className='trancss'>
             <TranCard  site={siteData} lastSampleTime={lastSampleTime} />
             <Titlelayout title='实时数据'>
             <UseTable columns={columns} bordered   dataSource={tabledata}></UseTable>
             </Titlelayout>
             </div>
             <CustContext.Provider value={dataProps} >
              <Pagecount showSearch={false}>
              {value=="2" ?  <Titlelayout title={<div style={{display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
               <span>数据趋势</span>
               <Space size={16}>
                
            {
                pattern===1?<Select 
                style={{width:180,marginLeft:32}} 
                options={opts} 
                value={type} 
                onChange={setType}></Select>:null
            }
          
              <DatePicker.RangePicker
              value={timeRanger} 
              format="YYYY-MM-DD" 
              onChange={changeTime}
              onCalendarChange={(time)=>{setDisableDate(time)}}
              onOpenChange={onOpenChange}
              disabledDate={disabledDate}
              ></DatePicker.RangePicker>
              <Button onClick={search}>查询</Button> 
              <Button onClick={exportData}>导出</Button>
                  <Radio.Group defaultValue={pattern}   buttonStyle="solid" onChange={changeRadio}>
                    <Radio.Button value={1}>趋势模式</Radio.Button>
                    <Radio.Button value={2}>列表模式</Radio.Button>
                  </Radio.Group>
          </Space>
             </div>} layout="flex" pv="0" bordered="n">
              <div style={{flex: 1, paddingTop: "16px", display: 'flex'}}>
               {
                 pattern===1?(<div ref={chartRef} style={{flex: 1}}>
                 </div>):
                 ( <UseTable 
                  columns={header} 
                  bordered  
                  dataSource={tabletrend}
                  scroll={{
                    y: 500,
                  }}
                  ref={tableRef}
                  ></UseTable>)
               }
               </div>
             </Titlelayout>
             : <Load sn={siteData?.sn} projectId={projectId}></Load>
             }
             </Pagecount>
             </CustContext.Provider>
            </MainDiv>
         </Pagecount> 
          ):(
            <div style={{flex:1,display: 'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
              <img src={imgurl.empty} alt="" style={{width:200}}/>
              <p style={{color:'#999',marginTop:16,fontSize:16}}>暂无数据</p>
            </div>
          )
        }
   
    </>
    
  )
}