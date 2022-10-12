import { Button, Modal, Input, message } from "antd";
import styled from "styled-components";
import React, { useState, useCallback, useEffect } from "react";
const Wrapper = styled.div`

margin: 20px;
height:600px ;
width: 600px;
#wrapper {
  height:80%;
  width: 100%;
}

` 


export default () => {

  let  [ipt, setIpt] = useState('')
  useEffect(() => {
   const map = new window.BMapGL.Map("wrapper")
   const geoc = new window.BMapGL.Geocoder()
    var point = new window.BMapGL.Point(120.228177, 30.212296);
    console.log(map)
    map?.centerAndZoom(point, 15); 
    map?.enableScrollWheelZoom(true)
    const scaleCtrl = new window.BMapGL.ScaleControl()
    const zoomCtrl = new window.BMapGL.ZoomControl()
    const  nav3d= new window.BMapGL.NavigationControl3D()
    const cityCtrl = new window.BMapGL.CityListControl
    map.addControl(scaleCtrl)
    map.addControl(zoomCtrl)
    map.addControl(nav3d)
    map.addControl(cityCtrl)
  
    map.addEventListener('click', (e) => {
        const point = e.latlng
        geoc.getLocation(point, function (rs) {
        console.log(rs)
          try {    
          let { addressComponents, address, point } = rs;   
          console.log(point?.lng)       
          let { city, district, province, street, streetNumber } = addressComponents; 
          console.log(province)
         // if(typeof setAaddress == 'function') setAaddress({Lng: point.lng, Lat: point.lat, Address: address, province, city, district})
           } catch (error) {
            console.dir(error)
          }     
        });
    })
   
    geoc.getPoint(ipt, function(point) {
      console.log(point)
      if(point) {
        map.centerAndZoom(point, 16);
        map.addOverlay(new window.BMapGL.Marker(point))
      }else {
        message.error('你输入的地址没有解析到结果')
      }
    }, '杭州市')
   // map.setHeading(64.5)
    //map.setMapType(window.BMAP_NORMAL_MAP)
    //map.setTilt(73)
  }, [ipt])
 
  const onSearch = (e) => {
    console.log(e)
    setIpt(e)
  }
  return (
    <Wrapper>
      <Input.Search  onSearch={(e) => onSearch(e)}  />
      <div id="wrapper">
      
      
      </div>
    </Wrapper>
  );
};
