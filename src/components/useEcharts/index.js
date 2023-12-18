
import { message } from "antd";
import * as echarts from "echarts";
import 'echarts-liquidfill'


/**
 * @author zhenglin zhu
 * @description: type： 1 数据设置在 系列（series）中 type: 2 数据系列 3.饼图
 * @date 2022-09-13 16:38
 */

echarts.registerTheme('walden', {
  "color": [
      "#5aaef3",
      "#62d9ad",
      "#5b6e96",
      "#97d5f4",
      "#ffdc4c",
      "#ff974c",
      "#e65a56",
      "#6d61e4",
      "#4a6fe2",
      "#6d9ae7",
      "#23c2db",
      "#d4ec59"
  ],
  "backgroundColor": "rgba(255,255,255,0)",
  "textStyle": {},
  "title": {
      "textStyle": {
          "color": "#237ae4"
      },
      "subtextStyle": {
          "color": "#999999"
      }
  },
  "line": {
      "itemStyle": {
          "borderWidth": "2"
      },
      "lineStyle": {
          "width": "3"
      },
      "symbolSize": "8",
      "symbol": "emptyCircle",
      "smooth": false
  },
  "radar": {
      "itemStyle": {
          "borderWidth": "2"
      },
      "lineStyle": {
          "width": "3"
      },
      "symbolSize": "8",
      "symbol": "emptyCircle",
      "smooth": false
  },
  "bar": {
      "itemStyle": {
          "barBorderWidth": "0",
          "barBorderColor": "#d7d7d7"
      }
  },
  "pie": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      }
  },
  "scatter": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      }
  },
  "boxplot": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      }
  },
  "parallel": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      }
  },
  "sankey": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      }
  },
  "funnel": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      }
  },
  "gauge": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      }
  },
  "candlestick": {
      "itemStyle": {
          "color": "#e6a0d2",
          "color0": "transparent",
          "borderColor": "#e6a0d2",
          "borderColor0": "#3fb1e3",
          "borderWidth": "2"
      }
  },
  "graph": {
      "itemStyle": {
          "borderWidth": "0",
          "borderColor": "#d7d7d7"
      },
      "lineStyle": {
          "width": "1",
          "color": "#cccccc"
      },
      "symbolSize": "8",
      "symbol": "emptyCircle",
      "smooth": false,
      "color": [
          "#5aaef3",
          "#62d9ad",
          "#5b6e96",
          "#97d5f4",
          "#ffdc4c",
          "#ff974c",
          "#e65a56",
          "#6d61e4",
          "#4a6fe2",
          "#6d9ae7",
          "#23c2db",
          "#d4ec59"
      ],
      "label": {
          "color": "#ffffff"
      }
  },
  "map": {
      "itemStyle": {
          "areaColor": "#eeeeee",
          "borderColor": "#aaaaaa",
          "borderWidth": 0.5
      },
      "label": {
          "color": "#ffffff"
      },
      "emphasis": {
          "itemStyle": {
              "areaColor": "rgba(63,177,227,0.25)",
              "borderColor": "#3fb1e3",
              "borderWidth": 1
          },
          "label": {
              "color": "#3fb1e3"
          }
      }
  },
  "geo": {
      "itemStyle": {
          "areaColor": "#eeeeee",
          "borderColor": "#aaaaaa",
          "borderWidth": 0.5
      },
      "label": {
          "color": "#ffffff"
      },
      "emphasis": {
          "itemStyle": {
              "areaColor": "rgba(63,177,227,0.25)",
              "borderColor": "#3fb1e3",
              "borderWidth": 1
          },
          "label": {
              "color": "#3fb1e3"
          }
      }
  },
  "categoryAxis": {
      "axisLine": {
          "show": true,
          "lineStyle": {
              "color": "#cccccc"
          }
      },
      "axisTick": {
          "show": false,
          "lineStyle": {
              "color": "#333"
          }
      },
      "axisLabel": {
          "show": true,
          "color": "#999999"
      },
      "splitLine": {
          "show": true,
          "lineStyle": {
              "color": [
                  "#eeeeee"
              ]
          }
      },
      "splitArea": {
          "show": false,
          "areaStyle": {
              "color": [
                  "rgba(250,250,250,0.05)",
                  "rgba(200,200,200,0.02)"
              ]
          }
      }
  },
  "valueAxis": {
      "axisLine": {
          "show": true,
          "lineStyle": {
              "color": "#cccccc"
          }
      },
      "axisTick": {
          "show": false,
          "lineStyle": {
              "color": "#333"
          }
      },
      "axisLabel": {
          "show": true,
          "color": "#999999"
      },
      "splitLine": {
          "show": true,
          "lineStyle": {
              "color": [
                  "#eeeeee"
              ]
          }
      },
      "splitArea": {
          "show": false,
          "areaStyle": {
              "color": [
                  "rgba(250,250,250,0.05)",
                  "rgba(200,200,200,0.02)"
              ]
          }
      }
  },
  "logAxis": {
      "axisLine": {
          "show": true,
          "lineStyle": {
              "color": "#cccccc"
          }
      },
      "axisTick": {
          "show": false,
          "lineStyle": {
              "color": "#333"
          }
      },
      "axisLabel": {
          "show": true,
          "color": "#999999"
      },
      "splitLine": {
          "show": true,
          "lineStyle": {
              "color": [
                  "#eeeeee"
              ]
          }
      },
      "splitArea": {
          "show": false,
          "areaStyle": {
              "color": [
                  "rgba(250,250,250,0.05)",
                  "rgba(200,200,200,0.02)"
              ]
          }
      }
  },
  "timeAxis": {
      "axisLine": {
          "show": true,
          "lineStyle": {
              "color": "#cccccc"
          }
      },
      "axisTick": {
          "show": false,
          "lineStyle": {
              "color": "#333"
          }
      },
      "axisLabel": {
          "show": true,
          "color": "#999999"
      },
      "splitLine": {
          "show": true,
          "lineStyle": {
              "color": [
                  "#eeeeee"
              ]
          }
      },
      "splitArea": {
          "show": false,
          "areaStyle": {
              "color": [
                  "rgba(250,250,250,0.05)",
                  "rgba(200,200,200,0.02)"
              ]
          }
      }
  },
  "toolbox": {
      "iconStyle": {
          "borderColor": "#999999"
      },
      "emphasis": {
          "iconStyle": {
              "borderColor": "#666666"
          }
      }
  },
  "legend": {
      "textStyle": {
          "color": "#999999"
      }
  },
  "tooltip": {
      "axisPointer": {
          "lineStyle": {
              "color": "#cccccc",
              "width": 1
          },
          "crossStyle": {
              "color": "#cccccc",
              "width": 1
          }
      }
  },
  "timeline": {
      "lineStyle": {
          "color": "#626c91",
          "width": 1
      },
      "itemStyle": {
          "color": "#626c91",
          "borderWidth": 1
      },
      "controlStyle": {
          "color": "#626c91",
          "borderColor": "#626c91",
          "borderWidth": 0.5
      },
      "checkpointStyle": {
          "color": "#3fb1e3",
          "borderColor": "#3fb1e3"
      },
      "label": {
          "color": "#626c91"
      },
      "emphasis": {
          "itemStyle": {
              "color": "#626c91"
          },
          "controlStyle": {
              "color": "#626c91",
              "borderColor": "#626c91",
              "borderWidth": 0.5
          },
          "label": {
              "color": "#626c91"
          }
      }
  },
  "visualMap": {
      "color": [
          "#2a99c9",
          "#afe8ff"
      ]
  },
  "dataZoom": {
      "backgroundColor": "rgba(255,255,255,0)",
      "dataBackgroundColor": "rgba(222,222,222,1)",
      "fillerColor": "rgba(114,230,212,0.25)",
      "handleColor": "#cccccc",
      "handleSize": "100%",
      "textStyle": {
          "color": "#999999"
      }
  },
  "markPoint": {
      "label": {
          "color": "#ffffff"
      },
      "emphasis": {
          "label": {
              "color": "#ffffff"
          }
      }
  }
});



