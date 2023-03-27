/**
 * @author zhenglin zhu
 * @description: // 120.228177,30.212296 正泰大厦经纬度
 * @date 2022-09-21 09:49
 */
 
import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react";
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
  
    const { setAaddress=()=>{}, lngLat, value, onChange} = props
    const defaultpoint = lngLat || value 

    const [lng, lat] = defaultpoint?.split(',') || []
     
   
    const [position, setPosition] = useState({
       point: new BMapGL.Point(lng || 120.22830511467954, lat || 30.21229461177818),
       icon: 'loc_blue'
     }
    )
  
    const mapref = useRef(null)
  
    const option = {
      zoom: 16,
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
        let { lng, lat} = res.getPoi(0)?.point;
        setAaddress({lng, lat})
      }
    }
  }
  
  const serachMap = new BMapGL.LocalSearch(mapref?.current?.map, { 
        renderOptions: { map: mapref?.current?.map },
        onSearchComplete: serachcomplete 
    }); 
  useEffect(() => {
   setPosition(
     {
       ...position,
       point: new BMapGL.Point(lng || 120.22830511467954, lat || 30.21229461177818),
     }
  
    ) 
  }, [value])
  useImperativeHandle(ref, () => ({
    serachMap
  }))
 const mapstyle = {
   height: '100%',
   width: '100%',
   minHeight: '370px',
   minWidth: '410px'
 }
  return (
    <Map style={mapstyle} {...option} onClick={getPosition} ref={mapref} center={position.point} >
     
      <Marker position={position.point} enableDragging icon={position.icon} />
      <NavigationControl />
      <CityListControl anchor={BMAP_ANCHOR_TOP_LEFT} />
      <MapTypeControl />
      <ScaleControl />
      <ZoomControl />
    </Map>
  );
}
export default forwardRef(Index)