import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { Pie } from '@ant-design/plots';

export default function Index(){
    const ringData = [
        {
            type:'点',
            value: 24.36,
        },
        {
            type:'水',
            value: 12.95,
        },
        {
            type:'燃气',
            value: 18.71,
        }
    ]
    
    const config = {
        appendPadding: 10,
        data:ringData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        innerRadius: 0.8,
        legend: {
            layout: 'horizontal',
            position: 'bottom'
          },
        label: {
          type: 'spider',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 14,
          },
        },
        interactions: [
          {
            type: 'element-selected',
          },
          {
            type: 'element-active',
          },
        ],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 14,
              color:'#666',
            },
            content: '总\n56.02',
          },
        },
      };

    return <div className={style.chartTab}>
        <div className={style.itemTitle}><span>能耗分布</span></div>
        <Pie style={{width:456,height:334,margin:12}} {...config} />
    </div>
}