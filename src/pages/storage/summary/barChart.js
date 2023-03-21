import React, {useState, useEffect, useRef} from 'react'
import * as echarts from "echarts";

export default function Index(props){
  const barRef = useRef()
  useEffect(()=>{
    // let barChart = echarts.init(document.getElementById('barChart'));
    echarts.dispose(barRef.current)
    let barChart = echarts.init(barRef.current)
    barChart.setOption({
      color:['#5fba5c', '#4d77ff', '#9951fe'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '0px',
        left: 'center',
        itemWidth: 12,
        itemHeight: 12
      },
      grid: {
        top: '28px',
        left: '6px',
        right: '6px',
        bottom: '0px',
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
      yAxis: [
        {
          type: 'value',
          scale: true, //自适应,
          splitNumber:5,
        },
        {
          type: 'value',
          scale: true, //自适应
          splitNumber:5,
        },
      ],
      series: [
        {
          name:'充电金额(元)',
          data: props.data.y,
          type: 'bar'
        },
        {
          name:'放电金额(元)',
          data: props.data.z,
          type: 'bar',
          barGap:'0',
        },
        {
          name:'收益(元)',
          yAxisIndex: 1,
          data: props.data.line,
          type: 'line',
          symbol:'circle', 
          smooth: false,
        },
      ]
    })
  },[props.barData])
  return <div style={{width:504,height:392}} id='barChart' ref ={barRef}></div>
}