import {useMemo} from 'react';
import {isObject} from "@com/usehandler"

export const tabs =[
    { label: "功率", key: 1, },
    { label: "收益", key: 2, },
    { label: "充放电", key: 3, }
]
export const option =[
    { label: "月", value: 0, },
    { label: "年", value: 1, },
    
]
export const useLine=({data,dimensions,type="line",dataZoom=true})=>{
    console.log("data",data)
  const{x=[], y=[], y1=[]} = isObject(data) ? data :  {}
  const lineopt = useMemo(()=>{
    return {
        series: [{ type,  seriesLayoutBy: 'row' }, { type,  seriesLayoutBy: 'row' }],  
        grid: { 
          left: "0px",
          right: "0",
          top: "20px",
          bottom: "0px",
          containLabel: true,
        },
        legend: {
          icon: 'circle'
         },
         dataZoom: dataZoom?{
            type: "slider",
            height: 16,
        }:{type:"inside"},
        dataset: {
            dimensions: [
              {name:   "时间", type: 'time'}, 
              ...dimensions
            ],
            source: [x, y, y1],
            sourceHeader: false,
          }
        
    }
  },[data,dimensions, type,dataZoom])
 return lineopt
}

export const lineoptdoub =(data, startTime,endTime)=>{
   let opt =  useMemo(()=>{ 
         
        const {earlyData=[], lateData=[]} = data
        const earlyX = earlyData.map(item=>item.x)
        const earlyY = earlyData.map(item=>item.y)
        const lateX = lateData.map(item=>item.x)
        const lateY = lateData.map(item=>item.y)
        const early = startTime?.format?.('YYYY-MM-DD'), late = endTime?.format?.('YYYY-MM-DD');
    
      return { 
          type:5,
          legend: {
              data: [early, late]
          }, 
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: "10px",
            right: "10px",
            top: "40px",
            bottom: "2px",
            containLabel:true,
          },
          xAxis: [
              {
                  type: 'category',
                  name: early,
                  boundaryGap: true,
                  data:  earlyX ,
              },
              {
                  type: 'category',
                  name: late,
                  boundaryGap: true,
                  data:  lateX ,
              }
          ],  
          yAxis: [
              {
                  type: 'value',
                  name: early
              },
              {
                  type: 'value',
                  name: late
              }
          ],
          // 系列列表
          series: [
              {
                  name: early,
                  type: 'line',
                  xAxisIndex: 0, // 对应第一个X轴
                  yAxisIndex: 0, // 对应第一个Y轴
                  data: earlyY, // 数据集1的数据
                  smooth:3,
              },
              {
                  name: late,
                  type: 'line',
                  xAxisIndex: 1, // 对应第二个X轴
                  yAxisIndex: 1, // 对应第二个Y轴
                  data: lateY, // 数据集2的数据
                  smooth:3
              }
          ]
      };
      
      },[data,  startTime,endTime ])
      return opt
}