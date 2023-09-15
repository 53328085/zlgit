import React, {useEffect, useRef} from 'react'
import { drawEcharts } from "@com/useEcharts";
export default function fform() {
  const ref = useRef();
 const  set = {
    // 提供一份数据。
    dimensions: ['score', 'amount'],
    source: [
      [89.3, 3371],
      [92.1, 8123],
      [94.4, 1954],
      [85.4, 829],
    ]
  }
  useEffect(() => {
    drawEcharts(ref.current, { 
      dataset: set,
       series: {
         type: "bar",
         
       }
       } )
     
  }, [])
  return (
    <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
       <div ref={ref} style={{width: "100%", height: "600px", border: "1px solid #dedede"}}></div>
    </div>
  )
}
