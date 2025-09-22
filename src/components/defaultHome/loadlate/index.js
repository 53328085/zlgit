import React, { useRef, useEffect, useState } from 'react'
 
import styled from 'styled-components';
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 import {useTranslation} from 'react-i18next';
 import Ichart from "@com/useEcharts/Ichart"
 
const Divorder = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
   
  
`

const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y",
  layout:'flex'
}

export default function DefaultHome(props) {
   console.log(props)
   const {t} = useTranslation(["overview", "comm"])
   const  custoption ={
    type: 5,
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    
    },
    series: [
      {
        type: 'gauge',
        center: ["50%", "56%"],
        radius: 80,
        progress: {
          show: true,
         // width: 18
        },
        axisLine: {
          lineStyle: {
           // width: 18
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
        //  length: 15,
          lineStyle: {
            width: 1,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 12,
          color: '#999',
          fontSize: 9
        },
        anchor: {
          show: true,
          showAbove: true,
         // size:10,
          itemStyle: {
         //  borderWidth: 5
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          offsetCenter: [0, '60%']
        },
        data: [
          {
            value: props.loadRate
          }
        ]
      }
    ]
      }
 
  return (
    <Titlelayout title="负荷率" {...fs} style={{minHeight: '200px'}}>
      <Divorder>
         <Ichart  custoption={custoption}/> 
      </Divorder>
    </Titlelayout>
  )
}
