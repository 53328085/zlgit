import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
import { useReactive } from 'ahooks';
import { message } from 'antd';
import { Monitoring } from '@api/api.js'

import deviceRuntime from '@imgs/device_runtime.png'

const Divorder = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  .card_icon{
    margin-left: 25px;
    width: 64px;
    height: 64px;
    margin-right: 34px;
  }
  .totalCount{
    display: flex;
    flex-direction: column;
    .count_title{
        font-size: 14px;
        color: #303133;
        line-height: 24px;
    }
    .count_val{
        font-size: 24px;
        line-height: 32px;
        color: #515151;
    }
  }
  .details{
    margin-left: 14px;
    border: 1px solid #e4e4e4;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.647058823529412);
    width: 224px;
    height: 112px;
    padding: 10px 32px 10px 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .detail_item{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
  }
  
`

const fs = {
  hv: '24px',
  fc: '#333'
}

export default function DefaultHome(props) {
  const projectId = useSelector(selectProjectId)

  const { RuntimeStatus } = Monitoring.Runtime

  const state = useReactive({
    electricMeterCount: 1250,
    electricMeterOnlineCount: 1200,
    electricMeterOfflineCount: 50
  })

  useEffect(() => {
    if (props.type == 'runtTime') {
        RuntimeStatus({
            projectId: projectId,
            areaId: 0
          }).then(res => {
            if(res.success && res.data){
                state.electricMeterCount = res.data.electricMeterCount
                state.electricMeterOnlineCount = res.data.electricMeterOnlineCount
                state.electricMeterOfflineCount = res.data.electricMeterOfflineCount
                state.percent = ((res.data.electricMeterOnlineCount / res.data.electricMeterCount) * 100).toFixed(2)
            }else{
              message.error(res.errMsg)
            }
          })
    } else if (props.type == 'configure') {
      return;
    }
  }, [])


  return (
    <Titlelayout title={'电表信息'} {...fs}>
      <Divorder>
        <img src={ deviceRuntime } className='card_icon'></img>
        <div className='totalCount'>
            <span className='count_title'>电表总数</span>
            <span className='count_val'>{ state.electricMeterCount }</span>
        </div>
        <div className='details'>
            <div className='detail_item'>
                <span className='item_title'>电表在线</span>
                <span className='item_value' style={{ color: '#096' }}>{ state.electricMeterOnlineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'>电表离线</span>
                <span className='item_value' style={{ color: '#f44336' }}>{ state.electricMeterOfflineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'>在线率</span>
                <span className='item_value'>{ state.percent }%</span>
            </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
