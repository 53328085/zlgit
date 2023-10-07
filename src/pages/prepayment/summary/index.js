import React, { useEffect, useState, useRef } from 'react'

import {useSelector} from 'react-redux'
import {selectUser} from '@redux/user'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form, Image, Timeline, Typography,Select, Button} from 'antd'

import { drawEcharts } from "@com/useEcharts"
import imgurl from './icon'
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-rows:48px 176px 304px 267px; 
  row-gap: 16px;
  justify-content: flex-end;
  .header{
    width: 1680px;
    height: 48px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d7d7d7;
    display: flex;
    align-items: center;
   
}
.line{
    width: 0;
    height: 33px;
    margin: 0 24px;
    border-left: 1px dashed #d7d7d7;
}
  .upper {
    display: grid;
    grid-template-columns:  repeat(7, 144px) 560px;
    column-gap: 16px;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #d7d7d7;
      width: 100%;
      height: 100%;
      color:#333;
      background-color:#fff;
      .imgBox{
        width:144px;
        height:88px;
        background-color:#237AE4;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      .descBox{
        display:flex;
        align-items:center;
        flex-direction:column;
        span{
          line-height:44px;
        }
      }
      strong {
        font-size: 22px;
      }
    }
  }
  .middle {
    display: grid;
    grid-template-columns: 808px 375px 464px;
    column-gap: 16px;
  }
  .lower {
    display: grid;
    grid-template-columns: repeat(3, 550px);
    column-gap: 16px;
  }
   `

const Timelinebox = styled(Timeline)`
   max-height: 115px;
   overflow-y:scroll;
   padding-top: 16px;
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

const {Text} = Typography


