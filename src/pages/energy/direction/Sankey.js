import React, {useEffect, useRef, useState} from 'react'
import { drawEcharts } from "@com/useEcharts";
import {Empty} from 'antd'
export default function Sankey({data}) {
  
  const {link=[] } = data
  let isempty = link.length < 1
  const chart = useRef()
  let source =  link.map(i => i.source)
  let target = link.map(i => i.target)
  let nodes =Array.from(new Set([...source, ...target])).map(name => ({name}))
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
    <>
    {
      isempty ? <Empty /> :  <div ref={chart} style={{flex: 1}}></div>
    }
    </>
   
  )
}
