import React, {useState} from 'react'
import { SketchPicker,PhotoshopPicker,ChromePicker,CirclePicker,SwatchesPicker } from 'react-color';
export default function Index() {
  const[color, setColor] =useState("#237ae4")
  const onChangeComplete=(v)=>{
    let {hex}=v;
    setColor(hex)
  }
  const onSwatchHover=(a,b)=>{
    console.log(a)
    console.log(b)
  }
  const[isd, setIsd] =useState(false)
  const onClick=(e)=>{
    setIsd(true)
    e.preventDefault()
  }
  return (
    <div>
      <input type='color' onClick={onClick} />
      {isd ?<SketchPicker color={color} onChangeComplete={onChangeComplete}    presetColors={[{color:"#237ae4", title: "主题色"}]}  /> :  null};
    </div>
  )
}
