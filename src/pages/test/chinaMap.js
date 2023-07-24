import React, {useRef, useEffect} from 'react'
import * as echarts from "echarts";
import china from "./china.json"
export default function Index() {
  echarts.registerMap('china', china)
  let option = {
     title: {
      text: "中华人民共和国",
     
     },
     series: {
    
      type: 'map',
      map: 'china',
      roam: true,
      selectedMode: "multiple",
      label: {
        show: true,
       // position: "insideRight", // 无效果~！！！
      // distance:  15, // 无效果
       rotate: 0,
       offset: [0,0],
       formatter: '{b}' ,
       //color: "#1677FF",
       align: "left",
       verticalAlign: "bottom"
       },
       rich: {
        a: {
          verticalAlign: "bottom"
        }
       }
      
    }
  }
  const mapref = useRef()

  useEffect(() => {
    try {
      console.log(mapref.current)
      let map = echarts.init(mapref.current)
      map.setOption(option)
    } catch (error) {
      console.log(error)
    }
     
  })
  return (
    <div style={{flex: 1, display: 'flex'}}>
       <div ref={mapref} style={{flex: 1}}></div>
    </div>
  )
}
