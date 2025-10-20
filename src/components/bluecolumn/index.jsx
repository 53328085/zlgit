import React from 'react'
import style from './style.module.less'
import {useSelector} from 'react-redux'
import {themeColor} from "@redux/systemconfig";
export default function Index({ name = '', children, styled = {}, bg = {}, fontSize = 14, bac = '',fontWeight = 'normal' ,isbgShow=false}) {
  const theme = useSelector(themeColor)
  console.log("theme",theme)
  const styles = isbgShow?{backgroundColor:theme.cardHeadBg,...styled}:styled
  return (
    <div className={style.title} style={styles} >
      <div className={bac == '' ? style.columns : style.red} style={bg}></div>
      <div className={style.name} style={{ fontSize, fontWeight}} >{name}</div>
      {children}
    </div>
  )
}
