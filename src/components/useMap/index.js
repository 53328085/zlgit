 
// 天地图

/**
 * @author zhenglin zhu
 * @description: //lngLat：坐标值可以为以,号分隔的字符串  或者 对象数组 对象包括坐标点和marke 文本 默认lnglat 物联公司： 120.22830511467954, 30.21229461177818
 * @date 2023-05-31 08:48 
 * 天地图无法重复初始化
 */

import React, {useEffect, useRef, forwardRef, useImperativeHandle, useCallback} from "react";
import {useSelector} from 'react-redux'

import {currProject} from '@redux/systemconfig'
import {message} from 'antd'
   let map = null;
  function Index(props, ref) {
  const {lngLat, value,setAaddress, onChange, isck=false, infoconfig={}} = props   // isck 是否允许点击
  

 let {lngLat: projectLnglat} = useSelector(currProject);
 let defaultpoint =projectLnglat || value || lngLat ;
  let geocoder = new T.Geocoder();
 
  
  const getlnglat = (str) => {
     const [lng, lat] =  str?.split(',') || []
     
     return  new T.LngLat(Number.parseFloat(lng), Number.parseFloat(lat))

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
 /*  const serachMap = (value, map) => {   
    try {
      map.clearOverLays();
      geocoder.getPoint(value, searchResult)
    } catch (error) {
      console.log(error)
    }
		
  } */
  const serachMap = (value, map) => {   
    console.log(map)
    try {
      map.clearOverLays();
      geocoder.getPoint(value, searchResult)
    } catch (error) {
      console.log(error)
    }
		
  }
  const mapClick = (result) =>  {  
     
    if(result.getStatus() == 0) {
      
      let {addressComponent,  location: {lon, lat},} = result
      console.log(result)
      let {city, province, county, address, address_distance,road='', poi='', poi_position='',poi_distance='',} = addressComponent
      
      let custaddress = city + county + road + poi
      console.log(custaddress);
      try {
        console.log(result.getAddress())
      } catch (error) {
        console.log(error);
      }
      setAaddress && setAaddress({lng: lon, lat, address: custaddress,  province, city, district: county, street: address, streetNumber:address_distance})
     
      addmarker(new T.LngLat(lon, lat), custaddress)
    }else {

      setAaddress && setAaddress({})
    }

    
   
  }
  useImperativeHandle(ref, () => ({
    serachMap:serachMap
  }), [map])
  //const [mapkey, setMapkey] = useState(Math.random().toString())
  //const mapkey = Math.random().toString()
  useEffect(() => {
    let latlng
    if(defaultpoint) {
      latlng =Array.isArray(defaultpoint) ? getlnglat(defaultpoint[0]?.lnglat) : getlnglat(defaultpoint)
    }else {
      latlng = getlnglat( "120.22830511467954,30.21229461177818")
    }
      
    if(!latlng) return;

     map = new T.Map("map");
   
   
   console.log(latlng)
    // let dom = document.getElementById("mapBox")
     try {
     
      // setMapkey(Math.random().toString())
       map.centerAndZoom(latlng, 10)    
       map.enableDrag();
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
     const clickhandler = (e) => {
        if(isck) return;     
        geocoder.getLocation(e.lnglat,mapClick)
     }
    /*  map.addEventListener("click", (e) => {   
       if(isck) return;
     
       geocoder.getLocation(e.lnglat,mapClick)
     }); */
      map.addEventListener('click', clickhandler)
      return () => {
        map.removeEventListener('click', clickhandler)
      }
    
  }, [defaultpoint])
  return (
    <div style={{width: "100%", height: '100%', touchAction: "none"}}    id="map"  >

    </div>
  /*   <div style={{flex: 1, height: '100%'}} ref={(node) => setMapref(node)} id="mapBox"  >

    </div> */
  )
}
export default forwardRef(Index)