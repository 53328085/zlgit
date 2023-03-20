import React, { useEffect, useState, useRef } from 'react'
import {NavLink ,useLocation,useNavigate} from "react-router-dom";

import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form, Image, Progress, Timeline,Select,Divider} from 'antd'
import {Liquid} from "@ant-design/charts"
import { drawEcharts } from "@com/useEcharts"
import { useSelector,useStore } from 'react-redux'
import first from '../imgs/first.png'
import second from '../imgs/second.png'
import third from '../imgs/third.png'

const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-columns: 1fr 432px 784px;
  grid-template-rows: 384px 400px;
  gap: 16px;
  justify-content: flex-end;
  .down {
    
      display: grid;
      grid-template-rows:20px 1fr;
      .chart {
        min-height: 330px;
      }
      .stack {
        min-height: 312px;
      }
    }


  .pie {
      grid-area: 2 / 1 / 3 / 3;
      display: grid;
      grid-template-rows:20px 270px;
      .chart {
         display: grid;
         grid-template-columns: 400px 400px;
         grid-template-rows: minmax(312px, auto);
         justify-content: space-between;
      }
    }
    
    .content {
      display: grid;
      grid-template-columns: 1fr;
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

  }`
const Warnbox = styled.div`
position: relative;
display: grid;
height: 100%;
grid-template-columns: 148px 1fr;
grid-template-rows: 1fr 75px;
gap: 32px;
 align-items: center;
justify-items: center;
.info {
    grid-area: 2 / 1 / 3 /3;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background-color: #f7f7f7;
    border: 1px solid #dedede;
    border-radius: 4px;
    height: 75px;
    width: 100%;
    div{ 
        font-size: 16px;
        color:#666;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        & span:last-child{
            color:#ff00a5;
            font-size: 14px;
        }
    }
}
.alarm {
 display: grid;
 grid-template-rows: 24px 1px 24px 1px 24px;
 row-gap: 16px;
 div {
  padding-left: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //  &:first-of-type {
  //   border-left: 2px solid #f8857d;
  //  }
  //  &:last-of-type {
  //   border-left: 2px solid #5d9fff;
  //  }
 }
 
}`
const Timelinebox = styled(Timeline)`
min-height: 142px;
  padding-top: 16px;
  background-color: #fff;
 .ant-timeline-item {
   padding-bottom: 8px;
 }
 .title {
   color:#1e1e1e;
 }
 .content {
   font-size: 12px;
   color:#6b6b6b;
 }
