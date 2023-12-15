import React, { useRef, useEffect } from 'react'
import { Image, Timeline } from 'antd'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import styled from 'styled-components';
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Cempty from '@com/useEmpty'
const Timelinebox = styled(Timeline)`
    height: 142px;
    overflow-y: auto;
   padding-top: 16px;
  .ant-timeline-item {
    padding-bottom: 8px;
  }
  .ant-timeline-item-content{
    min-height:auto
  }
  .title {
    color:#1e1e1e;
  }
  .content {
    font-size: 12px;
    color:#6b6b6b;
  }
`

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}


export default function DefaultHome(props) {
  const projectId = useSelector(selectProjectId)

  const state = useReactive({
    alarmList: [
      {
        alarmDes: '测试告警',
        alarmTime: '2022-01-01 01:01:01',
        sn: '123',
        address: '测试地址'
      }
    ]
  })

  const { GetAlarmInfo } = HomeRuntime

  useEffect(() => {
    if (props.type == 'runtTime') {
      GetAlarmInfo(projectId).then(res => {
        let { success, data } = res
        if (success) {
          if (data) {
            state.alarmList = data
            console.log(data)
          }
        } else {
          message.error(res.errMsg)
        }
      })
    } else if (props.type == 'configure') {
      return;
    }
  }, [])

  return (
    <Titlelayout title={'最新告警'} {...fs}>
      
      {  (state.alarmList?.length > 0) ? (
         <Timelinebox>
        {  state.alarmList.map((item, index) => {
            return <Timeline.Item key={index}>
              <div>
                <p className='title'>{item.alarmTime + '  ' + item.alarmDes}</p>
                <p className='content'>{item.address + '  SN ' + item.sn}</p>
              </div>
            </Timeline.Item>
          }) 
        }
      </Timelinebox>)
      :  <Cempty />
      }
       
    </Titlelayout>
  )
}
