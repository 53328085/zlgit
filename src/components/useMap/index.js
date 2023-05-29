 
// 天地图


import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react";
import {useSelector} from 'react-redux'
import {systemConfigInfo} from '@redux/systemconfig'

  function Index(props, ref) {
  const {lngLat, value,setAaddress, onChange} = props
 
  const defaultpoint = lngLat || value 
  
  const [lng, lat] = defaultpoint?.split(',') || []
  console.log(lng)
  let {companyName} = useSelector(systemConfigInfo)
  const [zoom] = useState(18)
  const mapref = useRef()
  const MapOptions = {
    projection: 'EPSG:900913',
    minZoom: 2,
    maxZoom: 20,
  }
  const mapClick = (e, map) =>  {   
    let {lnglat} = e
    setAaddress && setAaddress(lnglat)
  }
  useImperativeHandle(ref, () => ({
   // serachMap
  }))
  useEffect(() => {
     const map = new T.Map(mapref.current, MapOptions) 
     let latlng = lng&&lat ?new T.LngLat(lng, lat) :  new T.LngLat(120.22830511467954, 30.21229461177818)

    
    

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
     map.addEventListener("click", (e)=> mapClick(e, map));

     return () => {
      map.removeEventListener("click",mapClick)
     }
  }, [])
  return (
    <div style={{flex: 1}} ref={mapref} id="mapBox" >

    </div>
  )
}
export default forwardRef(Index)