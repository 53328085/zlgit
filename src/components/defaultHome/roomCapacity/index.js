import React, { useRef, useEffect, useState, useMemo, useContext } from 'react'
import {Typography} from 'antd'
import styled, {css} from 'styled-components';
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 import {useTranslation} from 'react-i18next';
 import { TextLoop } from "react-text-loop-next";
 import Context from "@com/content"
 const {Text} = Typography;
 const sty=css`
   padding: 0 8px;
   justify-content: space-between;
   .card_icon{
    font-size: 24px;
   }
   .details{
    width: auto;
    flex: 1;
     padding-left: 8px;
     font-size: 14px;
   }
 `
const Divorder = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  justify-content: space-evenly;
  flex: 1;
  padding: 0 16px 0 20px;
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
     width: 224px;
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
  ${props => props.laptop ? sty : null}
`

const fs = {
//  hv: '24px',
  fc: '#333',
  shadow: "y",
  layout: 'flex'
}

export default function DefaultHome(props) {
   const {roomCapacity} = props
   const {laptop} =useContext(Context)
   const {t} = useTranslation(["overview", "comm"])
   const items = (Array.isArray(roomCapacity) && roomCapacity?.length >0) ? roomCapacity : []
       
  return (
    <Titlelayout title="总容量 (KVA)" {...fs} style={{minHeight: '200px', height: "100%",alignItems:'center' }}>
      <Divorder laptop={laptop}>
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
