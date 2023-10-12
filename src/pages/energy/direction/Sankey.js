import React, {useEffect, useRef, useState} from 'react'
import { drawEcharts } from "@com/useEcharts";
export default function Sankey({data}) {
 console.log("render")
 const {link, name} = data
  const chart = useRef()
  let nodes = [
    "A区", "B区", "交易区","塔楼","工业设备机房","水产市场", "冷藏区", "冷库一", "冷库二", "冷库三", "冷库四", "冷库五", "冷库六", "1号楼", "2号楼", "工业设备机房1", "工业设备机房2", "市场A", "市场B"
  ].map(n => ({name: n}))
 let links = link.map(l =>({...l, value: parseFloat(l.value)}))

  const custoption = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          layout: "none",
          data: nodes,
          links,
          right: "5%",
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          },

        }
      ]
  }
  useEffect(() => {
   try {
   
   // if(data.name?.length < 1 || data.links?.length < 1 ) return
    // console.log(name)
    console.log(links)
     drawEcharts(
        chart.current,
        {
           custoption,
        }
     )
   } catch (error) {
     console.log(error)
   }
   
  }, [data])
  return (
    <div ref={chart} style={{flex: 1}}></div>
  )
}
