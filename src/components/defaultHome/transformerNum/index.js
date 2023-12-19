import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
import { useReactive } from 'ahooks';
import { message } from 'antd';
import { Monitoring } from '@api/api.js'

import transformerNum from '../transformerNum.svg'
import { HomeRuntime } from '@api/api.js'
const Divorder = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  justify-content: space-around;
  .card_icon{
    margin-left: 25px;
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }
  
  .details{
     display: flex;
     flex-direction: column;
     width: 200px;
     .detail_item {
       display: flex;
       justify-content: space-between;
       align-items: center;
       color:#515151;
       font-size: 16px;
       span:nth-child(2) {
         font-size: 28px;
       }
       span:last-child {
         font-size: 20px;
       }
     }
  }
  
`

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

export default function DefaultHome(props) {
   const [count, setCount] = useState({
    roomCnt: 0,
    transformerCnt:0,
   })
   const projectId = useSelector(selectProjectId)
   const getData = async () => {
      try {
       let {success, data} = await HomeRuntime.RoomInfo(projectId)
       if(success && data) {
          setCount({...count, ...data})
       }

      } catch (error) {
        
      }
  
   } 

   useEffect(() => {
    getData()
   }, [projectId])
  return (
    <Titlelayout title={'变压器数量'} {...fs} style={{width: '456px', height: '200px'}}>
      <Divorder>
        <img src={ transformerNum } className='card_icon'></img>
        
        <div className='details'>
            <div className='detail_item'>
                <span >配电房</span>
                <span>{count.roomCnt}</span>
                <span>个</span>
            </div>
            <div className='detail_item'>
                <span>变压器</span>
                <span>{count.transformerCnt}</span>
                <span>台</span>
            </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
