import React, { useEffect ,useMemo, useState,useRef} from 'react'
import {useSelector,useDispatch  } from 'react-redux'
import style from './style.module.less'
import {  Button, DatePicker,message  } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import * as echarts from "echarts";
import updateImg from './updateImg.png'
import ItemCard from './itemCard'
import BlueColumn from '@com/bluecolumn'
import { selectcurlRommid } from "@redux/systemconfig";
import styled from 'styled-components'
import moment from 'moment';
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
const opt={
  color:['#6395f9', '#62daab', '#657798'],
  tooltip:{
      trigger: "axis",
      axisPointer: {
          type: "line",
      },
  },
  legend:{
      show: true,
      top: 10,
      icon:'roundRect',
      itemHeight:2,
      itemWidth:16,
  },
  grid:{
      left:10,
      top:50,
      right: 20,
      bottom: 15,
      containLabel: true
  },
  xAxis: {
  type: 'category',
  boundaryGap: false,
  data: ['0:00',"2:00", '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
  },
  yAxis: {
  type: 'value',
  },
  series: [
    {
      name: '温度',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [],
  }
]
}
const init ={
  door:"",
  fire:"",
  humidness:"",
  noise:"",
  smoke:"",
  temperature:"",
  water:""
}
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)
  const roomId = useSelector(selectcurlRommid)
  const lineChartRef =useRef(null)
  const [dateval,setDateVal] =useState(moment())
  const [envlist,setEnvList]=useState(init)
  const [humidness,setHumidness] =useState([])
  const [temperature,setTemperature] =useState([])
 
  const changeTime=(time)=>{
   
    setDateVal(time) 
   
  }
  const search=()=>{
    EnvironmentTrend()
  }
  
 

  const EnvironmentTrend = async()=>{
  const day =  dateval.format('YYYY MM DD 00:00:00')
  const resp =   await DistributionRoomRuntime.EnvironmentTrend({projectId,roomId,day})
  if(resp.success){
    setEnvList(resp.data.environmentVo)
    setHumidness(resp.data.humidityTrends)
    setTemperature(resp.data.tempTrends)
  }else{
    message.error(resp.errMsg)
  }
}
  useEffect(()=>{
   if(roomId && projectId) EnvironmentTrend()
  },[roomId, projectId])
  useEffect( ()=>{
    let lineChart1 = echarts.init(document.getElementById('lineChart'));
    let opt1 = structuredClone(opt)
    const x1 =temperature.map(it=>it.x)
    const y1 = temperature.map(it=>{
     return parseFloat(it.y)
    })
    opt1.xAxis.data = [...x1]
    opt1.series=[{
      ...opt1.series[0],
      name: '温度',
      data:[...y1] ,
  }]
    lineChart1.setOption(opt1)
    let lineChart2=echarts.init(lineChartRef.current)
    let opt2 = structuredClone(opt)
    const x2 =humidness.map(it=>it.x)
    const y2 = humidness.map(it=>{
     return parseFloat(it.y)
    })
    opt2.xAxis.data = [...x2]
    opt2.series=[{
      ...opt2.series[0],
      name: '湿度',
      data: [...y2],
  }]
    lineChart2.setOption(opt2)
},[humidness,temperature] )
  return (
    <div>    
      <div className={style.content}>
        <div className={style.topContent}>
          {/* <div className={style.topTitle}>环境温湿度</div> */}
          <div className={style.topheader}>
          <BlueColumn name="环境温湿度" styled={{padding: '16px 0 0 16px'}}/>
          <div className={style.searchDiv}>
            <span >日期</span>
            <DatePicker  size='middle' style={{marginLeft:16,marginRight:16}} value={dateval} onChange={changeTime}></DatePicker>
            <Button size='middle' type='primary' icon={<SearchOutlined />} onClick={search}>查询</Button>
          </div>
          </div>
          
          <div className={style.lineChart} id='lineChart'></div>
          <div className={style.lineChart} ref={lineChartRef}></div>
        </div>
        <div className={style.bottomContent}>
          <BlueColumn name="环境监测" />
          <div className={style.cardflex}>
          <ItemCard title={'环境温度'} desc={envlist.temperature?'正常':'异常'} value={envlist.temperature} img="temperature"></ItemCard>
          <ItemCard title={'环境湿度'} desc={envlist.humidness?'正常':'异常'} value={envlist.humidness} img="humidness"></ItemCard>
          <ItemCard title={'水浸监测'} desc={envlist.water?'无水':'异常'} value={envlist.water} img="water"></ItemCard>
          <ItemCard title={'烟感监测'} desc={envlist.smoke?'无烟':'异常'} value={envlist.smoke} img="smook"></ItemCard>
          <ItemCard title={'噪音监测'} desc={envlist.noise?'正常':'异常'} value={envlist.noise} img="nosie"></ItemCard>
          <ItemCard title={'明火监测'} desc={envlist.fire?'无明火':'异常'} value={envlist.fire} img="fire"></ItemCard>
          <ItemCard title={'门禁监控'} desc={envlist.door?'门关闭':'异常'} value={envlist.door} img="door"></ItemCard>
          </div>
         
        </div>
      </div>
    </div>
  )
}
