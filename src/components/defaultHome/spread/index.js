import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import { drawEcharts } from '@com/useEcharts'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import {  message } from 'antd';
import UseEmpty from '@com/useEmpty'
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

  const state = useReactive({
    pieData: [
    ]
  })

  useEffect(() => {

    if (props.type == 'runtTime') {
      GetWarningDistribute(projectId).then(res => {
        let { success, data } = res
        if (success) {
          if (data && data.length > 0) {
            state.pieData = data
          } else {
            state.pieData = []
          }

          drawEcharts(wnref.current, {
            pieData: { data: state.pieData, radius: '75%', }, legend: {
              top: 'auto',
              bottom: 0,
            }, type: 3
          })

        } else {
          message.error(res.errMsg)
        }
      })
    } else {
      drawEcharts(wnref.current, {
        pieData: { data: state.pieData, radius: '75%', }, legend: {
          top: 'auto',
          bottom: 0,
        }, type: 3
      })
    }
  }, [])
  const sty = {
    width: '422px', height: '358px', display: 'flex' 
  }
  return (
    <Titlelayout title={'报警分布'} {...fs}>
     { (state?.pieData?.length > 0) ? <div ref={wnref} style={sty}></div>
      : <div style={sty}><UseEmpty /></div>
      }
    </Titlelayout>
  )
}
