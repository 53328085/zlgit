import { useMemo } from "react";
import dayjs from 'dayjs';
import { isObject } from "@com/usehandler";

export const tabs = [
  { label: "功率", key: 1 },
  { label: "收益", key: 2 },
  { label: "充放电", key: 3 },
];
export const option = [
  { label: "月", value: 1 },
  { label: "年", value: 2 },
];
export const useLine = ({
  data,
  dimensions,
  type = "line",
  icon = "rect",
  unit=""
} = {}) => {
  const { x = [], y = [], y1 = [] } = isObject(data) ? data : {};
  const lineopt = useMemo(() => {
    return {
      series: [
        { type, seriesLayoutBy: "row" },
        { type, seriesLayoutBy: "row" },
      ],
      grid: {
        left: "0px",
        right: "0",
        top: "30px",
        bottom: "0px",
        containLabel: true,
      },
      legend: {
        icon,
      },
      tooltip: {
       valueFormatter:(v)=>v+(unit ? unit : '')
      },
      dataset: {
        dimensions: [{ name: "时间", type: "time" }, ...dimensions],
        source: [x, y, y1],
        sourceHeader: false,
      },
    };
  }, [data, dimensions, type, icon]);
  return lineopt;
};
export const lineoptdoub = (data, startTime, endTime) => {
  let opt = useMemo(() => {
    const { earlyData = [], lateData = [] } = data;
    let earlyX = earlyData.map((item) => item.x);
    let earlyY = earlyData.map((item) => item.y);
    const lateX = lateData.map((item) => item.x);
    const lateY = lateData.map((item) => item.y);
  if (endTime.format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")) {
 
             
             let dif = endTime.diff(startTime, "days")
            
             let lastLatex = dayjs(lateX[lateX.length - 1], "YYYY-MM-DD HH:mm:ss").subtract(dif, "days")
            
             let idx = earlyX.findIndex(item => dayjs(item, "YYYY-MM-DD HH:mm:ss").isAfter(lastLatex))
            
             earlyX=earlyX.slice(0,idx)
             earlyY=earlyY.slice(0,idx)
         }
    const early = startTime?.format?.("YYYY-MM-DD"),
      late = endTime?.format?.("YYYY-MM-DD");

    return {
      type: 5,
      legend: {
        data: [early, late],
      },
      tooltip: {
        trigger: "axis",
        valueFormatter:(value)=>{
          return value+'kW'
        }
      },
      grid: {
        left: "10px",
        right: "10px",
        top: "40px",
        bottom: "2px",
        containLabel: true,
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
        },
      ],
      xAxis: [
        {
          type: "category",
          name: early,
          boundaryGap: true,
          data: earlyX,
          axisLabel: {
            formatter: (value, index) => {
              return dayjs(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
            },
            interval: "auto",
          },
        },
        {
          type: "category",
          name: late,
          boundaryGap: true,
          data: lateX,
          show: false,
          axisLabel: {
            formatter: (value, index) => {
              return dayjs(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
            },
            interval: "auto",
            color: "rgba(0,0,0,0.4)",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: early,
          nameGap: 20,
        },
        {
          type: "value",
          name: late,
          nameGap: 20,
        },
      ],
      // 系列列表
      series: [
        {
          name: early,
          type: "line",
          xAxisIndex: 0, // 对应第一个X轴
          yAxisIndex: 0, // 对应第一个Y轴
          data: earlyY, // 数据集1的数据
          smooth: 3,
        },
        {
          name: late,
          type: "line",
          xAxisIndex: 1, // 对应第二个X轴
          yAxisIndex: 1, // 对应第二个Y轴
          data: lateY, // 数据集2的数据
          smooth: 3,
        },
      ],
    };
  }, [data, startTime, endTime]);
  return opt;
};
