import React, {useEffect, useRef} from 'react'
import { drawEcharts } from "@com/useEcharts";
export default function fform() {
  const ref = useRef();
 const  set = {
    // 提供一份数据。
   
    source: [
      ['score', 'amount', 'product'],
      [89.3, 58212, 'Matcha Latte'],
      [57.1, 78254, 'Milk Tea'],
      [74.4, 41032, 'Cheese Cocoa'],
      [50.1, 12755, 'Cheese Brownie'],
      [89.7, 20145, 'Matcha Cocoa'],
      [68.1, 79146, 'Tea'],
      [19.6, 91852, 'Orange Juice'],
      [10.6, 101852, 'Lemon Juice'],
      [32.7, 20112, 'Walnut Brownie']
    ]
  }
  useEffect(() => {
    drawEcharts(ref.current, { dataset: set,xAxis: {type: "value"}, yAxis: {type: 'category'}, series: [
      {
        type: 'bar',
        encode: {
          // 将 "amount" 列映射到 X 轴。
          x: 'amount',
          // 将 "product" 列映射到 Y 轴。
          y: 'product'
        }
      }
    ] } )
     
  }, [])
  return (
    <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
       <div ref={ref} style={{width: "100%", height: "600px", border: "1px solid #dedede"}}></div>
    </div>
  )
}
