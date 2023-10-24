import React, { useEffect, useState, useRef ,useMemo} from 'react'
import {useSelector,useDispatch  } from 'react-redux'
import {getRoomId} from "@redux/systemconfig";
import {nanoid} from '@reduxjs/toolkit'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Divider, Form, Image, Radio,Select} from 'antd'

import { drawEcharts } from "@com/useEcharts"
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'

import imgurl from './icon'
import imglist from '@imgs/index.js'
const echarts = require('echarts')
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-columns: 366px 850px 432px; 
  column-gap: 16px;
  justify-content: flex-end;
  .left {
    display: grid;
    grid-template-rows: 416px 368px;
    row-gap: 16px;
    .detail{
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      text-align:center;
      span{
        font-size:16px;
        color: #333;
        line-height: 32px;
      }
      p{
        color: #999999
      }
    }
    .plist {
      .listItem{
        color: #999;
        display: flex;
        align-items:center;
        padding: 12px 0;
        border-bottom: 1px dashed #E4E4E4;
        .icons{
        width: 42px;
        height: 42px;
        background-color: #237AE4;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items:center;
        margin-right: 16px;
       }
       .valnum{
        margin-left: auto;
        font-size:18px;
        color: #515151;
      }
      }
      
    }
  }
  .middle {
    display: grid;
    grid-template-rows: 256px 256px 256px;
    row-gap: 16px;
   

  }

 .right{
    display: grid;
    grid-template-rows: 368px 416px;
    row-gap: 16px;
    .list{
      display: flex;
    }
    .levelval{
        width: 22px;
        height: 22px;
        border:1px solid #ff0000;
        color: #ff0000;
        text-align: center;
        line-height:22px;
        border-radius:50%;
        margin-left: 12px;
      }
    .warncard{  
      position: absolute;
      left: 0;
      top: 48px;
      width: 100%;
      height: 64px;
      padding:0 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 12px;
      background-color: #f9fafc;
      border-bottom: 1px solid #e4e4e4;
      .warnhead{ 
        span:nth-of-type(2){
          padding-left: 16px;
        }
      }
      .warncontent{
        display: flex;
        align-items: center;
        padding-bottom: 8px;
        .tag{
          width: 53px;
          height: 19px;
          background-color: #f44336;
          border-radius: 8px;
          color: #fff;
          text-align: center;
          line-height: 19px;
      }
      .warnval{
            width: 104px;
            height: 22px;
            background: #ffeeee;
            color: #fa5589;
            border: 1px solid #fdbbbb;
            line-height: 22px;
            margin-left: auto;
            text-align: center;
          }
    }
 }
    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: 100%;    
      .cl {
        display: flex;
        align-items: center;
        color:#515151;
        font-size: 32px;
        font-weight: bold;
      }
    }
    }`

   

const gauge = {
 
    radius: '85%',
    legend: {
      top: 'auto',
      bottom: 0,
      icon: 'none',
      formatter: function (name) {
      },   
    },
    tooltip: {
      trigger: 'item'
    },
    grid: {
       left: 0,
       right: 0,
       top: 0,
       bottom: 0,
       containLabel: true,
    },
    series: [ 
      {
        title: {
  
        },
        name: '实时负荷率',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [
          {
            value: 65.2,
            name: '负荷率%'
          }
        ],
      }
    ]
  }

const defaultColor=['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
const trendopts={
  color:['#5D91F9',...defaultColor],
  grid:{
    top: 20,
    right: 0,
    bottom: 20,
    left: '5%'
  },
  xAxis: {
    type: 'category',
    axisLine:{
      lineStyle:{
        color:"#D8D8D8",
      }
    },
    axisLabel:{
      color:"#333"
    },
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value',
    scale: true,
    
  },
  series: [
    {
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}
const uselopts= {
  grid:{
    top: 20,
    right: 0,
    bottom: 20,
    left: '5%'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};
export default function Index() {
  const [form] = Form.useForm()

  const guref = useRef(null)
  const trendRef =useRef(null)
  const trendPreRef=useRef(null)
  const useElRef=useRef(null)
  const dispatch =useDispatch()
  // const roomId =useSelector(state=>state.system.roomId)
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]

  const [roomlist,setRoomList]=useState([])
  const [value, setValue] = useState('1') 
  const onChange = ({target: {value}}) => {
    setValue(value)
  }
  const changeArea=()=>{

  }
 
  const select=(<Select style={{
    width: 120,
  }} options={[
    {
      value: 'jack',
      label: 'Jack',
    },
    {
      value: 'lucy',
      label: 'Lucy',
    },
    {
      value: 'Yiminghe',
      label: 'yiminghe',
    },
    {
      value: 'disabled',
      label: 'Disabled',
      disabled: true,
    },
  ]}>
    
  </Select>)
  const leveldom=(
    <div className='list'>
      <span>告警等级</span>
      <div className='levelval'>1</div>
      <div className='levelval'>2</div>
      <div className='levelval'>3</div>
    </div>
  )
  const statetrans = (
    <div className='listItem'>
      <div className='icons'>
      <img src={imglist.pylon}></img>
      </div>
      <span >配电房容量(kVA)</span>
      <div className='valnum'>8000</div>
    </div>
  )
  const stateList =[statetrans,statetrans,statetrans]

  const warnitem = (
      <div className='warncard'>
          <div className='warnhead'>
            <span>09-01 21:10:02</span>
            <span>01#T5变压器哦</span> 
          </div>
          <div className='warncontent'>
              <div className='tag'>越限</div>
              <div className='levelval'>1</div>
              <div style={{marginLeft:12}}>A相电流过流</div>
              <div className='warnval'>68.12A</div>
          </div>
      </div>
  )
  const getRoomList =async (projectId,roomId)=>{
    const resp = await distributionRoom.RoomList(projectId,roomId)
    if(resp.success){
      console.log(resp)
      dispatch(getRoomId(resp.data))
      
      setRoomList(resp.data)
      form.setFieldValue('roomId',resp.data[0][['id']])
    }
  }
  useEffect(() => {
    
    drawEcharts(guref.current,  {...gauge, type: 2})
    drawEcharts(trendRef.current,{...trendopts,type:2})
    drawEcharts(trendPreRef.current,{...trendopts,type:2})
    drawEcharts(useElRef.current,{...uselopts,type:2}) 
  })
  useEffect(()=>{
    getRoomList(projectId,areaOptions[0].id)
  },[roomlist.length])
  return (
    <CustContext.Provider value={{form}}>
      <Pagecount bgcolor="#eeeff3" pd="0px">  
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
        <Mainbox>
         <div className='left'>
             <Titlelayout title={'实时负荷率'}  >
                 <div ref={guref} style={{height: '350px'}}></div> 
                 <div className='detail'>
                  <span>本月最大负荷率：89.2%</span>
                  <p>发生时间:2023-5-11 12:32:12</p>
                 </div>
             </Titlelayout>
           
             <Titlelayout title={'配电房信息'}>
                 <div className='plist'>
                    {stateList}
                 </div>       
             </Titlelayout>
         </div>

         <div className='middle'>
         <Titlelayout title={'负荷趋势(kW)'}  >
          <div ref={trendRef} style={{height:'100%'}}></div>
         </Titlelayout>
         <Titlelayout title={'负荷率趋势(%)'}  >
          <div ref={trendPreRef} style={{height:'100%'}}></div>
         </Titlelayout>
         <Titlelayout title={'用电量趋势(kWh)'}  >
          <div ref={useElRef} style={{height:'100%'}}></div>
         </Titlelayout>
         </div>
         <div className='right'>
         <Titlelayout title={'配电房监控'} extra={select} ></Titlelayout>
         <Titlelayout title={'最新告警'} extra={leveldom} >
            {warnitem}
         </Titlelayout>
         </div>
         </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
