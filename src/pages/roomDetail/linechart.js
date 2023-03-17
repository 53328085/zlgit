import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import * as echarts from "echarts";

export default function Index(props){
  const { lineData } = props;
  let lineId = 'lineChart' + Math.random();
  useEffect(()=>{
    let lineChart = echarts.init(document.getElementById(lineId));
    lineChart.setOption({
      color:['#237ae4'],
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
        data: lineData.x
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: props.Unit,
          data: lineData.y,
          type: 'line'
        }
      ]
    })
  },[lineData])
  return <div className={style.chartTab}>
    <div className={style.itemTitle}><span>{ props.Name }</span></div>
    <div style={{width:456,height:334,}}  id={lineId}></div>
  </div>
    
}