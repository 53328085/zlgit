import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import * as echarts from "echarts";
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';

const fs = {
  hv: '24px',
  fc: '#333'
}

export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const lineRef = useRef()
  const { GetCFETrends } = HomeRuntime

  const getConfig = (x, y, y1) => {
    echarts.dispose(lineRef.current)
    let lineChart = echarts.init(lineRef.current);
    lineChart.setOption({
      color:['#ffe7d6', '#d6efd6'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '20px',
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
        data: x
      },
      yAxis: {
        type: 'value',
        // min: 24
        scale: true, //自适应
      },
      series: [
        {
          name: '充电量(kWh)',
          data: y,
          type: 'line',
          symbol:'none', 
          smooth: true,
          areaStyle: {
          }
        },
        {
            name: '放电量(kWh)',
            data: y1,
            type: 'line',
            symbol:'none', 
            smooth: true,
            areaStyle: {
            }
          },
      ]
    }, true)
  }

  useEffect(()=>{
    if (props.type == 'runtTime') {
      GetCFETrends(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data){
              getConfig(data.x, data.y, data.y1)
            }else{
              getConfig([],[],[])
            }
          }else{
            message.error(res.errMsg)
          }
      })
    } else {
      getConfig(['3月23日', '3月24日', '3月25日', '3月26日', '3月27日', '3月28日', '3月29日'],['170', '160','140.4', '90.23', '153.24', '211.5', '141.65'],['200', '300','170.4', '190.23', '273.24', '241.5', '201.65'])
    }
    
  },[])
  
  return (
         <Titlelayout title={'充放电量趋势'} {...fs}>
            <div style={{width: '440px', height: '358px'}}  ref={lineRef}></div>
         </Titlelayout>
  )
}
