import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'

import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
import { drawEcharts } from "@com/useEcharts"; 
import { HomeRuntime } from '@api/api.js'
import { useReactive } from 'ahooks';
 import {useTranslation} from "react-i18next"
const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 248px;
 column-gap: 16px;
 height: 142px;
 align-items: center;
 justify-items: center;

 .alarm {
   display: grid;
   grid-template-rows: repeat(2, 52px);
   row-gap: 16px;
   div {
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
     &:first-of-type {
      border-left: 2px solid #f8857d;
     }
     &:last-of-type {
      border-left: 2px solid #5d9fff;
     }
   }
 }
 
 .list {
   display: grid;
   grid-template-rows: repeat(4, 26px);
   color: #666;  
   align-items: center;
   row-gap: 8px;   
   padding: 0;
   span {
    line-height: 22px;
    b{
      font-size: 8px;
      padding-right: 1em;
    }
    &:first-child b{
     color: #237Ae4
    }
    &:nth-of-type(2) b {
      color: #325dca
    }
    &:nth-of-type(3) b {
      color: #008000;
    }
    &:last-child {
      
      b {
        color:#333;
      }
    }
   }
 }
`


const fs = {
  hv: '24px',
  fc: '#333'
}


export default function DefaultHome(props){
  const {type} = props
  const projectId = useSelector(selectProjectId)
  const ref= useRef()
  const {t} = useTranslation(["overview","comm"])
  const state = useReactive({
    alarmCount: 30,
    confirmCount: 0,
    unconfirmCount: 30,
    confirmPercent: 0,
    unconfirmPercent: 0,
  })

  const tdrawEcharts = () => {
    return drawEcharts(ref.current, {
      type: 4,
      liuqiu: {
        series: {
         data: [(state.alarmCount/50)],
         waveLength: "89%",
        label: {
          normal: {
            formatter: function() {
                return `${t("overview:AlarmOfToday")}\n\n\n${state.alarmCount}次`;
            },
            textStyle: {
                fontSize: 16,
                color: '#333'
            },
            position: ['50%', '65%']
         }
        },
        
      },
      
    }
    })
  }

  const { GetTodayAlarmInfo } = HomeRuntime

  useEffect(() => {
    if (props.type == 'runtTime') {
      GetTodayAlarmInfo(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data){
              state.alarmCount = data.alarmCount // 总的告警数
              state.confirmCount = data.confirmCount // 已确认
              state.unconfirmCount = data.unconfirmCount // 没确认
              state.confirmPercent = data.alarmCount > 0 ?   ((data.confirmCount / data.alarmCount)* 100).toFixed(1) : 0
              state.unconfirmPercent =  data.alarmCount > 0 ? ((data.unconfirmCount / data.alarmCount)* 100).toFixed(1) : 0         
              tdrawEcharts()
            }
          }else{
            message.error(res.errMsg)
          }
      })
    }else{
      tdrawEcharts()
    }
    
  },[projectId, type])
  
  return (
         <Titlelayout title={'今日告警'} {...fs} style={{height: "200px"}}>
        <Mainbox>
          <div style={{width: '112px', height: '112px'}} ref={ref}>
              {/* <DemoLiquid></DemoLiquid> */}
              
          </div>
          <div className='alarm'>
             <div>
                 <span>未确认 {state.unconfirmPercent}%</span>
                 <span>{state.unconfirmCount} 条</span>
             </div>
             <div>
                 <span>已确认 {state.confirmPercent}%</span>
                 <span>{state.confirmCount} 条</span>
             </div>
          </div>
        </Mainbox>
         </Titlelayout>
           
  )
}
