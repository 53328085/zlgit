
import { message } from "antd";
import _ from 'lodash'
import * as echarts from "echarts";
import 'echarts-liquidfill'
import store from '@redux/store'
import {i18t} from "@com/useButton"
/**
 * @author zhenglin zhu
 * @description: type： 1 数据设置在 系列（series）中 type: 2 数据系列 3.饼图
 * @date 2022-09-13 16:38
 */

echarts.registerTheme('walden', {
    "seriesCnt": "3",
    "backgroundColor": "rgba(252,252,252,0)",
    "titleColor": "#666666",
    "subtitleColor": "#999999",
    "textColorShow": false,
    "textColor": "#333",
    "markTextColor": "#ffffff",
    /* "color": [
      "#237AE4",
      "#62D9AD",
      "#5472B1",
      "#23C2DB",
      "#4A6FE2",
      "#FED428",
      "#FF974C",
      "#E65A56",
    ], */
    "borderColor": "#ccc",
    "borderWidth": 0,
    "visualMapColor": [
        "#2a99c9",
        "#afe8ff"
    ],
    "legendTextColor": "#999999",
    "kColor": "#e6a0d2",
    "kColor0": "transparent",
    "kBorderColor": "#e6a0d2",
    "kBorderColor0": "#3fb1e3",
    "kBorderWidth": "2",
    "lineWidth": "3",
    "symbolSize": "8",
    "symbol": "emptyCircle",
    "symbolBorderWidth": "2",
    "lineSmooth": false,
    "graphLineWidth": "1",
    "graphLineColor": "#cccccc",
    "mapLabelColor": "#ffffff",
    "mapLabelColorE": "#3fb1e3",
    "mapBorderColor": "#aaaaaa",
    "mapBorderColorE": "#3fb1e3",
    "mapBorderWidth": 0.5,
    "mapBorderWidthE": 1,
    "mapAreaColor": "#eeeeee",
    "mapAreaColorE": "rgba(63,177,227,0.25)",
    "axes": [
        {
            "type": "all",
            "name": "通用坐标轴",
            "axisLineShow": true,
            "axisLineColor": "#cccccc",
            "axisTickShow": false,
            "axisTickColor": "#333",
            "axisLabelShow": true,
            "axisLabelColor": "#999999",
            "splitLineShow": true,
            "splitLineColor": [
                "#eeeeee"
            ],
            "splitAreaShow": false,
            "splitAreaColor": [
                "rgba(250,250,250,0.05)",
                "rgba(200,200,200,0.02)"
            ]
        },
        {
            "type": "category",
            "name": "类目坐标轴",
            "axisLineShow": true,
            "axisLineColor": "#333",
            "axisTickShow": true,
            "axisTickColor": "#333",
            "axisLabelShow": true,
            "axisLabelColor": "#333",
            "splitLineShow": false,
            "splitLineColor": [
                "#ccc"
            ],
            "splitAreaShow": false,
            "splitAreaColor": [
                "rgba(250,250,250,0.3)",
                "rgba(200,200,200,0.3)"
            ]
        },
        {
            "type": "value",
            "name": "数值坐标轴",
            "axisLineShow": true,
            "axisLineColor": "#333",
            "axisTickShow": true,
            "axisTickColor": "#333",
            "axisLabelShow": true,
            "axisLabelColor": "#333",
            "splitLineShow": true,
            "splitLineColor": [
                "#ccc"
            ],
            "splitAreaShow": false,
            "splitAreaColor": [
                "rgba(250,250,250,0.3)",
                "rgba(200,200,200,0.3)"
            ]
        },
        {
            "type": "log",
            "name": "对数坐标轴",
            "axisLineShow": true,
            "axisLineColor": "#333",
            "axisTickShow": true,
            "axisTickColor": "#333",
            "axisLabelShow": true,
            "axisLabelColor": "#333",
            "splitLineShow": true,
            "splitLineColor": [
                "#ccc"
            ],
            "splitAreaShow": false,
            "splitAreaColor": [
                "rgba(250,250,250,0.3)",
                "rgba(200,200,200,0.3)"
            ]
        },
        {
            "type": "time",
            "name": "时间坐标轴",
            "axisLineShow": true,
            "axisLineColor": "#333",
            "axisTickShow": true,
            "axisTickColor": "#333",
            "axisLabelShow": true,
            "axisLabelColor": "#333",
            "splitLineShow": true,
            "splitLineColor": [
                "#ccc"
            ],
            "splitAreaShow": false,
            "splitAreaColor": [
                "rgba(250,250,250,0.3)",
                "rgba(200,200,200,0.3)"
            ]
        }
    ],
    "axisSeperateSetting": false,
    "toolboxColor": "#999999",
    "toolboxEmphasisColor": "#666666",
    "tooltipAxisColor": "#cccccc",
    "tooltipAxisWidth": 1,
    "timelineLineColor": "#626c91",
    "timelineLineWidth": 1,
    "timelineItemColor": "#626c91",
    "timelineItemColorE": "#626c91",
    "timelineCheckColor": "#3fb1e3",
    "timelineCheckBorderColor": "#3fb1e3",
    "timelineItemBorderWidth": 1,
    "timelineControlColor": "#626c91",
    "timelineControlBorderColor": "#626c91",
    "timelineControlBorderWidth": 0.5,
    "timelineLabelColor": "#626c91",
    "datazoomBackgroundColor": "rgba(255,255,255,0)",
    "datazoomDataColor": "rgba(222,222,222,1)",
    "datazoomFillColor": "rgba(114,230,212,0.25)",
    "datazoomHandleColor": "#cccccc",
    "datazoomHandleWidth": "100",
    "datazoomLabelColor": "#999999"
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

const pieOption = ({ data = [], total = 0, radius= ["60%", "80%"],labelLine={},label={}, legend={},series={},  grid={left: 0, right: 0, containLabel: true,}} = {}) =>{
  const primaryColor =store.getState()?.system?.themeColor?.primaryColor || "#237ae4"
  console.log(radius)
  const  color = [
   primaryColor,
   "#62D9AD",
   "#5472B1",
   "#23C2DB",
   "#4A6FE2",
   "#FED428",
   "#FF974C",
   "#E65A56",
 ]
   
    
 return {
  // 饼图的设置 
  color,
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
      text:  total ? [i18t("comm","total"), "", total].join("\n") : "",
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
        ...label,
      },
      labelLine: {
        show: true,
        length:8,
        length2:8,
        ...labelLine,
      },
      ...series,
    },

  ],
};
}
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
  console.dir(pieData)
  if (!dom) return
  if(type == 0) return message.warning("图表类型错误")
  const {locale} =store.getState()?.system?.intl  // 国际化语言
 
  let lang = locale == 'zh-cn' ? 'ZH' : locale?.locale?.toUpperCase()
  const chart = echarts.init(dom, 'walden', {locale: lang});
  // 对不同图表类型设置不同的格式

  let custSeries
  if(series.constructor == Object) {
    if (series.type == 'line') {
        custSeries = {
            smooth:true, 
            showSymbol: false,
          //  areaStyle: {},
            ...series,
        }
    }else if(series.type == 'bar'){
        custSeries = {
            barGap: 0,
            ...series,
        }
    }else  {
        custSeries = {...series}
    }
    
  }else if(series.constructor == Array) {
    custSeries = series.map(s => {
        if(s.type == "line") {
            return ({smooth:true,  areaStyle: {}, showSymbol: false, ...s, })
        }else if(s.type == "bar") {
            return ({barGap: 0, ...s,})
        }else {
            return s
        }
    })
  }
  const primaryColor =store.getState()?.system?.themeColor?.primaryColor || "#237ae4"

 const  color = [
  primaryColor,
  "#62D9AD",
  "#5472B1",
  "#23C2DB",
  "#4A6FE2",
  "#FED428",
  "#FF974C",
  "#E65A56",
]
 let {axisTick, axisLine, axisLabel, ...restxAxis} = xAxis
  const comm = {
    color,
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
         
        },
        ...axisTick
      },   
      axisLine: {
        lineStyle: {
         
        },
        ...axisLine,
      },
      axisLabel: {
       
        interval:'auto', // 显示所有x轴的label, auto: 标签不重叠  
        ...axisLabel,
      },
      
      ...restxAxis,
    },
    legend: {
    //  top: 0,

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
   window.addEventListener('resize', _.throttle(chart?.resize), 300) ;
  
   
  return chart
};

