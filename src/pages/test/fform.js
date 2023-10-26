import React, { useEffect } from "react";
import style from "./MapContainer.module.less";
import AMapLoader from "@amap/amap-jsapi-loader";
import fire from "@imgs";
export default function MapContainer() {
  let map = null;

  useEffect(() => {
    AMapLoader.load({
      key: "0a004d3329b9515715462f6af92f40eb", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [
        "AMap.Marker",
        "AMap.ToolBar",
        "AMap.Driving",
        "ElasticMarker",
        "Circle",
      ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        console.dir(AMap);
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
          console.dir(e);
        });
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
        var offset = new AMap.Pixel(-16, -30);

        var marker = new AMap.Marker({
          position: position,
          icon: "//a.amap.com/jsapi_demos/static/demo-center/marker/marker-bottom-left.png",
          // title: "浙江正泰物联有限公司",
          //  content: '<h5 style="width: 200px">浙江正泰物联有限公司</h5>',
          offset: new AMap.Pixel(-40, 0),
          anchor: "bottom-left",
        });

       // map.add(marker);
      /*   var text = new AMap.Text({
          text: "浙江正泰物联有限公司",
          draggable: true,
          position,
          style: {
            padding: "0.5em 1em",
            background: "#ff7313",
            color: "#fff",
          },
        }); */
        //  text.setMap(map)

        let circleMarker = new AMap.CircleMarker({
          center: position,
          radius: 40,
          strokeColor: "white",
          strokeWeight: 4,
          // strokeOpacity:0.5,
          fillColor: "rgba(0,0,255,1)",
          fillOpacity: 0.5,
          bubble: true,
          cursor: "pointer",
          clickable: true,
        });
        //  circleMarker.setMap(map)
        var circle = new AMap.Circle({
          center: new AMap.LngLat(120.22149, 30.20611), // 圆心位置
          radius: 100, //半径
          strokeColor: "#F33", //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 3, //线粗细度
          fillColor: "#ee2200", //填充颜色
          fillOpacity: 0.35, //填充透明度
        });
        const mapclick = (e) => {
          console.dir(e);
          console.log(e.lnglat.getLng() + "," + e.lnglat.getLat());
        };
        //   marker.on('click', mapclick)
        //  marker.off('click', mapclick)
        //   map.add(marker)

        //map.addControl(maptype)
        // var elasticMarker = new AMap.E

        //海量图标
        const icon = {
          // 第一步创建图标
          type: "image", // 图标类型，现阶段只支持 image 类型
          image:
            "https://a.amap.com/jsapi_demos/static/demo-center/marker/express2.png", // 图片 url
          size: [64, 30], // 图片尺寸
          anchor: "center", // 图片相对 position 的锚点，默认为 bottom-center
        };
        const text = {
          // 第二步创建文字
          content: "中邮速递易", // 要展示的文字内容
          direction: "right", // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
          offset: [-20, -5], // 在 direction 基础上的偏移量
          style: {
            // 文字样式
            fontSize: 12, // 字体大小
            fillColor: "#22886f", // 字体颜色
            strokeColor: "#fff", // 描边颜色
            strokeWidth: 2, // 描边宽度
          },
        };
        // 第三步创建实例
        const labelMarker = new AMap.LabelMarker({
          name: '标注2', // 此属性非绘制文字内容，仅最为标识使用
          position: position,
          zIndex: 16,
          icon: icon, // 将第一步创建的 icon 对象传给 icon 属性
          text: text,// 将第二步创建的 text 对象传给 text 属性
      });
       // 第四步创建 LabelsLayer 图层
      const labelsLayer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        collision: true,  // 该层内标注是否避让
        allowCollision: true, // 设置 allowCollision：true，可以让标注避让用户的标注
      });
      // 第五步
      labelsLayer.add(labelMarker);
      // 第六步
      map.add(labelsLayer)
       // 信息窗体
     
    
    // 创建 infoWindow 实例	
   /*  var infoWindow = new AMap.InfoWindow({
      content:  '<div>信息窗体</div>'  
     }) 
     infoWindow?.open(map) */
  


      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map?.destroy();
    };
  }, []);

  return <div id="container" className={style.container}></div>;
}
