import React  from 'react'
import {useFullscreen} from 'ahooks'
import imgurl from "../icon"
import {useTime} from '../data'
export default function index({pgref,setMeterType,meterType,isFullscreen,enterFullscreen,exitFullscreen }) {
    //  const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(pgref)
      const timeformat = useTime()
      const fullhandler=()=>{
        isFullscreen ? exitFullscreen() : enterFullscreen()
      }
      const onClick=(v)=>{
        setMeterType(v)

      }
 
  return (
    <div className='hearder'>
            <div className="h">
            赛诺菲能源监控计量系统
            </div>
         <div className="opt">
            <div className="btns">
                <div className={`btn ${meterType == 1 ? 'act' : ''} `} onClick={()=>onClick(1)} >
                    <div className="img">
                    <img src={imgurl["el"]}></img>
                    </div>
                    用电
                </div>
                <div className={`btn ${meterType == 2 ? 'act' : ''} `} onClick={()=>onClick(2)}>

                <div className="img">
                    <img src={imgurl["water"]}></img>
                    </div>
                    用水
                </div>
                <div className={`btn ${meterType == 3 ? 'act' : ''} `} onClick={()=>onClick(3)}>
                <div className="img">
                    <img src={imgurl["gas"]}></img>
                    </div>
                    用气
                </div>
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
