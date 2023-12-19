import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import { drawEcharts } from '@com/useEcharts'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import {  message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y",
  
}

// const pieData = 

export default function DefaultHome(props) {
  const projectId = useSelector(selectProjectId)
  const wnref = useRef(null)

  const { GetWarningDistribute } = HomeRuntime

  const [options, setOptions] = useState({ 
    grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "35px",
      bottom: "0px",
      containLabel: true,
    },
    type: 3,
    pieData: {
      data: [],
      total: '100%', 
      radius:  "65%",
    },
    legend: {
      top: 6,
    },
  })

  useEffect(() => {

    if (props.type == 'runtTime') {
      GetWarningDistribute(projectId).then(res => {
        let { success, data } = res
        if (success) {
          if (Array.isArray(data)) { 
             setOptions({
              ...options,
              pieData: {
                ...options.pieData,
                data,
              }
             })
          }
          
        } else {
          message.error(res.errMsg)
        }
      })
    } 
  }, [])
  const sty = {
    height: '200px' 
  }
  return (
    <Titlelayout title={'告警分布'} {...fs} layout="flex" style={sty}>
        <div  style={{flex: 1, display: 'flex'}}>
             <Ichart {...options} />
         </div>
    </Titlelayout>
  )
}
