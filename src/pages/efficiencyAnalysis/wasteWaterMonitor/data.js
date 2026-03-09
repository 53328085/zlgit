import { useMemo } from 'react';
import { isObject } from "@com/usehandler"
import moment from "moment"
let date = moment().subtract(1, "days")
const systematic =  Array.from({length: 24 }, (_,i)=> date.add(i, "m").format("HH:mm") )
const effort = Array.from({length: 24 }, (_, i)=> Math.round(Math.random() * 100*i))
const custom = Array.from({length: 24 }, (_, i)=> Math.round(Math.random() * 100*i))
const cover = Array.from({length: 24 }, (_, i)=> Math.round(Math.random() * 100*i))
console.log(systematic)
export const lineoptdoub = (data, startTime, endTime) => {
   // console.log("data", data)
    let opt = useMemo(() => {

        // const { earlyData = [], lateData = [] } = data
        // const earlyX = earlyData.map(item => item.x)
        // const earlyY = earlyData.map(item => item.y)
        // const lateX = lateData.map(item => item.x)
        // const lateY = lateData.map(item => item.y)
        // const early = startTime?.format?.('YYYY-MM-DD'), late = endTime?.format?.('YYYY-MM-DD');

        return {
            type: 5,
            legend: {
                data: ["PH", "COD", "流量"]
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: "10px",
                right: "150px",
                top: "40px",
                bottom: "2px",
                containLabel: true,
            },
            dataZoom: {
                
            },
            xAxis: [
                {
                    type: 'category',
                   // name: "",
                    boundaryGap: true,
                    data: systematic,
                    axisLabel: {
                        formatter: (value, index) => {
                           return value
                        },
                        interval: "auto",
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: "PH值",
                    nameGap: 20,
                },
                {
                    type: 'value',
                    name: "COD：mg/L",
                    nameGap: 20,
                },
                 {
                    type: 'value',
                    name: "流量：L/S",
                    nameGap: 20,
                    offset: 120,
                }
            ],
            // 系列列表
            series: [
                {
                    name: "PH",
                    type: 'line', 
                    yAxisIndex: 0, // 对应第一个Y轴
                    data: effort, // PH
                    smooth: 3,
                },
                {
                    name: "COD",
                    type: 'line', 
                    yAxisIndex: 1, // 对应第二个Y轴
                    data: custom, // COD
                    smooth: 3
                },
                {
                    name: "流量",
                    type: 'line', 
                    yAxisIndex: 2, // 对应第三个Y轴
                    data: cover, // 流量
                    smooth: 3 
                }
            ]
        };

    }, [])
    return opt
}