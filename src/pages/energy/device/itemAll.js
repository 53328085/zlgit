import React from 'react'
import imgurl from './icon'
import styled, {css} from 'styled-components'
import { nanoid } from "@reduxjs/toolkit";
import { Image, Typography, Descriptions } from 'antd'
import { numberformat, Statebox } from "@com/usehandler"
import {useSelector} from 'react-redux'
import {  adaptation } from '@redux/systemconfig.js'
const { Paragraph } = Typography
const sty = css`
 grid-template-columns: 115px repeat(3, 1fr);
`
const ItemAll = styled.div`
.levelName{
    font-size: 18px;
    font-weight: bold;
}
.level{
flex: 1;
display: grid;
grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));// repeat(4, 394px);
//row-gap: 16px;
  gap: 16px;
justify-content: space-between;   
margin: 24px 0px;
}

`
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
      justify-content: space-between;
      
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
  ${props=> props.laptop ? sty : null}
`
/* total: {
  value: 312.35,
  qqq:  0.15,
  yyy: -6.9,
}, */


export default function Item(props) {
  let {laptop} = useSelector(adaptation)
  // 1，2，3 离线,正常，告警
  // let { areaName } = props
  // const state = typeof index == "number" ? (['离线', '正常', '告警'][index - 1] || '未知') : '未知';
  // const bgColor = typeof index == "number" ? (['#666', '#096', '#ff4d4f'][index - 1] || 'ff4d4f') : '#666';
  return (
    <ItemAll >
      <div className='levelName' key={nanoid()}>{props[0].areaName}</div>
      <div className='level'>
        {Object.values(props).map(item =>
          <Itembox laptop={laptop}> 
            <div className='upper' key={nanoid()}>
              <div className='pic' key={nanoid()}>
                <img src={item.image} className='img' ></img>
              </div>
              <div className='info' key={nanoid()}>
                <Paragraph ellipsis={{ tooltip: item.name }}><span className='span'>设备名称</span>{item.name}</Paragraph>
                <Paragraph ellipsis={{ tooltip: item.sns, rows: 2 }}><span className='span'>设备SN</span>SN:{item.sns}</Paragraph>
                <Paragraph ellipsis={{ tooltip: item.address, rows: 3 }}><span className='span'>安装地址</span>{item.address}</Paragraph>
                <Paragraph ellipsis={{ tooltip: item.areaName }}><span className='span'>区域名称</span>{item.areaName}</Paragraph>
              </div>
            </div>
            <div className='below' key={nanoid()}>
              {["分类", "读数", "同比", "环比"].map(e => <div className='title'>{e}</div>)}

              <div className='back' key={nanoid()}>总能耗(kWh)</div>
              <div className='com comback' key={nanoid()}>{item.e}</div>
              <div className='com comback' key={nanoid()}>{numberformat(item.yoyE)}</div>
              <div className='com comback' key={nanoid()}>{numberformat(item.momE)}</div>
              <div className='red' key={nanoid()}>峰能耗(kWh)</div>
              <div className='com comred' key={nanoid()}>{item.e2}</div>
              <div className='com comred' key={nanoid()}>{numberformat(item.yoyE2)}</div>
              <div className='com comred' key={nanoid()}>{numberformat(item.momE2)}</div>

              <div className='yellow' key={nanoid()}>平能耗(kWh)</div>
              <div className='com comyellow' key={nanoid()}>{item.e3}</div>
              <div className='com comyellow' key={nanoid()}>{numberformat(item.yoyE3)}</div>
              <div className='com comyellow' key={nanoid()}>{numberformat(item.momE3)}</div>

              <div className='green' key={nanoid()}>谷能耗(kWh)</div>
              <div className='com comgreen' key={nanoid()}>{item.e4}</div>
              <div className='com comgreen' key={nanoid()}>{numberformat(item.yoyE4)}</div>
              <div className='com comgreen' key={nanoid()}>{numberformat(item.momE4)}</div>
            </div>
          </Itembox>
        )}</div>
    </ItemAll>
  )
}
