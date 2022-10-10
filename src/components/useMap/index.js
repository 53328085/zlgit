/**
 * @author zhenglin zhu
 * @description: // 120.228177,30.212296 正泰大厦经纬度
 * @date 2022-09-21 09:49
 */
import { ConsoleSqlOutlined } from "@ant-design/icons";
import React, {useEffect, useRef} from "react";
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
export default function Index(props) {
  const {initialValues={}, setAaddress=()=>{}} = props
  const {Lng, Lat} = initialValues 
  const center = { lng: Lng ||120.228177 , lat: Lat || 30.212296}
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
        let { addressComponents, address, point } = rs;   
        console.log(point?.lng)       
        let { city, district, province, street, streetNumber } = addressComponents; 
        console.log(province)
        if(typeof setAaddress == 'function') setAaddress({Lng: point.lng, Lat: point.lat, Address: address, province, city, district})
         } catch (error) {
          console.dir(error)
        }     
      });
         
    } catch (error) {
        console.log(error)
    }  
  }
 
  return (
    <Map style={{ height: "100%", width: "100%" }} {...option} onClick={getPosition}>
     
      <Marker position={center} />
      <NavigationControl />
      <CityListControl />
      <MapTypeControl />
      <ScaleControl />
      <ZoomControl />
    </Map>
  );
}
