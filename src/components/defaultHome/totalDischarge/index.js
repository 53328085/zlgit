import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import imgUrl from '@imgs'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';

const Mainbox = styled.div`
  width: 222px;
  height: 200px;
  padding: 16px;
  background-color: #4370ff;
  border-radius: 4px;
  .headerTitle{
    padding-left: 16px;
    border-left: 4px solid #fff;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
  }
  .mainData{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .centerImg{
        width: 72px;
        height: 72px;
        margin-top: 16px;
    }
    .data{
        font-size: 32px;
        color: #fff;
        font-weight: 700;
    }
  }

`


const fs = {
  hv: '24px',
  fc: '#333'
}

export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)

  const { GetCnFdUncharge } = HomeRuntime

  const state = useReactive({
    totalDischarge: 1987.36
  })
  
  useEffect(() => {
    if (props.type == 'runtTime') {
      GetCnFdUncharge(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(!isNaN(data)){
              state.totalDischarge = data
            }
          }else{
            message.error(res.errMsg)
          }
      })
    } else if (props.type == 'configure') {
      return;
    }
  }, [])
  
  
  return (
         <Mainbox>
            <div className='headerTitle'>总放电量(kWh)</div>
            <div className='mainData'>
                <img src={imgUrl.totalDischarge} className='centerImg'></img>
                <span className='data'>{state.totalDischarge}</span>
            </div>
         </Mainbox>
           
  )
}
