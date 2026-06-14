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
 
import dayjs from 'dayjs'
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
//  const [timeRanger,setTimeRanger] = useState([dayjs().subtract(6,'day'), dayjs()])
const [timeRanger,setTimeRanger] = useState(dayjs())
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
    return tooLate || tooEarly ||(current && current > dayjs().endOf('day'))
    
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
  console.log("siteData",siteData)
  const RuntimePoints =async( )=>{
   if(!siteData) return;
 //  if(!Number.isInteger(parseInt(projectId))) return
    const res =  await DistributionRoomRuntime.RuntimePoints(projectId,siteData.sn)
 
    if(res.success){
    //  setLastSampleTime(res.data?.lastSampleTime)
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
 useEffect(()=>{
  RuntimePoints()
 },[siteData,projectId])
 
  //数据趋势（echarts）
  const HistoryTrends =async ()=>{
   
    try{
      let startTime ,endTime;
      if(timeRanger){
        startTime =  dayjs(timeRanger).startOf().format('YYYY-MM-DD 00:00:00')
       // console.log("在前",timeRanger.isBefore(dayjs()))
      //  endTime= timeRanger.isBefore(dayjs())  ?  dayjs(timeRanger).endOf().format('YYYY-MM-DD HH:mm:ss') :dayjs(timeRanger).format('YYYY-MM-DD HH:mm:ss')
      }else{
        message.error('请选择日期！')
      }
    
   
     
    const {success,errMsg,data} ={
      success:true,
      data:[
    {
        "group": "EP",
        "data": [
            {
                "point": "Ua",
                "data": [
                    {
                        "time": "2026-06-14 00:00:00",
                        "value": 234.18
                    },
                    {
                        "time": "2026-06-14 00:05:00",
                        "value": 233.35
                    },
                    {
                        "time": "2026-06-14 00:10:00",
                        "value": 233.7
                    },
                    {
                        "time": "2026-06-14 00:15:00",
                        "value": 233.99
                    },
                    {
                        "time": "2026-06-14 00:20:00",
                        "value": 234.01
                    },
                    {
                        "time": "2026-06-14 00:25:00",
                        "value": 234.3
                    },
                    {
                        "time": "2026-06-14 00:30:00",
                        "value": 234.05
                    },
                    {
                        "time": "2026-06-14 00:35:00",
                        "value": 234.42
                    },
                    {
                        "time": "2026-06-14 00:40:00",
                        "value": 234.25
                    },
                    {
                        "time": "2026-06-14 00:45:00",
                        "value": 234.45
                    },
                    {
                        "time": "2026-06-14 00:50:00",
                        "value": 234.42
                    },
                    {
                        "time": "2026-06-14 00:55:00",
                        "value": 234.34
                    },
                    {
                        "time": "2026-06-14 01:00:00",
                        "value": 234.53
                    },
                    {
                        "time": "2026-06-14 01:05:00",
                        "value": 234.21
                    },
                    {
                        "time": "2026-06-14 01:10:00",
                        "value": 234.4
                    },
                    {
                        "time": "2026-06-14 01:15:00",
                        "value": 234.48
                    },
                    {
                        "time": "2026-06-14 01:20:00",
                        "value": 234.55
                    },
                    {
                        "time": "2026-06-14 01:25:00",
                        "value": 234.46
                    },
                    {
                        "time": "2026-06-14 01:30:00",
                        "value": 234.62
                    },
                    {
                        "time": "2026-06-14 01:35:00",
                        "value": 234.52
                    },
                    {
                        "time": "2026-06-14 01:40:00",
                        "value": 234.48
                    },
                    {
                        "time": "2026-06-14 01:45:00",
                        "value": 234.51
                    },
                    {
                        "time": "2026-06-14 01:50:00",
                        "value": 234.57
                    },
                    {
                        "time": "2026-06-14 01:55:00",
                        "value": 234.76
                    },
                    {
                        "time": "2026-06-14 02:00:00",
                        "value": 234.62
                    },
                    {
                        "time": "2026-06-14 02:05:00",
                        "value": 234.73
                    },
                    {
                        "time": "2026-06-14 02:10:00",
                        "value": 234.72
                    },
                    {
                        "time": "2026-06-14 02:15:00",
                        "value": 234.74
                    },
                    {
                        "time": "2026-06-14 02:20:00",
                        "value": 234.89
                    },
                    {
                        "time": "2026-06-14 02:25:00",
                        "value": 234.99
                    },
                    {
                        "time": "2026-06-14 02:30:00",
                        "value": 235.24
                    },
                    {
                        "time": "2026-06-14 02:35:00",
                        "value": 234.84
                    },
                    {
                        "time": "2026-06-14 02:40:00",
                        "value": 234.69
                    },
                    {
                        "time": "2026-06-14 02:45:00",
                        "value": 234.89
                    },
                    {
                        "time": "2026-06-14 02:50:00",
                        "value": 234.84
                    },
                    {
                        "time": "2026-06-14 02:55:00",
                        "value": 234.93
                    },
                    {
                        "time": "2026-06-14 03:00:00",
                        "value": 234.96
                    },
                    {
                        "time": "2026-06-14 03:05:00",
                        "value": 234.95
                    },
                    {
                        "time": "2026-06-14 03:10:00",
                        "value": 235.25
                    },
                    {
                        "time": "2026-06-14 03:15:00",
                        "value": 235.07
                    },
                    {
                        "time": "2026-06-14 03:20:00",
                        "value": 235.34
                    },
                    {
                        "time": "2026-06-14 03:25:00",
                        "value": 235.37
                    },
                    {
                        "time": "2026-06-14 03:30:00",
                        "value": 235.39
                    },
                    {
                        "time": "2026-06-14 03:35:00",
                        "value": 235.25
                    },
                    {
                        "time": "2026-06-14 03:40:00",
                        "value": 235.08
                    },
                    {
                        "time": "2026-06-14 03:45:00",
                        "value": 235.5
                    },
                    {
                        "time": "2026-06-14 03:50:00",
                        "value": 235.59
                    },
                    {
                        "time": "2026-06-14 03:55:00",
                        "value": 235.26
                    },
                    {
                        "time": "2026-06-14 04:00:00",
                        "value": 235.24
                    },
                    {
                        "time": "2026-06-14 04:10:00",
                        "value": 235.41
                    },
                    {
                        "time": "2026-06-14 04:20:00",
                        "value": 235.32
                    },
                    {
                        "time": "2026-06-14 04:25:00",
                        "value": 235.15
                    },
                    {
                        "time": "2026-06-14 04:30:00",
                        "value": 235.25
                    },
                    {
                        "time": "2026-06-14 04:35:00",
                        "value": 235.43
                    },
                    {
                        "time": "2026-06-14 04:40:00",
                        "value": 235.34
                    },
                    {
                        "time": "2026-06-14 04:45:00",
                        "value": 235.5
                    },
                    {
                        "time": "2026-06-14 04:50:00",
                        "value": 235.53
                    },
                    {
                        "time": "2026-06-14 04:55:00",
                        "value": 235.35
                    },
                    {
                        "time": "2026-06-14 05:00:00",
                        "value": 235.47
                    },
                    {
                        "time": "2026-06-14 05:05:00",
                        "value": 235.56
                    },
                    {
                        "time": "2026-06-14 05:10:00",
                        "value": 235.57
                    },
                    {
                        "time": "2026-06-14 05:15:00",
                        "value": 235.78
                    },
                    {
                        "time": "2026-06-14 05:20:00",
                        "value": 236.03
                    },
                    {
                        "time": "2026-06-14 05:25:00",
                        "value": 236.02
                    },
                    {
                        "time": "2026-06-14 05:30:00",
                        "value": 236.09
                    },
                    {
                        "time": "2026-06-14 05:35:00",
                        "value": 235.93
                    },
                    {
                        "time": "2026-06-14 05:40:00",
                        "value": 235.93
                    },
                    {
                        "time": "2026-06-14 05:45:00",
                        "value": 236.31
                    },
                    {
                        "time": "2026-06-14 05:50:00",
                        "value": 235.97
                    },
                    {
                        "time": "2026-06-14 05:55:00",
                        "value": 235.84
                    },
                    {
                        "time": "2026-06-14 06:00:00",
                        "value": 235.95
                    },
                    {
                        "time": "2026-06-14 06:05:00",
                        "value": 236.25
                    },
                    {
                        "time": "2026-06-14 06:10:00",
                        "value": 236.15
                    },
                    {
                        "time": "2026-06-14 06:15:00",
                        "value": 236.33
                    },
                    {
                        "time": "2026-06-14 06:20:00",
                        "value": 236.17
                    },
                    {
                        "time": "2026-06-14 06:25:00",
                        "value": 236.24
                    },
                    {
                        "time": "2026-06-14 06:30:00",
                        "value": 236.09
                    },
                    {
                        "time": "2026-06-14 06:35:00",
                        "value": 235.92
                    },
                    {
                        "time": "2026-06-14 06:40:00",
                        "value": 235.87
                    },
                    {
                        "time": "2026-06-14 06:45:00",
                        "value": 236.14
                    },
                    {
                        "time": "2026-06-14 06:50:00",
                        "value": 236.15
                    },
                    {
                        "time": "2026-06-14 06:55:00",
                        "value": 235.96
                    },
                    {
                        "time": "2026-06-14 07:00:00",
                        "value": 235.94
                    },
                    {
                        "time": "2026-06-14 07:05:00",
                        "value": 235.93
                    },
                    {
                        "time": "2026-06-14 07:10:00",
                        "value": 235.89
                    },
                    {
                        "time": "2026-06-14 07:15:00",
                        "value": 235.7
                    },
                    {
                        "time": "2026-06-14 07:20:00",
                        "value": 236
                    },
                    {
                        "time": "2026-06-14 07:25:00",
                        "value": 235.82
                    },
                    {
                        "time": "2026-06-14 07:30:00",
                        "value": 235.84
                    },
                    {
                        "time": "2026-06-14 07:35:00",
                        "value": 235.44
                    },
                    {
                        "time": "2026-06-14 07:40:00",
                        "value": 235.96
                    },
                    {
                        "time": "2026-06-14 07:45:00",
                        "value": 236.21
                    },
                    {
                        "time": "2026-06-14 07:50:00",
                        "value": 236.01
                    },
                    {
                        "time": "2026-06-14 07:55:00",
                        "value": 235.58
                    },
                    {
                        "time": "2026-06-14 08:00:00",
                        "value": 235.52
                    },
                    {
                        "time": "2026-06-14 08:05:00",
                        "value": 232.56
                    },
                    {
                        "time": "2026-06-14 08:10:00",
                        "value": 232.29
                    },
                    {
                        "time": "2026-06-14 08:15:00",
                        "value": 231.68
                    },
                    {
                        "time": "2026-06-14 08:20:00",
                        "value": 232.08
                    },
                    {
                        "time": "2026-06-14 08:25:00",
                        "value": 232.09
                    },
                    {
                        "time": "2026-06-14 08:30:00",
                        "value": 231.83
                    },
                    {
                        "time": "2026-06-14 08:35:00",
                        "value": 231.94
                    },
                    {
                        "time": "2026-06-14 08:40:00",
                        "value": 234.02
                    },
                    {
                        "time": "2026-06-14 08:45:00",
                        "value": 233.99
                    },
                    {
                        "time": "2026-06-14 08:50:00",
                        "value": 233.98
                    },
                    {
                        "time": "2026-06-14 08:55:00",
                        "value": 233.3
                    },
                    {
                        "time": "2026-06-14 09:00:00",
                        "value": 233.81
                    },
                    {
                        "time": "2026-06-14 09:05:00",
                        "value": 233.97
                    },
                    {
                        "time": "2026-06-14 09:10:00",
                        "value": 233.62
                    },
                    {
                        "time": "2026-06-14 09:15:00",
                        "value": 233.76
                    },
                    {
                        "time": "2026-06-14 09:20:00",
                        "value": 233
                    },
                    {
                        "time": "2026-06-14 09:25:00",
                        "value": 233.39
                    },
                    {
                        "time": "2026-06-14 09:30:00",
                        "value": 233.39
                    },
                    {
                        "time": "2026-06-14 09:35:00",
                        "value": 233.97
                    },
                    {
                        "time": "2026-06-14 09:40:00",
                        "value": 233.02
                    },
                    {
                        "time": "2026-06-14 09:45:00",
                        "value": 232.74
                    },
                    {
                        "time": "2026-06-14 09:50:00",
                        "value": 233.98
                    },
                    {
                        "time": "2026-06-14 09:55:00",
                        "value": 233.91
                    },
                    {
                        "time": "2026-06-14 10:00:00",
                        "value": 233.72
                    },
                    {
                        "time": "2026-06-14 10:05:00",
                        "value": 233.55
                    },
                    {
                        "time": "2026-06-14 10:10:00",
                        "value": 233.52
                    },
                    {
                        "time": "2026-06-14 10:15:00",
                        "value": 233.29
                    },
                    {
                        "time": "2026-06-14 10:20:00",
                        "value": 233.32
                    },
                    {
                        "time": "2026-06-14 10:25:00",
                        "value": 233.36
                    },
                    {
                        "time": "2026-06-14 10:30:00",
                        "value": 232.29
                    },
                    {
                        "time": "2026-06-14 10:35:00",
                        "value": 232.4
                    },
                    {
                        "time": "2026-06-14 10:40:00",
                        "value": 233.65
                    },
                    {
                        "time": "2026-06-14 10:45:00",
                        "value": 233.49
                    },
                    {
                        "time": "2026-06-14 10:50:00",
                        "value": 233.73
                    },
                    {
                        "time": "2026-06-14 10:55:00",
                        "value": 234.01
                    },
                    {
                        "time": "2026-06-14 11:00:00",
                        "value": 233.47
                    },
                    {
                        "time": "2026-06-14 11:05:00",
                        "value": 233.03
                    },
                    {
                        "time": "2026-06-14 11:10:00",
                        "value": 233.39
                    },
                    {
                        "time": "2026-06-14 11:15:00",
                        "value": 233.91
                    },
                    {
                        "time": "2026-06-14 11:20:00",
                        "value": 233.96
                    },
                    {
                        "time": "2026-06-14 11:25:00",
                        "value": 233.84
                    },
                    {
                        "time": "2026-06-14 11:30:00",
                        "value": 233.88
                    },
                    {
                        "time": "2026-06-14 11:35:00",
                        "value": 234.19
                    },
                    {
                        "time": "2026-06-14 11:40:00",
                        "value": 234.18
                    },
                    {
                        "time": "2026-06-14 11:45:00",
                        "value": 233.35
                    },
                    {
                        "time": "2026-06-14 11:50:00",
                        "value": 233.63
                    },
                    {
                        "time": "2026-06-14 11:55:00",
                        "value": 233.15
                    },
                    {
                        "time": "2026-06-14 12:00:00",
                        "value": 232.88
                    },
                    {
                        "time": "2026-06-14 12:05:00",
                        "value": 233.23
                    },
                    {
                        "time": "2026-06-14 12:10:00",
                        "value": 233.65
                    },
                    {
                        "time": "2026-06-14 12:15:00",
                        "value": 233.35
                    },
                    {
                        "time": "2026-06-14 12:20:00",
                        "value": 234.38
                    },
                    {
                        "time": "2026-06-14 12:25:00",
                        "value": 233.79
                    },
                    {
                        "time": "2026-06-14 12:30:00",
                        "value": 234.06
                    },
                    {
                        "time": "2026-06-14 12:35:00",
                        "value": 234.03
                    },
                    {
                        "time": "2026-06-14 12:40:00",
                        "value": 234.53
                    },
                    {
                        "time": "2026-06-14 12:45:00",
                        "value": 234.39
                    },
                    {
                        "time": "2026-06-14 12:50:00",
                        "value": 233.7
                    },
                    {
                        "time": "2026-06-14 12:55:00",
                        "value": 233.69
                    },
                    {
                        "time": "2026-06-14 13:00:00",
                        "value": 233.94
                    },
                    {
                        "time": "2026-06-14 13:05:00",
                        "value": 234.76
                    },
                    {
                        "time": "2026-06-14 13:10:00",
                        "value": 234.29
                    },
                    {
                        "time": "2026-06-14 13:15:00",
                        "value": 234.35
                    },
                    {
                        "time": "2026-06-14 13:20:00",
                        "value": 234.38
                    },
                    {
                        "time": "2026-06-14 13:25:00",
                        "value": 234.5
                    },
                    {
                        "time": "2026-06-14 13:30:00",
                        "value": 234.27
                    },
                    {
                        "time": "2026-06-14 13:35:00",
                        "value": 234.48
                    },
                    {
                        "time": "2026-06-14 13:40:00",
                        "value": 234.18
                    },
                    {
                        "time": "2026-06-14 13:45:00",
                        "value": 234.56
                    },
                    {
                        "time": "2026-06-14 13:50:00",
                        "value": 234.77
                    },
                    {
                        "time": "2026-06-14 13:55:00",
                        "value": 234.85
                    },
                    {
                        "time": "2026-06-14 14:00:00",
                        "value": 235.04
                    },
                    {
                        "time": "2026-06-14 14:05:00",
                        "value": 235.14
                    },
                    {
                        "time": "2026-06-14 14:10:00",
                        "value": 235.12
                    },
                    {
                        "time": "2026-06-14 14:15:00",
                        "value": 234.56
                    },
                    {
                        "time": "2026-06-14 14:20:00",
                        "value": 234.39
                    },
                    {
                        "time": "2026-06-14 14:25:00",
                        "value": 234.78
                    },
                    {
                        "time": "2026-06-14 14:30:00",
                        "value": 234.6
                    },
                    {
                        "time": "2026-06-14 14:35:00",
                        "value": 233.8
                    },
                    {
                        "time": "2026-06-14 14:40:00",
                        "value": 233.9
                    },
                    {
                        "time": "2026-06-14 14:45:00",
                        "value": 234.87
                    },
                    {
                        "time": "2026-06-14 14:50:00",
                        "value": 233.08
                    },
                    {
                        "time": "2026-06-14 14:55:00",
                        "value": 234.26
                    },
                    {
                        "time": "2026-06-14 15:00:00",
                        "value": 234.28
                    },
                    {
                        "time": "2026-06-14 15:05:00",
                        "value": 233.89
                    },
                    {
                        "time": "2026-06-14 15:10:00",
                        "value": 234.52
                    },
                    {
                        "time": "2026-06-14 15:15:00",
                        "value": 234.94
                    },
                    {
                        "time": "2026-06-14 15:20:00",
                        "value": 233.36
                    },
                    {
                        "time": "2026-06-14 15:25:00",
                        "value": 233.53
                    },
                    {
                        "time": "2026-06-14 15:30:00",
                        "value": 233.9
                    },
                    {
                        "time": "2026-06-14 15:35:00",
                        "value": 232.49
                    },
                    {
                        "time": "2026-06-14 15:40:00",
                        "value": 233.86
                    },
                    {
                        "time": "2026-06-14 15:45:00",
                        "value": 234.17
                    },
                    {
                        "time": "2026-06-14 15:50:00",
                        "value": 234.06
                    },
                    {
                        "time": "2026-06-14 15:55:00",
                        "value": 233.08
                    },
                    {
                        "time": "2026-06-14 16:00:00",
                        "value": 233.8
                    },
                    {
                        "time": "2026-06-14 16:05:00",
                        "value": 234.38
                    },
                    {
                        "time": "2026-06-14 16:10:00",
                        "value": 233.96
                    },
                    {
                        "time": "2026-06-14 16:15:00",
                        "value": 233.53
                    },
                    {
                        "time": "2026-06-14 16:20:00",
                        "value": 234.9
                    },
                    {
                        "time": "2026-06-14 16:25:00",
                        "value": 234.84
                    },
                    {
                        "time": "2026-06-14 16:30:00",
                        "value": 234.08
                    }
                ]
            },
            {
                "point": "Ub",
                "data": [
                    {
                        "time": "2026-06-14 00:00:00",
                        "value": 234.45
                    },
                    {
                        "time": "2026-06-14 00:05:00",
                        "value": 233.62
                    },
                    {
                        "time": "2026-06-14 00:10:00",
                        "value": 233.93
                    },
                    {
                        "time": "2026-06-14 00:15:00",
                        "value": 234.23
                    },
                    {
                        "time": "2026-06-14 00:20:00",
                        "value": 234.26
                    },
                    {
                        "time": "2026-06-14 00:25:00",
                        "value": 234.53
                    },
                    {
                        "time": "2026-06-14 00:30:00",
                        "value": 234.28
                    },
                    {
                        "time": "2026-06-14 00:35:00",
                        "value": 234.66
                    },
                    {
                        "time": "2026-06-14 00:40:00",
                        "value": 234.49
                    },
                    {
                        "time": "2026-06-14 00:45:00",
                        "value": 234.7
                    },
                    {
                        "time": "2026-06-14 00:50:00",
                        "value": 234.65
                    },
                    {
                        "time": "2026-06-14 00:55:00",
                        "value": 234.57
                    },
                    {
                        "time": "2026-06-14 01:00:00",
                        "value": 234.76
                    },
                    {
                        "time": "2026-06-14 01:05:00",
                        "value": 234.46
                    },
                    {
                        "time": "2026-06-14 01:10:00",
                        "value": 234.68
                    },
                    {
                        "time": "2026-06-14 01:15:00",
                        "value": 234.74
                    },
                    {
                        "time": "2026-06-14 01:20:00",
                        "value": 234.8
                    },
                    {
                        "time": "2026-06-14 01:25:00",
                        "value": 234.74
                    },
                    {
                        "time": "2026-06-14 01:30:00",
                        "value": 234.88
                    },
                    {
                        "time": "2026-06-14 01:35:00",
                        "value": 234.79
                    },
                    {
                        "time": "2026-06-14 01:40:00",
                        "value": 234.73
                    },
                    {
                        "time": "2026-06-14 01:45:00",
                        "value": 234.8
                    },
                    {
                        "time": "2026-06-14 01:50:00",
                        "value": 234.84
                    },
                    {
                        "time": "2026-06-14 01:55:00",
                        "value": 235.08
                    },
                    {
                        "time": "2026-06-14 02:00:00",
                        "value": 234.91
                    },
                    {
                        "time": "2026-06-14 02:05:00",
                        "value": 235.03
                    },
                    {
                        "time": "2026-06-14 02:10:00",
                        "value": 234.99
                    },
                    {
                        "time": "2026-06-14 02:15:00",
                        "value": 235.01
                    },
                    {
                        "time": "2026-06-14 02:20:00",
                        "value": 235.16
                    },
                    {
                        "time": "2026-06-14 02:25:00",
                        "value": 235.29
                    },
                    {
                        "time": "2026-06-14 02:30:00",
                        "value": 235.56
                    },
                    {
                        "time": "2026-06-14 02:35:00",
                        "value": 235.15
                    },
                    {
                        "time": "2026-06-14 02:40:00",
                        "value": 234.98
                    },
                    {
                        "time": "2026-06-14 02:45:00",
                        "value": 235.23
                    },
                    {
                        "time": "2026-06-14 02:50:00",
                        "value": 235.15
                    },
                    {
                        "time": "2026-06-14 02:55:00",
                        "value": 235.22
                    },
                    {
                        "time": "2026-06-14 03:00:00",
                        "value": 235.27
                    },
                    {
                        "time": "2026-06-14 03:05:00",
                        "value": 235.29
                    },
                    {
                        "time": "2026-06-14 03:10:00",
                        "value": 235.57
                    },
                    {
                        "time": "2026-06-14 03:15:00",
                        "value": 235.37
                    },
                    {
                        "time": "2026-06-14 03:20:00",
                        "value": 235.68
                    },
                    {
                        "time": "2026-06-14 03:25:00",
                        "value": 235.68
                    },
                    {
                        "time": "2026-06-14 03:30:00",
                        "value": 235.79
                    },
                    {
                        "time": "2026-06-14 03:35:00",
                        "value": 235.56
                    },
                    {
                        "time": "2026-06-14 03:40:00",
                        "value": 235.39
                    },
                    {
                        "time": "2026-06-14 03:45:00",
                        "value": 235.8
                    },
                    {
                        "time": "2026-06-14 03:50:00",
                        "value": 235.92
                    },
                    {
                        "time": "2026-06-14 03:55:00",
                        "value": 235.59
                    },
                    {
                        "time": "2026-06-14 04:00:00",
                        "value": 235.57
                    },
                    {
                        "time": "2026-06-14 04:10:00",
                        "value": 235.72
                    },
                    {
                        "time": "2026-06-14 04:20:00",
                        "value": 235.61
                    },
                    {
                        "time": "2026-06-14 04:25:00",
                        "value": 235.43
                    },
                    {
                        "time": "2026-06-14 04:30:00",
                        "value": 235.55
                    },
                    {
                        "time": "2026-06-14 04:35:00",
                        "value": 235.75
                    },
                    {
                        "time": "2026-06-14 04:40:00",
                        "value": 235.65
                    },
                    {
                        "time": "2026-06-14 04:45:00",
                        "value": 235.81
                    },
                    {
                        "time": "2026-06-14 04:50:00",
                        "value": 235.88
                    },
                    {
                        "time": "2026-06-14 04:55:00",
                        "value": 235.66
                    },
                    {
                        "time": "2026-06-14 05:00:00",
                        "value": 235.77
                    },
                    {
                        "time": "2026-06-14 05:05:00",
                        "value": 235.8
                    },
                    {
                        "time": "2026-06-14 05:10:00",
                        "value": 235.95
                    },
                    {
                        "time": "2026-06-14 05:15:00",
                        "value": 236.09
                    },
                    {
                        "time": "2026-06-14 05:20:00",
                        "value": 236.33
                    },
                    {
                        "time": "2026-06-14 05:25:00",
                        "value": 236.33
                    },
                    {
                        "time": "2026-06-14 05:30:00",
                        "value": 236.36
                    },
                    {
                        "time": "2026-06-14 05:35:00",
                        "value": 236.12
                    },
                    {
                        "time": "2026-06-14 05:40:00",
                        "value": 235.68
                    },
                    {
                        "time": "2026-06-14 05:45:00",
                        "value": 236.58
                    },
                    {
                        "time": "2026-06-14 05:50:00",
                        "value": 236.28
                    },
                    {
                        "time": "2026-06-14 05:55:00",
                        "value": 236.14
                    },
                    {
                        "time": "2026-06-14 06:00:00",
                        "value": 236.22
                    },
                    {
                        "time": "2026-06-14 06:05:00",
                        "value": 236.55
                    },
                    {
                        "time": "2026-06-14 06:10:00",
                        "value": 236.53
                    },
                    {
                        "time": "2026-06-14 06:15:00",
                        "value": 236.52
                    },
                    {
                        "time": "2026-06-14 06:20:00",
                        "value": 236.34
                    },
                    {
                        "time": "2026-06-14 06:25:00",
                        "value": 236.19
                    },
                    {
                        "time": "2026-06-14 06:30:00",
                        "value": 236.07
                    },
                    {
                        "time": "2026-06-14 06:35:00",
                        "value": 235.86
                    },
                    {
                        "time": "2026-06-14 06:40:00",
                        "value": 235.97
                    },
                    {
                        "time": "2026-06-14 06:45:00",
                        "value": 236.25
                    },
                    {
                        "time": "2026-06-14 06:50:00",
                        "value": 236.12
                    },
                    {
                        "time": "2026-06-14 06:55:00",
                        "value": 236.19
                    },
                    {
                        "time": "2026-06-14 07:00:00",
                        "value": 236.21
                    },
                    {
                        "time": "2026-06-14 07:05:00",
                        "value": 236.36
                    },
                    {
                        "time": "2026-06-14 07:10:00",
                        "value": 235.59
                    },
                    {
                        "time": "2026-06-14 07:15:00",
                        "value": 235.87
                    },
                    {
                        "time": "2026-06-14 07:20:00",
                        "value": 236.06
                    },
                    {
                        "time": "2026-06-14 07:25:00",
                        "value": 236.23
                    },
                    {
                        "time": "2026-06-14 07:30:00",
                        "value": 236.21
                    },
                    {
                        "time": "2026-06-14 07:35:00",
                        "value": 235.91
                    },
                    {
                        "time": "2026-06-14 07:40:00",
                        "value": 236.22
                    },
                    {
                        "time": "2026-06-14 07:45:00",
                        "value": 236.49
                    },
                    {
                        "time": "2026-06-14 07:50:00",
                        "value": 236.33
                    },
                    {
                        "time": "2026-06-14 07:55:00",
                        "value": 236.04
                    },
                    {
                        "time": "2026-06-14 08:00:00",
                        "value": 235.83
                    },
                    {
                        "time": "2026-06-14 08:05:00",
                        "value": 232.73
                    },
                    {
                        "time": "2026-06-14 08:10:00",
                        "value": 232.74
                    },
                    {
                        "time": "2026-06-14 08:15:00",
                        "value": 231.46
                    },
                    {
                        "time": "2026-06-14 08:20:00",
                        "value": 232.27
                    },
                    {
                        "time": "2026-06-14 08:25:00",
                        "value": 232.05
                    },
                    {
                        "time": "2026-06-14 08:30:00",
                        "value": 231.91
                    },
                    {
                        "time": "2026-06-14 08:35:00",
                        "value": 231.88
                    },
                    {
                        "time": "2026-06-14 08:40:00",
                        "value": 234.01
                    },
                    {
                        "time": "2026-06-14 08:45:00",
                        "value": 233.78
                    },
                    {
                        "time": "2026-06-14 08:50:00",
                        "value": 234.48
                    },
                    {
                        "time": "2026-06-14 08:55:00",
                        "value": 233.66
                    },
                    {
                        "time": "2026-06-14 09:00:00",
                        "value": 234.05
                    },
                    {
                        "time": "2026-06-14 09:05:00",
                        "value": 234.32
                    },
                    {
                        "time": "2026-06-14 09:10:00",
                        "value": 234.28
                    },
                    {
                        "time": "2026-06-14 09:15:00",
                        "value": 233.69
                    },
                    {
                        "time": "2026-06-14 09:20:00",
                        "value": 232.97
                    },
                    {
                        "time": "2026-06-14 09:25:00",
                        "value": 233.44
                    },
                    {
                        "time": "2026-06-14 09:30:00",
                        "value": 233.62
                    },
                    {
                        "time": "2026-06-14 09:35:00",
                        "value": 233.69
                    },
                    {
                        "time": "2026-06-14 09:40:00",
                        "value": 233.09
                    },
                    {
                        "time": "2026-06-14 09:45:00",
                        "value": 232.68
                    },
                    {
                        "time": "2026-06-14 09:50:00",
                        "value": 233.71
                    },
                    {
                        "time": "2026-06-14 09:55:00",
                        "value": 234.16
                    },
                    {
                        "time": "2026-06-14 10:00:00",
                        "value": 233.63
                    },
                    {
                        "time": "2026-06-14 10:05:00",
                        "value": 233.74
                    },
                    {
                        "time": "2026-06-14 10:10:00",
                        "value": 233.49
                    },
                    {
                        "time": "2026-06-14 10:15:00",
                        "value": 233.62
                    },
                    {
                        "time": "2026-06-14 10:20:00",
                        "value": 233.14
                    },
                    {
                        "time": "2026-06-14 10:25:00",
                        "value": 233.35
                    },
                    {
                        "time": "2026-06-14 10:30:00",
                        "value": 232.78
                    },
                    {
                        "time": "2026-06-14 10:35:00",
                        "value": 232.66
                    },
                    {
                        "time": "2026-06-14 10:40:00",
                        "value": 234.1
                    },
                    {
                        "time": "2026-06-14 10:45:00",
                        "value": 233.48
                    },
                    {
                        "time": "2026-06-14 10:50:00",
                        "value": 233.42
                    },
                    {
                        "time": "2026-06-14 10:55:00",
                        "value": 234.35
                    },
                    {
                        "time": "2026-06-14 11:00:00",
                        "value": 233.2
                    },
                    {
                        "time": "2026-06-14 11:05:00",
                        "value": 232.76
                    },
                    {
                        "time": "2026-06-14 11:10:00",
                        "value": 233.13
                    },
                    {
                        "time": "2026-06-14 11:15:00",
                        "value": 233.63
                    },
                    {
                        "time": "2026-06-14 11:20:00",
                        "value": 233.87
                    },
                    {
                        "time": "2026-06-14 11:25:00",
                        "value": 233.58
                    },
                    {
                        "time": "2026-06-14 11:30:00",
                        "value": 234.43
                    },
                    {
                        "time": "2026-06-14 11:35:00",
                        "value": 234.07
                    },
                    {
                        "time": "2026-06-14 11:40:00",
                        "value": 233.88
                    },
                    {
                        "time": "2026-06-14 11:45:00",
                        "value": 233.67
                    },
                    {
                        "time": "2026-06-14 11:50:00",
                        "value": 233.95
                    },
                    {
                        "time": "2026-06-14 11:55:00",
                        "value": 233.37
                    },
                    {
                        "time": "2026-06-14 12:00:00",
                        "value": 232.88
                    },
                    {
                        "time": "2026-06-14 12:05:00",
                        "value": 233.45
                    },
                    {
                        "time": "2026-06-14 12:10:00",
                        "value": 234.18
                    },
                    {
                        "time": "2026-06-14 12:15:00",
                        "value": 233.96
                    },
                    {
                        "time": "2026-06-14 12:20:00",
                        "value": 234.52
                    },
                    {
                        "time": "2026-06-14 12:25:00",
                        "value": 234.05
                    },
                    {
                        "time": "2026-06-14 12:30:00",
                        "value": 234.55
                    },
                    {
                        "time": "2026-06-14 12:35:00",
                        "value": 234.15
                    },
                    {
                        "time": "2026-06-14 12:40:00",
                        "value": 234.65
                    },
                    {
                        "time": "2026-06-14 12:45:00",
                        "value": 234.66
                    },
                    {
                        "time": "2026-06-14 12:50:00",
                        "value": 233.27
                    },
                    {
                        "time": "2026-06-14 12:55:00",
                        "value": 234.14
                    },
                    {
                        "time": "2026-06-14 13:00:00",
                        "value": 234.12
                    },
                    {
                        "time": "2026-06-14 13:05:00",
                        "value": 234.65
                    },
                    {
                        "time": "2026-06-14 13:10:00",
                        "value": 233.57
                    },
                    {
                        "time": "2026-06-14 13:15:00",
                        "value": 234.67
                    },
                    {
                        "time": "2026-06-14 13:20:00",
                        "value": 234.1
                    },
                    {
                        "time": "2026-06-14 13:25:00",
                        "value": 234.4
                    },
                    {
                        "time": "2026-06-14 13:30:00",
                        "value": 234.68
                    },
                    {
                        "time": "2026-06-14 13:35:00",
                        "value": 234.55
                    },
                    {
                        "time": "2026-06-14 13:40:00",
                        "value": 233.53
                    },
                    {
                        "time": "2026-06-14 13:45:00",
                        "value": 234.94
                    },
                    {
                        "time": "2026-06-14 13:50:00",
                        "value": 235.04
                    },
                    {
                        "time": "2026-06-14 13:55:00",
                        "value": 235.06
                    },
                    {
                        "time": "2026-06-14 14:00:00",
                        "value": 235.12
                    },
                    {
                        "time": "2026-06-14 14:05:00",
                        "value": 234.86
                    },
                    {
                        "time": "2026-06-14 14:10:00",
                        "value": 234.98
                    },
                    {
                        "time": "2026-06-14 14:15:00",
                        "value": 234.93
                    },
                    {
                        "time": "2026-06-14 14:20:00",
                        "value": 234.63
                    },
                    {
                        "time": "2026-06-14 14:25:00",
                        "value": 234.88
                    },
                    {
                        "time": "2026-06-14 14:30:00",
                        "value": 234.5
                    },
                    {
                        "time": "2026-06-14 14:35:00",
                        "value": 233.7
                    },
                    {
                        "time": "2026-06-14 14:40:00",
                        "value": 233.53
                    },
                    {
                        "time": "2026-06-14 14:45:00",
                        "value": 234.64
                    },
                    {
                        "time": "2026-06-14 14:50:00",
                        "value": 233.2
                    },
                    {
                        "time": "2026-06-14 14:55:00",
                        "value": 234.51
                    },
                    {
                        "time": "2026-06-14 15:00:00",
                        "value": 233.88
                    },
                    {
                        "time": "2026-06-14 15:05:00",
                        "value": 234.03
                    },
                    {
                        "time": "2026-06-14 15:10:00",
                        "value": 235.02
                    },
                    {
                        "time": "2026-06-14 15:15:00",
                        "value": 234.77
                    },
                    {
                        "time": "2026-06-14 15:20:00",
                        "value": 233.91
                    },
                    {
                        "time": "2026-06-14 15:25:00",
                        "value": 233.9
                    },
                    {
                        "time": "2026-06-14 15:30:00",
                        "value": 234.33
                    },
                    {
                        "time": "2026-06-14 15:35:00",
                        "value": 232.52
                    },
                    {
                        "time": "2026-06-14 15:40:00",
                        "value": 233.81
                    },
                    {
                        "time": "2026-06-14 15:45:00",
                        "value": 234.22
                    },
                    {
                        "time": "2026-06-14 15:50:00",
                        "value": 234.28
                    },
                    {
                        "time": "2026-06-14 15:55:00",
                        "value": 233.74
                    },
                    {
                        "time": "2026-06-14 16:00:00",
                        "value": 233.72
                    },
                    {
                        "time": "2026-06-14 16:05:00",
                        "value": 235.21
                    },
                    {
                        "time": "2026-06-14 16:10:00",
                        "value": 234.23
                    },
                    {
                        "time": "2026-06-14 16:15:00",
                        "value": 233.65
                    },
                    {
                        "time": "2026-06-14 16:20:00",
                        "value": 234.83
                    },
                    {
                        "time": "2026-06-14 16:25:00",
                        "value": 235.38
                    },
                    {
                        "time": "2026-06-14 16:30:00",
                        "value": 234.83
                    }
                ]
            },
            {
                "point": "Uc",
                "data": [
                    {
                        "time": "2026-06-14 00:00:00",
                        "value": 234.55
                    },
                    {
                        "time": "2026-06-14 00:05:00",
                        "value": 233.69
                    },
                    {
                        "time": "2026-06-14 00:10:00",
                        "value": 233.96
                    },
                    {
                        "time": "2026-06-14 00:15:00",
                        "value": 234.29
                    },
                    {
                        "time": "2026-06-14 00:20:00",
                        "value": 234.27
                    },
                    {
                        "time": "2026-06-14 00:25:00",
                        "value": 234.54
                    },
                    {
                        "time": "2026-06-14 00:30:00",
                        "value": 234.29
                    },
                    {
                        "time": "2026-06-14 00:35:00",
                        "value": 234.68
                    },
                    {
                        "time": "2026-06-14 00:40:00",
                        "value": 234.47
                    },
                    {
                        "time": "2026-06-14 00:45:00",
                        "value": 234.66
                    },
                    {
                        "time": "2026-06-14 00:50:00",
                        "value": 234.57
                    },
                    {
                        "time": "2026-06-14 00:55:00",
                        "value": 234.51
                    },
                    {
                        "time": "2026-06-14 01:00:00",
                        "value": 234.69
                    },
                    {
                        "time": "2026-06-14 01:05:00",
                        "value": 234.43
                    },
                    {
                        "time": "2026-06-14 01:10:00",
                        "value": 234.6
                    },
                    {
                        "time": "2026-06-14 01:15:00",
                        "value": 234.66
                    },
                    {
                        "time": "2026-06-14 01:20:00",
                        "value": 234.72
                    },
                    {
                        "time": "2026-06-14 01:25:00",
                        "value": 234.65
                    },
                    {
                        "time": "2026-06-14 01:30:00",
                        "value": 234.78
                    },
                    {
                        "time": "2026-06-14 01:35:00",
                        "value": 234.68
                    },
                    {
                        "time": "2026-06-14 01:40:00",
                        "value": 234.66
                    },
                    {
                        "time": "2026-06-14 01:45:00",
                        "value": 234.68
                    },
                    {
                        "time": "2026-06-14 01:50:00",
                        "value": 234.74
                    },
                    {
                        "time": "2026-06-14 01:55:00",
                        "value": 234.96
                    },
                    {
                        "time": "2026-06-14 02:00:00",
                        "value": 234.77
                    },
                    {
                        "time": "2026-06-14 02:05:00",
                        "value": 234.91
                    },
                    {
                        "time": "2026-06-14 02:10:00",
                        "value": 234.88
                    },
                    {
                        "time": "2026-06-14 02:15:00",
                        "value": 234.89
                    },
                    {
                        "time": "2026-06-14 02:20:00",
                        "value": 235.05
                    },
                    {
                        "time": "2026-06-14 02:25:00",
                        "value": 235.15
                    },
                    {
                        "time": "2026-06-14 02:30:00",
                        "value": 235.42
                    },
                    {
                        "time": "2026-06-14 02:35:00",
                        "value": 235.02
                    },
                    {
                        "time": "2026-06-14 02:40:00",
                        "value": 234.85
                    },
                    {
                        "time": "2026-06-14 02:45:00",
                        "value": 235.07
                    },
                    {
                        "time": "2026-06-14 02:50:00",
                        "value": 235.04
                    },
                    {
                        "time": "2026-06-14 02:55:00",
                        "value": 235.09
                    },
                    {
                        "time": "2026-06-14 03:00:00",
                        "value": 235.11
                    },
                    {
                        "time": "2026-06-14 03:05:00",
                        "value": 235.11
                    },
                    {
                        "time": "2026-06-14 03:10:00",
                        "value": 235.43
                    },
                    {
                        "time": "2026-06-14 03:15:00",
                        "value": 235.24
                    },
                    {
                        "time": "2026-06-14 03:20:00",
                        "value": 235.51
                    },
                    {
                        "time": "2026-06-14 03:25:00",
                        "value": 235.52
                    },
                    {
                        "time": "2026-06-14 03:30:00",
                        "value": 235.6
                    },
                    {
                        "time": "2026-06-14 03:35:00",
                        "value": 235.38
                    },
                    {
                        "time": "2026-06-14 03:40:00",
                        "value": 235.16
                    },
                    {
                        "time": "2026-06-14 03:45:00",
                        "value": 235.66
                    },
                    {
                        "time": "2026-06-14 03:50:00",
                        "value": 235.74
                    },
                    {
                        "time": "2026-06-14 03:55:00",
                        "value": 235.42
                    },
                    {
                        "time": "2026-06-14 04:00:00",
                        "value": 235.38
                    },
                    {
                        "time": "2026-06-14 04:10:00",
                        "value": 235.56
                    },
                    {
                        "time": "2026-06-14 04:20:00",
                        "value": 235.5
                    },
                    {
                        "time": "2026-06-14 04:25:00",
                        "value": 235.32
                    },
                    {
                        "time": "2026-06-14 04:30:00",
                        "value": 235.43
                    },
                    {
                        "time": "2026-06-14 04:35:00",
                        "value": 235.63
                    },
                    {
                        "time": "2026-06-14 04:40:00",
                        "value": 235.49
                    },
                    {
                        "time": "2026-06-14 04:45:00",
                        "value": 235.69
                    },
                    {
                        "time": "2026-06-14 04:50:00",
                        "value": 235.74
                    },
                    {
                        "time": "2026-06-14 04:55:00",
                        "value": 235.54
                    },
                    {
                        "time": "2026-06-14 05:00:00",
                        "value": 235.61
                    },
                    {
                        "time": "2026-06-14 05:05:00",
                        "value": 235.73
                    },
                    {
                        "time": "2026-06-14 05:10:00",
                        "value": 235.75
                    },
                    {
                        "time": "2026-06-14 05:15:00",
                        "value": 235.96
                    },
                    {
                        "time": "2026-06-14 05:20:00",
                        "value": 236.25
                    },
                    {
                        "time": "2026-06-14 05:25:00",
                        "value": 236.22
                    },
                    {
                        "time": "2026-06-14 05:30:00",
                        "value": 236.26
                    },
                    {
                        "time": "2026-06-14 05:35:00",
                        "value": 236.05
                    },
                    {
                        "time": "2026-06-14 05:40:00",
                        "value": 236.04
                    },
                    {
                        "time": "2026-06-14 05:45:00",
                        "value": 236.43
                    },
                    {
                        "time": "2026-06-14 05:50:00",
                        "value": 236.18
                    },
                    {
                        "time": "2026-06-14 05:55:00",
                        "value": 235.97
                    },
                    {
                        "time": "2026-06-14 06:00:00",
                        "value": 236.05
                    },
                    {
                        "time": "2026-06-14 06:05:00",
                        "value": 235.73
                    },
                    {
                        "time": "2026-06-14 06:10:00",
                        "value": 236.02
                    },
                    {
                        "time": "2026-06-14 06:15:00",
                        "value": 236.27
                    },
                    {
                        "time": "2026-06-14 06:20:00",
                        "value": 236.43
                    },
                    {
                        "time": "2026-06-14 06:25:00",
                        "value": 236.25
                    },
                    {
                        "time": "2026-06-14 06:30:00",
                        "value": 236.18
                    },
                    {
                        "time": "2026-06-14 06:35:00",
                        "value": 236.09
                    },
                    {
                        "time": "2026-06-14 06:40:00",
                        "value": 235.79
                    },
                    {
                        "time": "2026-06-14 06:45:00",
                        "value": 236.18
                    },
                    {
                        "time": "2026-06-14 06:50:00",
                        "value": 236.23
                    },
                    {
                        "time": "2026-06-14 06:55:00",
                        "value": 235.87
                    },
                    {
                        "time": "2026-06-14 07:00:00",
                        "value": 235.77
                    },
                    {
                        "time": "2026-06-14 07:05:00",
                        "value": 236.14
                    },
                    {
                        "time": "2026-06-14 07:10:00",
                        "value": 236.01
                    },
                    {
                        "time": "2026-06-14 07:15:00",
                        "value": 235.74
                    },
                    {
                        "time": "2026-06-14 07:20:00",
                        "value": 235.44
                    },
                    {
                        "time": "2026-06-14 07:25:00",
                        "value": 235.66
                    },
                    {
                        "time": "2026-06-14 07:30:00",
                        "value": 235.5
                    },
                    {
                        "time": "2026-06-14 07:35:00",
                        "value": 235.68
                    },
                    {
                        "time": "2026-06-14 07:40:00",
                        "value": 236.08
                    },
                    {
                        "time": "2026-06-14 07:45:00",
                        "value": 235.91
                    },
                    {
                        "time": "2026-06-14 07:50:00",
                        "value": 235.91
                    },
                    {
                        "time": "2026-06-14 07:55:00",
                        "value": 235.6
                    },
                    {
                        "time": "2026-06-14 08:00:00",
                        "value": 235.64
                    },
                    {
                        "time": "2026-06-14 08:05:00",
                        "value": 232.33
                    },
                    {
                        "time": "2026-06-14 08:10:00",
                        "value": 232.21
                    },
                    {
                        "time": "2026-06-14 08:15:00",
                        "value": 231.45
                    },
                    {
                        "time": "2026-06-14 08:20:00",
                        "value": 231.86
                    },
                    {
                        "time": "2026-06-14 08:25:00",
                        "value": 231.82
                    },
                    {
                        "time": "2026-06-14 08:30:00",
                        "value": 231.89
                    },
                    {
                        "time": "2026-06-14 08:35:00",
                        "value": 231.73
                    },
                    {
                        "time": "2026-06-14 08:40:00",
                        "value": 233.55
                    },
                    {
                        "time": "2026-06-14 08:45:00",
                        "value": 233.72
                    },
                    {
                        "time": "2026-06-14 08:50:00",
                        "value": 233.16
                    },
                    {
                        "time": "2026-06-14 08:55:00",
                        "value": 232.99
                    },
                    {
                        "time": "2026-06-14 09:00:00",
                        "value": 233.8
                    },
                    {
                        "time": "2026-06-14 09:05:00",
                        "value": 233.95
                    },
                    {
                        "time": "2026-06-14 09:10:00",
                        "value": 233.54
                    },
                    {
                        "time": "2026-06-14 09:15:00",
                        "value": 233.09
                    },
                    {
                        "time": "2026-06-14 09:20:00",
                        "value": 232.63
                    },
                    {
                        "time": "2026-06-14 09:25:00",
                        "value": 233.31
                    },
                    {
                        "time": "2026-06-14 09:30:00",
                        "value": 233.79
                    },
                    {
                        "time": "2026-06-14 09:35:00",
                        "value": 233.87
                    },
                    {
                        "time": "2026-06-14 09:40:00",
                        "value": 232.66
                    },
                    {
                        "time": "2026-06-14 09:45:00",
                        "value": 232.06
                    },
                    {
                        "time": "2026-06-14 09:50:00",
                        "value": 234.2
                    },
                    {
                        "time": "2026-06-14 09:55:00",
                        "value": 233.58
                    },
                    {
                        "time": "2026-06-14 10:00:00",
                        "value": 233.41
                    },
                    {
                        "time": "2026-06-14 10:05:00",
                        "value": 233.45
                    },
                    {
                        "time": "2026-06-14 10:10:00",
                        "value": 233.48
                    },
                    {
                        "time": "2026-06-14 10:15:00",
                        "value": 233.04
                    },
                    {
                        "time": "2026-06-14 10:20:00",
                        "value": 232.15
                    },
                    {
                        "time": "2026-06-14 10:25:00",
                        "value": 232.62
                    },
                    {
                        "time": "2026-06-14 10:30:00",
                        "value": 231.78
                    },
                    {
                        "time": "2026-06-14 10:35:00",
                        "value": 232.23
                    },
                    {
                        "time": "2026-06-14 10:40:00",
                        "value": 233.68
                    },
                    {
                        "time": "2026-06-14 10:45:00",
                        "value": 232.92
                    },
                    {
                        "time": "2026-06-14 10:50:00",
                        "value": 233.28
                    },
                    {
                        "time": "2026-06-14 10:55:00",
                        "value": 233.67
                    },
                    {
                        "time": "2026-06-14 11:00:00",
                        "value": 233.57
                    },
                    {
                        "time": "2026-06-14 11:05:00",
                        "value": 232.97
                    },
                    {
                        "time": "2026-06-14 11:10:00",
                        "value": 233.2
                    },
                    {
                        "time": "2026-06-14 11:15:00",
                        "value": 234.19
                    },
                    {
                        "time": "2026-06-14 11:20:00",
                        "value": 233.85
                    },
                    {
                        "time": "2026-06-14 11:25:00",
                        "value": 234.13
                    },
                    {
                        "time": "2026-06-14 11:30:00",
                        "value": 233.81
                    },
                    {
                        "time": "2026-06-14 11:35:00",
                        "value": 233.78
                    },
                    {
                        "time": "2026-06-14 11:40:00",
                        "value": 234.27
                    },
                    {
                        "time": "2026-06-14 11:45:00",
                        "value": 233.5
                    },
                    {
                        "time": "2026-06-14 11:50:00",
                        "value": 233.56
                    },
                    {
                        "time": "2026-06-14 11:55:00",
                        "value": 233.04
                    },
                    {
                        "time": "2026-06-14 12:00:00",
                        "value": 232.35
                    },
                    {
                        "time": "2026-06-14 12:05:00",
                        "value": 233.37
                    },
                    {
                        "time": "2026-06-14 12:10:00",
                        "value": 233.36
                    },
                    {
                        "time": "2026-06-14 12:15:00",
                        "value": 233.36
                    },
                    {
                        "time": "2026-06-14 12:20:00",
                        "value": 234.23
                    },
                    {
                        "time": "2026-06-14 12:25:00",
                        "value": 234.02
                    },
                    {
                        "time": "2026-06-14 12:30:00",
                        "value": 233.97
                    },
                    {
                        "time": "2026-06-14 12:35:00",
                        "value": 233.66
                    },
                    {
                        "time": "2026-06-14 12:40:00",
                        "value": 234.39
                    },
                    {
                        "time": "2026-06-14 12:45:00",
                        "value": 234.08
                    },
                    {
                        "time": "2026-06-14 12:50:00",
                        "value": 233.44
                    },
                    {
                        "time": "2026-06-14 12:55:00",
                        "value": 233.53
                    },
                    {
                        "time": "2026-06-14 13:00:00",
                        "value": 233.85
                    },
                    {
                        "time": "2026-06-14 13:05:00",
                        "value": 234.6
                    },
                    {
                        "time": "2026-06-14 13:10:00",
                        "value": 234.41
                    },
                    {
                        "time": "2026-06-14 13:15:00",
                        "value": 234.09
                    },
                    {
                        "time": "2026-06-14 13:20:00",
                        "value": 234.51
                    },
                    {
                        "time": "2026-06-14 13:25:00",
                        "value": 234.57
                    },
                    {
                        "time": "2026-06-14 13:30:00",
                        "value": 233.77
                    },
                    {
                        "time": "2026-06-14 13:35:00",
                        "value": 234.34
                    },
                    {
                        "time": "2026-06-14 13:40:00",
                        "value": 234.28
                    },
                    {
                        "time": "2026-06-14 13:45:00",
                        "value": 234.59
                    },
                    {
                        "time": "2026-06-14 13:50:00",
                        "value": 234.71
                    },
                    {
                        "time": "2026-06-14 13:55:00",
                        "value": 234.14
                    },
                    {
                        "time": "2026-06-14 14:00:00",
                        "value": 235.03
                    },
                    {
                        "time": "2026-06-14 14:05:00",
                        "value": 234.79
                    },
                    {
                        "time": "2026-06-14 14:10:00",
                        "value": 234.91
                    },
                    {
                        "time": "2026-06-14 14:15:00",
                        "value": 234.67
                    },
                    {
                        "time": "2026-06-14 14:20:00",
                        "value": 234.23
                    },
                    {
                        "time": "2026-06-14 14:25:00",
                        "value": 234.58
                    },
                    {
                        "time": "2026-06-14 14:30:00",
                        "value": 234.54
                    },
                    {
                        "time": "2026-06-14 14:35:00",
                        "value": 233.8
                    },
                    {
                        "time": "2026-06-14 14:40:00",
                        "value": 233.77
                    },
                    {
                        "time": "2026-06-14 14:45:00",
                        "value": 234.62
                    },
                    {
                        "time": "2026-06-14 14:50:00",
                        "value": 233.34
                    },
                    {
                        "time": "2026-06-14 14:55:00",
                        "value": 234.36
                    },
                    {
                        "time": "2026-06-14 15:00:00",
                        "value": 233.97
                    },
                    {
                        "time": "2026-06-14 15:05:00",
                        "value": 233.91
                    },
                    {
                        "time": "2026-06-14 15:10:00",
                        "value": 234.46
                    },
                    {
                        "time": "2026-06-14 15:15:00",
                        "value": 234.44
                    },
                    {
                        "time": "2026-06-14 15:20:00",
                        "value": 233.48
                    },
                    {
                        "time": "2026-06-14 15:25:00",
                        "value": 233.56
                    },
                    {
                        "time": "2026-06-14 15:30:00",
                        "value": 233.56
                    },
                    {
                        "time": "2026-06-14 15:35:00",
                        "value": 232.67
                    },
                    {
                        "time": "2026-06-14 15:40:00",
                        "value": 233.19
                    },
                    {
                        "time": "2026-06-14 15:45:00",
                        "value": 234.06
                    },
                    {
                        "time": "2026-06-14 15:50:00",
                        "value": 233.33
                    },
                    {
                        "time": "2026-06-14 15:55:00",
                        "value": 232.57
                    },
                    {
                        "time": "2026-06-14 16:00:00",
                        "value": 233.95
                    },
                    {
                        "time": "2026-06-14 16:05:00",
                        "value": 234.31
                    },
                    {
                        "time": "2026-06-14 16:10:00",
                        "value": 233.9
                    },
                    {
                        "time": "2026-06-14 16:15:00",
                        "value": 233.38
                    },
                    {
                        "time": "2026-06-14 16:20:00",
                        "value": 234.87
                    },
                    {
                        "time": "2026-06-14 16:25:00",
                        "value": 235.01
                    },
                    {
                        "time": "2026-06-14 16:30:00",
                        "value": 234.41
                    }
                ]
            }
        ]
    }
]
    }
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
    console.log('HistoryTable~~', dayjs(timeRanger).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
    if(!siteData?.sn) return
    try {
      setLoading(true)
      let startTime, endTime;
      startTime = dayjs(timeRanger).startOf().format('YYYY-MM-DD 00:00:00')
      endTime = dayjs(timeRanger).format('YYYY-MM-DD HH:mm:ss')
      
      let params = {
        projectId,
        sn:siteData?.sn,
        // type,
        start: startTime,
        end: dayjs(dayjs(timeRanger).format('YYYY-MM-DD')).isBefore(dayjs(dayjs().format('YYYY-MM-DD'))) ?  dayjs(timeRanger).endOf("day").format('YYYY-MM-DD HH:mm:ss')  : dayjs(timeRanger).format('YYYY-MM-DD HH:mm:ss')
      }
      const res ={
    "success": true,
    "errMsg": "",
    "data": {
        "sn": "T1byq0000001",
        "header": [
            {
                "name": "Time",
                "display": "监测时间"
            },
            {
                "name": "Ia",
                "display": "A相电流(A)"
            },
            {
                "name": "Ib",
                "display": "B相电流(A)"
            },
            {
                "name": "Ic",
                "display": "C相电流(A)"
            },
            {
                "name": "Ua",
                "display": "A相电压(V)"
            },
            {
                "name": "Ub",
                "display": "B相电压(V)"
            },
            {
                "name": "Uc",
                "display": "C相电压(V)"
            },
            {
                "name": "TotW",
                "display": "总有功功率(kW)"
            },
            {
                "name": "TotVar",
                "display": "总无功功率(kvar)"
            },
            {
                "name": "Load",
                "display": "负荷(kW)"
            }
        ],
        "data": [
            {
                "Time": "2026-06-14 00:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotVar": 0,
                "TotW": 0,
                "Ua": 234.11,
                "Ub": 234.33,
                "Uc": 234.34
            },
            {
                "Time": "2026-06-14 00:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 233.43,
                "Ub": 233.63,
                "Uc": 233.64
            },
            {
                "Time": "2026-06-14 00:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 233.74,
                "Ub": 233.95,
                "Uc": 233.91
            },
            {
                "Time": "2026-06-14 00:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 233.94,
                "Ub": 234.15,
                "Uc": 234.11
            },
            {
                "Time": "2026-06-14 00:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.07,
                "Ub": 234.27,
                "Uc": 234.2
            },
            {
                "Time": "2026-06-14 00:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.27,
                "Ub": 234.45,
                "Uc": 234.4
            },
            {
                "Time": "2026-06-14 00:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.04,
                "Ub": 234.22,
                "Uc": 234.13
            },
            {
                "Time": "2026-06-14 00:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.24,
                "Ub": 234.41,
                "Uc": 234.35
            },
            {
                "Time": "2026-06-14 00:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.36,
                "Ub": 234.55,
                "Uc": 234.49
            },
            {
                "Time": "2026-06-14 00:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.55,
                "Ub": 234.72,
                "Uc": 234.61
            },
            {
                "Time": "2026-06-14 00:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.25,
                "Ub": 234.43,
                "Uc": 234.32
            },
            {
                "Time": "2026-06-14 00:55:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.1,
                "Ub": 234.28,
                "Uc": 234.19
            },
            {
                "Time": "2026-06-14 01:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.39,
                "Ub": 234.58,
                "Uc": 234.46
            },
            {
                "Time": "2026-06-14 01:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.31,
                "Ub": 234.52,
                "Uc": 234.42
            },
            {
                "Time": "2026-06-14 01:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.41,
                "Ub": 234.62,
                "Uc": 234.49
            },
            {
                "Time": "2026-06-14 01:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.6,
                "Ub": 234.81,
                "Uc": 234.67
            },
            {
                "Time": "2026-06-14 01:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.62,
                "Ub": 234.82,
                "Uc": 234.66
            },
            {
                "Time": "2026-06-14 01:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.34,
                "Ub": 234.53,
                "Uc": 234.38
            },
            {
                "Time": "2026-06-14 01:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.62,
                "Ub": 234.83,
                "Uc": 234.68
            },
            {
                "Time": "2026-06-14 01:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.52,
                "Ub": 234.74,
                "Uc": 234.59
            },
            {
                "Time": "2026-06-14 01:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.46,
                "Ub": 234.66,
                "Uc": 234.53
            },
            {
                "Time": "2026-06-14 01:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.49,
                "Ub": 234.71,
                "Uc": 234.53
            },
            {
                "Time": "2026-06-14 01:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.48,
                "Ub": 234.72,
                "Uc": 234.55
            },
            {
                "Time": "2026-06-14 01:55:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.71,
                "Ub": 234.93,
                "Uc": 234.76
            },
            {
                "Time": "2026-06-14 02:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.69,
                "Ub": 234.88,
                "Uc": 234.73
            },
            {
                "Time": "2026-06-14 02:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.72,
                "Ub": 234.93,
                "Uc": 234.73
            },
            {
                "Time": "2026-06-14 02:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.62,
                "Ub": 234.82,
                "Uc": 234.66
            },
            {
                "Time": "2026-06-14 02:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.75,
                "Ub": 234.96,
                "Uc": 234.79
            },
            {
                "Time": "2026-06-14 02:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.9,
                "Ub": 235.12,
                "Uc": 234.95
            },
            {
                "Time": "2026-06-14 02:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.92,
                "Ub": 235.12,
                "Uc": 234.96
            },
            {
                "Time": "2026-06-14 02:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.24,
                "Ub": 235.49,
                "Uc": 235.25
            },
            {
                "Time": "2026-06-14 02:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.83,
                "Ub": 235.06,
                "Uc": 234.87
            },
            {
                "Time": "2026-06-14 02:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.67,
                "Ub": 234.93,
                "Uc": 234.69
            },
            {
                "Time": "2026-06-14 02:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.98,
                "Ub": 235.23,
                "Uc": 235.02
            },
            {
                "Time": "2026-06-14 02:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.08,
                "Ub": 235.3,
                "Uc": 235.12
            },
            {
                "Time": "2026-06-14 02:55:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.85,
                "Ub": 235.09,
                "Uc": 234.89
            },
            {
                "Time": "2026-06-14 03:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.94,
                "Ub": 235.17,
                "Uc": 234.98
            },
            {
                "Time": "2026-06-14 03:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.05,
                "Ub": 235.29,
                "Uc": 235.07
            },
            {
                "Time": "2026-06-14 03:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.29,
                "Ub": 235.55,
                "Uc": 235.33
            },
            {
                "Time": "2026-06-14 03:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.18,
                "Ub": 235.43,
                "Uc": 235.22
            },
            {
                "Time": "2026-06-14 03:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.21,
                "Ub": 235.49,
                "Uc": 235.27
            },
            {
                "Time": "2026-06-14 03:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.17,
                "Ub": 235.43,
                "Uc": 235.19
            },
            {
                "Time": "2026-06-14 03:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.58,
                "Ub": 235.86,
                "Uc": 235.61
            },
            {
                "Time": "2026-06-14 03:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.34,
                "Ub": 235.61,
                "Uc": 235.35
            },
            {
                "Time": "2026-06-14 03:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.23,
                "Ub": 235.51,
                "Uc": 235.24
            },
            {
                "Time": "2026-06-14 03:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.6,
                "Ub": 235.85,
                "Uc": 235.63
            },
            {
                "Time": "2026-06-14 03:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.63,
                "Ub": 235.89,
                "Uc": 235.65
            },
            {
                "Time": "2026-06-14 03:55:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.17,
                "Ub": 235.45,
                "Uc": 235.21
            },
            {
                "Time": "2026-06-14 04:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.39,
                "Ub": 235.64,
                "Uc": 235.39
            },
            {
                "Time": "2026-06-14 04:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.46,
                "Ub": 235.73,
                "Uc": 235.5
            },
            {
                "Time": "2026-06-14 04:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.2,
                "Ub": 235.46,
                "Uc": 235.23
            },
            {
                "Time": "2026-06-14 04:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.2,
                "Ub": 235.45,
                "Uc": 235.25
            },
            {
                "Time": "2026-06-14 04:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.26,
                "Ub": 235.51,
                "Uc": 235.36
            },
            {
                "Time": "2026-06-14 04:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.44,
                "Ub": 235.71,
                "Uc": 235.52
            },
            {
                "Time": "2026-06-14 04:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.4,
                "Ub": 235.67,
                "Uc": 235.47
            },
            {
                "Time": "2026-06-14 04:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.3,
                "Ub": 235.58,
                "Uc": 235.38
            },
            {
                "Time": "2026-06-14 04:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.29,
                "Ub": 235.54,
                "Uc": 235.37
            },
            {
                "Time": "2026-06-14 04:55:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.29,
                "Ub": 235.54,
                "Uc": 235.31
            },
            {
                "Time": "2026-06-14 05:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.39,
                "Ub": 235.62,
                "Uc": 235.44
            },
            {
                "Time": "2026-06-14 05:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.35,
                "Ub": 235.51,
                "Uc": 235.37
            },
            {
                "Time": "2026-06-14 05:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.72,
                "Ub": 235.92,
                "Uc": 235.77
            },
            {
                "Time": "2026-06-14 05:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.52,
                "Ub": 235.72,
                "Uc": 235.54
            },
            {
                "Time": "2026-06-14 05:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.97,
                "Ub": 236.18,
                "Uc": 236.04
            },
            {
                "Time": "2026-06-14 05:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.02,
                "Ub": 236.28,
                "Uc": 236.07
            },
            {
                "Time": "2026-06-14 05:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.94,
                "Ub": 236.19,
                "Uc": 236.03
            },
            {
                "Time": "2026-06-14 05:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.86,
                "Ub": 236.04,
                "Uc": 235.89
            },
            {
                "Time": "2026-06-14 05:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.04,
                "Ub": 236.12,
                "Uc": 236.3
            },
            {
                "Time": "2026-06-14 05:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.27,
                "Ub": 236.48,
                "Uc": 236.28
            },
            {
                "Time": "2026-06-14 05:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.94,
                "Ub": 236.19,
                "Uc": 236.03
            },
            {
                "Time": "2026-06-14 05:55:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.82,
                "Ub": 236.07,
                "Uc": 235.91
            },
            {
                "Time": "2026-06-14 06:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.92,
                "Ub": 236.15,
                "Uc": 235.95
            },
            {
                "Time": "2026-06-14 06:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.18,
                "Ub": 236.4,
                "Uc": 236.24
            },
            {
                "Time": "2026-06-14 06:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.23,
                "Ub": 236.46,
                "Uc": 236.16
            },
            {
                "Time": "2026-06-14 06:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.03,
                "Ub": 236.53,
                "Uc": 235.94
            },
            {
                "Time": "2026-06-14 06:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.34,
                "Ub": 236.38,
                "Uc": 236.27
            },
            {
                "Time": "2026-06-14 06:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.96,
                "Ub": 235.71,
                "Uc": 235.96
            },
            {
                "Time": "2026-06-14 06:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.09,
                "Ub": 236.07,
                "Uc": 236.13
            },
            {
                "Time": "2026-06-14 06:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.83,
                "Ub": 236.15,
                "Uc": 235.81
            },
            {
                "Time": "2026-06-14 06:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.76,
                "Ub": 235.99,
                "Uc": 235.78
            },
            {
                "Time": "2026-06-14 06:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.93,
                "Ub": 236.13,
                "Uc": 235.93
            },
            {
                "Time": "2026-06-14 06:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.19,
                "Ub": 236.06,
                "Uc": 236.15
            },
            {
                "Time": "2026-06-14 06:55:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.18,
                "Ub": 236.3,
                "Uc": 235.97
            },
            {
                "Time": "2026-06-14 07:00:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.03,
                "Ub": 235.9,
                "Uc": 235.83
            },
            {
                "Time": "2026-06-14 07:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.98,
                "Ub": 235.94,
                "Uc": 236.2
            },
            {
                "Time": "2026-06-14 07:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.95,
                "Ub": 235.76,
                "Uc": 235.84
            },
            {
                "Time": "2026-06-14 07:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.92,
                "Ub": 235.84,
                "Uc": 235.85
            },
            {
                "Time": "2026-06-14 07:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.91,
                "Ub": 236.07,
                "Uc": 235.38
            },
            {
                "Time": "2026-06-14 07:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236,
                "Ub": 236.19,
                "Uc": 236
            },
            {
                "Time": "2026-06-14 07:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.93,
                "Ub": 236.31,
                "Uc": 235.52
            },
            {
                "Time": "2026-06-14 07:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 235.84,
                "Ub": 236.23,
                "Uc": 235.8
            },
            {
                "Time": "2026-06-14 07:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.13,
                "Ub": 236.34,
                "Uc": 235.96
            },
            {
                "Time": "2026-06-14 07:45:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.36,
                "Ub": 236.42,
                "Uc": 236.25
            },
            {
                "Time": "2026-06-14 07:50:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 236.38,
                "Ub": 236.73,
                "Uc": 236.19
            },
            {
                "Time": "2026-06-14 07:55:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.54,
                "TotW": 75.54,
                "Ua": 235.33,
                "Ub": 235.35,
                "Uc": 234.78
            },
            {
                "Time": "2026-06-14 08:00:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.52,
                "TotW": 81.52,
                "Ua": 235.16,
                "Ub": 235.56,
                "Uc": 235.14
            },
            {
                "Time": "2026-06-14 08:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 74.81,
                "TotW": 74.81,
                "Ua": 232.4,
                "Ub": 232.4,
                "Uc": 232.43
            },
            {
                "Time": "2026-06-14 08:10:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 78.45,
                "TotW": 78.45,
                "Ua": 231.95,
                "Ub": 232.27,
                "Uc": 231.87
            },
            {
                "Time": "2026-06-14 08:15:00",
                "Ia": 0.17,
                "Ib": 0.16,
                "Ic": 0.16,
                "Load": 73.4,
                "TotW": 73.4,
                "Ua": 231.63,
                "Ub": 231.53,
                "Uc": 230.94
            },
            {
                "Time": "2026-06-14 08:20:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.82,
                "TotW": 75.82,
                "Ua": 231.68,
                "Ub": 231.76,
                "Uc": 231.46
            },
            {
                "Time": "2026-06-14 08:25:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 74.46,
                "TotW": 74.46,
                "Ua": 231.62,
                "Ub": 231.87,
                "Uc": 231.32
            },
            {
                "Time": "2026-06-14 08:30:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.58,
                "TotW": 79.58,
                "Ua": 231.52,
                "Ub": 231.62,
                "Uc": 231.39
            },
            {
                "Time": "2026-06-14 08:35:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 80.52,
                "TotW": 80.52,
                "Ua": 231.38,
                "Ub": 231.56,
                "Uc": 231.13
            },
            {
                "Time": "2026-06-14 08:40:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.89,
                "TotW": 79.89,
                "Ua": 233.53,
                "Ub": 233.33,
                "Uc": 233.27
            },
            {
                "Time": "2026-06-14 08:45:00",
                "Ia": 0.18,
                "Ib": 0.19,
                "Ic": 0.17,
                "Load": 84.71,
                "TotW": 84.71,
                "Ua": 233.71,
                "Ub": 233.99,
                "Uc": 233.57
            },
            {
                "Time": "2026-06-14 08:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.16,
                "TotW": 75.16,
                "Ua": 233.78,
                "Ub": 234.17,
                "Uc": 233.22
            },
            {
                "Time": "2026-06-14 08:55:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 80.54,
                "TotW": 80.54,
                "Ua": 233.33,
                "Ub": 233.42,
                "Uc": 232.71
            },
            {
                "Time": "2026-06-14 09:00:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.75,
                "TotW": 75.75,
                "Ua": 233.63,
                "Ub": 233.88,
                "Uc": 233.63
            },
            {
                "Time": "2026-06-14 09:05:00",
                "Ia": 0.18,
                "Ib": 0.19,
                "Ic": 0.17,
                "Load": 84.83,
                "TotW": 84.83,
                "Ua": 233.75,
                "Ub": 233.79,
                "Uc": 233.25
            },
            {
                "Time": "2026-06-14 09:10:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.09,
                "TotW": 81.09,
                "Ua": 233.62,
                "Ub": 234.01,
                "Uc": 233.41
            },
            {
                "Time": "2026-06-14 09:15:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.42,
                "TotW": 81.42,
                "Ua": 233.49,
                "Ub": 233.67,
                "Uc": 232.83
            },
            {
                "Time": "2026-06-14 09:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 79.85,
                "TotW": 79.85,
                "Ua": 233.42,
                "Ub": 233.49,
                "Uc": 233.26
            },
            {
                "Time": "2026-06-14 09:25:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 74.93,
                "TotW": 74.93,
                "Ua": 233.45,
                "Ub": 233.55,
                "Uc": 233
            },
            {
                "Time": "2026-06-14 09:30:00",
                "Ia": 0.18,
                "Ib": 0.19,
                "Ic": 0.17,
                "Load": 85.12,
                "TotW": 85.12,
                "Ua": 233.22,
                "Ub": 233.61,
                "Uc": 233.21
            },
            {
                "Time": "2026-06-14 09:35:00",
                "Ia": 0.18,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 79.74,
                "TotW": 79.74,
                "Ua": 233.49,
                "Ub": 233.89,
                "Uc": 232.42
            },
            {
                "Time": "2026-06-14 09:40:00",
                "Ia": 0.21,
                "Ib": 0.21,
                "Ic": 0.2,
                "Load": 103.37,
                "TotW": 103.37,
                "Ua": 233.45,
                "Ub": 233.49,
                "Uc": 233.13
            },
            {
                "Time": "2026-06-14 09:45:00",
                "Ia": 0.18,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 83.92,
                "TotW": 83.92,
                "Ua": 233.49,
                "Ub": 233.3,
                "Uc": 233.54
            },
            {
                "Time": "2026-06-14 09:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.7,
                "TotW": 76.7,
                "Ua": 233.58,
                "Ub": 233.64,
                "Uc": 233.59
            },
            {
                "Time": "2026-06-14 09:55:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.51,
                "TotW": 75.51,
                "Ua": 233.69,
                "Ub": 233.82,
                "Uc": 233.54
            },
            {
                "Time": "2026-06-14 10:00:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.47,
                "TotW": 75.47,
                "Ua": 233.32,
                "Ub": 233.78,
                "Uc": 233.18
            },
            {
                "Time": "2026-06-14 10:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 77.75,
                "TotW": 77.75,
                "Ua": 233.18,
                "Ub": 233.07,
                "Uc": 233.54
            },
            {
                "Time": "2026-06-14 10:10:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 76.85,
                "TotW": 76.85,
                "Ua": 233.04,
                "Ub": 232.82,
                "Uc": 233.16
            },
            {
                "Time": "2026-06-14 10:15:00",
                "Ia": 0.18,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 80.03,
                "TotW": 80.03,
                "Ua": 233,
                "Ub": 232.59,
                "Uc": 232.96
            },
            {
                "Time": "2026-06-14 10:20:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 74.91,
                "TotW": 74.91,
                "Ua": 233.25,
                "Ub": 233.28,
                "Uc": 231.98
            },
            {
                "Time": "2026-06-14 10:25:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 78.46,
                "TotW": 78.46,
                "Ua": 233.16,
                "Ub": 233.31,
                "Uc": 232.64
            },
            {
                "Time": "2026-06-14 10:30:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 80.19,
                "TotW": 80.19,
                "Ua": 233.09,
                "Ub": 233.64,
                "Uc": 232.62
            },
            {
                "Time": "2026-06-14 10:35:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.83,
                "TotW": 82.83,
                "Ua": 233.14,
                "Ub": 233.36,
                "Uc": 233.29
            },
            {
                "Time": "2026-06-14 10:40:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.18,
                "Load": 86.37,
                "TotW": 86.37,
                "Ua": 233.1,
                "Ub": 232.79,
                "Uc": 233.37
            },
            {
                "Time": "2026-06-14 10:45:00",
                "Ia": 0.19,
                "Ib": 0.19,
                "Ic": 0.18,
                "Load": 88.86,
                "TotW": 88.86,
                "Ua": 233.11,
                "Ub": 232.71,
                "Uc": 232.76
            },
            {
                "Time": "2026-06-14 10:50:00",
                "Ia": 0.19,
                "Ib": 0.19,
                "Ic": 0.18,
                "Load": 88.89,
                "TotW": 88.89,
                "Ua": 233.34,
                "Ub": 233.23,
                "Uc": 233.32
            },
            {
                "Time": "2026-06-14 10:55:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.71,
                "TotW": 79.71,
                "Ua": 233.5,
                "Ub": 233.68,
                "Uc": 233.56
            },
            {
                "Time": "2026-06-14 11:00:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 80.87,
                "TotW": 80.87,
                "Ua": 233.91,
                "Ub": 233.91,
                "Uc": 233.9
            },
            {
                "Time": "2026-06-14 11:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 77.7,
                "TotW": 77.7,
                "Ua": 232.68,
                "Ub": 232.88,
                "Uc": 232.49
            },
            {
                "Time": "2026-06-14 11:10:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.57,
                "TotW": 81.57,
                "Ua": 233.17,
                "Ub": 233.01,
                "Uc": 232.91
            },
            {
                "Time": "2026-06-14 11:15:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 78.83,
                "TotW": 78.83,
                "Ua": 233.35,
                "Ub": 233.07,
                "Uc": 232.7
            },
            {
                "Time": "2026-06-14 11:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.39,
                "TotW": 81.39,
                "Ua": 233.47,
                "Ub": 233.54,
                "Uc": 233.21
            },
            {
                "Time": "2026-06-14 11:25:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.64,
                "TotW": 79.64,
                "Ua": 233.39,
                "Ub": 233.12,
                "Uc": 233.41
            },
            {
                "Time": "2026-06-14 11:30:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 79.31,
                "TotW": 79.31,
                "Ua": 233.39,
                "Ub": 234.05,
                "Uc": 233.39
            },
            {
                "Time": "2026-06-14 11:35:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 79.19,
                "TotW": 79.19,
                "Ua": 233.94,
                "Ub": 233.8,
                "Uc": 233.52
            },
            {
                "Time": "2026-06-14 11:40:00",
                "Ia": 0.18,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 82.38,
                "TotW": 82.38,
                "Ua": 233.79,
                "Ub": 233.21,
                "Uc": 233.86
            },
            {
                "Time": "2026-06-14 11:45:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 77.43,
                "TotW": 77.43,
                "Ua": 233.58,
                "Ub": 233.66,
                "Uc": 233.59
            },
            {
                "Time": "2026-06-14 11:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.13,
                "TotW": 79.13,
                "Ua": 233.2,
                "Ub": 233.5,
                "Uc": 233.26
            },
            {
                "Time": "2026-06-14 11:55:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 78.56,
                "TotW": 78.56,
                "Ua": 232.8,
                "Ub": 232.8,
                "Uc": 232.64
            },
            {
                "Time": "2026-06-14 12:00:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 78.19,
                "TotW": 78.19,
                "Ua": 232.56,
                "Ub": 232.31,
                "Uc": 232.05
            },
            {
                "Time": "2026-06-14 12:05:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 80.25,
                "TotW": 80.25,
                "Ua": 233.19,
                "Ub": 232.88,
                "Uc": 233.36
            },
            {
                "Time": "2026-06-14 12:10:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.81,
                "TotW": 79.81,
                "Ua": 233.33,
                "Ub": 233.66,
                "Uc": 233.14
            },
            {
                "Time": "2026-06-14 12:15:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.68,
                "TotW": 82.68,
                "Ua": 234.11,
                "Ub": 234.34,
                "Uc": 234.2
            },
            {
                "Time": "2026-06-14 12:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 85.76,
                "TotW": 85.76,
                "Ua": 233.85,
                "Ub": 234.16,
                "Uc": 233.64
            },
            {
                "Time": "2026-06-14 12:25:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.56,
                "TotW": 81.56,
                "Ua": 233.29,
                "Ub": 233.97,
                "Uc": 233.23
            },
            {
                "Time": "2026-06-14 12:30:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 79.69,
                "TotW": 79.69,
                "Ua": 233.86,
                "Ub": 234.3,
                "Uc": 233.76
            },
            {
                "Time": "2026-06-14 12:35:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 79.43,
                "TotW": 79.43,
                "Ua": 233.62,
                "Ub": 234.05,
                "Uc": 233.55
            },
            {
                "Time": "2026-06-14 12:40:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.5,
                "TotW": 81.5,
                "Ua": 233.97,
                "Ub": 234.15,
                "Uc": 233.76
            },
            {
                "Time": "2026-06-14 12:45:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 79.45,
                "TotW": 79.45,
                "Ua": 233.76,
                "Ub": 234.38,
                "Uc": 233.59
            },
            {
                "Time": "2026-06-14 12:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.56,
                "TotW": 79.56,
                "Ua": 233.52,
                "Ub": 233.41,
                "Uc": 233.32
            },
            {
                "Time": "2026-06-14 12:55:00",
                "Ia": 0.2,
                "Ib": 0.2,
                "Ic": 0.19,
                "Load": 95.88,
                "TotW": 95.88,
                "Ua": 233.17,
                "Ub": 233.89,
                "Uc": 232.83
            },
            {
                "Time": "2026-06-14 13:00:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 83.05,
                "TotW": 83.05,
                "Ua": 233.44,
                "Ub": 233.89,
                "Uc": 233.71
            },
            {
                "Time": "2026-06-14 13:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 77.55,
                "TotW": 77.55,
                "Ua": 234.38,
                "Ub": 234.26,
                "Uc": 234.37
            },
            {
                "Time": "2026-06-14 13:10:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.62,
                "TotW": 81.62,
                "Ua": 234.01,
                "Ub": 233.76,
                "Uc": 233.89
            },
            {
                "Time": "2026-06-14 13:15:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 80.74,
                "TotW": 80.74,
                "Ua": 233.87,
                "Ub": 234.27,
                "Uc": 233.78
            },
            {
                "Time": "2026-06-14 13:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.97,
                "TotW": 81.97,
                "Ua": 234.05,
                "Ub": 233.94,
                "Uc": 234
            },
            {
                "Time": "2026-06-14 13:25:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.41,
                "TotW": 84.41,
                "Ua": 234.06,
                "Ub": 234.04,
                "Uc": 234.03
            },
            {
                "Time": "2026-06-14 13:30:00",
                "Ia": 0.18,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 81.03,
                "TotW": 81.03,
                "Ua": 233.94,
                "Ub": 234.28,
                "Uc": 233.75
            },
            {
                "Time": "2026-06-14 13:35:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.79,
                "TotW": 81.79,
                "Ua": 234.07,
                "Ub": 234.26,
                "Uc": 233.85
            },
            {
                "Time": "2026-06-14 13:40:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.09,
                "TotW": 79.09,
                "Ua": 234.07,
                "Ub": 234.2,
                "Uc": 233.75
            },
            {
                "Time": "2026-06-14 13:45:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.94,
                "TotW": 82.94,
                "Ua": 234.16,
                "Ub": 234.42,
                "Uc": 234.06
            },
            {
                "Time": "2026-06-14 13:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 77.63,
                "TotW": 77.63,
                "Ua": 234.3,
                "Ub": 234.79,
                "Uc": 234.38
            },
            {
                "Time": "2026-06-14 13:55:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.36,
                "TotW": 84.36,
                "Ua": 234.51,
                "Ub": 234.37,
                "Uc": 233.72
            },
            {
                "Time": "2026-06-14 14:00:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.15,
                "TotW": 82.15,
                "Ua": 234.8,
                "Ub": 234.88,
                "Uc": 234.87
            },
            {
                "Time": "2026-06-14 14:05:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 80.92,
                "TotW": 80.92,
                "Ua": 234.79,
                "Ub": 234.74,
                "Uc": 234.89
            },
            {
                "Time": "2026-06-14 14:10:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 78.57,
                "TotW": 78.57,
                "Ua": 234.67,
                "Ub": 234.52,
                "Uc": 234.56
            },
            {
                "Time": "2026-06-14 14:15:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 78.69,
                "TotW": 78.69,
                "Ua": 234.15,
                "Ub": 234.28,
                "Uc": 234.36
            },
            {
                "Time": "2026-06-14 14:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 80.73,
                "TotW": 80.73,
                "Ua": 234.01,
                "Ub": 234.22,
                "Uc": 233.34
            },
            {
                "Time": "2026-06-14 14:25:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 76.95,
                "TotW": 76.95,
                "Ua": 234.31,
                "Ub": 234.45,
                "Uc": 234.14
            },
            {
                "Time": "2026-06-14 14:30:00",
                "Ia": 0.2,
                "Ib": 0.2,
                "Ic": 0.19,
                "Load": 98.54,
                "TotW": 98.54,
                "Ua": 234.13,
                "Ub": 234.09,
                "Uc": 234.12
            },
            {
                "Time": "2026-06-14 14:35:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.85,
                "TotW": 82.85,
                "Ua": 234.25,
                "Ub": 234.37,
                "Uc": 234.5
            },
            {
                "Time": "2026-06-14 14:40:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 85.76,
                "TotW": 85.76,
                "Ua": 234.28,
                "Ub": 234.1,
                "Uc": 233.65
            },
            {
                "Time": "2026-06-14 14:45:00",
                "Ia": 0.18,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 81.2,
                "TotW": 81.2,
                "Ua": 234.54,
                "Ub": 233.97,
                "Uc": 234.39
            },
            {
                "Time": "2026-06-14 14:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 80.51,
                "TotW": 80.51,
                "Ua": 234.11,
                "Ub": 233.88,
                "Uc": 234.59
            },
            {
                "Time": "2026-06-14 14:55:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 78.15,
                "TotW": 78.15,
                "Ua": 234.19,
                "Ub": 234.38,
                "Uc": 234.46
            },
            {
                "Time": "2026-06-14 15:00:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.23,
                "TotW": 76.23,
                "Ua": 234.22,
                "Ub": 234.14,
                "Uc": 233.9
            },
            {
                "Time": "2026-06-14 15:05:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.61,
                "TotW": 82.61,
                "Ua": 234.15,
                "Ub": 234.36,
                "Uc": 234.16
            },
            {
                "Time": "2026-06-14 15:10:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.22,
                "TotW": 81.22,
                "Ua": 234.37,
                "Ub": 234.67,
                "Uc": 233.97
            },
            {
                "Time": "2026-06-14 15:15:00",
                "Ia": 0.19,
                "Ib": 0.19,
                "Ic": 0.18,
                "Load": 90.42,
                "TotW": 90.42,
                "Ua": 234.31,
                "Ub": 233.76,
                "Uc": 234.15
            },
            {
                "Time": "2026-06-14 15:20:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.24,
                "TotW": 76.24,
                "Ua": 233.59,
                "Ub": 234.21,
                "Uc": 233.99
            },
            {
                "Time": "2026-06-14 15:25:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 80.58,
                "TotW": 80.58,
                "Ua": 233.71,
                "Ub": 233.73,
                "Uc": 233.98
            },
            {
                "Time": "2026-06-14 15:30:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.5,
                "TotW": 81.5,
                "Ua": 234.05,
                "Ub": 234.43,
                "Uc": 234.08
            },
            {
                "Time": "2026-06-14 15:35:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 83.44,
                "TotW": 83.44,
                "Ua": 233.59,
                "Ub": 233.48,
                "Uc": 233.77
            },
            {
                "Time": "2026-06-14 15:40:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 83.22,
                "TotW": 83.22,
                "Ua": 233.89,
                "Ub": 233.71,
                "Uc": 233.71
            },
            {
                "Time": "2026-06-14 15:45:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 80.79,
                "TotW": 80.79,
                "Ua": 233.83,
                "Ub": 233.7,
                "Uc": 233.91
            },
            {
                "Time": "2026-06-14 15:50:00",
                "Ia": 0.18,
                "Ib": 0.19,
                "Ic": 0.17,
                "Load": 86.43,
                "TotW": 86.43,
                "Ua": 233.6,
                "Ub": 233.82,
                "Uc": 233.36
            },
            {
                "Time": "2026-06-14 15:55:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.81,
                "TotW": 84.81,
                "Ua": 233.85,
                "Ub": 234.11,
                "Uc": 233.55
            },
            {
                "Time": "2026-06-14 16:00:00",
                "Ia": 0.18,
                "Ib": 0.19,
                "Ic": 0.17,
                "Load": 86.97,
                "TotW": 86.97,
                "Ua": 233.8,
                "Ub": 234.06,
                "Uc": 234.15
            },
            {
                "Time": "2026-06-14 16:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 77.94,
                "TotW": 77.94,
                "Ua": 233.95,
                "Ub": 234.38,
                "Uc": 233.86
            },
            {
                "Time": "2026-06-14 16:10:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 77.54,
                "TotW": 77.54,
                "Ua": 233.81,
                "Ub": 233.94,
                "Uc": 233.97
            },
            {
                "Time": "2026-06-14 16:15:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 76.76,
                "TotW": 76.76,
                "Ua": 234.11,
                "Ub": 234.05,
                "Uc": 233.8
            },
            {
                "Time": "2026-06-14 16:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.49,
                "TotW": 82.49,
                "Ua": 234.44,
                "Ub": 234.65,
                "Uc": 234.41
            },
            {
                "Time": "2026-06-14 16:25:00",
                "Ia": 0.2,
                "Ib": 0.2,
                "Ic": 0.19,
                "Load": 98.48,
                "TotW": 98.48,
                "Ua": 234.4,
                "Ub": 234.87,
                "Uc": 234.03
            },
            {
                "Time": "2026-06-14 16:30:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 81.64,
                "TotW": 81.64,
                "Ua": 234.26,
                "Ub": 235.01,
                "Uc": 234.65
            },
            {
                "Time": "2026-06-14 16:35:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.14,
                "TotW": 82.14,
                "Ua": 234.66,
                "Ub": 235.25,
                "Uc": 235.02
            },
            {
                "Time": "2026-06-14 16:40:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 80.83,
                "TotW": 80.83,
                "Ua": 234.59,
                "Ub": 235,
                "Uc": 234.4
            },
            {
                "Time": "2026-06-14 16:45:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.31,
                "TotW": 82.31,
                "Ua": 234.27,
                "Ub": 234.26,
                "Uc": 234.09
            },
            {
                "Time": "2026-06-14 16:50:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.63,
                "TotW": 82.63,
                "Ua": 234.42,
                "Ub": 234.96,
                "Uc": 234.54
            },
            {
                "Time": "2026-06-14 16:55:00",
                "Ia": 0.18,
                "Ib": 0.19,
                "Ic": 0.18,
                "Load": 88.3,
                "TotW": 88.3,
                "Ua": 234.45,
                "Ub": 234.74,
                "Uc": 234.9
            },
            {
                "Time": "2026-06-14 17:00:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 83.69,
                "TotW": 83.69,
                "Ua": 234.97,
                "Ub": 235.03,
                "Uc": 234.79
            },
            {
                "Time": "2026-06-14 17:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 78.47,
                "TotW": 78.47,
                "Ua": 233.9,
                "Ub": 233.76,
                "Uc": 234.02
            },
            {
                "Time": "2026-06-14 17:10:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 78.59,
                "TotW": 78.59,
                "Ua": 234.26,
                "Ub": 234.24,
                "Uc": 233.81
            },
            {
                "Time": "2026-06-14 17:15:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 76.54,
                "TotW": 76.54,
                "Ua": 234.45,
                "Ub": 234.45,
                "Uc": 234.56
            },
            {
                "Time": "2026-06-14 17:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 80.91,
                "TotW": 80.91,
                "Ua": 234.15,
                "Ub": 234.28,
                "Uc": 234.18
            },
            {
                "Time": "2026-06-14 17:25:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.94,
                "TotW": 82.94,
                "Ua": 234.04,
                "Ub": 234.81,
                "Uc": 233.66
            },
            {
                "Time": "2026-06-14 17:30:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 79.09,
                "TotW": 79.09,
                "Ua": 234.23,
                "Ub": 233.8,
                "Uc": 234.41
            },
            {
                "Time": "2026-06-14 17:35:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.36,
                "TotW": 76.36,
                "Ua": 234.05,
                "Ub": 234.37,
                "Uc": 234.18
            },
            {
                "Time": "2026-06-14 17:40:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.05,
                "TotW": 76.05,
                "Ua": 233.77,
                "Ub": 233.5,
                "Uc": 233.63
            },
            {
                "Time": "2026-06-14 17:45:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.15,
                "TotW": 76.15,
                "Ua": 233.64,
                "Ub": 234.02,
                "Uc": 233.4
            },
            {
                "Time": "2026-06-14 17:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76,
                "TotW": 76,
                "Ua": 233.18,
                "Ub": 233.48,
                "Uc": 233.61
            },
            {
                "Time": "2026-06-14 17:55:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 77.97,
                "TotW": 77.97,
                "Ua": 233.3,
                "Ub": 233.77,
                "Uc": 232.98
            },
            {
                "Time": "2026-06-14 18:00:00",
                "Ia": 0.17,
                "Ib": 0.16,
                "Ic": 0.16,
                "Load": 74.29,
                "TotW": 74.29,
                "Ua": 233.6,
                "Ub": 233.49,
                "Uc": 233.52
            },
            {
                "Time": "2026-06-14 18:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.32,
                "TotW": 76.32,
                "Ua": 233.42,
                "Ub": 233.77,
                "Uc": 233.49
            },
            {
                "Time": "2026-06-14 18:10:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.02,
                "TotW": 76.02,
                "Ua": 233.35,
                "Ub": 233.11,
                "Uc": 233.51
            },
            {
                "Time": "2026-06-14 18:15:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.07,
                "TotW": 76.07,
                "Ua": 233.15,
                "Ub": 233.54,
                "Uc": 233.43
            },
            {
                "Time": "2026-06-14 18:20:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.17,
                "Load": 80.19,
                "TotW": 80.19,
                "Ua": 233.15,
                "Ub": 232.99,
                "Uc": 233.36
            },
            {
                "Time": "2026-06-14 18:25:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 82.27,
                "TotW": 82.27,
                "Ua": 232.83,
                "Ub": 232.88,
                "Uc": 232.74
            },
            {
                "Time": "2026-06-14 18:30:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.83,
                "TotW": 84.83,
                "Ua": 233.01,
                "Ub": 232.96,
                "Uc": 232.93
            },
            {
                "Time": "2026-06-14 18:35:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.18,
                "Load": 85.04,
                "TotW": 85.04,
                "Ua": 233.22,
                "Ub": 232.67,
                "Uc": 233.32
            },
            {
                "Time": "2026-06-14 18:40:00",
                "Ia": 0.19,
                "Ib": 0.19,
                "Ic": 0.17,
                "Load": 87.88,
                "TotW": 87.88,
                "Ua": 233.45,
                "Ub": 234.01,
                "Uc": 233.1
            },
            {
                "Time": "2026-06-14 18:45:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 85.53,
                "TotW": 85.53,
                "Ua": 233.6,
                "Ub": 233.67,
                "Uc": 233
            },
            {
                "Time": "2026-06-14 18:50:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.82,
                "TotW": 84.82,
                "Ua": 233.51,
                "Ub": 233.93,
                "Uc": 233.6
            },
            {
                "Time": "2026-06-14 18:55:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.21,
                "TotW": 84.21,
                "Ua": 233.57,
                "Ub": 234.04,
                "Uc": 233.28
            },
            {
                "Time": "2026-06-14 19:00:00",
                "Ia": 0.2,
                "Ib": 0.2,
                "Ic": 0.2,
                "Load": 98.43,
                "TotW": 98.43,
                "Ua": 233.48,
                "Ub": 233.77,
                "Uc": 233.75
            },
            {
                "Time": "2026-06-14 19:05:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.18,
                "Load": 83.77,
                "TotW": 83.77,
                "Ua": 233.38,
                "Ub": 233.27,
                "Uc": 233.38
            },
            {
                "Time": "2026-06-14 19:10:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.18,
                "Load": 85.92,
                "TotW": 85.92,
                "Ua": 233.46,
                "Ub": 233.36,
                "Uc": 233.6
            },
            {
                "Time": "2026-06-14 19:15:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.18,
                "Load": 86.57,
                "TotW": 86.57,
                "Ua": 233.22,
                "Ub": 233,
                "Uc": 233.4
            },
            {
                "Time": "2026-06-14 19:20:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 85.97,
                "TotW": 85.97,
                "Ua": 233.55,
                "Ub": 233.87,
                "Uc": 232.86
            },
            {
                "Time": "2026-06-14 19:25:00",
                "Ia": 0.19,
                "Ib": 0.19,
                "Ic": 0.17,
                "Load": 87.95,
                "TotW": 87.95,
                "Ua": 233.39,
                "Ub": 233.86,
                "Uc": 233.34
            },
            {
                "Time": "2026-06-14 19:30:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.18,
                "Load": 85.97,
                "TotW": 85.97,
                "Ua": 232.77,
                "Ub": 232.79,
                "Uc": 232.85
            },
            {
                "Time": "2026-06-14 19:35:00",
                "Ia": 0.18,
                "Ib": 0.19,
                "Ic": 0.18,
                "Load": 87.69,
                "TotW": 87.69,
                "Ua": 232.56,
                "Ub": 232.75,
                "Uc": 232.88
            },
            {
                "Time": "2026-06-14 19:40:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.07,
                "TotW": 84.07,
                "Ua": 232.64,
                "Ub": 232.68,
                "Uc": 232.14
            },
            {
                "Time": "2026-06-14 19:45:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 86.2,
                "TotW": 86.2,
                "Ua": 232.72,
                "Ub": 232.78,
                "Uc": 232.57
            },
            {
                "Time": "2026-06-14 19:50:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 85.87,
                "TotW": 85.87,
                "Ua": 232.36,
                "Ub": 233.24,
                "Uc": 232.25
            },
            {
                "Time": "2026-06-14 19:55:00",
                "Ia": 0.18,
                "Ib": 0.18,
                "Ic": 0.17,
                "Load": 84.07,
                "TotW": 84.07,
                "Ua": 232.01,
                "Ub": 232.37,
                "Uc": 232.1
            },
            {
                "Time": "2026-06-14 20:00:00",
                "Ia": 0.17,
                "Ib": 0.18,
                "Ic": 0.16,
                "Load": 77.17,
                "TotW": 77.17,
                "Ua": 232.04,
                "Ub": 232.71,
                "Uc": 231.74
            },
            {
                "Time": "2026-06-14 20:05:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 74.58,
                "TotW": 74.58,
                "Ua": 231.95,
                "Ub": 232.49,
                "Uc": 231.62
            },
            {
                "Time": "2026-06-14 20:10:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 77.73,
                "TotW": 77.73,
                "Ua": 231.88,
                "Ub": 232.14,
                "Uc": 232.26
            },
            {
                "Time": "2026-06-14 20:15:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.19,
                "TotW": 76.19,
                "Ua": 231.96,
                "Ub": 232.1,
                "Uc": 231.86
            },
            {
                "Time": "2026-06-14 20:20:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.12,
                "TotW": 76.12,
                "Ua": 232.43,
                "Ub": 232.49,
                "Uc": 232.43
            },
            {
                "Time": "2026-06-14 20:25:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.93,
                "TotW": 75.93,
                "Ua": 232.52,
                "Ub": 232.89,
                "Uc": 232.34
            },
            {
                "Time": "2026-06-14 20:30:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.94,
                "TotW": 75.94,
                "Ua": 232.47,
                "Ub": 232.53,
                "Uc": 232.6
            },
            {
                "Time": "2026-06-14 20:35:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.63,
                "TotW": 76.63,
                "Ua": 232.72,
                "Ub": 232.73,
                "Uc": 232.46
            },
            {
                "Time": "2026-06-14 20:40:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.61,
                "TotW": 75.61,
                "Ua": 232.53,
                "Ub": 232.8,
                "Uc": 232.24
            },
            {
                "Time": "2026-06-14 20:45:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.61,
                "TotW": 76.61,
                "Ua": 232.67,
                "Ub": 232.63,
                "Uc": 232.59
            },
            {
                "Time": "2026-06-14 20:50:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 75.68,
                "TotW": 75.68,
                "Ua": 232.66,
                "Ub": 232.93,
                "Uc": 233.04
            },
            {
                "Time": "2026-06-14 20:55:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.07,
                "TotW": 76.07,
                "Ua": 232.72,
                "Ub": 233.18,
                "Uc": 232.91
            },
            {
                "Time": "2026-06-14 21:00:00",
                "Ia": 0.17,
                "Ib": 0.17,
                "Ic": 0.16,
                "Load": 76.1,
                "TotW": 76.1,
                "Ua": 232.85,
                "Ub": 233.23,
                "Uc": 232.66
            },
            {
                "Time": "2026-06-14 21:05:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.03,
                "Ub": 233.54,
                "Uc": 233.94
            },
            {
                "Time": "2026-06-14 21:10:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.14,
                "Ub": 234.34,
                "Uc": 233.94
            },
            {
                "Time": "2026-06-14 21:15:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 233.82,
                "Ub": 234.22,
                "Uc": 234.37
            },
            {
                "Time": "2026-06-14 21:20:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.39,
                "Ub": 234.06,
                "Uc": 234.65
            },
            {
                "Time": "2026-06-14 21:25:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.12,
                "Ub": 233.49,
                "Uc": 234.38
            },
            {
                "Time": "2026-06-14 21:30:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.39,
                "Ub": 234.54,
                "Uc": 234.8
            },
            {
                "Time": "2026-06-14 21:35:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 233.97,
                "Ub": 233.75,
                "Uc": 234.28
            },
            {
                "Time": "2026-06-14 21:40:00",
                "Ia": 0,
                "Ib": 0,
                "Ic": 0,
                "Load": 0,
                "TotW": 0,
                "Ua": 234.02,
                "Ub": 234.05,
                "Uc": 234.04
            }
        ]
    }
}
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