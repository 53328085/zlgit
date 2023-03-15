import React, {useState, useEffect, Fragment} from 'react'
import * as echarts from "echarts";

export default function Index(){
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
        data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'综合能耗(吨标煤)',
          data: [125.36, 251.25, 321.25, 587.36, 258.14, 298.36, 301.32, 428.69, 298.54, 125.96, 189.15, 315.45, 
            425.42, 500.23, 418.36, 428.69, 298.54, 125.96, 189.15, 315.45, 0, 0, 0, 0],
          type: 'bar'
        }
      ]
    })
  },[])
  return <div style={{width:1368,height:334}} id='barChart'></div>
}