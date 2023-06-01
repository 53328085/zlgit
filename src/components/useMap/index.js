 
// 天地图

/**
 * @author zhenglin zhu
 * @description: //lngLat：坐标值可以为以，号分隔的字符串  或者 对象数组 对象包括坐标点和marke 文本 默认lnglat 物联公司： 120.22830511467954, 30.21229461177818
 * @date 2023-05-31 08:48 
 */

import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback} from "react";

import {message} from 'antd'
 
  function Index(props, ref) {
  const {lngLat, value,setAaddress, onChange, isck=false, infoconfig={}} = props   // isck 是否允许点击
  
  const defaultpoint = lngLat || value 

 
  const [zoom] = useState(18)


  const geocoder = new T.Geocoder();
  const MapOptions = {
    projection: 'EPSG:900913',
    minZoom: 2,
    maxZoom: 18,
  }
 
  let [mapref, setMapref] = useState()
  let map = mapref ? new T.Map(mapref, MapOptions) : null

  const getlnglat = (str) => {
    const [lng, lat] =  str?.split(',') || []

     return lng&&lat ? new T.LngLat(lng, lat) :  new T.LngLat(120.22830511467954, 30.21229461177818)

  }

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
 
  const addInfo = (str, text='') => {
     let latlng = getlnglat(str);
     console.log(latlng)
     let marker = new  T.Marker(latlng);
     let infoWin = new T.InfoWindow(text, {offset:new T.Point(0,-30), ...infoconfig});
   //  infoWin.setLngLat(latlng);     
    
     map.addOverLay(marker);
    // map.addOverLay(infoWin)
    marker.addEventListener("mouseover", function() {
     
      marker.openInfoWindow(infoWin);
     } )

  }
 
  const searchResult = (result) =>{   
		if(result.getStatus() == 0){    
			map.panTo(result.getLocationPoint(), 16);    
      addmarker(result.getLocationPoint(), result.location?.keyWord)
		}else{
			message.error({count: result.getMsg()});
		}
		
	}
  const serachMap = (value) => {   
    try {
      map.clearOverLays();
      geocoder.getPoint(value, searchResult)
    } catch (error) {
      console.log(error)
    }
		
  }
  const mapClick = (result) =>  {  
     
    if(result.getStatus() == 0) {
    
      let {addressComponent,  location: {lon, lat}} = result
      let {city, province, county, address, address_distance} = addressComponent
      setAaddress && setAaddress({lng: lon, lat, address: result.getAddress(), province, city, district: county, street: address, streetNumber:address_distance})
      addmarker(new T.LngLat(lon, lat), result.getAddress())
    }else {

      setAaddress && setAaddress({})
    }

    
   
  }
  useImperativeHandle(ref, () => ({
    serachMap
  }))

  useEffect(() => {
     if(!mapref) return
     let geocode = new T.Geocoder();
     let latlng
     if (!Array.isArray(defaultpoint)) {
      latlng = getlnglat(defaultpoint) 
      map.centerAndZoom(latlng, zoom); // 初始化   
      geocode.getLocation(latlng,mapClick)
     }else if(Array.isArray(defaultpoint)) {
       
        map.centerAndZoom(getlnglat(defaultpoint[0]?.lnglat), zoom); // 初始化
        defaultpoint.forEach(item => {
          console.log(item)
          let {lnglat, text} = item
          addInfo(lnglat, text)
        })
       

     }
    
   
    
     
          
    


     map.addEventListener("click", (e) => {   
       if(isck) return;
     
      geocode.getLocation(e.lnglat,mapClick)
     });
   
  
  }, [mapref])
  return (
    <div style={{flex: 1, height: '100%'}} ref={(node) => setMapref(node)} id="mapBox" >

    </div>
  )
}
export default forwardRef(Index)