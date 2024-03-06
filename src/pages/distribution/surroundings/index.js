import React, { useEffect ,useMemo, useState,useRef} from 'react'
import {useSelector,useDispatch  } from 'react-redux'
import style from './style.module.less'
import {  Button, DatePicker,message,Space  } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import Pagecount from '@com/pagecontent'
import Titlelayout from '@com/titlelayout' 
import ItemCard from './itemCard'
import BlueColumn from '@com/bluecolumn'
import { selectcurlRommid } from "@redux/systemconfig";
import styled from 'styled-components'
import moment from 'moment';
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import { drawEcharts } from "@com/useEcharts";
import {SerachButton} from '@com/useButton'
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 448px 1fr;
  column-gap: 16px;
  .chart {
    flex: 1;
    display: grid;
    grid-template-rows: 1fr 1fr;
  }
`
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
    try {
      const day =  dateval.format('YYYY MM DD 00:00:00')
      const resp =   await DistributionRoomRuntime.EnvironmentTrend({projectId,roomId,day})
     if(resp.success){
        setEnvList(resp?.data?.environmentVo || {})
        setHumidness(resp?.data?.humidityTrends || [])
        setTemperature(resp?.data?.tempTrends || [])
     }else{
       message.error(resp.errMsg)
     }
    } catch (error) {
      
    }
  
}
  const tempref = useRef();
  useEffect(()=>{
   if(roomId && projectId) EnvironmentTrend()
  },[roomId, projectId])
  useEffect( ()=>{
    drawEcharts(tempref.current, {
      dataset: {
       dimensions: [
         {
           name: 'x',
           displayName: '时间'
         },
         {
           name: 'y',
           displayName: '温度(℃)'
         }
       ],
        source: Array.isArray(temperature) ? temperature : [],

      },
     dataZoom: {
       type: 'inside'
     },
     xAxis: {
       axisLabel: {
          formatter: (value, index) => {
              return moment(value, "YYYY-MM-DD hh:mm:ss").format("hh:mm")
          }
       }
     },
      series: [{type: 'line'}]
      
   })
   drawEcharts(lineChartRef.current, {
    dataset: {
     dimensions: [
       {
         name: 'x',
         displayName: '时间'
       },
       {
         name: 'y',
         displayName: '湿度(RH)'
       }
     ],
      source: Array.isArray(humidness) ? humidness : [],

    },
   dataZoom: {
     type: 'inside'
   },
   xAxis: {
     axisLabel: {
        formatter: (value, index) => {
            return moment(value, "YYYY-MM-DD hh:mm:ss").format("hh:mm")
        }
     }
   },
    series: [{type: 'line'}]
    
 }) 

   
},[humidness,temperature] )
  return (
    <Pagecount>    
      <Mainbox>
        <Titlelayout layout="flex" pv="0" bordered="n"  title={<div style={{display: 'flex',justifyContent: 'space-between', alignItems: 'center'}}>
           <span>环境温湿度</span>
           <Space>
           <span >日期</span>
            <DatePicker  size='middle'  value={dateval} onChange={changeTime}></DatePicker>
            <SerachButton   onClick={search} /> 
           </Space>
        </div>}>
        
           <div className='chart'>
           
          
          <div className={style.lineChart} ref={tempref}></div>
          <div className={style.lineChart} ref={lineChartRef}></div>
           </div>
        </Titlelayout>
        <div className={style.bottomContent}>
          <BlueColumn name="环境监测" />
          <div className={style.cardflex}>
          <ItemCard title={'环境温度'} desc={envlist.temperature?'正常':'异常'} value={envlist.temperature} img="temperature"></ItemCard>
          <ItemCard title={'环境湿度'} desc={envlist.humidness?'正常':'异常'} value={envlist.humidness} img="humidness"></ItemCard>
          <ItemCard title={'水浸监测'} desc={envlist.water?'正常':'异常'} value={envlist.water} img="water"></ItemCard>
          <ItemCard title={'烟感监测'} desc={envlist.smoke?'正常':'异常'} value={envlist.smoke} img="smook"></ItemCard>
          <ItemCard title={'噪音监测'} desc={envlist.noise?'正常':'异常'} value={envlist.noise} img="nosie"></ItemCard>
          <ItemCard title={'明火监测'} desc={envlist.fire?'正常':'异常'} value={envlist.fire} img="fire"></ItemCard>
          <ItemCard title={'门禁监控'} desc={envlist.door?'正常':'异常'} value={envlist.door} img="door"></ItemCard>
          </div>
         
        </div>
      </Mainbox>
    </Pagecount>
  )
}
