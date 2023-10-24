import React, { useEffect ,useMemo, useState,useRef} from 'react'
import {useSelector,useDispatch  } from 'react-redux'
import style from './style.module.less'
import { Select, Button, DatePicker,Divider,Form } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import * as echarts from "echarts";
import updateImg from './updateImg.png'
import ItemCard from './itemCard'
import BlueColumn from '@com/bluecolumn'
import styled from 'styled-components'
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
]
}
export default function Index() {
  const [form]=Form.useForm()
  const {Option} = Select;
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state => state.system.onelevel)
  const roomlist =useSelector(state=>state.system.roomId)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]
  const lineChartRef =useRef(null)
  const [envlist,setEnvList]=useState({
    door:"",
    fire:"",
    humidness:"",
    noise:"",
    smoke:"",
    temperature:"",
    water:""
  })
  const changeArea=()=>{

  }
  const getEnvironment=async(roomId)=>{
    const res = await DistributionRoomRuntime.GetEnvironment(projectId,roomId)
    if(res.success){
      setEnvList(res.data)
    }else{
      message.error(res.errMsg)
    }
  }
  useEffect(()=>{
    if(roomlist.length>0){
      getEnvironment(roomlist[0].id)
    }
    
  },[])
  useEffect( ()=>{
    let lineChart1 = echarts.init(document.getElementById('lineChart'));
    let opt1 = structuredClone(opt)
    opt1.series=[{
      name: '温度',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [26.3, 26.4, 26.2, 27.1, 28.4, 29.1, 29.4, 29.3, 30.3, 27.5, 26.4, 25.4],
  }]
    lineChart1.setOption(opt1)
    let lineChart2=echarts.init(lineChartRef.current)
    let opt2 = structuredClone(opt)
    opt2.series=[{
      name: '湿度',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [56.3, 51.3, 56.6, 57.4, 56.4, 58.6, 59.4, 56.3, 54.3, 54.2, 53.2, 56.7],
  }]
    lineChart2.setOption(opt2)
} )
  return (
    <div>
       <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout="inline"
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length>0?0:null}></Select>
            </Form.Item>
            <Form.Item>
            <Divider dashed type="vertical" style={{borderColor: "#999",height:'30px'}}></Divider>
            </Form.Item>
           <Form.Item name="roomId" >
              <Select  
              options={roomlist} 
              fieldNames={{ label: 'name', value: 'id' }}
              style={{ width: 240 }} 
              placeholder="请选择配电房"></Select>
           </Form.Item>
          </Form>
        </div>
      <div className={style.content}>
        <div className={style.topContent}>
          {/* <div className={style.topTitle}>环境温湿度</div> */}
          <div className={style.topheader}>
          <BlueColumn name="环境温湿度" styled={{padding: '16px 0 0 16px'}}/>
          <div className={style.searchDiv}>
            <span >日期</span>
            <DatePicker  size='middle' style={{marginLeft:16,marginRight:16}}></DatePicker>
            <Button size='middle' type='primary' icon={<SearchOutlined />}>查询</Button>
          </div>
          </div>
          
          <div className={style.lineChart} id='lineChart'></div>
          <div className={style.lineChart} ref={lineChartRef}></div>
        </div>
        <div className={style.bottomContent}>
          <BlueColumn name="环境监测" />
          <div className={style.cardflex}>
          <ItemCard title={'环境温度'} desc={'正常'} value={envlist.temperature} img="temperature"></ItemCard>
          <ItemCard title={'环境湿度'} desc={'正常'} value={envlist.humidness} img="humidness"></ItemCard>
          <ItemCard title={'水浸监测'} desc={'无水'} value={envlist.water} img="water"></ItemCard>
          <ItemCard title={'烟感监测'} desc={'无烟'} value={envlist.smoke} img="smook"></ItemCard>
          <ItemCard title={'噪音监测'} desc={'正常'} value={envlist.noise} img="nosie"></ItemCard>
          <ItemCard title={'明火监测'} desc={'无明火'} value={envlist.fire} img="fire"></ItemCard>
          <ItemCard title={'门禁监控'} desc={'门关闭'} value={envlist.door} img="door"></ItemCard>
          </div>
         
        </div>
      </div>
    </div>
  )
}
