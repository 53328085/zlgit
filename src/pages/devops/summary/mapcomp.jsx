import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

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
    CustomOverlay,
    AutoComplete
} from "react-bmapgl";

export default function MapComp({ points }) {
    const [showIndex,setShowIndex] = useState()
    const centerPointer = points[0]?.lngLat?.split(',')
    
    const mouseEnter=(index)=>{
        setShowIndex(index)
    }
    return (
        <Map
            style={{ height: '100%' }}
            center={new BMapGL.Point(Number(centerPointer[0]?centerPointer[0]:120), Number(centerPointer[1]?centerPointer[1]:30))}
            zoom={12}
            tilt={40}
            enableScrollWheelZoom
           
        >
               <CityListControl/>
            {points?.map((it,index) => {
                const positions = it.lngLat.split(',')
                return (<>
                    <Marker
                        position={new BMapGL.Point(Number(positions[0]), Number(positions[1]))}
                        // enableDragging
                        onMouseover={()=>{mouseEnter(index)}}
                        onMouseout={()=>{setShowIndex(null)}}
                    />
                 
                    {
                     showIndex===index?<CustomOverlay 
                         position={new BMapGL.Point(Number(positions[0]), Number(positions[1]))}            
                         unit="px"
                         offset={{ 
                             width: 120 ,
                             height: 160,
                         }}
                        >
                             <Info   message={it}/>
                         </CustomOverlay>:null
                    }
                   
                </>)
            })}

                
            <ZoomControl />
        </Map>
    )
}
let Info = ({message}) => {
    const flexcss = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        whiteSpace: 'nowrap',
        marginBottom: 12
    }
    const mgl24={
        marginLeft: 24
    }
    return (
        <div style={{
            // width: 224,
            // height: 160,
            background: '#fff',
            borderRadius: 2,
            padding: 12,
            boxShadow: '2px 2px 5px #cccccc',
            display: 'grid',
            gridTemplateRows: 'repeat(5,1fr)',
            // position:'absolute',
        }}>
            <p style={flexcss}>
                <div>告警坐标</div>
                <div style={mgl24}>{message?.lngLat}</div>
            </p>
            <p style={flexcss}>
                <div>设备编号</div>
                <div style={mgl24}>{message?.sn}</div>
            </p>
            <p style={flexcss}>
                <div>设备类型</div>
                <div style={mgl24}>{message?.category}</div>
            </p>
            <p style={flexcss}>
                <div>告警等级</div>
                <div style={mgl24}>{message?.level}级</div>
            </p>
            <p style={flexcss}>
                <div>告警详情</div>
                <div style={mgl24}>{message?.content}</div>
            </p>
            <p style={flexcss}>
                <div>告警地址</div>
                <div style={mgl24}>{message.address}</div>
            </p>
        </div>
    )
}

export class EmptyMap extends React.Component {
    render() {
      return (
        <Map
          style={{ height: '100%' }}
          center={new BMapGL.Point(120.22830511467954,30.21229461177818)}
          zoom={12}
          heading={0}
          tilt={40}
          onClick={e => console.log(e)}
          enableScrollWheelZoom
        />
      )
    }
  }


