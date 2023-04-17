import React, {useState, useEffect, useRef} from 'react'
import style from './style.module.less';
import * as echarts from "echarts";

export default function Index(props){
  const { lineData } = props;
  let lineId = 'lineChart'
  const lineRef = useRef()
  useEffect(()=>{
    // let powerChart = echarts.init(document.getElementById(lineId));
    echarts.dispose(lineRef.current)
    let powerChart = echarts.init(lineRef.current)
    powerChart.setOption({
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
        data: lineData.x,
        boundaryGap: true,
        axisTick:{
          alignWithLabel:true
        },
      },
      yAxis: {
        type: 'value',
        scale: true, //自适应
        // min: function(value){
        //   return (value / 1000) * 1000
        // }
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
  return <div style={{width:1068, height: 240, marginLeft: 16}}  id={lineId} ref={lineRef}></div>
    
}