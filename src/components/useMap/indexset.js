 
// 天地图

/**
 * @author zhenglin zhu
 * @description: //lngLat：坐标值可以为以,号分隔的字符串  或者 对象数组 对象包括坐标点和marke 文本 默认lnglat 物联公司： 120.22830511467954, 30.21229461177818
 * @date 2023-05-31 08:48 
 * 天地图无法重复初始化
 */

import React, {useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useState,memo} from "react";
import {useSelector} from 'react-redux'
import {Fallack} from "@com/useError"
import {currProject} from '@redux/systemconfig'
import {message} from 'antd'

  function Index(props, ref) {
    let map = null
  const {lngLat, value,setAaddress, onChange, isck=false, infoconfig={}, } = props   // isck 是否允许点击
  
 
 let {lngLat: projectLnglat, address} = useSelector(currProject);
 let defaultpoint =  value || lngLat || projectLnglat;
  let geocoder = window.T  ?    new T.Geocoder() : null;
   
 
 
  const getlnglat = (str) => {
     if(typeof str !== "string") return []
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
    try {
      console.log(str)
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
      
    } catch (error) {
      console.log(error)
    }
    
  }
 
  const searchResult = (result) =>{   
    try {
     console.log(result)
		if(result.getStatus() == 0){    
      let {lon, lat, keyWord} = result.location || {}
      let latlng = new T.LngLat(lon, lat)
     map.panTo(latlng, 18);    
   
      addmarker(latlng, keyWord)
     
      setAaddress && setAaddress({lng: lon, lat, address: keyWord})
		}else{
			message.error({count: result.getMsg()});
		}
   } catch (error) {
      console.log(error)
    }
	}
  const serachMap = (value) => {   
     console.log(value)
   //  console.log(map)
    try {
    //  map &&  map.clearOverLays();
      geocoder?.getPoint(value, searchResult)
    } catch (error) {
      console.log(error)
    }
		
  }
 
  const mapClick = (res) =>  {  
    
    if(res.getStatus() == 0 && res.addressComponent) {
      
      let {addressComponent,  location: {lon, lat},} = res
      console.log(res)
      let {city, province, county, address, address_distance,road='', poi='', poi_position='',poi_distance='',} = addressComponent
      
      let custaddress = city + county + road + poi
     // console.log(custaddress);
     
      setAaddress && setAaddress({lng: lon, lat, address: custaddress,  province, city, district: county, street: address, streetNumber:address_distance})
      map.clearOverLays();
      addmarker(new T.LngLat(lon, lat), custaddress)
    }else {

      setAaddress && setAaddress({})
    }
   
  }
  useImperativeHandle(ref, () => ({
    serachMap: serachMap 
  }), [map])
  //const [mapkey, setMapkey] = useState(Math.random().toString())
  //const mapkey = Math.random().toString()
  useEffect(() => {
    try {
    if (!geocoder) return
    let latlng
    if(defaultpoint) {
      latlng =Array.isArray(defaultpoint) ? getlnglat(defaultpoint[0]?.lnglat) : getlnglat(defaultpoint)
    }else {
      latlng = getlnglat( "120.22830511467954,30.21229461177818")
    }
   
     if(!map) {
     
      map =new T.Map("tmap");
      map.centerAndZoom(latlng, 18)    
      map.enableDrag();
      if(latlng && address)  addmarker(latlng, address)
      if (Array.isArray(defaultpoint)) {
        defaultpoint.forEach(item => {

          let {lnglat, text} = item
          addInfo(lnglat, text)
        })
       } else {
         geocoder?.getLocation(latlng,mapClick)
       }    
      map.addEventListener("click", (e) => {
        if(isck) return;
        geocoder?.getLocation(e.lnglat,mapClick)
       });
      }
     
    } catch (error) {
      console.log(error)
    }
     return () => {
      map = null
     }
  }, [defaultpoint])
  return (
    <div style={{width: "100%", height: '100%',  touchAction: "none"}} id="tmap">
         
            { !window.T  && <Fallack custmsg={"地图加载出错，请检查网络是否断开"} />}
           
    </div>
  /*   <div style={{flex: 1, height: '100%'}} ref={(node) => setMapref(node)} id="mapBox"  >

    </div> */
  )
}
export default forwardRef(Index)