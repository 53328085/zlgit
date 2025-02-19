import React, { useState, useEffect } from 'react'
import moment from 'moment';
import styled, { css } from 'styled-components';
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout'
const sty = css`
  column-gap: 8px;
`
const Chartwrap = styled.div`
 display: flex;
 flex:1;
 
 justify-content: space-between;
 height: 200px;
 ${props => props.laptop ? sty : null}
 .yb {
  flex:1 1 264px;
 }
 .line {
  display: flex;
  flex: 1 1 1040px;
 }
`
const comoptionfn = (laptop) => ({
  type: 5,
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

  },
  tooltip: {
    formatter: ' {b} : {c}%'
  },
  color: ['#6395fa'],
  series: [{
    type: 'gauge',

    center: ["50%", "50%"],
    radius: laptop ? 65 : 90,
    progress: {
      show: true,
      // width: 18
    },
    axisLine: {
      lineStyle: {
        width: laptop ? 8 : 10
        // width: 18
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      //  length: 15,
      lineStyle: {
        width: 1,
        color: '#999'
      }
    },
    axisLabel: {
      distance: 12,
      color: '#999',
      fontSize: laptop ? 7 : 9
    },
    anchor: {
      show: true,
      showAbove: true,
      // size:10,
      itemStyle: {
        //  borderWidth: 5
      }
    },
    title: {
      show: false
    },
    detail: {
      valueAnimation: true,
      formatter: '{value}',
      offsetCenter: [0, '70%'],
      fontSize: laptop ? 20 : 30
    },


  }]

})
export default function Chart({ data, laptop, allData }) {
  let { trend } = data
  // #6395fa
  let comoption = comoptionfn(laptop)
  const toption = {
    ...comoption,
    series: [{
      ...comoption.series[0],
      name: data.name,
      data: [
        {
          title: {
            show: true,
            fontSize: laptop ? "12px" : "14px",
            offsetCenter: [0, "30%"]
          },
          value: parseFloat(data.temperature),
          name: "温度 (℃)",
        }
      ]

    }]
  }

  const voption = {
    ...comoption,
    series: [{
      ...comoption.series[0],
      name: data.name,
      data: [
        {
          title: {
            show: true,
            fontSize: laptop ? "12px" : "14px",
            offsetCenter: [0, "30%"]
          },
          value: parseFloat(data.humidity),
          name: "湿度 (%)",
        }
      ]

    }]
  }
  const [option, setOption] = useState({
    grid: {
      left: "150px",
      right: "72px",
    },
    legend: {
      data: ["温度", "湿度"],
      position: 'center',
    },
    series: [{ type: 'line', yAxisIndex: 0, smooth: true, areaStyle: null }, { type: "line", yAxisIndex: 1, smooth: true, areaStyle: null }],

    xAxis: {
      type: 'category',
    },
    yAxis: [
      {
        type: 'value',
        name: '环境温度',
        position: 'left',
        axisLabel: {
          formatter: '{value}°C'
        }
      },
      {
        type: 'value',
        name: '环境湿度',

        position: 'right',
        axisLabel: {
          formatter: '{value}%'
        }
      }

    ],
  })
  useEffect(() => {
    if (Array.isArray(trend?.y) && Array.isArray(trend?.y1)) {
      // let tp = tempTrends.map((t, index) => ({ ...t, y1: humidityTrends[index].y }))
      // console.log(tp);
      setOption({
        ...option,
        dataset: {
          dimensions: [
            { name: 'x', type: "time" },
            { name: 'y', displayName: '温度' },
            { name: 'y1', displayName: '湿度' }
          ],
          source: trend,
        }
      })
    }

  }, [trend])
  return (

    <Titlelayout layout="flex" style={{ flexBasis: '296px' }} title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{data.name}</span>
    </div>}>

      <Chartwrap laptop={laptop}>
        <div className='yb'>
          <Ichart custoption={toption} />
        </div>
        <div className='yb'>
          <Ichart custoption={voption} />
        </div>
        <div className='line'>
          <Ichart {...option} />
        </div>
      </Chartwrap>
    </Titlelayout >
  )
}
