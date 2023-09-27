import React from 'react'
import {createPortal} from 'react-dom'
export default function Msk() {
  const style = {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#000',
    opacity: 0.4,
    width: "100%",
    height: '100%',
    zIndex: 2
  }
  return  createPortal(<div style={style}></div>, document.body )

}
