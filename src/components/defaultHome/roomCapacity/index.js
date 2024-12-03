import React, { useRef, useEffect, useState, useMemo } from 'react'
import {Typography} from 'antd'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
 import {useTranslation} from 'react-i18next';
 import { TextLoop } from "react-text-loop-next";
 const {Text} = Typography;
const Divorder = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  justify-content: center;
  flex: 1;
//  padding: 0 16px 0 20px;
   column-gap: 8px;
   overflow: hidden;
  .card_icon{
    display: flex;
    font-size: 32px;
    align-items: center;
    max-width: 120px;
  }
  
  .details{
     display: flex;
     border-left: 4px solid ${props => props.theme.primaryColor};
     padding-left: 16px;
     font-size: 16px;
     color: #333;
     align-items: center;
     height: 50px;
     flex: 1;
     .item{ 
       display: flex;
       column-gap: 8px;
       
     }
    
  }
  
`

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y",
  layout: 'flex'
}

export default function DefaultHome(props) {
   const {roomCapacity} = props
   const {t} = useTranslation(["overview", "comm"])
   const items = (Array.isArray(roomCapacity) && roomCapacity?.length >0) ? roomCapacity : []
       
  return (
    <Titlelayout title="总容量 (KVA)" {...fs} style={{height: '200px',alignItems:'center' }}>
      <Divorder>
        <div className='card_icon'><Text ellipsis={{tooltip: props.sumCapacity}}>{props.sumCapacity}</Text></div>
        <div className='details'>
        <TextLoop>
              {
                items.map((d) => <div className='item' >
                    <Text>{d.roomName}</Text>
                    <Text ellipsis={{tooltip: d.value}}>{d.value}</Text>
                </div>)
              }
             </TextLoop>     
        </div>
      </Divorder>
    </Titlelayout>
  )
}
