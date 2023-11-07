import React, { useEffect, useRef } from "react";
import style from "./MapContainer.module.less";
import AMapLoader from "@amap/amap-jsapi-loader";
 import {Button} from 'antd';
export default function MapContainer() {
  let map = null;
  let serach = useRef()
  useEffect(() => {
    AMapLoader.load({
      key: "0a004d3329b9515715462f6af92f40eb", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.HawkEye',
        'AMap.MapType',
         'AMap.Geolocation',
         'AMap.CitySearch',
         'AMap.Weather',
         'AMap.Geocoder'
      ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
       // console.dir(AMap);
        let position = new AMap.LngLat(120.221494, 30.206116);
        map = new AMap.Map("container", {
          // 设置地图容器id
          //  pitch:60, // 地图俯仰角度，有效范围 0 度- 83 度
          viewMode: "2D", // 是否为3D地图模式
          // terrain: true, // 开启地形图
          zoom: 16, // 初始化地图级别
          center: position, // 初始化地图中心点位置
          //  mapStyle: "amap://styles/blue"
        });
       
        map.on("click", function (e) {
           //console.dir(e);
        });
        let contextMenu = new AMap.ContextMenu() ;
      //  console.dir(contextMenu)
        contextMenu.addItem("放大一级", function() {
          map.zoomIn()
        }, 0)
        
        map.on("rightclick", function(e){
          contextMenu.open(map, e.lnglat)
        })
      

        var geocoder = new AMap.Geocoder({
          city: "010", //城市设为北京，默认：“全国”
        });
      
      var marker = new AMap.Marker();
      
        function geoCode() {
         // var address  = document.getElementById('address').value;
          geocoder.getLocation('杭州市', function(status, result) {
              if (status === 'complete'&&result.geocodes.length) {
                  var lnglat = result.geocodes[0].location
                  console.log(status)
                //  document.getElementById('lnglat').value = lnglat;
                  marker.setPosition(lnglat);
                  map.add(marker);
                  map.setFitView(marker);
              }else{
                  log.error('根据地址查询位置失败');
              }
          });
       }

       serach.current = geoCode

      //  map.addControl(new AMap.MapType());
    //    map.addControl(new AMap.ToolBar());
         map.addControl(new  AMap.Scale()) //比例尺
         map.addControl(new AMap.Geolocation());
      //   map.addControl(new AMap.CitySearch())
       

  

  //showCityInfo() 


      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map?.destroy();
    };
  }, []);

  return (
    <div  className={style.container} >
        <Button onClick={() => {
          console.log(serach.current)
          serach.current()
          }} style={{position: "absolute", top: "10px", zIndex: 10}}> 搜索</Button>
  <div id="container" style={{height: "800px"}} >
            
        </div>
        </div>
        );
}
