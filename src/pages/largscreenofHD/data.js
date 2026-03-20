import React,{useState,useEffect, useMemo} from 'react'

import dayjs from 'dayjs'
import {isObject} from "@com/usehandler"
export const useTime = () => {
  const [time, setTime] = useState(dayjs())
  const timeformat = `${time.format('YYYY年MM月DD日')} 星期${['日', '一', '二', '三', '四', '五', '六'][time.day()]} ${time.format('HH:mm:ss')}`
  useEffect(() => { 
    let timer = setInterval(() => {
      setTime(dayjs())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return timeformat
}

export const colors=["#19EBFF","#1DBD6D","#FF9702","#46C7FF","#E182A7","#E182A7"]
export const clen=colors.length
export const   settings = {  // 动画切换
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  waitForAnimate: false
};
export   function useOpt(datas){
  
  
  return useMemo(()=>{
return {
  grid:{
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    containLabel: true
  },
  title: {
      show: false
  },
  legend: {
      show: false,
     
  },
   
  xAxis: {
      type: 'value',
      show: false, // 隐藏 x 轴线和刻度
      min: 0,
      max: datas?.total
  },
  
  yAxis: {
      type: 'category',
      show: false, // 隐藏 y 轴线和标签
      data: ['总体']
  },
  // 提示框
  tooltip: {
      show:false
  },
  // 系列配置
  series: [
      {
         
          type: 'bar',
          stack: 'total',  
          barWidth: 14,  
          label: {
              show: false, 
          },
         
      }, 
      {
         
        type: 'bar',
        stack: 'total',  
        barWidth: 14,  
        label: {
            show: false, 
        },
       
    }, 
    {
         
      type: 'bar',
      stack: 'total',  
      barWidth: 14,  
      label: {
          show: false, 
      },
     
  }, 
  {
         
    type: 'bar',
    stack: 'total',  
    barWidth: 14,  
    label: {
        show: false, 
    },
   
}, 
{
         
  type: 'bar',
  stack: 'total',  
  barWidth: 14,  
  label: {
      show: false, 
  },
 
}, 
  ],
  dataset:{
    source:  datas?.top5
  },
 
}
},[datas])
};
export function useLineopt({datas}){
  const lineopt=useMemo(()=>{
    const {x=[], y=[], y1=[],y2=[]}= isObject(datas) ? datas : {}
    console.log(datas)
     return{
          type:5,
          series: [
                {
                    name: "用电量",
                    type: 'line', 
                    yAxisIndex: 0, // 对应第一个Y轴
                    data: y, // 数据集1的数据
                    smooth: 3,
                },
                {
                    name: "冷水量",
                    type: 'line',
                  
                    yAxisIndex: 1, // 对应第二个Y轴
                    data: y1, // 数据集2的数据
                    smooth: 3
                },
                 {
                    name: "热水量",
                    type: 'line',
                    yAxisIndex: 2, // 对应第二个Y轴
                    data: y2, // 数据集2的数据
                    smooth: 3
                }
            ],
         grid: {
           left: "0px",
           right: "0",
           top: "40px",
           bottom: "12px",
           containLabel: true,
           
         },
         legend: {
           show:true,
           icon: "circle",
           left:"2px",
           textStyle: {
            color: "#fff",
            
          },
         },
         yAxis:[{
          name:"kWh",
          axisLine:{ 
            show:false,
           },
           axisLabel: {
             color: "#fff",
             
           },
           splitLine:{
            show:false
           }
         },
         {
          name:"m³",
          axisLine:{ 
            show:false,
           },
           axisLabel: {
             color: "#fff",
             
           },
           splitLine:{
            show:false
           }
         },
          {
          axisLine:{ 
            show:false,
           },
           axisLabel: {
             color: "#fff",
             
           },
           splitLine:{
            show:false
           }
         }
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
         
         color:colors
     }
 }, [datas ])
 return lineopt
}
export const areas =[
  {label:"正泰华东产业园",value:"1"},
  {label:"正泰华南产业园",value:"2"},
  {label:"正泰西北产业园",value:"3"}
]
export const intervalTime = 60*1000*15  // 15分钟轮询时间