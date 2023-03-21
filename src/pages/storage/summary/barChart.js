import React, {useState, useEffect, useRef} from 'react'
import * as echarts from "echarts";

export default function Index(props){
  const barRef = useRef()
  useEffect(()=>{
    // let barChart = echarts.init(document.getElementById('barChart'));
    echarts.dispose(barRef.current)
    let barChart = echarts.init(barRef.current)
    barChart.setOption({
      color:['#237ae4'],
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
        right: '6px',
        bottom: '16px',
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
          name:'储能系统收益(元)',
          data: props.data.y,
          type: 'bar'
        }
      ]
    })
  },[props.barData])
  return <div style={{width:448,height:199}} id='barChart' ref ={barRef}></div>
}