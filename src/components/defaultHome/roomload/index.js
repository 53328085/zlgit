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
  padding: 0 16px 0 20px;
  column-gap: 32px;
  .card_icon{
    display: flex;
    font-size: 32px;
    align-items: center;
    width: 120px;
  }
  
  .details{
     display: flex;
     border-left: 4px solid ${props => props.theme.primaryColor};
     padding-left: 16px;
     font-size: 16px;
     color: #333;
     align-items: center;
     height: 50px;
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
   const {roomLoad} = props
   const {t} = useTranslation(["overview", "comm"])
   const items = (Array.isArray(roomLoad) && roomLoad?.length >0) ? roomCapacity : []
       
  return (
    <Titlelayout title="实时负荷 (kW)" {...fs} style={{height: '200px',alignItems:'center' }}>
      <Divorder>
        <div className='card_icon'><Text ellipsis={{tooltip: props.sumLoad}}>{props.sumLoad}</Text></div>
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
