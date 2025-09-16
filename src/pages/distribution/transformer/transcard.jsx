import React, { useEffect } from 'react'
import {Transbox} from "./style"
import transform from '@imgs/sitetrans.png'
import Titlelayout from  '@com/titlelayout'
export default function TransCard({site,lastSampleTime}) {
 
  return (
    <Titlelayout  layout="flex" title={site?.name}>
      <Transbox>
       <div className='imgbox'>
         <img src={transform} className='img' />
       </div>
       <div className='list'>
         <div className="item">
         设备编号：<span className='value'>{site?.sn}</span>       
         </div>
       <div className='item'>额定容量：<span className='value'>{site?.capacity}</span></div>  
       <div className="item">网关状态：<span className='value'>{site?.state==2 ? "正常": site?.state==1 ? "离线" : ""}</span></div> 
        <div className="item">在线时长：<span className='value'>{site?.onlineTime}</span></div> 
        <div className="item">更新时间：<span className='value'>{lastSampleTime}</span></div> 
       </div>
       </Transbox> 
    </Titlelayout>
  )
}
