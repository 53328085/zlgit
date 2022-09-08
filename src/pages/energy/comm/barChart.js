import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { Column } from '@ant-design/plots';

export default function Index(){
    const barData = [
        {
          type: '01:00',
          sales: 125.36,
        },
        {
          type: '02:00',
          sales: 251.25,
        },
        {
          type: '03:00',
          sales: 321.25,
        },
        {
          type: '04:00',
          sales: 587.36,
        },
        {
          type: '05:00',
          sales: 258.14,
        },
        {
          type: '06:00',
          sales: 298.36,
        },
        {
          type: '07:00',
          sales: 301.32,
        },
        {
          type: '08:00',
          sales: 428.69,
        },{
          type: '09:00',
          sales: 298.54,
        },
        {
          type: '10:00',
          sales: 125.96,
        },
        {
          type: '11:00',
          sales: 189.15,
        },
        {
          type: '12:00',
          sales: 315.45,
        },
        {
          type: '13:00',
          sales: 425.42,
        },
        {
          type: '14:00',
          sales: 500.23,
        },
        {
          type: '15:00',
          sales: 418.36,
        },
        {
          type: '16:00',
          sales: 428.69,
        },{
          type: '17:00',
          sales: 298.54,
        },
        {
          type: '18:00',
          sales: 125.96,
        },
        {
          type: '19:00',
          sales: 189.15,
        },
        {
          type: '20:00',
          sales: 315.45,
        },
        {
          type: '21:00',
          sales: 0,
        },
        {
          type: '22:00',
          sales: 0,
        },
        {
          type: '23:00',
          sales: 0,
        },
        {
          type: '24:00',
          sales: 0,
        },
      ]
    
      const config = {
        data:barData,
        xField: 'type',
        yField: 'sales',
        label: {
    
          // 可手动配置 label 数据标签位置
          position: 'top',
          // 'top', 'bottom', 'middle',
          // 配置样式
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        meta: {
          type: {
            alias: '时间',
          },
          sales: {
            alias: '用电量(kWh)',
          },
        },
      };

    return <Column style={{width:920,height:712,margin:12}} {...config} />
}