 
// 天地图


import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react";
import {useSelector} from 'react-redux'
import {systemConfigInfo} from '@redux/systemconfig'
import {message} from 'antd'
import {Tadi} from '@api/api'
  function Index(props, ref) {
  const {lngLat, value,setAaddress, onChange} = props
 
  const defaultpoint = lngLat || value 
  
  const [lng, lat] = defaultpoint?.split(',') || []
 
  let {companyName} = useSelector(systemConfigInfo)
  const [zoom] = useState(18)
  const [mapref, setMapref] = useState()

  const geocoder = new T.Geocoder();
  const MapOptions = {
    projection: 'EPSG:900913',
    minZoom: 2,
    maxZoom: 20,
  }
  const map = mapref ? new T.Map(mapref, MapOptions) : null


  const searchResult = (result) =>{
		if(result.getStatus() == 0){
			map.panTo(result.getLocationPoint(), 16);
			//创建标注对象
	        var marker = new T.Marker(result.getLocationPoint());
	        //向地图上添加标注
	        map.addOverLay(marker);
		}else{
			message.error({count: result.getMsg()});
		}
		
	}
  const serachMap = (value) => {
    map.clearOverLays();
		geocoder.getPoint(value, searchResult)
  }
  const mapClick = (result) =>  {  
    if(result.getStatus() == 0) {
    
      let {addressComponent,  location: {lon, lat}} = result
      let {city, province, county, address, address_distance} = addressComponent
      setAaddress && setAaddress({lng: lon, lat, address: result.getAddress(), province, city, district: county, street: address, streetNumber:address_distance})

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
     let label = new T.Label({
        text:companyName,
        position: latlng,
        offset: new T.Point(-9, 0)

     })
     let marker = new T.Marker(latlng)
     map.addOverLay(label)
     map.addOverLay(marker)
     marker.disableDragging(); 
     map.enableDrag();
     let geocode = new T.Geocoder();
     map.addEventListener("click", (e) => {     
      geocode.getLocation(e.lnglat,mapClick)
     });

     return () => {
      map.removeEventListener("click",mapClick)
     }
  }, [mapref])
  return (
    <div style={{flex: 1, height: '100%'}} ref={(node) => setMapref(node)} id="mapBox" >

    </div>
  )
}
export default forwardRef(Index)