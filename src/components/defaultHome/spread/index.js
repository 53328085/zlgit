import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'

const fs = {
  hv: '24px',
  fc: '#333'
}

const pieData = [
  { value: 30, name: "组合式电气火灾监测器" },
  { value: 25, name: "智能微断" },
  { value: 25, name: "导轨表" },
  { value: 20, name: "其他" },
];

export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const wnref = useRef(null)

  useEffect(() => {
    drawEcharts(wnref.current,  {pieData: {data: pieData, radius: '75%', },legend: {
      top: 'auto',
      bottom: 0,
    }, type: 3})
  }, [])
  
  return (
         <Titlelayout title={'报警分布'} {...fs}>
         <div ref={wnref} style={{width: '422px', height: '358px'}}>
         </div>
         </Titlelayout>
  )
}
