import React from 'react'

import {nanoid} from '@reduxjs/toolkit'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form, Image, Progress} from 'antd'
const path = require('path')
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-rows: 1fr 152px;
  row-gap: 16px;
  justify-content: flex-end;
  .up {
    display: grid;
  }
  .down {
    display: grid;
    grid-template-columns: repeat(6, 248px);
    grid-template-rows: 152px;
    column-gap: 16px;
    
  }
`
const Itembox = styled.div`
   background-color: #f0f9ff;
   border-radius: 4px;
   border: 1px solid #c9e9ff;
   display: grid;
   grid-template-columns: 56px 128px;
   padding: 16px;
   justify-content: space-between;
   box-sizing: border-box;
   .desc {
     display: grid;
     grid-template-rows: repeat(4, 1fr);    
     align-items:center;
     justify-items: flex-end;
     .num {
      font-size: 20px;
      display: block;
     }
   }
`
const Itemlist = (props) => {
  const datas = [
    {
      display: '今日用电量(kWh)',
      value: 2115.23,
      display2: '今日电费（元）' ,
      value2: 215.3,
      icon: ''
    },
    {
      display: '本月用电量(kWh)',
      value: 2115.23,
      display2: '本月累计电费（元）' ,
      value2: 4215.3,
      icon: ''
    },
    {
      display: '年度总用电量(kWh)',
      value: 542115.23,
      display2: '今日电费（元）' ,
      value2: 65215.3,
      icon: ''
    },
    {
      display: '当前负荷(kW)',
      value: 987.23,
      display2: '当前负荷率(%)' ,
      value2: 60,
      icon: '',
      progress: false
    },
    {
      display: '本月最大负荷(kW)',
      value: 2915.23,
      display2: '本月平均负载(kWh)' ,
      value2: 1215.3,
      icon: ''
    },
    {
      display: '功率因数',
      value: 0.92,
      display2: '月平均功率因数' ,
      value2: 0.91,
      icon: ''
    }
  ]
  return (
   
    datas.map((d)=> (
    <Itembox key={nanoid()}>
       <Image src={d.icon} preview={false} width={56} />
       <div className='desc'>
           <span>{d.display}</span>
           <span className='num'>{d.value}</span>
           <span>{d.display2}</span>
           <span className='num'>
             {d.value2}
             {d.progress ?  <Progress percent={d.value2}  /> : null}
            </span>
       </div>
     </Itembox>
   )) 
  )
}

export default function Index() {
  const [form] = Form.useForm()
  return (
    <CustContext.Provider value={{form}}>
      <Pagecount>
      <Titlelayout title='能源概述'>
        <Mainbox>
         <div className='up'></div>

         <div className='down'>
             <Itemlist/>
         </div>
         </Mainbox>
      </Titlelayout>
      </Pagecount>
    </CustContext.Provider>
  )
}
