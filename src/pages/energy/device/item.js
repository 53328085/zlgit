import React from 'react'
import imgurl from './icon'
import styled, {css} from 'styled-components'
import { nanoid } from "@reduxjs/toolkit";
import {Image, Typography, Descriptions} from 'antd'
import {numberformat, Statebox} from "@com/usehandler"
const {Paragraph} = Typography
 
const Itembox = styled.div`
  position: relative;
  overflow: hidden;
//  background-image:   url(${imgurl.itembg}) ;
//  background-size: contain;
  outline: 1px solid #DDDFE6;
  //outline-offset: 1px ;
  display: grid;
  //padding: 8px;
  padding: 14px;
  grid-template-rows: 100px 148px;
  row-gap: 20px;
  align-content: end;
  border-radius: 8px;
  color: #303133;
  .upper{
     display: grid;
     grid-template-columns: 100px 1fr;
     column-gap: 17px;
     padding: 0 4px;
     .pic {
       background-color: rgba(97,113,152,1);
       border-radius: 6px;
       display: flex;
       align-items: center;
       justify-content: center;
       width: 100px;
       height: 100px;
       overflow: hidden;
       .img {
        max-width: 100%;
       }
     }
     .info {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      
      .ant-typography {

        color: #303133;
        line-height: 1;
        margin-bottom: 0;
        .span {
        display: inline-block;
        color: #606266;
        width: 6em;
      }
      }
     
     }
  }
  .below {
     outline: 1px solid #fff;
     outline-offset: 1px;
     display: grid;
     grid-template-columns: 120px repeat(3, 1fr);
     grid-template-rows: repeat(5, 1fr);
     div {
      display: flex;
      color: #fff;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
     }
     .title {
       background-color: #B4CBF3;
       color:#303133;
    //  background-color: #135abd;
     // border-right: 1px solid #fff;
      justify-content: center;
     
     }
     .title:nth-of-type(4){
        border-right: none;
      }
     .topborder {
      border-top: 1px solid #fff;
     }
     .back {
    //  border-top: 1px solid #fff;
       background-color: #1A316F;
     }
     .red {
    //  border-top: 1px solid #fff;
      background-color:#E46464;
     }
     .yellow {
    //  border-top: 1px solid #fff;
       background-color: #EDB258;
     }
     .green {
    //  border-top: 1px solid #fff;
      background-color: #43C66F;
     }
     .com { 
    //  background-color: #fff;
    //  border-right: 1px solid #d7d7d7;
     // border-bottom: 1px solid #d7d7d7 ;
      color:#303133;
      display: flex;
      align-items: center;
      justify-content: center;
      &:last-of-type {
       // border-right: none;
      }
     }
     .comback {
      background-color: rgba(26, 49, 111, 0.15);
     }
     .comred {
      background-color: rgba(228, 100, 100, 0.15);
     }
     .comyellow {
      background-color: rgba(237, 178, 88, 0.15);
     }
     .comgreen {
      background-color: rgba(67, 198, 111, 0.15);
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
  let {type, name, states=[], sns, address, e, e2, e3, e4, momE, yoyE, momE2, yoyE2, momE3, yoyE3, momE4, yoyE4, image, laptop} = props
  // 1，2，3 离线,正常，告警
  
  // let index = states[0];
  // const state = typeof index == "number" ? (['离线', '正常', '告警'][index-1] || '未知') : '未知';
  // const bgColor = typeof index == "number" ? (['#666', '#096', '#ff4d4f'][index-1] || 'ff4d4f') : '#666';
  return (
    <Itembox laptop={laptop}>
       {/* <Statebox top="13px" right="-20px" width="85px" bgColor={bgColor}>{state}</Statebox> */}
       <div className='upper' key={nanoid()}>
           <div className='pic' key={nanoid()}>
              <img src={image} className='img' ></img>
           </div>
            <div className='info' key={nanoid()}>
                           <Paragraph ellipsis={{ tooltip: name }}><span className='span'>设备名称</span>{name}</Paragraph>
                           <Paragraph ellipsis={{ tooltip: sns, rows: 2 }}><span className='span'>设备SN</span>SN:{sns}</Paragraph>
                           <Paragraph ellipsis={{ tooltip: address, rows: 3 }}><span className='span'>安装地址</span>{address}</Paragraph>
                         </div>
       </div>
        <div className='below' key={nanoid()}>
                    {["分类", "读数", "同比", "环比"].map(e => <div className='title'>{e}</div>)}
      
                    <div className='back' key={nanoid()}>总能耗(kWh)</div>
                    <div className='com comback' key={nanoid()}>{e}</div>
                    <div className='com comback' key={nanoid()}>{numberformat(yoyE)}</div>
                    <div className='com comback' key={nanoid()}>{numberformat(momE)}</div>
                    <div className='red' key={nanoid()}>峰能耗(kWh)</div>
                    <div className='com comred' key={nanoid()}>{e2}</div>
                    <div className='com comred' key={nanoid()}>{numberformat(yoyE2)}</div>
                    <div className='com comred' key={nanoid()}>{numberformat(momE2)}</div>
      
                    <div className='yellow' key={nanoid()}>平能耗(kWh)</div>
                    <div className='com comyellow' key={nanoid()}>{e3}</div>
                    <div className='com comyellow' key={nanoid()}>{numberformat(yoyE3)}</div>
                    <div className='com comyellow' key={nanoid()}>{numberformat(momE3)}</div>
      
                    <div className='green' key={nanoid()}>谷能耗(kWh)</div>
                    <div className='com comgreen' key={nanoid()}>{e4}</div>
                    <div className='com comgreen' key={nanoid()}>{numberformat(yoyE4)}</div>
                    <div className='com comgreen' key={nanoid()}>{numberformat(momE4)}</div>
                  </div>
    </Itembox>
  )
}
