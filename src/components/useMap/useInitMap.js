 
// 天地图

/**
 * @author zhenglin zhu
 * @description: //lngLat：坐标值可以为以,号分隔的字符串  或者 对象数组 对象包括坐标点和marke 文本 默认lnglat 物联公司： 120.22830511467954, 30.21229461177818
 * @date 2023-05-31 08:48 
 * 天地图无法重复初始化
 */

import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useMemo} from "react";

import {message} from 'antd'

 
export default  function useMap(props={}) {
  const {lngLat, value,setAaddress, onChange, isck=false, infoconfig={}, id="map"} = props   // isck 是否允许点击
  
 let defaultpoint =  value || lngLat

 
  let map;
 
  let geocoder = new T.Geocoder();

  const addmarker = (latlng, text='') => {
    map.clearOverLays()
   let marker = new  T.Marker(latlng);
   let label = new T.Label({
    text,
    position: latlng,
    offset: new T.Point(-9, 0),
   })
   map.addOverLay(marker);
   map.addOverLay(label)
}

 
 
  const searchResult = (result) =>{   
    let {lon, lat, keyWord} = result.location || {}
		if(result.getStatus() == 0){    
			map.panTo(result.getLocationPoint(), 16);    
      addmarker(result.getLocationPoint(), keyWord)
      setAaddress && setAaddress({lng: lon, lat, address: keyWord})
		}else{
			message.error({count: result.getMsg()});
		}
		
	}
  
 

  useEffect(() => {
    if(!defaultpoint) return 
    const getlnglat = (str) => {
      const [lng, lat] =  str?.split(',') || []
      
      return lng&&lat ? new T.LngLat(Number.parseFloat(lng), Number.parseFloat(lat)) :  new T.LngLat(120.22830511467954, 30.21229461177818)
 
   }
   
     map = new T.Map(id)
    let latlng = getlnglat(lngLat);
    map.centerAndZoom(latlng, 18);

 
    const addInfo = (str, text='') => {
      let latlng = getlnglat(str);
      let marker = new  T.Marker(latlng);
      let infoWin = new T.InfoWindow(text, {offset:new T.Point(0,0),closeButton:false, ...infoconfig});
    //  infoWin.setLngLat(latlng);     
     
      map.addOverLay(marker);
     // map.addOverLay(infoWin)
     marker.addEventListener("mouseover", function() {
      
       marker.openInfoWindow(infoWin);
      } )
      marker.addEventListener("mouseout",function() {
       marker.closeInfoWindow(infoWin)
      }) 
      
   }

 
  const mapClick = (result) =>  {  
     
    if(result.getStatus() == 0) {
      console.log(result)
      let {addressComponent,  location: {lon, lat},} = result
      
      let {city, province, county, address, address_distance,road='', poi=''} = addressComponent
      
      let custaddress = city + county + road + poi;
      console.log(custaddress);
      setAaddress && setAaddress({lng: lon, lat, address: custaddress,  province, city, district: county, street: address, streetNumber:address_distance})
      //addmarker(new T.LngLat(lon, lat), result.getAddress())
      addmarker(new T.LngLat(lon, lat), custaddress)
    }else {

      setAaddress && setAaddress({})
    }

    
   
  }

  if (Array.isArray(defaultpoint)) {
    defaultpoint.forEach(item => {
      let {lnglat, text} = item
      addInfo(lnglat, text)
    })
   }else {
     geocoder.getLocation(latlng,mapClick)
   } 

  map.addEventListener("click", (e) => {   
    if(isck) return;
  
    geocoder.getLocation(e.lnglat,mapClick)
  });

  }, [defaultpoint])

  const serachMap = (value) => { 
    console.log(value);  
    try {
      map.clearOverLays();
      geocoder.getPoint(value, searchResult)
    } catch (error) {
      console.log(error)
    }
		
  }
  return serachMap
}
 