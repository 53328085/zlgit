import React from 'react'
import style from '../index.module.less'
import Title from './title'
import HeaderMenu from './menu'
import Log from './log'
export default function Header(props) {
 console.log(props)
  return (
    <div className={props.istitle ? style.comheader : style.notitle}>
     {props.istitle ? <Title /> : null } <HeaderMenu/> <Log/>
      
    </div>
  )
}
