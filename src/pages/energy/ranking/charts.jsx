import React from 'react';
import {Bar} from '@ant-design/plots';
export default function Charts() {
    let data = [
        {
          year: '生产车间2',
          value: 38,
          title:'用电量'
        },
        {
          year: '研发3号楼',
          value: 52,
        },
        {
          year: '行政1号楼',
          value: 61,
        },
        {
          year: '保安室',
          value: 145,
        },
        {
          year: '无聊仓库',
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
