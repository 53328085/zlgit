import React from 'react'
import {useDispatch} from "react-redux"
import { SketchPicker } from 'react-color';
export default function Index({value, onChange})  {
    const dispatch = useDispatch();
    const  onColorChange= (hex)=> {
      dispatch(getThemeColor({primaryColor: hex}))
      window.localStorage.setItem("CustThemeColor", hex)
      onChange(hex)
    }
    return   <SketchPicker
    presetColors={[value]}
    disabled
    color={value}
    onChange={({ hex }) => {
      onColorChange(hex);
    }}
  />
  }