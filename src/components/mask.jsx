 
import React from 'react'
import {createPortal} from 'react-dom'
import style from './style.module.less'
export default function Msk(props) {
  let {task} = props
/*   const style = {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: `rgba(0,0,0,0.4)`,
    width: "100%",
    height: '100%',
    zIndex: 1978,
  } */
  return  createPortal(<div className={`${style.mask} ${task ? style.startAnimation : style.endAnimation}` }>{props.children}</div>, document.body )

}
