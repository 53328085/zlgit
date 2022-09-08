import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { Pie } from '@ant-design/plots';

export default function Index(){
    const ringData = [
        {
            type:'照明插座用电',
            value: 65,
        },
        {
            type:'空调用电',
            value: 10,
        },
        {
            type:'动力用电',
            value: 20,
        },
        {
            type:'特殊区域用电',
            value: 5,
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
            },
            content: '总\n100',
          },
        },
      };

    return <Pie style={{width:368,height:321,margin:12}} {...config} />
}