import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import imgUrl from '@imgs'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import {useTranslation} from 'react-i18next'
const Mainbox = styled.div`
  width: 222px;
  height: 200px;
  padding: 16px;
  background-color: #56b653;
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
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
  const {t} = useTranslation("overview")
  const { GetChargeEByGrid } = HomeRuntime

  const state = useReactive({
    totalCharge: 2154.36
  })
  
  useEffect(() => {
    if (props.type == 'runtTime') {
      GetChargeEByGrid(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(!isNaN(data)){
              state.totalCharge = data
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
            <div className='headerTitle'>{t("TotalCharge")}(kWh)</div>
            <div className='mainData'>
                <img src={imgUrl.totalCharge} className='centerImg'></img>
                <span className='data'>{state.totalCharge}</span>
            </div>
         </Mainbox>
           
  )
}
