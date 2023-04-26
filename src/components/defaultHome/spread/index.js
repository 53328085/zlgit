import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import { drawEcharts } from '@com/useEcharts'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';

const fs = {
  hv: '24px',
  fc: '#333'
}

// const pieData = 

export default function DefaultHome(props) {
  const projectId = useSelector(selectProjectId)
  const wnref = useRef(null)

  const { GetWarningDistribute } = HomeRuntime

  const state = useReactive({
    pieData: [
      { value: 30, name: "组合式电气火灾监测器" },
      { value: 25, name: "智能微断" },
      { value: 25, name: "导轨表" },
      { value: 20, name: "其他" },
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

  return (
    <Titlelayout title={'报警分布'} {...fs}>
      <div ref={wnref} style={{ width: '422px', height: '358px' }}>
      </div>
    </Titlelayout>
  )
}
