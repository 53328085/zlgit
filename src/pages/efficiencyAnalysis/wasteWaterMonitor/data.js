import { useMemo } from 'react';
import { isObject } from "@com/usehandler"
import moment from "moment"
 
export const lineoptdoub = ({data,type}) => {
   // console.log("data", data)
    let opt = useMemo(() => {

        const {x=[], y=[], y1=[],y2=[] } = isObject(data) ? data :{}
        let end = {
            1:10,
            2:1,
            3:0.1,
            4:1
        }[type]

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
                start:0,
                end,
                maxSpan:end
            },
            xAxis: [
                {
                    type: 'category',
                   // name: "",
                    boundaryGap: true,
                    data: x,
                    axisLabel: {
                        formatter: (value, index) => {
                           
                           return moment(value,"YYYY-MM-DD HH:mm")?.format?.("HH:mm")
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
                    offset: 100,
                }
            ],
            // 系列列表
            series: [
                {
                    name: "PH",
                    type: 'line', 
                    yAxisIndex: 0, // 对应第一个Y轴
                    data: y1, // PH
                     progressive: 1000,          // 每批次渲染的图形元素数量
                    progressiveThreshold: 5000, // 数据量超过此阈值时，才启用渐进式渲染
                    // 可选：启用 LTTB 降采样
                    sampling: 'lttb',
                    symbol:"none",
                },
                {
                    name: "COD",
                    type: 'line', 
                    yAxisIndex: 1, // 对应第二个Y轴
                    data: y2, // COD
                     progressive: 1000,          // 每批次渲染的图形元素数量
                    progressiveThreshold: 5000, // 数据量超过此阈值时，才启用渐进式渲染
                    // 可选：启用 LTTB 降采样
                    sampling: 'lttb',
                    symbol:"none",
                },
                {
                    name: "流量",
                    type: 'line', 
                    yAxisIndex: 2, // 对应第三个Y轴
                    data: y, // 流量
                     progressive: 1000,          // 每批次渲染的图形元素数量
                    progressiveThreshold: 5000, // 数据量超过此阈值时，才启用渐进式渲染
                    // 可选：启用 LTTB 降采样
                    sampling: 'lttb',
                    symbol:"none",
                }
            ]
        };

    }, [data])
    return opt
}