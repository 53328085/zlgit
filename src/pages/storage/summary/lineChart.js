import React, {useState, useEffect, useRef} from 'react'
import * as echarts from "echarts";

export default function Index(props){
  const lineRef = useRef()
  useEffect(()=>{
    // let barChart = echarts.init(document.getElementById('barChart'));
    echarts.dispose(lineRef.current)
    let lineChart = echarts.init(lineRef.current)
    lineChart.setOption({
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
        data: props.data.date
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
          name:'充电电量(kWh)',
          data: props.data.chargingIncome,
          type: 'line',
          symbol:'none', 
          areaStyle: {},
        },
        {
          name:'放电电量(kwh)',
          data: props.data.disChargingIncome,
          type: 'line',
          symbol:'none', 
          areaStyle: {}
        },
      ]
    })
  },[props.barData])
  return <div style={{width:504,height:272}} id='lineChart' ref ={lineRef}></div>
}