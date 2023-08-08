 
// 天地图

/**
 * @author zhenglin zhu
 * @description: //lngLat：坐标值可以为以，号分隔的字符串  或者 对象数组 对象包括坐标点和marke 文本 默认lnglat 物联公司： 120.22830511467954, 30.21229461177818
 * @date 2023-05-31 08:48 
 * 天地图无法重复初始化
 */

import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useMemo} from "react";

import {message} from 'antd'

 
  function Index(props, ref) {
  const {lngLat, value,setAaddress, onChange, isck=false, infoconfig={}} = props   // isck 是否允许点击

  let defaultpoint =  value || lngLat || "120.22830511467954,30.21229461177818"

  console.log('lngLat',lngLat,'infoconfig',infoconfig)
  const zoom = 18;


  let geocoder = new T.Geocoder();
  


  const MapOptions = {
    projection: 'EPSG:900913',
    minZoom: 2,
    maxZoom: 18,
  }
 
  let [mapref, setMapref] = useState()
   let map = mapref ? new T.Map(mapref, MapOptions) : null
  
 

  const getlnglat = (str) => {
     const [lng, lat] =  str?.split(',') || []
     
     return lng&&lat ? new T.LngLat(Number.parseFloat(lng), Number.parseFloat(lat)) :  new T.LngLat(120.22830511467954, 30.21229461177818)

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
  const serachMap = (value) => {   
    try {
      map.clearOverLays();
      geocoder.getPoint(value, searchResult)
    } catch (error) {
      console.log(error)
    }
		
  }
  const mapClick = (result) =>  {  
     console.log(result.getStatus())
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
  //const [mapkey, setMapkey] = useState(Math.random().toString())
  //const mapkey = Math.random().toString()
  useEffect(() => {
   
     if(!mapref || !defaultpoint) return
   
    // let dom = document.getElementById("mapBox")
     try {
      let latlng =Array.isArray(defaultpoint) ? getlnglat(defaultpoint[0]?.lnglat) : getlnglat(defaultpoint)
      // setMapkey(Math.random().toString())
       map.centerAndZoom(latlng, zoom)     
      if (Array.isArray(defaultpoint)) {
       defaultpoint.forEach(item => {
         let {lnglat, text} = item
         addInfo(lnglat, text)
       })
      }else {
        geocoder.getLocation(latlng,mapClick)
      }
      } catch (error) {
        console.log(error)
      }
    
     map.addEventListener("click", (e) => {   
       if(isck) return;
     
       geocoder.getLocation(e.lnglat,mapClick)
     });
    
     map.addEventListener('load', (e)=> {
      console.log("地图加载")
     })
    
  }, [mapref, lngLat, value])
  return (
    <div style={{flex: 1, height: '100%'}} ref={(node) => setMapref(node)} id="mapBox"  >

    </div>
  )
}
export default forwardRef(Index)