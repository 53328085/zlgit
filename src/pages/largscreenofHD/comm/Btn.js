import React from 'react'
import {Btns} from "../style"
import  imgurl from "../icon"
export default function Index({meterType,onClick}) {
  return (
    <Btns>
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
                            冷水
                        </div>
                        <div className={`btn ${meterType == 7 ? 'act' : ''} `} onClick={()=>onClick(7)}>
                        <div className="img">
                            <img src={imgurl["gas"]}></img>
                            </div>
                            热水
                        </div>
                    </div>
    </Btns>
  )
}
