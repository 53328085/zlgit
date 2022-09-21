
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
const pieOption = ({ data = [], total = 0, radius= ["60%", "80%"], legend={}, grid={left: 0, right: 0, containLabel: true,}} = {}) => ({
  // 饼图的设置 
  tooltip: {
    trigger: "item",
  },
  legend: {
    top:0,
    icon: 'circle',
    itemHeight: 8,
    itemWidth: 8,
    itemGap: 20,
    ...legend
  },
  grid,
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
      radius,
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
    pieData = { data: [], total: 0, radius: ["60%", "80%"] },
    type = 1,
    grid={},
    legend={},
    ...rest
  } = {}
) => {  
  if (!dom) return
  const bar = echarts.getInstanceByDom(dom);
  const chart = echarts.init(dom);
  const comm = {
    grid: {
      left: "80px",
      right: "40px",
      top: "40px",
      bottom: "40px",
      ...grid
    },
    xAxis: {    
      type: "category",
      boundaryGap: true,
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: '#ccc'
        }
      },   
      axisLine: {
        lineStyle: {
          color:"#ccc"
        }
      },
      axisLabel: {
        color:"#545454",
        interval:0, // 显示所有x轴的label
      },
      
      ...xAxis,
    },
    legend: {
      top: 0,

      icon: 'rect',
      itemHeight: 8,
      itemWidth: 8,
      itemGap: 20,
     
      ...legend
    },  
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
      ? pieOption({...pieData, grid, legend})
      : "";
  chart.setOption({...setoption, ...rest}, true, chartoption);
  chart.resize();
};

