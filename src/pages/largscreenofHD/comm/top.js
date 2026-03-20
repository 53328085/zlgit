import React ,{useState} from 'react'
import {Select} from 'antd'
import {useFullscreen} from 'ahooks'
import imgurl from "../icon"
import {useTime,areas} from '../data'
import {Cselect} from '../style'
export default function index({pgref,setMeterType,meterType }) {
     const [value, setValue] = useState({label:"正泰华东产业园",value:"1"}) 
     const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(pgref)
      const timeformat = useTime()
       const fullhandler=()=>{
        isFullscreen ? exitFullscreen() : enterFullscreen()
      }  
      
      const onChange=(v)=>{
        setMeterType(v)

      }
 
  return (
    <div className='hearder'>
            <div className="h">
            {value.label}综合能源管理平台
            </div>
         <div className="opt">
            <div className="btns">
                 <Cselect options={areas} value={value} onChange={setValue}  dropdownStyle={{backgroundColor: "transparent"}}   labelInValue={true}></Cselect>
            </div>
            <div className="date">
            <div className='time'>{timeformat}</div>
            <div className="full" onClick={fullhandler}>
                <div className="fullimg">
                <img src={isFullscreen ? imgurl["exit"]:imgurl["full"]}></img>
                </div>
              <span>{isFullscreen?"退出全屏":"全屏"}</span> 
            </div>  
         </div>
         </div>
       
        </div>
  )
}
