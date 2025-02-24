import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId, iszhCN } from '@redux/systemconfig.js'
import styled from 'styled-components';
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 import {useTranslation} from 'react-i18next';

import roomnum from '../roomNum.svg'
import { HomeRuntime } from '@api/api.js'
const Divorder = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  height: 64px;
  justify-content: space-around;
  .card_icon{
   // margin-left: 25px;
    width: 64px;
    height: 64px;
   // margin-right: 16px;
  }
  
  .details{
     display: flex;
     border-left: 4px solid ${props => props.theme.primaryColor};
     //width: 200px;
     height: 64px;
     font-size: 16px;
     color: #333;
     padding-left: 16px;
     align-items: center;
     span {
      padding-left: 1em;
     }
  }
  
`

const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}

export default function DefaultHome(props) {
 
   const {t} = useTranslation(["overview", "comm"])
 
 
  return (
    <Titlelayout title="配电房数量" {...fs} style={{height: '200px'}}>
      <Divorder>
        <img src={ roomnum } className='card_icon'></img>
        <div className='details'>
             变配电站数量<span>{props.roomCnt}</span>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
