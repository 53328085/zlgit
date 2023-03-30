import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import * as echarts from "echarts";

const fs = {
  hv: '24px',
  fc: '#333'
}

export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const lineRef = useRef()
  useEffect(()=>{
    echarts.dispose(lineRef.current)
    let lineChart = echarts.init(lineRef.current);
    lineChart.setOption({
      color:['#ffe7d6', '#d6efd6'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '20px',
        left: 'center'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick:{
          alignWithLabel:true
        },
        data: ['3月23日', '3月24日', '3月25日', '3月26日', '3月27日', '3月28日', '3月29日']
      },
      yAxis: {
        type: 'value',
        // min: 24
        scale: true, //自适应
      },
      series: [
        {
          name: '充电量(kWh)',
          data: ['200', '300','170.4', '190.23', '273.24', '241.5', '201.65'],
          type: 'line',
          symbol:'none', 
          smooth: true,
          areaStyle: {
          }
        },
        {
            name: '放电量(kWh)',
            data: ['170', '160','140.4', '90.23', '153.24', '211.5', '141.65'],
            type: 'line',
            symbol:'none', 
            smooth: true,
            areaStyle: {
            }
          },
      ]
    }, true)
  },[])
  
  return (
         <Titlelayout title={'充放电量趋势'} {...fs}>
            <div style={{width: '440px', height: '358px'}}  ref={lineRef}></div>
         </Titlelayout>
  )
}
