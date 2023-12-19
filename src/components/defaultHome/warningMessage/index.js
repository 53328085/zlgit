import React, { useRef, useEffect,useState } from 'react'
import { Image, Timeline } from 'antd'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import styled from 'styled-components';
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Cempty from '@com/useEmpty'


const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}


export default function DefaultHome(props) {
  const Timelinebox = styled(Timeline)`
    height: 142px;
    overflow-y: hidden;
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
  #scrollTimeLine{
    animation: ${props=>{if(props.domht>142){
      return 'transY'
    }else{return ""}}} ${props=>(props.domht/60)}s 1s linear infinite;;
    &:hover{
      animation-play-state: paused;
    }
  }
  @keyframes transY{
   0%{
      transform:translateY(0)
   }
   100%{
    transform:translateY(-${props=>props.dmheight}px) 
   }
 }
`
  const projectId = useSelector(selectProjectId)
  const [dmheight,setDomHeight] =useState(0)
  const domRef =useRef()
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
  useEffect(()=>{
    

    if(state.alarmList?.length>0){
      console.log(state.alarmList?.length)
      const listdom = document.querySelector('#scrollTimeLine')
      const domstyle = listdom.getBoundingClientRect()
      domRef.current = domstyle.height
      console.log(domstyle,domstyle.height-142)
      setDomHeight(domstyle.height-142)
    }
    
  },[state.alarmList.length])
  const sty = {
     height: '200px' 
  }
  return (
    <Titlelayout title={'最新告警'} {...fs} style={sty}>
      
      {  (state.alarmList?.length > 0) ? (
        <Timelinebox dmheight={dmheight} domht ={domRef.current} >
          <div id="scrollTimeLine">
          {state.alarmList?.length > 3?(
             [...state.alarmList.map((item, index) => {
              return (<Timeline.Item key={index}>
                <div>
                  <p className='title'>{item.alarmTime + '  ' + item.alarmDes}</p>
                  <p className='content'>{item.address + '  SN ' + item.sn}</p>
                </div>
              </Timeline.Item>)
            }
            )
            ,  <div style={{height:142,overflow:'hidden',paddingTop: '1px'}}>
                  {state.alarmList.map((item, index) => {
                    return <Timeline.Item key={index}>
                      <div>
                        <p className='title'>{item.alarmTime + '  ' + item.alarmDes}</p>
                        <p className='content'>{item.address + '  SN ' + item.sn}</p>
                      </div>
                    </Timeline.Item>
                  })
                }
              </div>]
          ):state.alarmList.map((item, index) => {
            return (<Timeline.Item key={index}>
              <div>
                <p className='title'>{item.alarmTime + '  ' + item.alarmDes}</p>
                <p className='content'>{item.address + '  SN ' + item.sn}</p>
              </div>
            </Timeline.Item>)
          }
          )
            
          } 
            </div>

        </Timelinebox>
        )
      :  <Cempty />
      } 
       
    </Titlelayout>
  )
}
