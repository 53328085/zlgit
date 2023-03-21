import React, {useState, useEffect, useRef} from 'react'
import * as echarts from "echarts";

export default function Index(props){
  const lineRef = useRef()
  useEffect(()=>{
    echarts.dispose(lineRef.current)
    let lineChart = echarts.init(lineRef.current);
    lineChart.setOption({
      color:['#b8cdf8'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '0px',
        left: 'center',
        itemWidth: 16,
        itemHeight: 12
      },
      grid: {
        top: '20px',
        left: '16px',
        right: '0%',
        bottom: '32px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick:{
          alignWithLabel:true
        },
        data: props.data.x
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'实时功率(kW)',
          data: props.data.y,
          type: 'line',
          symbol:'none', 
          smooth: true,
          areaStyle: {}
        }
      ]
    })
  },[props.data])
  return <div style={{width:448,height:199}} id='lineChart' ref={lineRef}></div>
}