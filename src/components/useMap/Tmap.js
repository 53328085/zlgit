 
// 天地图


import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {systemConfigInfo} from '@redux/systemconfig'
export default function BigScreenUrl2({lat, lng}) {
  let {companyName} = useSelector(systemConfigInfo)
  const [zoom] = useState(18)
  const ref = useRef()
  const MapOptions = {
    projection: 'EPSG:900913',
    minZoom: 2,
    maxZoom: 20,
  }
  const mapClick = (e) =>  {   
    let {lnglat} = e
    
     console.log(lnglat.getLng()) 
     console.log(lnglat.getLat())
  }
  useEffect(() => {
     const map = new T.Map(ref.current, MapOptions) 
     let latlng = new T.LngLat(120.22830511467954, 30.21229461177818)

     map.centerAndZoom(latlng, zoom); // 初始化
     let label = new T.Label({
        text:companyName,
        position: latlng,
        offset: new T.Point(-9, 0)

     })
     let marker = new T.Marker(latlng)
     map.addOverLay(label)
     map.addOverLay(marker)
     marker.disableDragging(); 
     map.enableDrag();
     map.addEventListener("click",mapClick);

     return () => {
      map.removeEventListener("click",mapClick)
     }
  }, [])
  return (
    <div style={{flex: 1}} ref={ref} id="mapBox" >

    </div>
  )
}
