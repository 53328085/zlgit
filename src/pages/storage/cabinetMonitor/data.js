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
export const useLine=({data,dimensions,type="line",icon="rect" }={})=>{ 
  const{x=[], y=[], y1=[]} = isObject(data) ? data :  {}
  const lineopt = useMemo(()=>{
    return {
        series: [{ type,  seriesLayoutBy: 'row' }, { type,  seriesLayoutBy: 'row' }],  
        grid: { 
          left: "0px",
          right: "0",
          top: "30px",
          bottom: "0px",
          containLabel: true,
        },
        legend: {
          icon 
         }, 
        dataset: {
            dimensions: [
              {name:   "时间", type: 'time'}, 
              ...dimensions
            ],
            source: [x, y, y1],
            sourceHeader: false,
          }
        
    }
  },[data,dimensions, type,icon ])
 return lineopt
}