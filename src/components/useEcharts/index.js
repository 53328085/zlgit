
import * as echarts from "echarts";


/**
 * @author zhenglin zhu
 * @description: type： 1 数据设置在 系列（series）中 type: 2 数据系列 3.饼图
 * @date 2022-09-13 16:38
 */
const chartoption = {
  notMerge: true,
  lazyUpdate: true,
  replaceMerge: ["xAxis", "series"],
};
const pieOption = ({ data = [], total = 0 } = {}) => ({
  // 饼图的设置
  color:['#6395f9', '#62daab', '#657798', '#f6c022'],
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: "5%",
    left: "center",
  },
  legend: {
    top: "bottom",
  },
  grid: {
    left: "5%",
    right: "5%",
  },
  graphic: {
    type: "text",
    left: "center",
    top: "center",
    style: {
      text: total ? ["总", "", total].join("\n") : "",
    },
  },
  series: [
    {
      type: "pie",
      data,
      radius: ["60%", "80%"],
      label: {
        show: true,
        position: "outside",
        formatter: "{d}%",
      },
      labelLine: {
        show: true,
        length:8,
        length2:8
      },
    },
  ],
});



export const drawEcharts = (
  dom,
  {
    xAxis = [],
    series = [],
    dataset = [],
    pieData = { data: [], total: 0 },
    type = 1,
    ...rest
  } = {}
) => {
  
  const bar = echarts.getInstanceByDom(dom);
  const chart = echarts.init(dom);
  const comm = {
    grid: {
      left: "80px",
      right: "40px",
      top: "40px",
      bottom: "40px",
    },
    xAxis: {
    
      type: "category",
      boundaryGap: true,
      axisTick: {
        alignWithLabel: true,
      }, 
     
      ...xAxis,
    },
    legend: {
      top: "0px",
    },
   /*  dataZoom: [
      {
        type: "slider",
        height: "20px",
      },
    ], */
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
  };
  const baseoption = {
    ...comm,
    yAxis: {
      type: "value",
    },
    series,
  };
  const option = {
    ...comm,

    yAxis: [
      {
        type: "value",     
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
        },
      },
    ],
    dataset,
    series,
  };
  const setoption =
    type == 1
      ? option
      : type == 2
      ? baseoption
      : type == 3
      ? pieOption(pieData)
      : "";
  chart.setOption({...setoption, ...rest}, true, chartoption);
 // chart.resize();
};

