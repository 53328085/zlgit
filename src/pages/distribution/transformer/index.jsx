import React, { useState, useRef ,useMemo, useEffect } from 'react'
import { Select ,Space, Radio, Button, message } from 'antd'
 
import {useSelector,  } from 'react-redux'
import { selectcurlRommid,adaptation, site } from "@redux/systemconfig"; 
import TranCard from './transcard'
import UseTable from '@com/useTable'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {useRequest} from "ahooks"
 
import {DistributionRoomRuntime} from '@api/api.js'
 
import moment from 'moment'
import {isObject} from "@com/usehandler" 
import Titlelayout from '@com/titlelayout' 
import {ComDatePicker} from "@com/comstyled"
import { cloneDeep } from 'lodash';
import {tabs,opts,columns,useChartopt } from './data' 
import {MainDiv} from './style'
import Load from './load'
import Ichart from '@com/useEcharts/Ichart';
import {Empty} from "@svgs"
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)  
 
  const roomId = useSelector(selectcurlRommid)
  const siteData = useSelector(site)
  
  const [pattern,setPattern]=useState(1)
  
 
  const [value, setvalue] =useState("1")
  const [tabledata,setTableData]=useState([])
  const [type,setType] =useState(1)
//  const [timeRanger,setTimeRanger] = useState([moment().subtract(6,'day'), moment()])
const [timeRanger,setTimeRanger] = useState(moment())
  const [header,setHeader] = useState([])
  const [tabletrend,setTabletrend] = useState([])
  const [disableDate,setDisableDate] = useState([])
  const [loading, setLoading] = useState(false)
  const chartsRef =useRef()
  const tableRef=useRef()
  const initchartRef =useRef()
  const transInfo =useRef({
    capacity:null
  })
 const [lastSampleTime, setLastSampleTime] =useState(null)

 const [chartdata, setChartData] = useState([])

 const chartOpt = useChartopt(chartdata)




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
      if(timeRanger){
        startTime =  moment(timeRanger).startOf().format('YYYY-MM-DD 00:00:00')
       // console.log("在前",timeRanger.isBefore(moment()))
      //  endTime= timeRanger.isBefore(moment())  ?  moment(timeRanger).endOf().format('YYYY-MM-DD HH:mm:ss') :moment(timeRanger).format('YYYY-MM-DD HH:mm:ss')
      }else{
        message.error('请选择日期！')
      }
    
    let params = {
      projectId,
      sn:siteData?.sn,
      type,
      start:startTime,
      end:moment(moment(timeRanger).format('YYYY-MM-DD')).isBefore(moment(moment().format('YYYY-MM-DD'))) ?  moment(timeRanger).endOf("day").format('YYYY-MM-DD HH:mm:ss')  : moment(timeRanger).format('YYYY-MM-DD HH:mm:ss')
    }
     
    const {success,errMsg,data} = await DistributionRoomRuntime.HistoryTrends(params)
    if(success && Array.isArray(data) && data.length) {
      setChartData(data)
    }else{
       setChartData([])
    }
  }
    catch(e){
      console.log(e)
    }  
}
  //数据趋势（table）
  const HistoryTable = async () => {
    console.log('HistoryTable~~', moment(timeRanger).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
    if(!siteData?.sn) return
    try {
      setLoading(true)
      let startTime, endTime;
      startTime = moment(timeRanger).startOf().format('YYYY-MM-DD 00:00:00')
      endTime = moment(timeRanger).format('YYYY-MM-DD HH:mm:ss')
      
      let params = {
        projectId,
        sn:siteData?.sn,
        // type,
        start: startTime,
        end: moment(moment(timeRanger).format('YYYY-MM-DD')).isBefore(moment(moment().format('YYYY-MM-DD'))) ?  moment(timeRanger).endOf("day").format('YYYY-MM-DD HH:mm:ss')  : moment(timeRanger).format('YYYY-MM-DD HH:mm:ss')
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
        setLoading(false)
      }else{
        message.error(res.errMsg)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
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
    if(isObject(siteData) && siteData.sn && value=="2" && timeRanger){
      pattern===1&& HistoryTrends()
      pattern===2&& HistoryTable()
    }
  },[type,pattern, siteData, value,timeRanger])

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
             <UseTable columns={columns} bordered   dataSource={tabledata} size="middle"></UseTable>
             </Titlelayout>
             </div>
             <CustContext.Provider value={dataProps} >
              <Pagecount showSearch={false} pd="0px">
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
          
            {/*   <DatePicker.RangePicker
              value={timeRanger} 
              format="YYYY-MM-DD" 
              onChange={changeTime}
              onCalendarChange={(time)=>{setDisableDate(time)}}
              onOpenChange={onOpenChange}
              disabledDate={disabledDate}
              ></DatePicker.RangePicker> */}
              <ComDatePicker
              value={timeRanger} 
              format="YYYY-MM-DD" 
              onChange={changeTime}
            //  onCalendarChange={(time)=>{setDisableDate(time)}}
             // onOpenChange={onOpenChange}
            //  disabledDate={disabledDate}
              ></ComDatePicker>
             {/*  <Button onClick={search}>查询</Button>  */}
              <Button onClick={exportData} disabled={pattern!=2 } >导出</Button>
                  <Radio.Group defaultValue={pattern}   buttonStyle="solid" onChange={changeRadio}>
                    <Radio.Button value={1}>趋势模式</Radio.Button>
                    <Radio.Button value={2}>列表模式</Radio.Button>
                  </Radio.Group>
          </Space>
             </div>} layout="flex" pv="0" bordered="n">
              <div style={{flex: 1, paddingTop: "16px", display: 'flex'}}>
               {
                 pattern===1?(<div   style={{flex: 1, display: 'flex'}}>
                 <Ichart {...chartOpt} /> 
                 </div>):
                 ( <UseTable 
                  columns={header} 
                  bordered  
                  dataSource={tabletrend}
                  scroll={{
                    y: 500,
                  }}
                  ref={tableRef}
                  loading={loading}
                  ></UseTable>)
               }
               </div>
             </Titlelayout>
             : <Load sn={siteData?.sn} projectId={projectId}  ></Load>
             }
             </Pagecount>
             </CustContext.Provider>
            </MainDiv>
         </Pagecount> 
          ):(
            <div style={{flex:1,display: 'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
             {/*  <img src={imgurl.empty} alt="" style={{width:200}}/> */}
             <Empty/>
              <p style={{color:'#999',marginTop:16,fontSize:16}}>暂无数据</p>
            </div>
          )
        }
   
    </>
    
  )
}