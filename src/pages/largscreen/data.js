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

export const colors=["#0475E6","#F88C28","#46C7FF","#46C7FF","#E182A7","#E182A7"]
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
export function useLineopt({datas, index,name}){
  const lineopt=useMemo(()=>{
    const {x=[], y=[]}= isObject(datas) ? datas : {}
     return{
         series:[{ 
           type: "line", 
           seriesLayoutBy: 'row', 
           smooth:0.3, 
          }
         ] ,
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
         yAxis:{
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
         xAxis: {
           axisLabel: {
             showMaxLabel: true,
             hideOverlap: true,
             interval: "auto",
             color: "#fff",
           }
         },
         dataset: {
             dimensions: [
                 { name: '时间', type: 'time' },
                 { name:name  },
               ] ,
               source: [x,y],
               sourceHeader: false,
         },
         color:[colors[index%clen] ]
     }
 }, [datas, index,name])
 return lineopt
}