import React, { useEffect, useState, useRef } from 'react'

import {nanoid} from '@reduxjs/toolkit'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form, Image, Radio} from 'antd'

import { drawEcharts } from "@com/useEcharts"
import imgurl from './icon'
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-rows: 176px 304px 267px; 
  column-gap: 16px;
  justify-content: flex-end;
  .upper {
    display: grid;
    grid-template-columns: 420px repeat(7, 176px);
    column-gap: 16px;
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
    .lower {
      display: grid;
      grid-template-rows: 32px 658px;
      grid-template-columns: 1206px;
      .control {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
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
    }`

   
const Radiogroup = styled(Radio.Group)`

 .ant-radio-button-wrapper {
  min-width: 100px;
  text-align: center;
  height: 32px;
  line-height: 32px;
  background-color: #237ae4;
  border-color:#237ae4;
  color: #fff; 
  font-size: 14px;
  span {
    font-size: 14px;
  }
 }
 .ant-radio-button-wrapper-checked {
   background-color: #003399;
   border-color:#003399;
   &:hover {
    color:#fff;
    border-color:#003399;
   }
 }
`
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
  const guref = useRef(null)
  const options = [
    {
      label: '负荷趋势 (kW)',
      value: '1',
    },
    {
      label: '负荷率(%)',
      value: '2',
    },
    {
      label: '用电量趋势(kWh)',
      value: '3',
    },
  ];
  const options2 = [
    {
      label: '日',
      value: 'day',
    },
    {
      label: '月',
      value: 'month',
    },
    {
      label: '年',
      value: 'year',
    },
  ];
  const [value, setValue] = useState('1') 
  const onChange = ({target: {value}}) => {
    setValue(value)
  }
  const [value2, setTime] = useState('day') 
  const onChange2 = ({target: {value}}) => {
    console.log(value)
    setTime(value)
  }
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

  useEffect(() => {
    drawEcharts(guref.current,  {...gauge, type: 2})
  })
  return (
    <CustContext.Provider value={{form}}>
      <Pagecount bgcolor="#eeeff3" pd="0px">        
        <Mainbox>
            <div className='upper'></div>
            <div className='middle'></div>
            <div className='lower'></div>
         </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}
