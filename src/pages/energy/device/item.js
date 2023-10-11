import React from 'react'
import imgurl from './icon'
import styled from 'styled-components'
import { nanoid } from "@reduxjs/toolkit";
import {Image, Typography, Descriptions} from 'antd'
import {numberformat, Statebox} from "@com/usehandler"
const {Paragraph} = Typography
const Itembox = styled.div`
  position: relative;
  overflow: hidden;
  background-image:   url(${imgurl.itembg}) ;
  background-size: contain;
  outline: 1px solid rgba(215,215,215,1);
  outline-offset: 1px ;
  display: grid;
  padding: 8px;
  grid-template-rows: 128px 140px;
  row-gap: 16px;
  align-content: end;
  .upper{
     display: grid;
     grid-template-columns: 172px 1fr;
     column-gap: 8px;
     padding: 0 4px;
     .pic {
       background-color: rgba(97,113,152,1);
       border-radius: 8px;
       display: flex;
       align-items: center;
       justify-content: center;
     }
     .info {
      .ant-typography {
        color: #fff;
        line-height: 1.2;
      }
     
     }
  }
  .below {
     outline: 1px solid #fff;
     outline-offset: 1px;
     display: grid;
     grid-template-columns: 86px 132px 80px 80px;
     grid-template-rows: repeat(5, 1fr);
     div {
      display: flex;
      color: #fff;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
     }
     .title {
      background-color: #135abd;
      border-right: 1px solid #fff;
      justify-content: center;
     
     }
     .title:nth-of-type(4){
        border-right: none;
      }
     .topborder {
      border-top: 1px solid #fff;
     }
     .back {
      border-top: 1px solid #fff;
       background-color: #000;
     }
     .red {
      border-top: 1px solid #fff;
      background-color: #ff3333;
     }
     .yellow {
      border-top: 1px solid #fff;
       background-color: #ffcc00;
     }
     .green {
      border-top: 1px solid #fff;
      background-color: #093;;
     }
     .com { 
      background-color: #fff;
      border-right: 1px solid #d7d7d7;
      border-bottom: 1px solid #d7d7d7 ;
      color:#000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:last-of-type {
       // border-right: none;
      }
     }
     .bold {
      color: #515151;
      font-weight: bold;
      justify-content: end;
     }
    
     .rose {
      color: #f00;
     }
     .decing {
       color: #090;
       
     } 
  }
`
/* total: {
  value: 312.35,
  qqq:  0.15,
  yyy: -6.9,
}, */

 
export default function Item(props) {
  let {type, name, sns, address, e, e2, e3, e4, mome, yoye, mome2, yoye2, mome3, yoye3, mome4, yoye4,} = props
  
  return (
    <Itembox>
       <Statebox top="13px" right="-20px" width="85px">正常</Statebox>
       <div className='upper' key={nanoid()}>
           <div className='pic' key={nanoid()}>
              <Image src={imgurl[`a${type}`]} preview={false} ></Image>
           </div>
           <div className='info' key={nanoid()}>
             <Paragraph ellipsis={{tooltip: name}}>{name}</Paragraph>
             <Paragraph ellipsis={{tooltip: sns, rows: 2}}>SN:{sns}</Paragraph>
             <Paragraph ellipsis={{tooltip: address, rows: 3}}>{address}</Paragraph>
           </div>
       </div>
       <div className='below' key={nanoid()}>
           {["分类", "能耗(kwh)","同比", "环比"].map(e => <div className='title'>{e}</div>)}

           <div className='back' key={nanoid()}>总能耗</div>
           <div className='com bold' key={nanoid()}>{e}</div>
           <div className='com' key={nanoid()}>{numberformat(yoye)}</div>
           <div className='com' key={nanoid()}>{numberformat(mome)}</div>
           <div className='red' key={nanoid()}>峰能耗</div>
           <div className='com bold' key={nanoid()}>{e2}</div>
           <div className='com' key={nanoid()}>{numberformat(yoye2)}</div>
           <div className='com' key={nanoid()}>{numberformat(mome2)}</div>

           <div className='yellow' key={nanoid()}>平能耗</div>
           <div className='com bold' key={nanoid()}>{e3}</div>
           <div className='com' key={nanoid()}>{numberformat(yoye3)}</div>
           <div className='com' key={nanoid()}>{numberformat(mome3)}</div>

           <div className='green' key={nanoid()}>平能耗</div>
           <div className='com bold' key={nanoid()}>{e4}</div>
           <div className='com' key={nanoid()}>{numberformat(yoye4)}</div>
           <div className='com' key={nanoid()}>{numberformat(mome4)}</div>
       </div>
    </Itembox>
  )
}
