/**
 * @author zhenglin zhu
 * @description: // 120.228177,30.212296 正泰大厦经纬度
 * @date 2022-09-21 09:49
 */
import { ConsoleSqlOutlined } from "@ant-design/icons";
import React, {useEffect, useState} from "react";
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
} from "react-bmapgl";
export default function Index(props) {
  const {initialValues={}, setAaddress=null} = props
  const {Lng, Lat} = initialValues 
  const center = { lng: Lng ||120.228177 , lat: Lat || 30.212296}
  const option = {
    // mapType: 'earth',
    center ,
    zoom: 12,
    enableScrollWheelZoom: true, // 鼠标滚轮缩放
    // tilt: 20,
    enableDragging: true,
    // enableRotate: false
  };
  
  useEffect(() => {
  /*  if(window.BMapGL)  {   
    geoc = new window.BMapGL.Geocoder()
   } */
  }, [])
 
  const getPosition = (e) => {
    try {
   
    let geoc = null
    if(window.BMapGL)  {   
        geoc = new window.BMapGL.Geocoder()
    }
    const pt = e.latlng   
    console.dir(geoc)
    geoc.getLocation(pt, function (rs) {
        
        try {    
        let { addressComponents, address, point } = rs;   
        console.log(point?.lng)       
        let { city, district, province, street, streetNumber } = addressComponents;    
        
         if(typeof setAaddress == 'function') setAaddress((params) => ( { ...params, Lng: point.lng, Lat: point.lat, Address: address}) )
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
