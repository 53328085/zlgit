 
import React, {useRef, useEffect} from 'react'
import {Typography} from 'antd'
import styled from 'styled-components';
const {Text, Paragraph} = Typography
const Info = styled.div`
   position: absolute;
   top: 10px;
   right: 10px;
   background-color: #fff;
   border: 1px solid #d7d7d7;
   border-radius: 4px;

`
export default function Index() {
   
    let map;
    
   

  useEffect(() => {
    AMapLoader.load({ //首次调用 load
        key:'0a004d3329b9515715462f6af92f40eb',//首次load key为必填
        version:'2.0',
        plugins:['AMap.Scale','AMap.ToolBar']
    }).then((AMap)=>{
        map = new AMap.Map('map', {
           // mapStyle: 'amap://styles/whitesmoke'
        });
        const traffic = new AMap.TileLayer({
            'autoRefresh': true,     //是否自动刷新，默认为false
            'interval': 180,         //刷新间隔，默认180s
          })
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.ToolBar())
        map.add(new AMap.Marker({
            position:map.getCenter(),
            
        }));
        map.add(traffic)
        map.remove(traffic)
        traffic.hide()
        
    }).catch((e)=>{
        console.error(e);
    });
   
    AMapLoader.load({ //可多次调用load
        plugins:['AMap.MapType']
    }).then((AMap)=>{
        map.addControl(new AMap.MapType())
    }).catch((e)=>{
        console.error(e);
    });
    
  })
 
  return (
   <div   id="map" style={{height: "100vh", position: "relative"}}>
     <Info>
        <Paragraph>获取地图级别与中心点坐标</Paragraph>
        <Text>当前级别：</Text>
     </Info>
   </div>
  )
}
