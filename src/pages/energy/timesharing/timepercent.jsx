import React from 'react'
import Bluecolumn from '@com/bluecolumn';
import style from './style.module.less'
import { Pie } from '@ant-design/plots';
import warn from '@imgs/warn.png'
export default function Timepercent() {
    const data = [
        {
            type: '尖占比',
            value: 27,
        },
        {
            type: '峰占比',
            value: 25,
        },
        {
            type: '平占比',
            value: 18,
        },
        {
            type: '谷占比',
            value: 15,
        }
    ];
    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        innerRadius: 0.7,
        legend:{
            position: 'bottom',
            offsetY: -16
        },
        label:{
            type:'outer',
            formatter:v=>v.value+'%'
        },
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 'normal',
                    fontSize: '16px'
                },
                content: `总\n${100}`,
            },
        },
    };
    return (
        <div className={style.timeper}>
            <div className={style.percent}>
                <Bluecolumn name="分时占比" />
                <Pie {...config}/>
            </div>
            <div className={style.analysis}>
                <Bluecolumn name="用电分析" />
               <div style={{padding:'16px 0',display: 'flex'}}>
               <img src={warn} style={{marginRight:16,flexShrink:0,width:32,height:32}}></img>
               <div> 今日时段内,峰电量占总电量26%,占比较大。
               请合理利用峰谷用电。</div>
              
               </div>
            </div>
        </div>
    )
}
