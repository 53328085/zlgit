import React from 'react'
import style from './style.module.less'
import columnpng from '@imgs/columns.png'
import LineCharts from './lineCharts'
export default function selectHeader({type,typeIndex,setTypeIndex,typeDate,setTypeDate}) {
    
    const datetype = [{name:'日',value:0},{name:'月',value:1},{name:'年',value:2}]
    return (
        <div className={style.totalCharts}>
            <div className={style.chartsheader}>
                <div className={style.totaltype}>
                    <img src={columnpng} style={{ width: 36, height: 24, padding: '0 3px', }} alt=""></img>
                    {type.map((item, index) => (<div key={item.value} className={style.type + ' ' + (typeIndex === index ? style.activetype : null)} onClick={() => { setTypeIndex(index)}}>{item.name}</div>))}
                </div>
                <div className={style.totaltype}>
                    {datetype.map((item, index) => (<div style={{ width: 86 }} className={typeDate === index ? (style.activetype + " " + style.type) : style.type} onClick={() => { setTypeDate(index)}}>{item.name}</div>))}
                </div>
            </div>
            <div style={{ padding: '16px 16px 0px 16px', height: 346 }}>
                <LineCharts />
            </div>

        </div>
    )
}
