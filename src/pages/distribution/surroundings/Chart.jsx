import React,{useState, useEffect} from 'react'
import dayjs from 'dayjs';
import {Space,DatePicker} from 'antd'
import {SerachButton} from '@com/useButton'
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout' 
import styled from "styled-components"
const Wrap=styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    column-gap:16px;
`
const CardDiv = styled.div`
display:grid;
grid-template-columns:264px 264px 1040px;
height:100%;
justify-content: space-between;
`
export default function Chart(props) {
const {title=""} =props
const [lineOption,setLineOption]=useState({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
})
//仪表图
const [option,setOption] =useState({
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 10
        },
        axisLine: {
          lineStyle: {
            width: 10
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 15,
          color: '#999',
          fontSize: 10
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 15,
          itemStyle: {
            borderWidth: 5
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 20,
          offsetCenter: [0, '70%']
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
})
const onChange=()=>{

}
const customHead = (
    <Wrap>
     <div>日期</div>   
    <DatePicker onChange={onChange} />
    <SerachButton/>
    </Wrap>
)
  return (
 
        <Titlelayout title={title} extra={customHead}>
          <CardDiv>
          <Ichart custoption={option} type={5}/>
          <Ichart custoption={option} type={5}/>
          <Ichart custoption={lineOption} type={5}/>
          
          </CardDiv>
           
        </Titlelayout>

    
  )
}
