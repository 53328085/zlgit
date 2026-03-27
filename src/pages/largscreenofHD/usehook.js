import { useMemo } from "react";

import { useRequest } from "ahooks";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import { isObject } from "@com/usehandler";
import echarts from "@com/useEcharts";
import { intervalTime } from "./data";

export function useGetData(handler) {
  const projectId = useSelector(selectProjectId);
  const getData = async () => {
    try {
      if (!Number.isInteger(Number.parseInt(projectId))) return;
      const { data, success } = await handler({ projectId });
      if (success) {
        return data;
      } else {
        return {};
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  };
  const { data } = useRequest(getData, {
    manual: false,
    pollingInterval: intervalTime,
    pollingErrorRetryCount: 3,
    refreshDeps: [projectId],
  });
  return data;
}

export function usebarline({ datas, type }) {
  let { x = [], y = [], y1 = [] } = isObject(datas) ? datas : {};
  let legendData = {
    1: ["本月用电", "同期用电"],
    2: ["本月冷水", "同期冷水"],
    7: ["本月热水", "同期热水"],
  }[type];
  return useMemo(() => {
    return {
      type: 5,
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
        textStyle: {
          color: "#fff",
        },
        icon: "rect",
        itemWidth: 13,
        itemHeight: 5,
        itemGap: 20,
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
        axisLabel: {
          color: "#fff",
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
          name: legendData[0],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(1, 225, 224, 1)",
              },
              {
                offset: 1,
                color: "rgba(182, 254, 254, 1)",
              },
            ]),
          },
          data: y,
        },
        {
          type: "bar",
          name: legendData[1],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(255, 177, 43, 1)",
              },
              {
                offset: 1,
                color: "rgba(255, 243, 222, 1)",
              },
            ]),
          },
          data: y1,
        },
      ],
    };
  }, [datas]);
}

export function usebarlineright2nd({ datas }) {
  let { x = [], y = [], y1 = [] } = datas;
  console.log("y1", y1);
  return useMemo(() => {
    return {
      type: 5,
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

      yAxis: [
        {
          name: "kWh",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        {
          name: "kWh",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],

      // 系列配置
      series: [
        {
          type: "bar",
          barWidth: 10,
          name: "用电量",
          yAxisIndex: 0,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(255, 96, 33, 1)",
              },
              {
                offset: 1,
                color: "rgba(255, 177, 43, 1)",
              },
            ]),
          },
          data: y,
          /*  markLine:{ 
            label:{
              position:"start",
              color:"#fff",
              fontSize:12,
              show:true,
              width:100,
            },
            data:[{name:"Max", type:"max"}]
            
          } */
        },
        {
          type: "line",
          name: "节约用电",
          yAxisIndex: 1,
          data: y1,
          color: "rgba(5, 192, 110, 1)",
          symbol: "circle",
          symbolSize: 8,
          symbolKeepAspect: true,
        },
      ],
    };
  }, [datas]);
}
export function usepieoption({ datas, emphasis = { label: {} } }) {
  return useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
      },
      type: 5,
      series: [
        {
          type: "pie",
          radius: ["55%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              //  fontSize: 20,
              fontWeight: "bold",
              scale: true,
              scaleSize: 20,
              formatter: ["{d}%", "{a|{b}{c}}"].join("\n"),
              color: "#fff",
              rich: {
                a: {
                  fontSize: 12,
                  padding: [4, 0, 0, 0],
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
              ...emphasis?.label,
            },
          },
          labelLine: {
            show: false,
          },
          data: datas,
        },
      ],
    };
  }, [datas]);
}

export function usecustompie({ datas, datas2 }) {
  return useMemo(() => {
    return {
      type: 5,
      legend: {
        show: false,
        
      },
      series: [
        {
          type: "pie",
          radius: ["55%", "75%"],
          avoidLabelOverlap: false,
          z:2,
          label: {
            show: false,
            position: "center",
          },
          
          labelLine: {
            show: false,
          },
          data: Array.isArray(datas) ? datas : [],
        },
        {
          type: "pie",
          radius: ["40%", "55%"],
          avoidLabelOverlap: false,
          z:3,
          label: {
            show: false,
            position: "center",
          },
            
          labelLine: {
            show: false,
          },
          data: Array.isArray(datas2) ? datas2 : [],
        },
      
      ],
    };
  }, [datas]);
}
