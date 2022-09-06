import React from 'react';
import {Bar} from '@ant-design/plots';
export default function Charts() {
    let data = [
        {
          year: '1951 年',
          value: 38,
          title:'用电量'
        },
        {
          year: '1952 年',
          value: 52,
        },
        {
          year: '1956 年',
          value: 61,
        },
        {
          year: '1957 年',
          value: 145,
        },
        {
          year: '1958 年',
          value: 48,
        },
      ];
      let mapData = data.map(item=>({...item,title:'用电量(kwh)'}))
      console.log(mapData)
      const config = {
        data:mapData,
        xField: 'value',
        yField: 'year',
        maxBarWidth: 30,
        seriesField: 'title',
        legend: {  
            layout: 'horizontal',

            position: 'bottom',
         }
      };
      return <Bar {...config} />;
}
