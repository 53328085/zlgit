import React from 'react'
import { Line } from '@ant-design/plots';
export default function LineCharts() {
    const data=[{
        "date": "2018/8/12",
        "type": "register",
        "value": 3491
      },
      {
        "date": "2018/8/12",
        "type": "bill",
        "value": 456
      },
      {
        "date": "2018/8/13",
        "type": "download",
        "value": 6419
      },
      {
        "date": "2018/8/13",
        "type": "register",
        "value": 2852
      },
      {
        "date": "2018/8/13",
        "type": "bill",
        "value": 689
      },
      {
        "date": "2018/8/14",
        "type": "download",
        "value": 1643
      },
      {
        "date": "2018/8/14",
        "type": "register",
        "value": 4788
      },
      {
        "date": "2018/8/14",
        "type": "bill",
        "value": 280
      },
      {
        "date": "2018/8/15",
        "type": "download",
        "value": 445
      },
      {
        "date": "2018/8/15",
        "type": "register",
        "value": 4319
      },
      {
        "date": "2018/8/15",
        "type": "bill",
        "value": 176
      }
    ]
    const config = {
        data,
        xField: 'date',
        yField: 'value',
        
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        seriesField: 'type',
        point: {
          size: 5,
          style: {
            lineWidth: 1,
            fillOpacity: 1,
          },
          shape: 'circle',
        },
        color: ({ type }) => {
          return type === 'register' ? '#F4664A' : type === 'download' ? '#30BF78' : '#FAAD14';
        },
        lineStyle: {
          lineWidth:1
        },
        legend:{
          position:'bottom'
        },
        slider: {
            start: 0,
            end: 0.5,
          },
      };
     
    return (
        <Line {...config} style={{height:314}}/>
  )
}
