import React, {useRef, useEffect, useMemo} from 'react'
import {useSelector} from 'react-redux'

import { selectProjectId, themeColor } from '@redux/systemconfig.js'
import styled from 'styled-components';
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
import { drawEcharts } from "@com/useEcharts"; 
import Ichart from "@com/useEcharts/Ichart"
import {hextodec} from "@com/usehandler"
import {HomeRuntime } from '@api/api.js'
import { useReactive } from 'ahooks';
 import {useTranslation} from "react-i18next"
 
const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(116px, 1fr)  minmax(max-content, 1fr);
 column-gap: 16px;
 min-height: 142px;
 height: 100%;
 width: 100%;
 align-items: center;
 justify-items: center;
  .chart {
    display: flex;
    height: 100%;
    width: 100%;
  }
 .alarm {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
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
 // hv: '24px',
  fc: '#333'
}


export default function DefaultHome(props){
  const {type} = props
  const projectId = useSelector(selectProjectId)
  const {warningColor} = useSelector(themeColor)
  const ref= useRef()
  const {t} = useTranslation(["overview","comm"])
  const state = useReactive({
    alarmCount: 30,
    confirmCount: 0,
    unconfirmCount: 30,
    confirmPercent: 0,
    unconfirmPercent: 0,
  })
  const rgb = hextodec(warningColor);
  
  const option =useMemo(()=>  ({
    
      type: 4,
      
      liuqiu: {
        series: {
         data: [(state.alarmCount/50)],
         waveLength: "89%",
         backgroundStyle: {
          borderWidth: 2,
          borderColor: warningColor,
          color: rgb?.length==3 ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},0.15)` : "#fff"
         },
         color: [warningColor],
         outline: {
            show:false
         },
        label: {
          normal: {
       formatter: function() {
                return `${t("overview:AlarmOfToday")}\n {a|${state.alarmCount}次}`;
            },  
            textStyle: {
                fontSize: 16,
                color: '#333'
            },
            position: ['50%', '65%'],
            rich: {
              a: {
                lineHeight: 22,
                fontSize: "small",
                fontWeight: "bold"
              }
            }
         }
        },
        
      },
     
    }
    
  }), [state?.alarmCount,warningColor, rgb ])

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
             // tdrawEcharts()
            }
          }else{
            message.error(res.errMsg)
          }
      })
    }else{
     // tdrawEcharts()
    }
    
  },[projectId, type,warningColor])
  
  return (
         <Titlelayout title={t("overview:AlarmOfToday")} {...fs} style={{minHeight: "200px", height: "100%"}}>
        <Mainbox>
          <div className='chart' >
            <Ichart {...option} />
          </div>
          <div className='alarm'>
             <div>
                 <span>{t("comm:NotConfirmed")} {state.unconfirmPercent}%</span>
                 <span>{state.unconfirmCount} {t("comm:Piece")}</span>
             </div>
             <div>
                 <span>{t("comm:Confirmed")} {state.confirmPercent}%</span>
                 <span>{state.confirmCount} {t("comm:Piece")}</span>
             </div>
          </div>
        </Mainbox>
         </Titlelayout>
           
  )
}
