import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { Line } from '@ant-design/plots';

export default function Index(props){
    
    const { lineData } = props;
    
      const config = {
        data:lineData.valueList,
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
            alias: lineData.Unit,
          },
        },
      };

    return <div className={style.chartTab}>
    <div className={style.itemTitle}><span>{ lineData.Name }</span></div>
    <Line style={{width:424,height:334,margin:12}} {...config} />
</div>
    
}