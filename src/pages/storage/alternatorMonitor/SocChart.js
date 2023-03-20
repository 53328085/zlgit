import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import * as echarts from "echarts";

export default function Index(props){
  const { lineData } = props;
  let lineId = 'socChart'
  useEffect(()=>{
    let socChart = echarts.init(document.getElementById(lineId));
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
    })
  },[props.lineData])
  return <div style={{width:1068, height: 184, marginLeft: 16}}  id={lineId}></div>
    
}