const chartoption = {
  notMerge: true,
  lazyUpdate: true,
  replaceMerge: ["xAxis", "series"],
};

const liuqiuOption =(option) =>  {  // 水球图
    
    let {series, ...set} = option
  return  {
        series: [{
            type: "liquidFill",
            color: ['#237AE4'],
       
            radius: "95%",
            backgroundStyle: {
              color: '#fff'
            },
            itemStyle: {
              opacity: 0.95,
              shadowBlur: 5,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
           },
          
            outline: {
              borderDistance: 2,
              itemStyle: {
                borderWidth: 2,
                borderColor: '#237AE4',
              }
            },
            ...series,
         }],
         ...set
    } 

}

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
      text: !isNaN(total) ? ["总计", "", total].join("\n") : "",
    },
  },
  series: [
    {
      type: "pie",
      stillShowZeroSum: true,
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
 
/* fetch("./walden.json").then(r => r.json()).then(theme => {
    echarts.registerTheme(JSON.parse(theme))
}) */

export const drawEcharts = (
  dom,
  {
    xAxis = [],
    series = [],
    dataset = [],
    pieData = { data: [], total: 0, radius: ["60%", "80%"] },
    liuqiu={},
    type = 1,
    grid={},
    legend={},
    ...rest
  } = {}
) => {  
  
  if (!dom) return
  if(type == 0) return message.warning("图表类型错误")
 // const bar = echarts.getInstanceByDom(dom);
  const chart = echarts.init(dom);
  let custSeries
  if(series.constructor == Object) {
    if (series.type == 'line') {
        custSeries = {
            smooth:true, 
            showSymbol: false,
            ...series,
        }
    }else if(series.type == 'bar'){
        custSeries = {
            barGap: 0,
            ...series,
        }
    }else {
        custSeries = {...series}
    }
    
  }else if(series.constructor == Array) {
    custSeries = series.map(s => {
        if(s.type == "line") {
            return ({smooth:true,  showSymbol: false, ...s, })
        }else if(s.type == "bar") {
            return ({barGap: 0, ...s,})
        }else {
            return s
        }
    })
  }


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
         
        }
      },   
      axisLine: {
        lineStyle: {
         
        }
      },
      axisLabel: {
       
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
    dataZoom: {
        type: "inside",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
  };
  const baseoption = { //系列方式
    ...comm,
    yAxis: {
      type: "value",   
    },
    series: custSeries,
  };
  const option = {  // 数据集
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
    series: custSeries,
  };
  const sankoption = {
    grid: {
      ...comm.grid,
      ...grid,
    },
    series: {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency'
        },
    }
  }
  const setoption = ['', option, baseoption, pieOption({...pieData, grid, legend}), liuqiuOption(liuqiu)][type];
  /*   type == 1
      ? option
      : type == 2
      ? baseoption
      : type == 3
      ? pieOption({...pieData, grid, legend})
      : {};  */
     
  if(rest.custoption) {
    chart.setOption({...rest.custoption}, true); //桑基图
  }else {
    chart.setOption({...setoption, ...rest}, true, chartoption);
  }    
  chart?.resize();
  return chart
};