export default function Index() {
  const [form] = Form.useForm()
  const bref = useRef(null)
  const pref = useRef(null)
  const stref = useRef(null)
  const lref = useRef(null)
  const l2ref = useRef(null)
  const l3ref = useRef(null)
  const { Option } = Select
  const {name, password}  = useSelector(selectUser)
  console.log(name)
  console.log(password)
  const grid = {
    // 图表 grid
    left: "0px",
    right: "0",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  }
  const datasetMonth = {
    dimensions: ["time", "2020", "2019"],
    source: [
      { time: "1月", "2020": 5600, "2019": 9600 },
      { time: "2月", "2020": 4600, "2019": 3644 },
      { time: "3月", "2020": 3600, "2019": 4644 },
      { time: "4月", "2020": 5611, "2019": 9655 },
      { time: "5月", "2020": 5644, "2019": 3677 },
      { time: "6月", "2020": 4677, "2019": 3633 },
      { time: "7月", "2020": 3688, "2019": 4655 },
      { time: "8月", "2020": 5088, "2019": 2644 },
      { time: "9月", "2020": 6677, "2019": 2641 },
      { time: "10月", "2020": 5866, "2019": 5641 },
      { time: "11月", "2020": 4677, "2019": 7645 },
      { time: "12月", "2020": 1877, "2019": 2645 },
    ],
  };
  const pieData = [
    { value: 30.4, name: "支付宝" },
    { value: 25.7, name: "微信" },
    { value: 25.6, name: "现金" },
    { value: 15.6, name: "对公支付" },
    { value: 5, name: "其他" },
  ];
  const datasetStack = {
    dimensions: ["type", "用电量"],
    source: [
      {type: "A区1-203", "用电量": 5600, },
      {type: "A区1-204", "用电量": 4600 },
      { type: "A区1-205", "用电量": 3600 },
      { type: "A区1-206", "用电量": 5611 },
      { type: "A区1-207", "用电量": 5644},
      { type: "A区1-208", "用电量": 4677 },
      { type: "A区1-209", "用电量": 3688 },
    ],
  };
  const datasetMonthe = {
    dimensions: ["time", "用电量" ],
    source: [
      { time: "1", "用电量": 5600 },
      { time: "2", "用电量": 4600},
      { time: "3", "用电量": 3600 },
      { time: "4", "用电量": 5611 },
      { time: "5", "用电量": 5644 },
      { time: "6", "用电量": 4677 },
      { time: "7", "用电量": 3688 },
      { time: "8", "用电量": 5088 },
      { time: "9", "用电量": 6677 },
      { time: "10", "用电量": 5866 },
      { time: "11", "用电量": 4677 },
      { time: "12", "用电量": 1877 },
    ],
  };
  const datasetMonthw = {
    dimensions: ["time", "用水量" ],
    source: [
      { time: "1", "用水量": 7600 },
      { time: "2", "用水量": 4600},
      { time: "3", "用水量": 1600 },
      { time: "4", "用水量": 2611 },
      { time: "5", "用水量": 5644 },
      { time: "6", "用水量": 4677 },
      { time: "7", "用水量": 2688 },
      { time: "8", "用水量": 3088 },
      { time: "9", "用水量": 4677 },
      { time: "10", "用水量": 5866 },
      { time: "11", "用水量": 6677 },
      { time: "12", "用水量": 7877 },
    ],
  };
  const datasetMonthg = {
    dimensions: ["time", "天燃气" ],
    source: [
      { time: "1", "天燃气": 5600 },
      { time: "2", "天燃气": 4600},
      { time: "3", "天燃气": 3600 },
      { time: "4", "天燃气": 5611 },
      { time: "5", "天燃气": 5644 },
      { time: "6", "天燃气": 4677 },
      { time: "7", "天燃气": 1688 },
      { time: "8", "天燃气": 2088 },
      { time: "9", "天燃气": 3677 },
      { time: "10", "天燃气": 5866 },
      { time: "11", "天燃气": 4677 },
      { time: "12", "天燃气": 7877 },
    ],
  };
  const fs = {
    hv: '24px',
    fc: '#333'
  }

  useEffect(() => {
    drawEcharts(lref.current, {
      color: ["#5e92f9"],
      dataset: datasetMonthe,
      series: [{ type: "line" }],
      grid: {
        top: '30px',
        left: 0,
        right: 0,
        bottom: '0',
        containLabel: true,
      },
      legend: {
        top: 0,
       // bottom: 0,
        icon: 'rect',
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
      }
    })
    drawEcharts(l2ref.current, {
      color: ["#099c9c"],
      dataset: datasetMonthw,
      series: [{ type: "line" }],
      grid: {
        top: '30px',
        left: 0,
        right: 0,
        bottom: '0',
        containLabel: true,
      },
      legend: {
        top: 0,
       // bottom: 0,
        icon: 'rect',
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
      }
    })
    drawEcharts(l3ref.current, {
      color: ["#ff6803"],
      dataset: datasetMonthg,
      series: [{ type: "line" }],
      grid: {
        top: '30px',
        left: 0,
        right: 0,
        bottom: '0',
        containLabel: true,
      },
      legend: {
        top: 0,
       // bottom: 0,
        icon: 'rect',
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
      }
    })
    drawEcharts(bref.current, {
      dataset: datasetMonth,
      series: [{ type: "bar",barGap: 0 }, { type: "bar", barGap: 0 }],
      grid,
      legend: {
      
        icon: 'rect',
        itemHeight: 8,
        itemWidth: 8,
        itemGap: 20
      }
    })  
    drawEcharts(pref.current,  {pieData: {data: pieData, radius: '65%'}, type: 3, legend: {
       top: 'auto',
       bottom: 0,
      
    }}) 
    drawEcharts(stref.current, {
      xAxis: {
          type: 'value',
          
        },
        yAxis: {
          type: 'category',
          axisLabel: {
              color:"#545454"
          },
        },    
    dataset: datasetStack,
    series: [{ type: "bar",  stack: 'total', barWidth:20, itemStyle: {
      borderRadius: 10
    } }],
    grid: {
      top: '10px',
      bottom: "0px",
      right: '0px',
      left: '0px',
      containLabel: true,
    },
    legend: {   
      show: false
    },
    label: {
      show: true,     
      formatter: '{@[1]}kwh'
    }
  })   
  })
  const handleChange=(e)=>{
    console.log(e)//value值
  }
  const jump = () => {

   /*  const hostname = process.env.NODE_ENV === "production"
    ? new URL(window.location.href).hostname
    : "10.5.7.60"; */
    window.open(`http://pay.yinli56.com:20215?name=chint&password=admin@123456&type=dark`)
  }
  return (
    <CustContext.Provider value={{form}}>
      <Pagecount bgcolor="#eeeff3" pd="0px">        
        <Mainbox>
        <div className='header'>
        <span style={{marginLeft: '12px'}}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          defaultValue="1"
          style={{width: '320px', marginLeft: '12px'}}
          onChange={handleChange}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
        </Select>
        <Button onClick={jump} type='primary' style={{marginLeft: "auto"}}>控制台</Button>
        {/* <div className='line'></div>
        <span>能源类型</span>
        <Select
          placeholder="全部类型"
          size="middle"
          style={{width: '126px', marginLeft: '12px'}}
        >
          <Option value="0">电</Option>
          <Option value="1">水</Option>
          <Option value="2">燃气</Option>
        </Select>  */}
      </div>
            <div className='upper'>
           {/* <Titlelayout> */}
               <div className='item' onClick={jump}>
                <div className='imgBox'><Image src={imgurl.home5} preview={false} width={64} height={64} ></Image></div>
                <div className='descBox'> <span>账户余额总计</span>
                 <Text strong ellipsis>125896.30</Text></div>
               </div>
           {/* </Titlelayout> */}
           {/* <Titlelayout> */}
               <div className='item'>
               <div className='imgBox'><Image src={imgurl.home1} preview={false} width={64} height={64}></Image></div>
               <div className='descBox'><span>能源费累计收入</span>
                 <Text strong ellipsis>15896.01</Text></div>
               </div>
           {/* </Titlelayout> */}
           {/* <Titlelayout> */}
               <div className='item'>
               <div className='imgBox'><Image src={imgurl.home2} preview={false} width={64} height={64}></Image></div>
               <div className='descBox'><span>物业费累计收入</span>
                 <Text strong ellipsis>125.00</Text></div>
               </div>
           {/* </Titlelayout> */}
           {/* <Titlelayout> */}
               <div className='item'>
               <div className='imgBox'><Image src={imgurl.home6} preview={false} width={64} height={64}></Image></div>
               <div className='descBox'><span>能源欠费总计</span>
                 <Text strong ellipsis>3.00</Text></div>
               </div>
           {/* </Titlelayout> */}
           {/* <Titlelayout> */}
               <div className='item'>
               <div className='imgBox'><Image src={imgurl.home6} preview={false} width={64} height={64}></Image></div>
               <div className='descBox'> <span>物业费欠费总计</span>
                 <Text strong ellipsis>122325.00</Text></div>
               </div>
           {/* </Titlelayout> */}
           {/* <Titlelayout> */}
               <div className='item'>
               <div className='imgBox'><Image src={imgurl.home3} preview={false} width={64} height={64}></Image></div>
               <div className='descBox'> <span>客户总数</span>
                 <Text strong ellipsis>205</Text></div>
               </div>
           {/* </Titlelayout> */}
           {/* <Titlelayout> */}
               <div className='item'>
               <div className='imgBox'><Image src={imgurl.home4} preview={false} width={64} height={64}></Image></div>
               <div className='descBox'> <span>欠费客户</span>
                 <Text strong ellipsis>20</Text></div>
               </div>
           {/* </Titlelayout> */}
           <Titlelayout title={'最新告警'} extra={<a href="#">详情</a>} {...fs}>
                  <Timelinebox>
                    <Timeline.Item color='red'>
                        <div>
                          <p className='title'>13:48:55    客户欠费    <span className='content'>   02303  张三 / 13588455699  欠费 100.32元</span></p>
                          {/* <p className='content'>02303  张三 / 13588455699  欠费 100.32元</p> */}
                        </div>
                    </Timeline.Item>
                    <Timeline.Item color='red'>
                        <div>
                          <p className='title'>13:20:23  客户欠费<span className='content'>   02303  张三 / 13588455699  欠费 100.32元</span></p>
                          {/* <p className='content'>02304  李四 / 13588455699  欠费 100.32元</p> */}
                        </div>
                    </Timeline.Item>
                    <Timeline.Item color='red'>
                        <div>
                          <p className='title'>13:20:23  客户欠费<span className='content'>   02303  张三 / 13588455699  欠费 100.32元</span></p>
                          {/* <p className='content'>02305  王五 / 13588455699  欠费 100.32元</p> */}
                        </div>
                    </Timeline.Item>    
                    <Timeline.Item color='red'> 
                        <div>
                          <p className='title'>13:20:23  客户欠费<span className='content'>   02303  张三 / 13588455699  欠费 100.32元</span></p>
                          {/* <p className='content'>02305  王五 / 13588455699  欠费 100.32元</p> */}
                        </div>
                    </Timeline.Item>      
                  </Timelinebox>
                  
            </Titlelayout>
            </div>
            <div className='middle'>
              <Titlelayout title={'项目收入趋势'} extra={<a href="#">详情</a>} {...fs}>
               <div ref={bref} style={{width: '100%', height: '100%'}}></div>
               </Titlelayout>
               <Titlelayout title={'支付方式'}   {...fs}>
                 <div ref={pref} style={{width: '100%', height: '100%'}}></div>
               </Titlelayout>
               <Titlelayout title={'房间累计能耗排名(kwh)'}   {...fs} extra={'用电量'}>
                 <div ref={stref} style={{width: '100%', height: '100%'}}></div>
               </Titlelayout>
            </div>
            <div className='lower'>
            <Titlelayout title={'用电量趋势'}   {...fs} extra={<a href="#">详情</a>}>
                <div ref={lref} style={{width: '100%', height: '100%'}}></div>
                </Titlelayout>
                <Titlelayout title={'用水量趋势'}   {...fs} extra={<a href="#">详情</a>}>
                    <div ref={l2ref}  style={{width: '100%', height: '100%'}}></div>
                </Titlelayout>
                <Titlelayout title={'用气趋势'}   {...fs} extra={<a href="#">详情</a>}>
                <div ref={l3ref}  style={{width: '100%', height: '100%'}}></div>
                </Titlelayout>
            </div>
         </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
