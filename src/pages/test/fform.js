import React, {useRef, useEffect, useState} from 'react'
import * as echarts from "echarts";
import china from "./china.json";
import geochina from './geochina.json'
// import Svgchina from './china.svg'
import zhejiang from './zhejiang.json'
import hangzhou from './hangzhou.json'
import log from  '../../assets/image/chintlog.png'
import mapbg from './map.PNG'
var ROOT_PATH = 'https://echarts.apache.org/examples'
export default function Index() {
  let img = document.createElement('img')
  img.src=mapbg
  const [datas, setDatas] = useState(china)
  const [Name, setName] = useState('china')
 
 //echarts.registerMap(Name, datas)

 echarts.registerMap('china', geochina)
  let option = {
     title: {
      text: "中华人民共和国",
      textStyle: {
        color: "#bce2e8",
        fontStyle: 24,
      },
      top: 60,
      left: "center"
     },
     visualMap: {
      type: "piecewise",
      left: 20,
      bottom: "10",
      min: 10,
      max: 10000,
      inRange: {
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
      },
      show: true,
      seriesIndex: 0,
      pieces: [
        {gt: 9000, lte: 10000},
        {gt: 10, lte: 1000},
        {gt: 1100, lte: 2000},
        {gt: 2100, lte: 3000},
        {gt: 3100, lte: 4000},
        {gt: 4100, lte: 5000},
        {gt: 5100, lte: 6000},
      ]
     },

     geo: {
        map: "china", // 必须设置
        zoom: 1.25,
        roam: true,
        label: {
           normal: {
             show: true,
             textStyle: {
              color: "#333"
             }
           },
           emphasis: {
              textStyle: {
                color: "#fff"
              }
           }
        },
        itemStyle: { // 地图区域的多边形 图形样式          
          normal: {
              borderColor: "rgba(147, 235, 248, .5)", //设置地图区域边框的颜色
              borderWidth: 1, //设置地图区域边框的宽度
              areaColor: {    //设置地图区域的填充色 -> 渐变色
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [
                      {
                          offset: 0,
                          color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                      },
                      {
                          offset: 1,
                          color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                      },
                  ],
                  globalCoord: false, // 缺省为 false
              },
          },
          // 鼠标放上去高亮的样式（在鼠标悬停状态下）
          emphasis: {
              areaColor: "#389BB7",
              borderWidth: 0,
          },
         
      },
    
     },
    
     series: [
      {
      type: "map",
     
      data: [
        {name: "浙江省", value: 500},
        {name: "安徽省", value: 1500},
        {name: "江苏省", value: 4500},
        {name: "上海市", value: 3245}
      ]       
     },
     {
      type: "scatter", //类型：散点
      symbol: "rect",
      coordinateSystem: "geo", //使用地理坐标系
      itemStyle: {
        color: {
          type: "radial", // 径向渐变，前三个参数分别是圆心 x, y 和半径
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [
            {
              offset: 0.5,
              color: "#fff", // 50% 处的颜色
            },
            {
              offset: 1,
              color: "rgb(0 0 0 / 0%)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        borderColor: "#fff", //边框白色
        borderWidth: 1,      //边框宽度
      },
      symbolSize: 10,    //散点大小
      data: [
        { name: "浙江省", value: [119.5035076, 29.703459] },
        { name: "安徽省", value: [121.579792, 29.468388] },
        { name: "江苏省", value: [120.452111, 27.700575] },
        { name: "上海市", value: [120.770865, 30.500653] },
        { name: "江西省", value: [119.882398, 30.607198] },
       
      ],
      zlevel: 1,
      },
    ],
       
   
      
    
  }
  const mapref = useRef()
  const init = (map) => {
    let mapJson = echarts.getMap(Name)
    if(mapJson) {
      mapJson = mapJson.geoJSON
      echarts.registerMap(Name, mapJson)
    }else {
      echarts.registerMap(Name, datas)
    }
    map.setOption(option)
  }
 
  useEffect(() => {
    try {
     
      let map = echarts.init(mapref.current, "dark")
      map.setOption(option)
     /*  map.setOption({
        geo: [
          {
            id: "geoChina",
            show: true,
            map: 'topo',
            roam: true,
            layoutCenter: ['50%', '50%'],
            layoutSize: '95%',
            label: {
               show: true
            },
            regions: [{
              name: '广东省',
              itemStyle: {
                  areaColor: 'red',
                  color: 'red'
              }
            }],
            series: {
               
            },
            nameProperty: "NAME",
            data: [
              {name: "广东省", value: 1000}
            ]
          }
        ]
      }) */
    //  init(map)
     /*  map.on("click", ({name}) => {
         console.log(name)
         if(name == '浙江省') {
          setName('zhejiang')
          setDatas(zhejiang)
         }else if(name == '杭州市') {
          setName('hangzhou')
          setDatas(hangzhou)
         }
      }) */
    } catch (error) {
      console.log(error)
    }
     
  }, [mapref.current])
  return (
    <div style={{flex: 1, display: 'flex', padding: "32px", alignItems: "center",justifyContent: "center"}}>
     
       <div ref={mapref} style={{width: "1000px", height: "800px", border: "1px solid #dedede"}}></div>
    </div>
  )
}
