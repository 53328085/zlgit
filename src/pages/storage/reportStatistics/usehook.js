import {useMemo } from "react";

import {isObject} from "@com/usehandler"
import { data } from "browserslist";

export function usebarline({ datas  }) {

  let { x = [], y = [], y1 = [],y2=[] } = isObject(datas) ? datas : {};

  return useMemo(() => {
     let fag = isObject(datas) && Array.isArray(datas.x) && Array.isArray(datas.y) && Array.isArray(datas.y1) && Array.isArray(datas.y2)
     if (!fag) return {}
         y1 = y1.map((item) => Number.parseFloat(item));
        y2=y2.map((item) => Number.parseFloat(item));
        y=y.map((item) => Number.parseFloat(item));
    return {
      type: 5,
      color: ["#5983FE", "#FF6021","#50C8FF"],
      grid: {
        left: 0,
        right: 0,
        top: 32,
        bottom: 16,
        containLabel: true,
      },
      title: {
        show: false,
      },
      legend: { 
        icon: "rect",
        itemWidth: 13,
        itemHeight: 5,
        itemGap: 20,
      },
      tooltip:{
        trigger:"axis"
      },
      xAxis: {
        type: "category",
        data: x,
        axisLine: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        
      },
       // 系列配置
      series: [
        {
          type: "bar",
          name: "充电量",
          data: y,
          yAxisIndex: 0,
          markLine:{
            symbol:"none",
            data:[
              {
                type: "max",
              }, 
            ]
          }
        },
        {
          type: "bar",
          name:  "放电量",
          data: y1,
           yAxisIndex: 0,
        },
        {
          type: "line",
          name:  "实时收益",
          data: y2,
           yAxisIndex: 1,
        },
      ],
      yAxis:[
           {
          name: "单位(kWh)",
          nameTextStyle: {
            align: "left",
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        {
          name: "单位(元)",
           nameTextStyle: {
            align: "right",
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
    ],
    
     
    };
  }, [datas]);
}