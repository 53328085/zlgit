 
// 天地图


import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback} from "react";

import {message} from 'antd'
 
  function Index(props, ref) {
  const {lngLat, value,setAaddress, onChange} = props
 
  const defaultpoint = lngLat || value 
  
  const [lng, lat] = defaultpoint?.split(',') || []
 
  const [zoom] = useState(18)


  const geocoder = new T.Geocoder();
  const MapOptions = {
    projection: 'EPSG:900913',
    minZoom: 2,
    maxZoom: 18,
  }
 
  let [mapref, setMapref] = useState()
  let map = mapref ? new T.Map(mapref, MapOptions) : null

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
     
     let latlng = lng&&lat ?new T.LngLat(lng, lat) :  new T.LngLat(120.22830511467954, 30.21229461177818)
     map.centerAndZoom(latlng, zoom); // 初始化
    
     
     let geocode = new T.Geocoder();


     geocode.getLocation(latlng,mapClick)
     map.addEventListener("click", (e) => {   
     
     
      geocode.getLocation(e.lnglat,mapClick)
     });
   
  
  }, [mapref])
  return (
    <div style={{flex: 1, height: '100%'}} ref={(node) => setMapref(node)} id="mapBox" >

    </div>
  )
}
export default forwardRef(Index)