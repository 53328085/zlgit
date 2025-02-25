import React, { useRef, useEffect, useState } from 'react'
import { Image, Timeline } from 'antd'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
import styled from 'styled-components';
import { useReactive } from 'ahooks';
import { HomeRuntime, safeElectric } from '@api/api.js'
import { message } from 'antd';
import Cempty from '@com/useEmpty'
import { useTranslation } from 'react-i18next'

const fs = {
//  hv: '24px',
  fc: '#333',
  shadow: "y"
}


export default function DefaultHome(props) {
  const Timelinebox = styled(Timeline)`
   // height: 142px;
    height: 120px;
    overflow-y: hidden;
   padding-top: 16px;
   padding-left: 4px;
  .ant-timeline-item {
    padding-bottom: 8px;
  
  }

  .ant-timeline-item-content{
    min-height:auto
  }
  .title {
    color:#1e1e1e;
    display: flex;
    justify-content: space-between;
  }
  .content {
    font-size: 12px;
    color:#6b6b6b;
  }
  #scrollTimeLine{
    animation: ${props => {
      if (props.domht > 120) {
        return 'transY'
      } else { return "" }
    }} ${props => (props.domht / 60)}s 1s linear infinite;;
    &:hover{
      animation-play-state: paused;
    }
  }
  @keyframes transY{
   0%{
      transform:translateY(0)
   }
   100%{
    transform:translateY(-${props => props.dmheight}px) 
   }
 }
`
  const { t } = useTranslation("overview")
  const projectId = useSelector(selectProjectId)
  const [dmheight, setDomHeight] = useState(0)
  const mapobj = new Map([[1, { color: '#ff7070', text: '一级告警' }], [2, { color: '#ffb726', text: '二级告警' }], [3, { color: '#b07ef9', text: '三级告警' }]])
  const domRef = useRef()
  const state = useReactive({
    alarmList: [
      // {
      //   alarmDes: '测试告警',
      //   alarmTime: '2022-01-01 01:01:01',
      //   sn: '123',
      //   address: '测试地址'
      // }
    ]
  })

  // const { GetAlarmInfo } = HomeRuntime

  const { WarningDetailsList } = safeElectric
  useEffect(() => {
    if (props.type == 'runtTime') {

      let params = {
        projectId,
        areaId: 0
      }
      WarningDetailsList(params).then(res => {
        let { success, data } = res
        if (success) {
          if (data) {
            state.alarmList = data
          }
        } else {
          message.error(res.errMsg)
        }
      })
    } else if (props.type == 'configure') {
      return;
    }
  }, [])
  useEffect(() => {


    if (state.alarmList?.length > 0) {
      console.log(state.alarmList?.length)
      const listdom = document.querySelector('#scrollTimeLine')
      const domstyle = listdom.getBoundingClientRect()
      domRef.current = domstyle.height
      console.log(domstyle, domstyle.height - 142)
      setDomHeight(domstyle.height - 142)
    }

  }, [state.alarmList.length])
  const sty = {
    height: '200px'
  }
  return (
    <Titlelayout title={t("LatestAlarm")} {...fs} style={sty}>

      {(state.alarmList?.length > 0) ? (
        <Timelinebox dmheight={dmheight} domht={domRef.current} >
          <div id="scrollTimeLine">
            {state.alarmList?.length > 3 ? (
              [...state.alarmList.map((item, index) => {
                return (<Timeline.Item key={index}
                  dot={<div
                    style={{
                      borderRadius: '50%', width: 16, height: 16, border: '1px solid',
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      borderColor: item.level === 1 ? 'rgb(255,112,112)' : item.level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)'
                    }}>
                    <div style={{ borderRadius: '50%', width: 10, height: 10, background: item.level === 1 ? 'rgb(255,112,112)' : item.level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)' }}>
                    </div >
                  </div>}>
                  <div>
                    <p className='title'>
                      <span> {item.warningTime}</span>
                      <span style={{ color: mapobj.get(item.level).color, fontSize: 12 }}>{mapobj.get(item.level).text}</span>
                    </p>
                    <p className='title'>{item.alarmEvent}</p>
                    <p className='content'>{item.address + '  SN ' + item.sn}</p>
                  </div>
                </Timeline.Item>)
              }
              )
                , <div style={{ height: 326 }}>
                {state.alarmList.map((item, index) => {
                  return <Timeline.Item key={index}
                    dot={<div
                      style={{
                        borderRadius: '50%', width: 16, height: 16, border: '1px solid',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        borderColor: item.level === 1 ? 'rgb(255,112,112)' : item.level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)'
                      }}>
                      <div style={{ borderRadius: '50%', width: 10, height: 10, background: item.level === 1 ? 'rgb(255,112,112)' : item.level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)' }}>
                      </div >
                    </div>}>
                    <div>
                      <p className='title'>
                        <span> {item.warningTime}</span>
                        <span style={{ color: mapobj.get(item.level).color, fontSize: 12 }}>{mapobj.get(item.level).text}</span>
                      </p>
                      <p className='title'>{item.alarmEvent}</p>
                      <p className='content'>{item.address + '  SN ' + item.sn}</p>
                    </div>
                  </Timeline.Item>
                })
                }
              </div>]
            ) : state.alarmList.map((item, index) => {
              return (<Timeline.Item key={index}
                dot={<div
                  style={{
                    borderRadius: '50%', width: 16, height: 16, border: '1px solid',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    borderColor: item.level === 1 ? 'rgb(255,112,112)' : item.level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)'
                  }}>
                  <div style={{ borderRadius: '50%', width: 10, height: 10, background: item.level === 1 ? 'rgb(255,112,112)' : item.level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)' }}>
                  </div >
                </div>}>
                <div>
                  <p className='title'>
                    <span> {item.warningTime}</span>
                    <span style={{ color: mapobj.get(item.level).color, fontSize: 12 }}>{mapobj.get(item.level).text}</span>
                  </p>
                  <p className='title'>{item.alarmEvent}</p>
                  <p className='content'>{item.address + '  SN ' + item.sn}</p>
                </div>
              </Timeline.Item>)
            }
            )
            }
          </div>

        </Timelinebox>
      )
        : <Cempty />
      }

    </Titlelayout>
  )
}
