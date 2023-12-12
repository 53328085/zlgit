import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

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
      name: '实时负荷率',
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
          name: '负荷率%'
        }
      ],
    }
  ]
}

export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const guref = useRef(null)

  useEffect(() => {

    drawEcharts(guref.current,  {...gauge, type: 2})

  }, [])
  
  return (
         <Titlelayout title={'实时负荷率'} {...fs}>
         <div ref={guref} style={{width: '422px', height: '358px'}}>
          </div>
         </Titlelayout>
  )
}
