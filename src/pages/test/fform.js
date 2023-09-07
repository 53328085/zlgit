import React, {useEffect} from 'react'

export default function Index() {
  useEffect(() => {
   let map = new T.Map("map");
   var lnglat = new T.LngLat(116.40969,39.89945)
   map.centerAndZoom(lnglat,12)


  })

  return (
    <div style={{width: "600px", height: "600px"}} id="map"></div>
  )
}
