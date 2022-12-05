import { Scale } from '@antv/l7-component'
import React, {useState, useCallback, useEffect} from 'react'
import styled from 'styled-components'
export default function Fform() {
  const [pixe, setPixe] = useState()
  const [scr, setScreen] = useState()
  const [ascr, setaScreen] = useState()
  const detectZoom = () => {
    let ratio = 0,
      screen = window.screen,
      ua = navigator.userAgent.toLowerCase();
    if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) { // IE浏览器
      if (screen.deviceXDPI && screen.logicalXDPI) {
        ratio = screen.deviceXDPI / screen.logicalXDPI;
      }
    } else if ( // opera浏览器
      window.outerWidth !== undefined &&
      window.innerWidth !== undefined
    ) {
      ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio) {
      ratio = Math.round(ratio * 100);
    }
    return ratio;
  }
  useEffect(() => {
    console.log(navigator.userAgent)
   if(~'qwe'.indexOf('a')) console.log('ddd')
    let m = detectZoom()
    document.body.style.zoom = 100 / Number(m)
  }, [])
  return (

      <div>
         <h2>屏幕缩放问题</h2>
         <div>{pixe}</div>
         <h2>显示器的尺寸</h2>
         <div>{JSON.stringify(window.screen, null, 2)}</div>
         <div>{JSON.stringify(scr)}</div>
      </div>
  )  
}
