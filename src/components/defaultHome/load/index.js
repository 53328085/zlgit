import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'
import {useTranslation} from "react-i18next"
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}


export default function DefaultHome(){
  
  const curProject = useSelector(selectCurProject)
  const guref = useRef(null)
  const {t} = useTranslation(["overview"])
  
const gauge = {
 
  tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'auto',
      bottom: 0,
      icon: 'none',
      formatter: function (name) {
        return  '本月最大负荷率:88.2% 发生时间： 2022-7-21 12:32:12'; 
      },   
    },
    tooltip: {
      trigger: 'item'
    },
    series: [ 
      {
        title: {
  
        },
        name: t("overview:Realtimeloadrate"),
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [
          {
            value: 65.2,
            name:  t("overview:loadrate"),
          }
        ],
      }
    ]
  }
  useEffect(() => {

    drawEcharts(guref.current,  {...gauge, type: 2})

  }, [])
  
  return (
         <Titlelayout title={t("overview:Realtimeloadrate")} {...fs} style={{height: "200px"}} layout="flex">
         <div ref={guref} style={{flex: 1}}>
          </div>
         </Titlelayout>
  )
}
