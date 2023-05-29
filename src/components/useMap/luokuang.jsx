 
// 箩筐图


import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react";
import {useSelector} from 'react-redux'
import {systemConfigInfo} from '@redux/systemconfig'


 
  function Index(props, ref) {
  const {lngLat, value,setAaddress, onChange} = props
 
  const defaultpoint = lngLat || value 
  
  const [mapref, setMap] = useState()

  const [lng, lat] = defaultpoint?.split(',') || []
  
  let {companyName} = useSelector(systemConfigInfo)
  const [zoom] = useState(18)
//  const mapref = useRef()
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
   //  const map = new T.Map(mapref.current, MapOptions) 
    // let latlng = lng&&lat ?new T.LngLat(lng, lat) :  new T.LngLat(120.22830511467954, 30.21229461177818)
     if(!mapref) return
    
      const map = new LKMap.Map(mapref,{
      center: [120.22830511467954, 30.21229461177818],      // 中心点
      zoom: 16,   // 缩放级别
      style:"lkmap://styles/standard",    // 地图样式
    })
    
    var marker = new LKMap.Marker({
      map: map,
      position: new LKMap.LngLat(120.22830511467954, 30.21229461177818),
    });

    map.on('load', function () {
    
    })
   return  () => {
      map.destroy();
    }
  }, [mapref])
  return (
    <div style={{flex: 1}} ref={(node) => setMap(node)} id="mapBox" >

    </div>
  )
}
export default forwardRef(Index)