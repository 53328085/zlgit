/**
 * @author zhenglin zhu
 * @description: // 120.228177,30.212296 正泰大厦经纬度
 * @date 2022-09-21 09:49
 */
 
import React, {useEffect, useRef, forwardRef, useImperativeHandle} from "react";
import {
  Map,
  Marker,
  Circle,
  NavigationControl,
  InfoWindow,
  CityListControl,
  MapTypeControl,
  ScaleControl,
  ZoomControl,
  AutoComplete
} from "react-bmapgl";

 function Index(props, ref) {
  
    const {initialValues={}, setAaddress=()=>{}, lngLat, value, onChange} = props
    const {Lng, Lat} = initialValues
    const [lng, lat] = lngLat?.split(',') || []
    const center = { lng: (Lng ?? lng) ?? 120.2281 , lat: Lat ?? lat  ?? 30.2122} 
    const mapref = useRef(null)
  
    const option = {
      // mapType: 'earth',
      center ,
      zoom: 12,
      enableScrollWheelZoom: true, // 鼠标滚轮缩放
      // tilt: 20,
      enableDragging: true,
      // enableRotate: false
    };
    
  
 
  const getPosition = (e) => {
    try {
   
    let geoc = null
    if(window.BMapGL)  {   
        geoc = new window.BMapGL.Geocoder()
    }
    const pt = e.latlng    
    geoc.getLocation(pt, function (rs) { 
        try {    
        let { addressComponents, address, point:{lng, lat} } = rs;    
        let { city, district, province, street, streetNumber } = addressComponents;    
        console.log(rs)      
        setAaddress({lng, lat, address, province, city, district, street, streetNumber})
         } catch (error) {
          console.dir(error)
        }     
      });
         
    } catch (error) {
        console.log(error)
    }  
  }
   
  const serachcomplete = (res) => {
   // console.log(serachMap.getStatus())
    if (serachMap.getStatus() == BMAP_STATUS_SUCCESS) {
      let len = res.getCurrentNumPois();
      if (len > 0) {
        console.dir(res.getPoi(0));
        let { lng, lat } = res.getPoi(0)?.point;
        setAaddress({lng, lat})
      }
    }
  }
  
  const serachMap = new BMapGL.LocalSearch(mapref?.current?.map, { 
        renderOptions: { map: mapref?.current?.map },
        onSearchComplete: serachcomplete 
    }); 
  useImperativeHandle(ref, () => ({
    serachMap
  }))
  return (
    <Map style={{ height: "100%", width: "100%" }} {...option} onClick={getPosition} ref={mapref}>
     
      <Marker position={center} />
      <NavigationControl />
      <CityListControl />
      <MapTypeControl />
      <ScaleControl />
      <ZoomControl />
    </Map>
  );
}
export default forwardRef(Index)