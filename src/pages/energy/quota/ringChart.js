import React, {useState, useEffect, Fragment} from 'react'
import { Pie } from '@ant-design/plots';


export default function Index(){
    const ringData = [
        {
            type:'0~20%',
            value: 35,
        },
        {
            type:'21%~40%',
            value: 15,
        },
        {
            type:'41%~60%',
            value: 20,
        },
        {
            type:'61%~80%',
            value: 30,
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
            position: 'bottom',
            itemSpacing:4
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
              fontSize: 16,
              fontWeight:'400',
              textOverflow: 'ellipsis',
            },
            content: '总\n\n100',
          },
        },
      };

    return <Pie style={{width:368,height:321,margin:12}} {...config} />
}