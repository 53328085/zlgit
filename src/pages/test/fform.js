import React, {useRef, useEffect} from 'react'
import { drawEcharts } from "@com/useEcharts";
export default function Index() {
  const ref = useRef()
  const option = {
    legend: {
      data: ['2015', '2016', '2017']
    },
    tooltip: {},
    dataset: {
     
      dimensions: ['product', '2015', '2016', '2017'], // 维度
      source: [
        { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
        { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
        { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
        { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
      ]
    },
    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
    xAxis: { type: 'category' },
    // 声明一个 Y 轴，数值轴。
    yAxis: {},
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'line' }]
  };
  useEffect(() => {
    drawEcharts(ref.current, {...option})

  })
  return (
    <div>
       
       <div style={{width: '600px', height: '500px'}} ref={ref}></div>

    </div>
  )
}
