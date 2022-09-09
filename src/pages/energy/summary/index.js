import React from 'react'

import {nanoid} from '@reduxjs/toolkit'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form, Image, Progress} from 'antd'
import imgurl from './icon'

const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-rows: 1fr 152px;
  row-gap: 16px;
  justify-content: flex-end;
  .up {
    display: grid;
    grid-template-columns: 1fr 512px;
    .right {
      display: grid;
      grid-template-rows: 208px 1fr;
      row-gap: 32px;
      .rup {
        display: grid;
        grid-template-columns: 248px 248px;
        grid-template-rows: 96px 96px;
        gap: 16px
      }
      .rdown {
        display: grid;
        grid-template-columns: 248px 248px;
        grid-template-rows: 96px 152px;
        gap: 16px
      }
    }
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
   align-items: center;
   box-sizing: border-box;
   .desc {
     display: grid;
     grid-template-rows: ${(props) => `repeat(${props.count}, '1fr')`};    
     align-items:center;
     justify-items: flex-end;
     .num {
      font-size: 20px;
      display: block;
     }
   }
`
const datas = [
  {
    display: '今日用电量(kWh)',
    value: 2115.23,
    display2: '今日电费（元）' ,
    value2: 215.3,
    icon: 'e01'
  },
  {
    display: '本月用电量(kWh)',
    value: 2115.23,
    display2: '本月累计电费（元）' ,
    value2: 4215.3,
    icon: 'e02'
  },
  {
    display: '年度总用电量(kWh)',
    value: 542115.23,
    display2: '今日电费（元）' ,
    value2: 65215.3,
    icon: 'e03'
  },
  {
    display: '当前负荷(kW)',
    value: 987.23,
    display2: '当前负荷率(%)' ,
    value2: 60,
    icon: 'e04',
    progress: false
  },
  {
    display: '本月最大负荷(kW)',
    value: 2915.23,
    display2: '本月平均负载(kWh)' ,
    value2: 1215.3,
    icon: 'e05'
  },
  {
    display: '功率因数',
    value: 0.92,
    display2: '月平均功率因数' ,
    value2: 0.91,
    icon: 'e06'
  }
]
const datas2 = [
  {
    display: '总装机容量(MWh)',
    value: 2115.23,   
    icon: 'e07'
  },
  {
    display: '总装机功率(MW)',
    value: 36977,   
    icon: 'e08'
  },
  {
    display: '总放电量(GWh)',
    value: 543.41,  
    icon: 'e09'
  },
  {
    display: '总充电量(GWh)',
    value: 987.23,
    icon: 'e10',
  },
  
]
const datas3 = [
  {
    display: '当前功率(kW)',
    value: 52.23,
    icon: 'e11' ,
  },
  {
    display: '当前辐照度(w/m2)',
    value: 2115.23,
    icon: 'e12',
  }
]
const datas4 = [ {
    display: '当日发电量(kWh)',
    value: 542115.23,
    display2: '发电金额（元）' ,
    value2: 65215.3,
    icon: 'e13'
  },
  {
    display: '累计发电量(kwh)',
    value: 987.23,
    display2: '累计发电金额(元)' ,
    value2: 60007,
    icon: 'e14',
    
  },
  
]
const Itemlist = ({data, count}) => {
 
  return (
   
    data.map((d)=> (
    <Itembox key={nanoid()} count={count}>
       <Image src={imgurl[d.icon]} preview={false} width={56} height={56} />
       <div className='desc'>
           <span>{d.display}</span>
           <span className='num'>{d.value}</span>
           { d.display2 ? (<span>{d.display2}</span>) : null }
           { d.value2 ?  (
              <span className='num'>
                {d.value2}
                {d.progress ?  <Progress percent={d.value2}  /> : null}
              </span>
            )
            : null
            }
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
         <div className='up'>
            <Image src={imgurl.engeryBg} preview={false} />
            <div className='right'>
               <div className='rup'>
               <Itemlist data={datas2} count={2}/>
               </div>
               <div className='rdown'>
               <Itemlist data={datas3} count={2}/>
               <Itemlist data={datas4} count={4}/>
               </div>
            </div>
         </div>

         <div className='down'>
             <Itemlist data={datas} count={4}/>
         </div>
         </Mainbox>
      </Titlelayout>
      </Pagecount>
    </CustContext.Provider>
  )
}
