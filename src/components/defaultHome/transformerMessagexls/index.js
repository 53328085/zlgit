// 香炉山项目


import React, { useRef, useEffect } from 'react'
 import { Badge } from 'antd'
import styled from 'styled-components';
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 

 
import transformer from "../icon/transformer.png"
import {useTranslation} from 'react-i18next'
 
const Divorder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex:1; 
  column-gap: 16px;
  .card_icon{ 
    width: 120px;
    height: 120px; 
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    align-self: stretch;
    row-gap: 10px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .ant-badge-status-text {
        color: #606266;
        font-weight: 400;
      }
     .value {
      font-size: 15px;
      color: #303133;
      font-weight: 500;
     }
    }
  } 

  
`

const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}

export default function DefaultHome(props) {
  const {datas} =props
  const {t} = useTranslation("overview")
  console.log("datas")
  return (
    <Titlelayout title={datas?.title}  {...fs} style={{minHeight: "200px", height: "100%"}}>
      <Divorder>      
        <img src={transformer} className='card_icon'></img>
         <div className="content">

          {datas?.data?.map((item,index)=>(<div className="item">
                <Badge color='#1E50E6' text={item?.name}></Badge>
                <span className='value'>{item.text}</span>
            </div>) )}
            {/* <div className="item">
                <Badge color='#1E50E6' text="负荷"></Badge>
                <span className='value'>123123kW</span>
            </div>
            <div className="item">
                <Badge color='#1E50E6' text="总视在功率"></Badge>
                <span className='value'>123123kW</span>
            </div>
            <div className="item">
                <Badge color='#1E50E6' text="总功率因数"></Badge>
                <span className='value'>1231</span>
            </div>
            <div className="item">
                <Badge color='#1E50E6' text="额定容量"></Badge>
                <span className='value'>123123kW</span>
            </div> */}
         </div>
      </Divorder>
    </Titlelayout>
  )
}
