import React, { useRef, useEffect, useState, useMemo,useContext } from 'react'
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
 column-gap: 8px;
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
  padding: 0 16px 0 20px;
  column-gap: 32px;
  flex:1;
  .card_icon{
    display: flex;
    font-size: 32px;
    align-items: center;
    justify-content: center;
    flex: auto;
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
  ${props => props.laptop ? sty : null}
`

const fs = {
//  hv: '24px',
  fc: '#333',
  shadow: "y",
  layout: 'flex'
}

export default function DefaultHome(props) {
   const {roomLoad} = props
   const {laptop} =useContext(Context)
   const {t} = useTranslation(["overview", "comm"])
   const items = (Array.isArray(roomLoad) && roomLoad?.length >0) ? roomCapacity : []
       
  return (
    <Titlelayout title="实时负荷 (kW)" {...fs} style={{minHeight: '200px',height: "100%",alignItems:'center' }}>
      <Divorder laptop={laptop}>
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
