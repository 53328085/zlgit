import React, { useEffect, useState, useRef } from 'react'

import {nanoid} from '@reduxjs/toolkit'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form, Image, Progress} from 'antd'
import {Liquid} from "@ant-design/charts"
import { drawEcharts } from "@com/useEcharts"
import imgurl from './icon'

const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-columns: 458px 1206px; 
  column-gap: 16px;
  justify-content: flex-end;
  .left {
    display: grid;
    grid-template-rows: 336px 448px;
    row-gap: 16px;
    .plist {
      padding-top: 16px;
      height: 100%;
      display: grid;
      grid-template-rows: repeat(3, 112px);
      row-gap: 16px;
      .item {
        border: 1px solid #dedede;
        padding: 8px;
        display: grid;
        grid-template-columns: 107px 1fr;
        column-gap: 8px;
        .itemR {
           height: 87px;
           display: flex;
           flex-direction: column;
           justify-content: space-between;
           div.sub{
             display: grid;
             grid-template-columns: 1fr 1fr;
             color: #666;
             grid-template-rows: 19px;
             align-items: center;
             span {
              line-height: 19px;
             }
           }
        }
      }
    }
  }
  .rigth {
    display: grid;
    grid-template-rows: 96px 690px;
    row-gap: 16px;
   
    .upper {
      display: grid;
      grid-template-columns: repeat(4, 290px);
      grid-template-rows: 96px;
      column-gap: 16px;
       >div {
        background-color: #fff;
        border: 1px solid #dedede;
        border-radius: 4px;
        padding: 16px;
        display: grid;
        grid-template-columns: 48px 1fr;
        column-gap: 32px;
        grid-template-rows: 1fr;
        align-items: center;
        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          line-height: 1;
          span:first-of-type{
             color:#999;
             font-size: 16px;
          }
          span:last-of-type{
            color:#515151;
            font-size: 26px;
          }
        }
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

  }`
const Warnbox = styled.div`
position: relative;
display: grid;
grid-template-columns: 1fr 248px;
column-gap: 16px;
height: 142px;
align-items: stretch;
justify-items: center;
.alarm {
 display: grid;
 grid-template-rows: repeat(2, 52px);
 row-gap: 16px;
 div {
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
   &:first-of-type {
    border-left: 2px solid #f8857d;
   }
   &:last-of-type {
    border-left: 2px solid #5d9fff;
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
        return  '本月最大负荷率:89.2% 发生时间： 2022-7-21 12:32:12'; 
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


export default function Index() {
  const [form] = Form.useForm()
  const bref = useRef(null)
  const pref = useRef(null)
  const lref = useRef(null)
  const guref = useRef(null)
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

    drawEcharts(guref.current,  {...gauge, type: 2})
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
      <Pagecount bgcolor="#eeeff3" pd="0px">        
        <Mainbox>
         <div className='left'>
             <Titlelayout title={'实时负荷率'}  >
             
                 <div ref={guref} style={{height: '270px'}}>
                  
                 </div>
                  
             </Titlelayout>
           
             <Titlelayout title={'变压器状态'}>
                 <div className='plist'>
                     <div className='item'>
                       <Image src={imgurl.transformer} preview={false} width={107} height={87}></Image>
                       <div className='itemR'>
                               <div>
                                 <div className='sub'>
                                  <span>1#变压器</span>
                                  <span>实时功率</span>
                                 </div>
                                 <div className='sub'>
                                  <span>S11-M-315</span>
                                  <span>215.21&nbsp;kW</span>
                                 </div>
                               </div>
                               <div>
                                 <div className='sub'>
                                  <span>额定容量</span>
                                  <span>实时负荷率</span>
                                 </div>
                                 <div className='sub'>
                                  <span>315 kVA</span>
                                  <span>74.21%</span>
                                 </div>
                               </div>
                       </div>
                    </div>
                    <div className='item'>
                       <Image src={imgurl.transformer} preview={false} width={107} height={87}></Image>
                       <div className='itemR'>
                               <div>
                                 <div className='sub'>
                                  <span>2#变压器</span>
                                  <span>实时功率</span>
                                 </div>
                                 <div className='sub'>
                                  <span>S11-M-315</span>
                                  <span>215.21&nbsp;kW</span>
                                 </div>
                               </div>
                               <div>
                                 <div className='sub'>
                                  <span>额定容量</span>
                                  <span>实时负荷率</span>
                                 </div>
                                 <div className='sub'>
                                  <span>315 kVA</span>
                                  <span>74.21%</span>
                                 </div>
                               </div>
                       </div>
                    </div>
                    <div className='item'>
                       <Image src={imgurl.transformer} preview={false} width={107} height={87}></Image>
                       <div className='itemR'>
                               <div>
                                 <div className='sub'>
                                  <span>3#变压器</span>
                                  <span>实时功率</span>
                                 </div>
                                 <div className='sub'>
                                  <span>S11-M-315</span>
                                  <span>215.21&nbsp;kW</span>
                                 </div>
                               </div>
                               <div>
                                 <div className='sub'>
                                  <span>额定容量</span>
                                  <span>实时负荷率</span>
                                 </div>
                                 <div className='sub'>
                                  <span>315 kVA</span>
                                  <span>74.21%</span>
                                 </div>
                               </div>
                       </div>
                    </div>
                 </div>
                 
                  
             </Titlelayout>
         </div>

         <div className='rigth'>
           <div className='upper'>
              <div>
                <Image src={imgurl.z02} preview={false} width={48} height={48}></Image>
                <div className='content'>
                   <span>配电房容量(kvA)</span>
                   <span>8000</span>
                </div>
              </div>
              <div>
                <Image src={imgurl.z03} preview={false} width={48} height={48}></Image>
                <div className='content'>
                   <span>申报需量 (kW)</span>
                   <span>7000</span>
                </div>
              </div>
              <div>
                <Image src={imgurl.z04} preview={false} width={48} height={48}></Image>
                <div className='content'>
                   <span>电压等级 (kV)</span>
                   <span>10/0.4</span>
                </div>
              </div>
              <div>
                <Image src={imgurl.z05} preview={false} width={48} height={48}></Image>
                <div className='content'>
                   <span>变压器 (台)</span>
                   <span>3</span>
                </div>
              </div>
           </div>
         </div>
         </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
