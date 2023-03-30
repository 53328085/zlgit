import React, { useEffect, useState, useRef, useMemo } from 'react'

import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Form, Image, message, Progress, Select } from 'antd'
//import {Map, Marker, Circle, NavigationControl, InfoWindow, CityListControl, MapTypeControl, ScaleControl, ZoomControl} from 'react-bmapgl';
import { drawEcharts } from "@com/useEcharts";
import { useSelector } from 'react-redux'
// import Mapcom from '@com/useMap'
import BlueColumn from '@com/bluecolumn'
import first from './imgs/first.png'
import second from './imgs/second.png'
import third from './imgs/third.png'
import total from './imgs/total.png'
import { operation } from '@api/api'
import Map,{EmptyMap} from './mapcomp'

const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-columns: 880px 1fr;
  column-gap: 16px;
  justify-content: flex-end;
  height:823px;
  .left {   
    display: grid;
    grid-template-rows: 60px 1fr ;
    .title{}
    .map{}
    overflow: hidden;
    border:1px solid #d7d7d7;
    
  }
  .rigth {
    display: grid;
    grid-template-columns: repeat(3, 248px);
    grid-template-rows: 160px 320px 1fr;
    gap: 16px;
    .mc {
      grid-area: 2 / 1 / 3 /4;
      display: grid;
      grid-template-rows:20px 270px;
      .chart {
         display: grid;
         grid-template-columns:742px;
         grid-template-rows: minmax(270px, auto);
         justify-content: space-between;
      }
    }
    .down {
      grid-area: 3 / 1 / 4 /4;
      display: grid;
      grid-template-rows:20px 1fr;
      .chart {
        min-height: 240px;
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
        padding-left:20px;
        color:#515151;
        font-size: 24px;
        font-weight: bold;
      }
    }
    .list {
      display: grid;
      grid-auto-rows: 26px;
      align-items: flex-start;
      align-content: flex-end;
      div {
        display: flex;
        justify-content: space-between;
        &:nth-of-type(1) span:first-child{
          color: #ff3333;
        }
        &:nth-of-type(2) span:first-child{
          color: #ff6600;
        }
        &:nth-of-type(3) span:first-child{
          color: #009900;
        }
  }

  }
`



/* const Mapcom = () =>  {
  const option = {
   // mapType: 'earth',
    center: {lng: 120.228166, lat: 30.212296},
    zoom: 12,
    enableScrollWheelZoom: true, // 鼠标滚轮缩放
   // tilt: 20,
    enableDragging: true,
   // enableRotate: false
  }
  return (
  <Map  style={{height: '100%', width: '100%'}}  {...option} >
    <Marker position={{lng:120.228177, lat:30.212296}} /> 
    <NavigationControl /> 
    <CityListControl/>
    <MapTypeControl/>
    <ScaleControl/>
    <ZoomControl/>
  </Map>
  )
} */

export default function Index() {
  const [form] = Form.useForm()
  const bref = useRef(null)
  // const pref = useRef(null)
  const lref = useRef(null)
  const [areavalue, setAreavalue] = useState(0)
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]
  const [warn, setWarn] = useState()//当前告警
  const [allwarn, setAllwarn] = useState() //本月告警
  const [order, setOrder] = useState() //工单
  const [task,setTask]=useState()//巡检任务
  const [datasetMonth,setDatasetMonth] =useState() //派单
  const [datasetMonthl,setDatasetMonthl]=useState()//告警事件
  const [alarmPosition,setAlarmPosition] =useState()
  let params = {
    projectId,
    areaId: areavalue
  }
  const imgcss = {
    width: 32,
    height: 32,
  }
  const grid = {
    // 图表 grid
    left: "0px",
    right: "0",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  }
  // const datasetMonth = {
  //   dimensions: ["time", "派单数", "完成"],
  //   source: [
  //     { time: "1", "派单数": 5600, "完成": 9600 },
  //     { time: "2", "派单数": 4600, "完成": 3644 },
  //     { time: "3", "派单数": 3600, "完成": 4644 },
  //     { time: "4", "派单数": 5611, "完成": 9655 },
  //     { time: "5", "派单数": 5644, "完成": 3677 },
  //     { time: "6", "派单数": 4677, "完成": 3633 },
  //     { time: "7", "派单数": 3688, "完成": 4655 },
  //     { time: "8", "派单数": 5088, "完成": 2644 },
  //     { time: "9", "派单数": 6677, "完成": 2641 },
  //     { time: "10", "派单数": 5866, "完成": 5641 },
  //     { time: "11", "派单数": 4677, "完成": 7645 },
  //     { time: "12", "派单数": 1877, "完成": 2645 },
  //   ],
  // };
  // const datasetMonthl = {
  //   dimensions: ["time", "本月", "上月"],
  //   source: [
  //     { time: "1", "本月": 5600, "上月": 9600 },
  //     { time: "2", "本月": 4600, "上月": 3644 },
  //     { time: "3", "本月": 3600, "上月": 4644 },
  //     { time: "4", "本月": 5611, "上月": 9655 },
  //     { time: "5", "本月": 5644, "上月": 3677 },
  //     { time: "6", "本月": 4677, "上月": 3633 },
  //     { time: "7", "本月": 3688, "上月": 4655 },
  //     { time: "8", "本月": 5088, "上月": 2644 },
  //     { time: "9", "本月": 6677, "上月": 2641 },
  //     { time: "10", "本月": 5866, "上月": 5641 },
  //     { time: "11", "本月": 4677, "上月": 7645 },
  //     { time: "12", "本月": 1877, "上月": 2645 },
  //   ],
  // };
  // const pieData = [
  //   { value: 30.4, name: "已完成" },
  //   { value: 25.7, name: "未分派" },
  //   { value: 25.6, name: "处理中" },
  // ];
  //改变区域
  const changeArea = (v) => {
    console.log(v)
    setAreavalue(v)
  }
  //获取当前告警
  const getAlarmCurrent = async () => {
    try {
      const { data: { all, one, two, three, alarmPosition }, errMsg, success } = await operation.AlarmCurrent(params)
      if (success) {
        setWarn({ all, one, two, three })
        setAlarmPosition(alarmPosition)
      } else {
        message.error(errMsg)
      }
    } catch (e) {
      console.log(e)
    }


  }
  //获取当月告警
  const getAlarmMonth = async () => {
    try {
      const { data: { all, one, two, three, alarmPosition }, errMsg, success } = await operation.AlarmMonth(params)
      if (success) {
        setAllwarn({ all, one, two, three })
      } else {
        message.error(errMsg)
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取本月工单
  const getMonthOrderStatistics = async () => {
    try {
      const {data: { all, wait, process, finish}, errMsg, success} = await operation.MonthOrderStatistics(params)
      if (success) {
        setOrder({all, wait, process, finish})
      } else {
        message.error(errMsg)
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取巡检任务
  const getInspectionStatistics=async()=>{
    try {
      const {data: { all, wait, process, finish}, errMsg, success} = await operation.InspectionStatistics(params)
      if (success) {
        setTask({all, wait, process, finish})
      } else {
        message.error(errMsg)
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取本月派单
  const getMonthOrderTrend =async()=>{
    const res =await operation.MonthOrderTrend(params)
    if(res.success){
      const {all ,finish} =res.data
      let data = all.map((item,index)=>{
        return {
          x:item.x,
          '派单数':item.y,
          '完成':finish[index].y
        }
      })
      setDatasetMonth({dimensions:['x','派单数','完成'],source:[...data]})
    }else{
      message.error(res.errMsg)
    }
  }
  //本月告警
  const getMonthAlarmTrend=async ()=>{
    const res =await operation.MonthAlarmTrend(params)
    if(res.success){
      const {currentMonth ,lastMonth} =res.data
      let arr=[]
      if(currentMonth.length-lastMonth.length>0){
        arr=[...currentMonth]
      }else{
        arr=[...lastMonth]
      }
      let data = arr.map((item,index)=>{
        return {
          x:item.x,
          '本月':item.y,
          '上月':lastMonth[index]?.y
        }
      })
      setDatasetMonthl({dimensions:['x','本月','上月'],source:[...data]})
    }else{
      message.error(res.errMsg)
    }
  }
  useEffect(() => {
    if(oneLevel.length>0){
      getAlarmCurrent()
      getAlarmMonth()
      getMonthOrderStatistics()
      getInspectionStatistics()
      getMonthOrderTrend()
      getMonthAlarmTrend()
    }
   
  }, [areavalue])
  useEffect(() => {
    drawEcharts(bref.current, {
      dataset: datasetMonth,
      series: [{ type: "bar" }, { type: "bar" }],
      grid,
      legend: {

        icon: 'rect',
        itemHeight: 8,
        itemWidth: 8,
        itemGap: 20
      }
    })
    // drawEcharts(pref.current, {
    //   pieData: { data: pieData, radius: '65%' }, type: 3, legend: {
    //     // Try 'horizontal'


    //   },
    // })
    drawEcharts(lref.current, {
      dataset: datasetMonthl,
      series: [{ type: "line" }, { type: "line" }],
      grid: {
        top: '20px',
        left: 0,
        right: 0,
        bottom: '30px',
        containLabel: true,
      },
      legend: {
        top: 'auto',
        bottom: 0,
        icon: 'rect',
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
      }
    })
  })
  return (
    <CustContext.Provider value={{ form }}>
      <Pagecount bgcolor="#eeeff3" pd={0}>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length>0?0:null}></Select>
            </Form.Item>
          </Form>

        </div>
        <Mainbox>
          <div className='left'>
            <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', background: '#fff' }}>
              <BlueColumn name="当前告警" />
              <div style={{ marginLeft: 'auto', padding: '0 8px', width: 600, height: 42, border: '1px solid #d7d7d7', borderRadius: 21, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <img src={total} alt="" style={imgcss} />
                <span>告警总数</span>
                <span style={{ fontWeight: 'bold' }}>{warn?.all}</span>
                <img src={first} alt="" style={imgcss} />
                <span>一级告警</span>
                <span style={{ fontWeight: 'bold' }}>{warn?.one}</span>
                <img src={second} alt="" style={imgcss} />
                <span>二级总数</span>
                <span style={{ fontWeight: 'bold' }}>{warn?.two}</span>
                <img src={third} alt="" style={imgcss} />
                <span>三级总数</span>
                <span style={{ fontWeight: 'bold' }}>{warn?.three}</span>
              </div>
            </div>

            {/* <Mapcom></Mapcom> */}
           {alarmPosition&&alarmPosition.length>0?<Map points={alarmPosition}></Map>:<EmptyMap/>} 
          </div>

          <div className='rigth'>
            <Titlelayout title="本月所有告警" pl="0px" bl="none" hv="20px">
              <div className='content'>
                <div className='cl'>{allwarn?.all}</div>
                <div className='list'>
                  <div>
                    <span>一级告警</span>
                    <span style={{ fontSize: 18 }}>{allwarn?.one}</span>
                  </div>
                  <div>
                    <span>二级告警</span>
                    <span style={{ fontSize: 18 }}>{allwarn?.two}</span>
                  </div>
                  <div>
                    <span>三级告警</span>
                    <span style={{ fontSize: 18 }}>{allwarn?.three}</span>
                  </div>
                </div>
              </div>
            </Titlelayout>
            <Titlelayout title="本月所有工单" pl="0px" bl="none" hv="20px">
              <div className='content'>
                <div className='cl'>{order?.all}</div>
                <div className='list'>

                  <div>
                    <span>待处理</span>
                    <span style={{ fontSize: 18 }}>{order?.wait}</span>
                  </div>
                  <div>
                    <span>处理中</span>
                    <span style={{ fontSize: 18 }}>{order?.process}</span>
                  </div>
                  <div>
                    <span>已完成</span>
                    <span style={{ fontSize: 18 }}>{order?.finish}</span>
                  </div>
                </div>
              </div>
            </Titlelayout>
            <Titlelayout title="巡检任务" pl="0px" bl="none" hv="20px">
              <div className='content'>
                <div className='cl'>{task?.all}</div>
                <div className='list'>

                  <div>
                    <span>待处理</span>
                    <span>{task?.wait}</span>
                  </div>
                  <div>
                    <span>处理中</span>
                    <span>{task?.process}</span>
                  </div>
                  <div>
                    <span>已完成</span>
                    <span>{task?.finish}</span>
                  </div>
                </div>
              </div>
            </Titlelayout>

            <Titlelayout className="mc" title="本月派单情况" pl="0px" bl="none" hv="20px">
              <div className='chart'>
                <div ref={bref}></div>
                {/* <div ref={pref}></div> */}
              </div>
            </Titlelayout>

            <Titlelayout className="down" title="本月告警事件" pl="0px" bl="none" hv="20px">
              <div className='chart' ref={lref}>

              </div>
            </Titlelayout>
          </div>
        </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
