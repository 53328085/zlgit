import React, {useState, useEffect, Fragment} from 'react'
import * as echarts from "echarts";

export default function Index(props){
  console.log(props)
  useEffect(()=>{
    let barChart = echarts.init(document.getElementById('barChart'));
    barChart.setOption({
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
        data: props.barData.x
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'综合能耗(吨标煤)',
          data: props.barData.y,
          type: 'bar'
        }
      ]
    })
  },[props.barData])
  return <div style={{width:1368,height:334}} id='barChart'></div>
}