`
const DemoLiquid = () => {
  const config = {
    percent: 0.4,
    outline: {
      border: 2,
      distance: 2,
    },
    wave: {
      length: 128,
    },
  
      statistic: {
        title: {
          formatter: () => '今日报警',
          style: {
            fontSize: 14,
            color: '#333',
            
          }
        },
        
        content: {
          style: {
            fontSize: 14,
            color: '#fff'
          },
          customHtml: () => {
            return <span>30次</span>
          }
        }
      }
   
  };
  return <Liquid {...config} />;
};

const headercss = {
  background:'#fff ' ,
  marginBottom:16,
  border:'1px solid #d7d7d7',
  borderRadius:4,
  padding: '8px 16px'
}
export default function Index() {
  const [form] = Form.useForm()
  const bref = useRef(null)
  const pref = useRef(null)
  const opref = useRef(null)
  const lref = useRef(null)
  const store = useStore();
  const {siderRunMenus, siderDesignerMenus } =  store.getState()?.system.menus
  const location = useLocation()
  const navigate = useNavigate()
  console.log(location)
  //console.log(siderRunMenus, siderDesignerMenus)
  const arealist = useSelector(state=>state.system.onelevel)
  const grid = {
    // 图表 grid
    left: "0px",
    right: "0",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  }
  const datasetStack = {
    dimensions: ["type", "一级报警", "二级报警", "三级报警"],
    source: [
      {type: "掉电", "一级报警": 5600, "二级报警": 9600, "三级报警": 9600, },
      {type: "过温", "一级报警": 4600, "二级报警": 3644,"三级报警": 7600, },
      { type: "过流", "一级报警": 3600, "二级报警": 4644,"三级报警": 8600, },
      { type: "缺相报警", "一级报警": 5611, "二级报警": 9655,"三级报警": 6600, },
      { type: "电流不平衡", "一级报警": 5644, "二级报警": 3677,"三级报警": 4600,},
      { type: "电压不平衡", "一级报警": 4677, "二级报警": 3633,"三级报警": 9874, },
      { type: "频率超限", "一级报警": 3688, "二级报警": 4655,"三级报警": 4789, },
      { type: "欠压报警", "一级报警": 5088, "二级报警": 2644,"三级报警": 3698, },
      { type: "过压报警", "一级报警": 6677, "二级报警": 2641,"三级报警": 7532, },
      { type: "剩余电量过流", "一级报警": 5866, "二级报警": 5641,"三级报警": 9521, },
     
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
    { value: 30.4, name: "组合式电气火灾监测器" },
    { value: 25.7, name: "智能微断" },
    { value: 25.6, name: "导轨表" },
    { value: 15.6, name: "其他" },
  ];
  const opieData = [
    { value: 20.4, name: "1级报警" },
    { value: 35.7, name: "2级报警" },
    { value: 15.6, name: "3级报警" },
  
  ];
  useEffect(() => {
    drawEcharts(bref.current, {
        xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            axisLabel: {
                color:"#545454"
            },
            axisTick: {
                alignWithLabel: true,
                lineStyle: {
                    color:"#4bcb82"
                }
            },
            axisLine: {
                lineStyle: {
                    color:"#4bcb82"
                }
            }
          },    
      dataset: datasetStack,
      series: [{ type: "bar",  stack: 'total' }, { type: "bar",  stack: 'total' },{ type: "bar",  stack: 'total' }],
      grid: {
        top: '10px',
        bottom: "30px",
        right: '0px',
        left: '0px',
        containLabel: true,
      },
      legend: {   
        top: 'auto',
        bottom: 0,
        icon: 'rect',
        itemHeight: 8,
        itemWidth: 8,
        itemGap: 20
      }
    })   
    drawEcharts(pref.current,  {pieData: {data: pieData, radius: '65%'}, type: 3, legend: {
     
       top: 'auto',
       bottom: 0,
     
    },})
    drawEcharts(opref.current,  {pieData: {data: opieData, radius: ['45%', '65%']}, type: 3, legend: {
     
        top: 'auto',
        bottom: 0,
      
     },})
    drawEcharts(lref.current, {
      dataset: datasetMonthl,
      series: [{ type: "line" }, { type: "line" }],
      grid: {
        top: '30px',
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
  const fs = {
    hv: '24px',
    fc: '#333'
  }

  return (
    <CustContext.Provider value={{form}}>
      <Pagecount bgcolor="transparent" pd="0px">
        <div style={headercss}>
          <span style={{paddingRight:16}}>园区选择</span>
          <Select options={arealist} style={{width:200}} fieldNames={{label:'name',value:'id'}} defaultValue={arealist[0].id}></Select>
        </div>
        <Mainbox>
        <Titlelayout title={'今日告警'} {...fs}>
        <Warnbox>
          <div style={{width: '148px', height: '148px'}}>
              <DemoLiquid></DemoLiquid>
              
          </div>
          <div className='alarm'>
             <div className='warning'>
              <img src={first} style={{width:36,height:36}}></img>
              <span style={{padding:'0 40px 0 16px'}}>一级告警</span>
              <span style={{fontSize:18}}>3 </span>
             </div>
              <Divider style={{margin: 0,borderColor:"#d7d7d7"}} dashed/>
             <div className='warning'>
             <img src={second} style={{width:36,height:36}}></img>
             <span style={{padding:'0 40px 0 16px'}}>二级告警</span>
              <span style={{fontSize:18}}>3 </span>

             </div>
             <Divider style={{margin: 0,borderColor:"#d7d7d7"}} dashed />
             <div className='warning'>
             <img src={third} style={{width:36,height:36}}></img>
             <span style={{padding:'0 40px 0 16px'}}>三级告警</span>
              <span style={{fontSize:18}}>3 </span>    
             </div>
           
          </div>
           <div className='info'>
              <div>
                <span>本周告警</span>
                <span>120</span>
              </div>
              <div>
                <span>本月告警</span>
                <span>420</span>
              </div>
              <div>
                <span>本年告警</span>
                <span>5220</span>
              </div>
           </div>
        </Warnbox>
      </Titlelayout>
      {/* <div onClick={()=>{navigate("/index/runtimeSafe/alarmDetail",{state: {title: '告警详情', nested: 'alarmDetail', primary: 'runtimeSafe'}})}}>查看详情</div> */}
     <Titlelayout title={'最新告警'} extra={<NavLink   to={{ pathname:"/index/runtimeSafe/alarmDetail" }} state={{title: '告警详情', nested: 'alarmDetail', primary: 'runtimeSafe'}}>查看详情</NavLink>} {...fs}>
      <Timelinebox>
          <Timeline.Item>
              <div>
                <p className='title'>13:48:55  设备过温</p>
                <p className='content'>正泰物联滨江园区-研发1号楼-12层-401    SN 102362256232</p>
              </div>
          </Timeline.Item>
          <Timeline.Item>
              <div>
                <p className='title'>13:20:23  设备过温</p>
                <p className='content'>正泰物联滨江园区-研发1号楼-12层-403    SN 102362256238</p>
              </div>
          </Timeline.Item>
          <Timeline.Item>
              <div>
                <p className='title'>13:20:23  设备过流</p>
              
              </div>
          </Timeline.Item>         
        </Timelinebox>
        </Titlelayout>
        <Titlelayout className="down"  title="本月告警趋势" {...fs}>
                <div className='chart' ref={lref}>                  
                 
                </div>  
        </Titlelayout>
        <Titlelayout className="pie"  title="告警分布" {...fs}>
                <div className='chart'>  
                  <div ref={pref}></div>                
                  <div ref={opref}></div>
                </div>  
        </Titlelayout>
        <Titlelayout className="down"  title="告警类型排名" {...fs}>
                <div className='stack' ref={bref}>  
                 
                </div>  
        </Titlelayout>
    

        
         </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
