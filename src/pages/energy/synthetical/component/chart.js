import { useState, useEffect, useRef, useMemo } from "react"
import {Radio} from 'antd'
import Ichart from '@com/useEcharts/Ichart'
import Charttable from './chartTable'

import { Echartbox } from "../style"


 export default function({ data, type, legend, tabvalue  }) {
   
      const [model, setModel] = useState(1)

    const changeModel = (e) => {
      setModel(e.target.value)
    }


    let { x = [], y = [], y1 = [] } = data || {}

    
 const lineopt=useMemo(()=>{
     return{
        
       
         series:[{ 
           type: "bar", 
           seriesLayoutBy: 'row',  
          },
          { 
           type: "bar", 
           seriesLayoutBy: 'row',  
          }
         
         ],
         grid: {
           left: "0px",
           right: "0",
           top: "40px",
           bottom: "0px",
           containLabel: true,
         },
         legend: {
           show:true
         },
         xAxis: {
           axisLabel: {
             showMaxLabel: true,
             hideOverlap: true,
             interval: "auto"
           }
         },
         dataset: {
             dimensions:  [
                 { name: '时间', type: 'time' },
                 { name: legend?.[0] },
                 { name: legend?.[1] },
               ],
               source: [x, y, y1],
               sourceHeader: false,
         },
     }
 }, [data, legend])

   
 
    let source = x.map((v, index) => ({ time: v, [legend[0]]: y[index], [legend[1]]: y1[index] }))
 
    return (
      <Echartbox>
        <div className="model">
          <Radio.Group
            onChange={changeModel}
            defaultValue={model}
            buttonStyle="solid"
          >
            <Radio.Button
              style={{ width: "96px", marginLeft: 16, textAlign: "center" }}
              value={1}
            >
              图表模式
            </Radio.Button>
            <Radio.Button
              style={{ width: "96px", textAlign: "center" }}
              value={2}
            >
              表格模式
            </Radio.Button>
          </Radio.Group></div>

        {model == 1 ? <div className="chart">
            <Ichart {...lineopt} />
        </div>
          : <Charttable source={source} type={type} tabvalue={tabvalue} />}
      </Echartbox>
    )
  }
