import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import * as echarts from "echarts";

const Mainbox = styled.div`
  width: 936px;
  height: 416px;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  .headerTitle{
    padding-left: 16px;
    border-left: 4px solid #237ae4;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #333;
  }
`
export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const barRef = useRef()
  useEffect(()=>{
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
        itemWidth: 15,
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
        data: ['03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '03/21']
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
          data: ['523.23', '418.58', '306.98', '489.32', '874.59', '742.63', '684.25'],
          type: 'bar'
        },
        {
          name:'放电金额(元)',
          data: ['685.25', '514.23', '451.36', '598.32', '957.32', '845.36', '874.39'],
          type: 'bar',
          barGap:'0',
        },
        {
          name:'收益(元)',
          yAxisIndex: 1,
          data: ['162.02', '95.65', '144.38', '109', '82.73', '102.73', '190.14'],
          type: 'line',
          symbol:'circle', 
          smooth: false,
        },
      ]
    })
  },[])

  return (
         <Mainbox>
            <div className='headerTitle'>储能收益统计</div>
            <div style={{width:896,height:338}} id='barChart' ref ={barRef}></div>
         </Mainbox>
           
  )
}
