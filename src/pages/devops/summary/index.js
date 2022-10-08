import React, { useEffect, useState, useRef } from 'react'

import {nanoid} from '@reduxjs/toolkit'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form, Image, Progress} from 'antd'
//import {Map, Marker, Circle, NavigationControl, InfoWindow, CityListControl, MapTypeControl, ScaleControl, ZoomControl} from 'react-bmapgl';
import { drawEcharts } from "@com/useEcharts";

import  Mapcom from '@com/useMap'
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-columns: 880px 768px;
  column-gap: 16px;
  justify-content: flex-end;
  .left {   
    display: grid;
    grid-template-rows: 20px 716px ;
    .title{}
    .map{}
    overflow: hidden;
   
    
  }
  .rigth {
    display: grid;
    grid-template-columns: repeat(3, 248px);
    grid-template-rows: 160px 320px 264px;
    gap: 16px;
    .mc {
      grid-area: 2 / 1 / 3 /4;
      display: grid;
      grid-template-rows:20px 270px;
      .chart {
         display: grid;
         grid-template-columns: 440px 280px;
         grid-template-rows: minmax(270px, auto);
         justify-content: space-between;
      }
    }
    .down {
      grid-area: 3 / 1 / 4 /4;
      display: grid;
      grid-template-rows:20px 1fr;
      .chart {
        min-height: 210px;
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
  const pref = useRef(null)
  const lref = useRef(null)
  const grid = {
    // 图表 grid
    left: "0px",
    right: "0",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  }
  const datasetMonth = {
    dimensions: ["time", "派单数", "完成"],
    source: [
      { time: "1", "派单数": 5600, "完成": 9600 },
      { time: "2", "派单数": 4600, "完成": 3644 },
      { time: "3", "派单数": 3600, "完成": 4644 },
      { time: "4", "派单数": 5611, "完成": 9655 },
      { time: "5", "派单数": 5644, "完成": 3677 },
      { time: "6", "派单数": 4677, "完成": 3633 },
      { time: "7", "派单数": 3688, "完成": 4655 },
      { time: "8", "派单数": 5088, "完成": 2644 },
      { time: "9", "派单数": 6677, "完成": 2641 },
      { time: "10", "派单数": 5866, "完成": 5641 },
      { time: "11", "派单数": 4677, "完成": 7645 },
      { time: "12", "派单数": 1877, "完成": 2645 },
    ],
  };
  const datasetMonthl = {
    dimensions: ["time", "本月", "上月"],
    source: [
      { time: "1", "本月": 5600, "上月": 9600 },
      { time: "2", "本月": 4600, "上月": 3644 },
      { time: "3", "本月": 3600, "上月": 4644 },
      { time: "4", "本月": 5611, "上月": 9655 },
      { time: "5", "本月": 5644, "上月": 3677 },
      { time: "6", "本月": 4677, "上月": 3633 },
      { time: "7", "本月": 3688, "上月": 4655 },
      { time: "8", "本月": 5088, "上月": 2644 },
      { time: "9", "本月": 6677, "上月": 2641 },
      { time: "10", "本月": 5866, "上月": 5641 },
      { time: "11", "本月": 4677, "上月": 7645 },
      { time: "12", "本月": 1877, "上月": 2645 },
    ],
  };
  const pieData = [
    { value: 30.4, name: "已完成" },
    { value: 25.7, name: "未分派" },
    { value: 25.6, name: "处理中" },
  ];
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
    drawEcharts(pref.current,  {pieData: {data: pieData, radius: '65%'}, type: 3, legend: {
      // Try 'horizontal'
       
     
    },})
    drawEcharts(lref.current, {
      dataset: datasetMonthl,
      series: [{ type: "line" }, { type: "line" }],
      grid: {
        top: '10px',
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
    <CustContext.Provider value={{form}}>
      <Pagecount bgcolor="#eeeff3">
    
        <Mainbox>
         <div className='left'>
            <div style={{display: 'flex', justifyContent: 'space-between', lineHeight: '1.5'}}>
              <span>故障位置</span>
              <span>告警数： {5}</span>
            </div>
            <Mapcom></Mapcom>
           
         </div>

         <div className='rigth'>
            <Titlelayout   title="本月所有告警" pl="0px" bl="none" hv="20px">             
              <div className='content'>
                 <div className='cl'>652</div>
                 <div className='list'>
                  
                    <div>
                      <span>一般告警</span>
                      <span>12</span>
                    </div> 
                    <div>
                      <span>严重告警</span>
                      <span>58</span>
                    </div> 
               </div>
              </div>
            </Titlelayout>
            <Titlelayout  title="本月所有工单" pl="0px" bl="none" hv="20px">             
              <div className='content'>
                 <div className='cl'>652</div>
                 <div className='list'>
                  
                    <div>
                      <span>未分派</span>
                      <span>12</span>
                    </div> 
                    <div>
                      <span>已分派</span>
                      <span>58</span>
                    </div>
                    <div>
                      <span>已处理</span>
                      <span>18</span>
                    </div>  
               </div>
              </div>
            </Titlelayout>
            <Titlelayout  title="巡检任务" pl="0px" bl="none" hv="20px">             
              <div className='content'>
                 <div className='cl'>112</div>
                 <div className='list'>
                  
                    <div>
                      <span>待巡检</span>
                      <span>12</span>
                    </div> 
                    <div>
                      <span>巡检中</span>
                      <span>58</span>
                    </div>
                    <div>
                      <span>已完成</span>
                      <span>18</span>
                    </div>  
               </div>
              </div>
            </Titlelayout>
          
              <Titlelayout className="mc"  title="本月派单情况" pl="0px" bl="none" hv="20px">
                <div className='chart'>
                  <div ref={bref}></div>
                  <div ref={pref}></div>
                  </div>  
              </Titlelayout>
           
              <Titlelayout className="down"  title="本月告警事件" pl="0px" bl="none" hv="20px">
                <div className='chart' ref={lref}>                  
                 
                </div>  
              </Titlelayout>
         </div>
         </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
