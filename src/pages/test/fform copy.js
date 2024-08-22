 
import React, { useState } from 'react';
import {Typography} from 'antd'
import {CaretRightOutlined} from '@ant-design/icons'
import styled from 'styled-components';
import { TextLoop } from "react-text-loop-next";
import warn from './waring.svg'
const {Text} = Typography
const Textscroll = styled.div`
  width: 538px;
  height: 48px;
  background-color: #f00;
  display: flex;
  align-items: center;
  padding: 0 6px 0px 8px ;
  overflow: hidden;
  column-gap: 8px;
  .warning {
     background-color: #fff;
     display: flex;
     align-items: center;
     column-gap: 16px;
     font-size: 16px;
     height: 32px;
     padding: 0 8px;
     color: #f00;
     .img {
        width: 24px;
        height: 24px;
     }
  }
  .scroll {
    width: 353px;
    height: 48px;
    display: flex;
    flex-direction: column;
    
    padding: 4px 8px;
    justify-content: center;
    .ant-typography {
        color: #fff;
    }
    
    
  }
 
`
const App = ({num=2}) => {
   const arr =[
    {
        date: '2024-08-16 10:00:00',
        text: '传感器离线告警,传感器离线告警,通讯告警:[离线];Discon=1'
    },
    {
        date: '2024-07-25 21:31:00',
        text: '传感器离线告警,通讯告警:[离线];Discon=1'
    },
    {
        date: '2024-05-08 12:50:01',
        text: 'Ia电流越限,越限告警:[80,∞];Ia=263.60'
    }
   ]
   return(
    <div style={{margin: "30px"}}>
        <Textscroll>
             <div className='warning'>
                <img src={warn} alt="" className='img' /> 
                <span>告警数({num})</span>
             </div>
             <TextLoop>
              {
                arr.map((d,i) => <div className='scroll' style={{backgroundColor: i%2==0 ? "#ff4848" : 'transparent' }}>
                    <Text>{d.date}</Text>
                    <Text ellipsis={{tooltip: d.text}}>{d.text}</Text>
                </div>)
              }
             </TextLoop>
             <CaretRightOutlined style={{color: "#fff", fontSize: '16px', cursor: "pointer", marginLeft: 'auto'}} />
        </Textscroll>
       
    </div>
   )
};
export default App;