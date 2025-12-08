// 香炉山

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
  grid-template-rows: minmax(240px, 1fr)  56px;
  row-gap: 16px;
 width: 100%;
 height: 100%; 
  .chart {
    display: flex;
    height: 100%;
    width: 100%;
  }
  
 .content{ 
  display: flex;
  column-gap: 10px; 
  .item{
    flex:1;
    display: flex;  
    flex-direction: column;
    background: #F2F7FF;
    border-radius: 4px;
    padding: 6px 12px;
    .title {
      font-weight: 600;
      font-size: 13px;
      color: #909399;
    }
    .value {
      font-weight: 600;
font-size: 13px;
color: #303133;
    }
  }
 }

`


const fs = {
 // hv: '24px',
  fc: '#333',
  layout: "flex"
}


export default function DefaultHome(props){
  const {type} = props
 
  const {primaryColor} = useSelector(themeColor)
 
  const state = useReactive({
    alarmCount: 30,
    confirmCount: 0,
    unconfirmCount: 30,
    confirmPercent: 0,
    unconfirmPercent: 0,
  })
  const rgb = hextodec(primaryColor)
  const fntcolor = rgb?.length==3 ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},0.35)` : "#fff";
  
  const option =useMemo(()=>  ({
    
      type: 4,
      
      liuqiu: {
        series: {
         data: [(state.alarmCount/50)],
         waveLength: "89%",
         backgroundStyle: {
          borderWidth: 2,
          borderColor: primaryColor,
          color: fntcolor 
         },
         color: [primaryColor],
         outline: {
            show:false
         },
        label: {
          normal: {
       formatter: function() {
                return `{a|${typeof  props?.loadRate=="number" ? props?.loadRate : 0}%}\n {b|实时负荷率}`;
            },              
            position: ['50%', '50%'],
            rich: {
              a: { 
                fontWeight: "bold",
                fontSize: 26,
                color:fntcolor,
              },
              b:{ 
                fontSize: 16,
                color: "#303133",
                fontWeight: "bold",
              }

            }
         }
        },
        
      },
     
    }
    
  }), [props.loadRate,primaryColor, fntcolor ])

  

 
  
  return (
         <Titlelayout title="负荷率"  {...fs} style={{minHeight: "400px", height: "100%"}}>
        <Mainbox>
          <div className='chart' >
            <Ichart {...option} />
          </div>
          <div className='content'>
             <div className='item'>
                 <div className="title">实时总负荷(kW)</div>
                 <div className='value'>{props.sumLoad}</div>
             </div>
             <div className='item'>
             <div className="title">总容量(kVA)</div>
             <div className='value'>{props.sumCapacity}</div>
             </div>
          </div>
        </Mainbox>
         </Titlelayout>
           
  )
}
