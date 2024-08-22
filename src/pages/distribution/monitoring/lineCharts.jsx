import React from 'react'
import { Line } from '@ant-design/plots';
export default function LineCharts() {
    const line1 = [
      {
        "date": "2018/8/12",
        "type": "A相电流",
        "value": 3491
      },
      {
        "date": "2018/8/13",
        "type": "A相电流",
        "value": 2852
      },
      {
        "date": "2018/8/14",
        "type": "A相电流",
        "value": 4788
      },
      {
        "date": "2018/8/15",
        "type": "A相电流",
        "value": 4319
      },
    ]
    const line2 = [
      {
        "date": "2018/8/12",
        "type": "B相电流",
        "value": 456
      },
      {
        "date": "2018/8/13",
        "type": "B相电流",
        "value": 689
      },
      {
        "date": "2018/8/14",
        "type": "B相电流",
        "value": 280
      },
      {
        "date": "2018/8/15",
        "type": "B相电流",
        "value": 176
      }
    ]
    const data=[
      ...line1,
      ...line2,
      {
        "date": "2018/8/12",
        "type": "C相电流",
        "value": 6419
      },
      {
        "date": "2018/8/13",
        "type": "C相电流",
        "value": 6419
      },
      {
        "date": "2018/8/14",
        "type": "C相电流",
        "value": 1643
      },
      {
        "date": "2018/8/15",
        "type": "C相电流",
        "value": 445
      },
      
      
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
          return type === 'A相电流' ? '#F4664A' : type === 'C相电流' ? '#30BF78' : '#FAAD14';
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
