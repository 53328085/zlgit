import React, {useState, useRef, useEffect } from 'react'
import {createPortal} from 'react-dom'
import {useDispatch} from "react-redux";
import { SketchPicker } from 'react-color';
import {CloseOutlined} from "@ant-design/icons"
import {getThemeColor} from '@redux/systemconfig'  
import defaultcolor from "@com/defaultcolor"
export default function Index({value, onChange, name, arrcolor})  {
    const [showv, setShowv] =useState(value)
    const dispatch = useDispatch()
    const [show, setShow]=useState(false)
    const [el, setEl] = useState()
    const colors =Array.isArray(arrcolor) ? arrcolor : Array.isArray(defaultcolor[name]) ? defaultcolor[name] : []
    let {left=0, top=0, height}=el?.getBoundingClientRect?.() || {}
    let  sty={
      display: 'flex',
      position: "absolute",
      left,
      top: top + height+4
    }
    const isty ={
      position: "absolute",
    right: "0px",
    top: "0px",
    fontSize: "10px"
    }
    const changecolor=(e)=>{
      e.preventDefault()
      setShow(true)
    }
   useEffect(()=> {
     setShowv(value)
   },[value])
    const  onColorChange= (hex)=> { 
      dispatch(getThemeColor({[name]: hex}))
      if( name=="primaryColor") window.localStorage.setItem("CustThemeColor", hex)
      onChange?.(hex)
      setShowv(hex)
    }
   
    return   <div>
      <input type='color' value={showv} onChange={()=>{}} onClick={changecolor} ref={ref => setEl(ref)} />
    {show && createPortal(<div style={sty}><SketchPicker
    presetColors={colors}
    disabled
    color={value}
    onChange={({ hex }) => {
      onColorChange(hex);
    }}
  /><CloseOutlined style={isty} onClick={()=> setShow(false)}/></div>, document.body)}
  </div>
  }