import React, { useState, useEffect, useMemo } from "react";

import dayjs from "dayjs";
import { isObject } from "@com/usehandler";
import echarts from "@com/useEcharts";
import imgurl from './icon'
export const useTime = () => {
  const [time, setTime] = useState(dayjs());
  const timeformat = `${time.format("YYYY年MM月DD日")} 星期${["日", "一", "二", "三", "四", "五", "六"][time.day()]} ${time.format("HH:mm:ss")}`;
  useEffect(() => {
    let timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return timeformat;
};

export const colors = [
  "#19EBFF",
  "#1DBD6D",
  "#FF9702",
  "#46C7FF",
  "#E182A7",
  "#E182A7",
];
export const clen = colors.length;
export const settings = {
  // 动画切换
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  waitForAnimate: false,
};
export function useOpt(datas) {
  return useMemo(() => {
    return {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: true,
      },
      title: {
        show: false,
      },
      legend: {
        show: false,
      },

      xAxis: {
        type: "value",
        show: false, // 隐藏 x 轴线和刻度
        min: 0,
        max: datas?.total,
      },

      yAxis: {
        type: "category",
        show: false, // 隐藏 y 轴线和标签
        data: ["总体"],
      },
      // 提示框
      tooltip: {
        show: false,
      },
      // 系列配置
      series: [
        {
          type: "bar",
          stack: "total",
          barWidth: 14,
          label: {
            show: false,
          },
        },
        {
          type: "bar",
          stack: "total",
          barWidth: 14,
          label: {
            show: false,
          },
        },
        {
          type: "bar",
          stack: "total",
          barWidth: 14,
          label: {
            show: false,
          },
        },
        {
          type: "bar",
          stack: "total",
          barWidth: 14,
          label: {
            show: false,
          },
        },
        {
          type: "bar",
          stack: "total",
          barWidth: 14,
          label: {
            show: false,
          },
        },
      ],
      dataset: {
        source: datas?.top5,
      },
    };
  }, [datas]);
}
export function useLineopt({ datas }) {
  const lineopt = useMemo(() => {
    let { x = [], y = [], y1 = [], y2 = [] } = isObject(datas) ? datas : {};
    y = y.map((item) => Number.parseFloat(item));
    y1 = y1.map((item) => Number.parseFloat(item));
    y2 = y2.map((item) => Number.parseFloat(item));
    console.log("y1", y1);
    return {
      type: 5,
      series: [
        {
          name: "用电量",
          type: "line",
          yAxisIndex: 0, // 对应第一个Y轴
          data: y, // 数据集1的数据
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(233, 165, 82, 1)",
              },
              {
                offset: 1,
                color: "rgba(233, 165, 82, 0)",
              },
            ]),
          },

          // smooth: 2,
        },
        {
          name: "冷水量",
          type: "line",

          yAxisIndex: 1, // 对应第二个Y轴
          data: y1, // 数据集2的数据
          //  smooth: 2
        },
        {
          name: "热水量",
          type: "line",
          yAxisIndex: 2, // 对应第三个Y轴
          data: y2, // 数据集2的数据
          // smooth: 2
        },
      ],
      grid: {
        left: "10px",
        right: "0",
        top: "40px",
        bottom: "12px",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      legend: {
        show: true,
        icon: "circle",
        top: "0px",
        textStyle: {
          color: "#fff",
        },
      },
      yAxis: [
        {
          name: "kWh",
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
          },
          splitLine: {
            show: false,
          },
        },
        {
          name: "m³",
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            formatter: (value) => {
              return value == Math.max.apply(null, y1) ? value : null;
            },
          },
          splitLine: {
            show: false,
          },
        },
        {
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      xAxis: {
        axisLabel: {
          showMaxLabel: true,
          hideOverlap: true,
          interval: "auto",
          color: "#fff",
        },
        data: x,
      },

      color: colors,
    };
  }, [datas]);
  return lineopt;
}

export function usebarline({datas}) {
  let {x=[],y=[]} = datas
  y = y.map((_,i)=>Math.round(Math.random()*1000))
  return useMemo(() => {
    return {
      type:5,
      grid: {
        left: 0,
        right: 0,
        top: 16,
        bottom: 0,
        containLabel: true,
      },
      title: {
        show: false,
      },
      legend: {
        show: false,
      },

      xAxis: {
        type: "category",
        data: x,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },

      yAxis: { 
        show: false, 
       
      },
      // 提示框
      tooltip: {
        show: false,
      },
      // 系列配置
      series: [
        {
          type: "bar", 
          barWidth: 2,
          itemStyle: {
             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(5, 192, 110, 1)",
              },
              {
                offset: 1,
                color: "rgba(25, 235, 255, 0)",
              },
            ]),
          },
          data:y, 
        },
        {
          type: "line",
          data: y,
          label:{
            show:true,
            position:"top",
            color:"#fff",
           fontSize:15,
             
          },
          color:"rgba(25, 235, 255, 1)",
          symbol: `image://${imgurl["circle"]}`  ,
          symbolSize:20,
          symbolKeepAspect:true,
        }
      ],
      
    };
  }, [datas]);
}

export const areas = [
  { label: "正泰华东产业园", value: "1" },
  { label: "正泰华南产业园", value: "2" },
  { label: "正泰西北产业园", value: "3" },
];
export const intervalTime = 60 * 1000 * 15; // 延迟15分钟请求时间
export const delayTime = 30 * 1000 ; // 延迟30秒切换坐标 和 水 、冷水、热水
