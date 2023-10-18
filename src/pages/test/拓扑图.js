import React, {useRef, useEffect} from 'react'
import { drawEcharts } from "@com/useEcharts";
import { current } from '@reduxjs/toolkit';
export default function fform() {
  const ref = useRef()
  const axisData = ['Mon', 'Tue', 'Wed', 'Very Loooong Thu', 'Fri', 'Sat', 'Sun'];

  var data = [{
    x: 500,
    y: 1000,
    name: '应用',
    svgPath: 'M544  ',
    symbolSize: 70,

}, {
    x: 100,
    y: 600,
    name: '模块1',
    svgPath: 'M1172.  '
},
{
    x: 500,
    y: 600,
    name: '模块2',
    svgPath: 'M1 615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z'
},
{
    x: 900,
    y: 600,
    name: '模块3',
    svgPath: 'M117 615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z'
},
{
    x: 0,
    y: 300,
    name: '节点1',
    svgPath: 'M887.5  68 68.25472-68.224 68.28544l-0.06144-0.06656z',
},
{
    x: 300,
    y: 300,
    name: '节点2',
    svgPath: 'M8837.71392 0 68.29056 30.57152 68.28544 68.29056 0 37.68832-30.53568 68.25472-68.224 68.28544l-0.06144-0.06656z',
},
{
    x: 700,
    y: 300,
    name: '节点3',
    svgPath: 'M887.5525472-68.22468.28544l-0.06144-0.06656z',
},
{
    x: 1000,
    y: 300,
    name: '节点4',
    svgPath: 'M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
},
]
var charts = {
nodes: [],
linesData: [{
        coords: [
            [500, 1000],
            [500, 800],
        ]
    }, {
        coords: [
            [500, 800],
            [100, 800],
            [100, 600]

        ]
    }, {
        coords: [
            [500, 800],
            [500, 600],

        ]
    }, {
        coords: [
            [500, 800],
            [900, 800],
            [900, 600]

        ]
    },
    {
        coords: [
            [100, 600],
            [0, 300]
        ]
    },
    {
        coords: [
            [100, 600],
            [300, 300]
        ]
    },
    {
        coords: [
            [900, 600],
            [700, 300]
        ]
    },
    {
        coords: [
            [900, 600],
            [1000, 300]
        ]
    }
]
}
for (var j = 0; j < data.length; j++) {
const {
    x,
    y,
    name,
    svgPath,
    symbolSize
} = data[j];
var node = {
    name,
    value: [x, y],
    symbolSize: symbolSize || 150,
    symbol: 'path://' + svgPath,
    itemStyle: {
        color: 'orange',
    }
}
charts.nodes.push(node)
}

let option = {
backgroundColor: "#0B1321",
xAxis: {
    min: 0,
    max: 1000,
    show: false,
    type: 'value'
},
yAxis: {
    min: 0,
    max: 1000,
    show: false,
    type: 'value'
},
series: [{
    type: 'graph',
    coordinateSystem: 'cartesian2d',
    label: {
        show: true,
        position: 'bottom',
        color: 'orange',
        formatter: function(item) {
            return item.data.nodeName
        }
    },
    data: charts.nodes,
}, {
    type: 'lines',
    polyline: true,
    coordinateSystem: 'cartesian2d',
    lineStyle: {
        type: 'dashed',
        width: 2,
        color: '#175064',
        curveness: 0.3

    },
    effect: {
        show: true,
        trailLength: 0.1,
        symbol: 'arrow',
        color: '#ff7313',
        symbolSize: 8
    },
    data: charts.linesData
}]
};



useEffect(() => {
  drawEcharts(ref.current, {
    ...option,
    type: 2,
  })
})
 const sty = {
  height: "600px",
  widht: "800px",
 }
  return (
    <div>
      <div ref={ref} style={sty}></div>
    </div>
  )
}
