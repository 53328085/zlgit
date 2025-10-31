import {} from 'antd'
import {marks} from "./data"
import {CSlider} from "./style"
import { useState } from 'react';


 
export const Cslider =({v=0, onChange, custmarks, ...rest})=> {
    const markdata=custmarks || marks
    const [value, setValue] =useState(v)
    const vchange = (e) => { 
        onChange?.(e)
        setValue(e)
    }
   return(
    <div style={{ position: "relative", width: "450px" }}>
      <CSlider value={value} step={null} onChange={vchange} marks={markdata} {...rest}></CSlider>
     </div>
   )
}   