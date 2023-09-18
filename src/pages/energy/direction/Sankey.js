import React, {useEffect, useRef, useState} from 'react'
import { drawEcharts } from "@com/useEcharts";
export default function Sankey() {
  const chart = useRef()
  const [data, setData] = useState({
    nodes: [
        {name: "成都银犁冷藏物流有限公司"},
        {name: "工业设备机房"},
        {name: "塔楼区"},
        {name: "交易区"},
        {name: "干杂区"},
        {name: "水产市场"},
        {name: "库房区域"},
        {name: "叉车充电间"},
        {name: "1号机房"},
        {name: "2号机房"},
        {name: "3号机房"}
    ],
    links: [
        {"source": "成都银犁冷藏物流有限公司", "target": "塔楼区",  "value": 50},
        {"source": "成都银犁冷藏物流有限公司", "target": "交易区",  "value": 120},
        {"source": "成都银犁冷藏物流有限公司", "target": "干杂区",  "value": 40},
        {"source": "成都银犁冷藏物流有限公司", "target": "水产市场",  "value": 20},
        {"source": "成都银犁冷藏物流有限公司", "target": "库房区域",  "value": 96},
        {"source": "成都银犁冷藏物流有限公司", "target": "叉车充电间",  "value": 30},
        {"source": "成都银犁冷藏物流有限公司", "target": "工业设备机房",  "value": 48},
        {"source": "工业设备机房", "target": "1号机房",  "value": 16},
        {"source": "工业设备机房", "target": "2号机房",  "value": 20},
        {"source": "工业设备机房", "target": "3号机房",  "value": 12},
    ],
    label: {
        position: "top",
    }
  }) 
  const option = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          data: data.nodes,
          links: data.links,
          right: "5%",
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          },

        }
      ]
  }
  useEffect(() => {
     drawEcharts(
        chart.current,
        {
          type: 2,
           ...option,
        }
     )
  })
  return (
    <div ref={chart} style={{flex: 1}}>桑基图</div>
  )
}
