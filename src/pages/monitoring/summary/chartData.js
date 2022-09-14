import React, {useEffect,useState,Fragment} from "react";
import * as echarts from "echarts";
import style from './style.module.less'
import hidden from './images/hidden.png'
import warning from './images/warning.png'

export default function ChartData({opts, itemValue }){
    let mainId = 'lineChart' + Math.random();
    useEffect(()=>{
        let lineChart = echarts.init(document.getElementById(mainId));
        lineChart.setOption({
            title: {
                text: opts.title,
                left: 0,
                top: 0,
                textStyle: {
                  fontSize: 20
                },
              },
            toolbox: {
            show: true,
            feature: {
                dataZoom: {
                yAxisIndex: 'none'
                },
                dataView: {
                    show:true,
                readOnly: false
                },
                magicType: {
                type: ['line', 'bar']
                },
                restore: {
                    show:true
                },
                saveAsImage: {
                    show:true
                }
            }
            },
            tooltip:{
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend:{
                show: true,
            },
            xAxis: {
            type: 'category',
            boundaryGap: false,
            data: opts.Time
            },
            yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} kW'
            }
            },
            series: [
            {
                name: 'kW',
                type: 'line',
                data: opts.lineData,
                markPoint: {
                data: [
                    {
                    type: 'max',
                    name: 'Max'
                    },
                    {
                    type: 'min',
                    name: 'Min'
                    }
                ]
                },
                markLine: {
                data: [
                    {
                    type: 'average',
                    name: 'Avg'
                    }
                ]
                }
            }
            ]
        }
        )
    })
    
    return (
        <div className={style.chartItem}>
            <div className={style.linechart} id={mainId}></div>
            <div className={style.dataItem}>
                { itemValue.map((item, index)=>{
                    return <Fragment key={index}>
                        <div className={style.title}>{item.name} <span className={style.subTitle}>{item.subTitle}{item.Time}</span></div>
                        { item.theme? <div className={style.itemDesc}>
                            {item.theme == 'hidden'? <img className={style.stateImg} src={hidden}></img>:<img className={style.stateImg} src={warning}></img>}
                            <span className={style.desc}>{item.description}</span>
                        </div> : <div className={style.itemData}>{item.value}<span className={style.unit}>{item.unit}</span></div> }
                    </Fragment>
                })}
            </div>
        </div>
    )
}