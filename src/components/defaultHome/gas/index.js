import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import { useReactive } from 'ahooks';

const fs = {
  hv: '24px',
  fc: '#333'
}


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const gref = useRef(null)

  const option = (name, color, type="line") =>  ({
    xAxis: {   
      data: state.x,
    },
    series: [
      {
        data: state.y,
        type,
        name 
      }
    ],
    grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    color 
  });
  
  const tdrawEcharts = (c, option) => {
    return drawEcharts(c, {...option, type:2 })
  }
  const state = useReactive({
    x: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月'],
    y: [150, 230, 224, 218, 135, 147, 460, 224, 218, 135, 147, 460],
  })

  const { GetUseETrends_Gas } = HomeRuntime

  useEffect(() => {
    if (props.type == 'runtTime') {
      GetUseETrends_Gas(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data){
              state.x = data.x
              state.y = data.y
              tdrawEcharts(gref.current, option('用燃气量', ["#ff6803"]))
            }
          }else{
            message.error(res.errMsg)
          }
      })
    }else{
      tdrawEcharts(gref.current, option('用燃气量', ["#ff6803"]))
    }
    // tdrawEcharts(gref.current, option('用燃气量', ["#ff6803"]))
  }, [])
  
  return (
    <Titlelayout title={'用燃气量'} {...fs}>
        <div ref={gref} style={{width: '422px', height: '142px'}}></div>
    </Titlelayout>
  )
}
