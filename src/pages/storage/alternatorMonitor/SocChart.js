import React, {useState, useEffect, useRef} from 'react'
import style from './style.module.less';
import * as echarts from "echarts";

export default function Index(props){
  const { lineData } = props;
  let lineId = 'socChart'
  const socRef = useRef()
  useEffect(()=>{
    echarts.dispose(socRef.current)
    let socChart = echarts.init(socRef.current);
    socChart.setOption({
      color:[props.color],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '0',
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
        data: lineData.x
      },
      yAxis: {
        type: 'value',
        // min: 24
        scale: true, //自适应
      },
      series: [
        {
          name: props.Unit,
          data: lineData.y,
          type: 'line',
          symbol:'none', 
          smooth: true,
          areaStyle: {}
        }
      ]
    }, true)
  },[props.lineData])
  return <div style={{width:1068, height: 240, marginLeft: 16}}  id={lineId} ref={socRef}></div>
    
}