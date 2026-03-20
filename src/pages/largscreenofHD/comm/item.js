import React from 'react'
import imgurl from '../icon/index'
export default function Index({name, value}) {
  const title ={
    "电":"用电量(kWh)",
    "冷水":"冷水量(m³)",
    "热水":"热水量(m³)"
  }[name] || name
  return (
    <div className="item">
       <div className="text"> <div className='title'>{title}</div>
       <div className='value'>{value}</div></div>
      
       <div className="icon">
 <img src={imgurl[name]} alt="" className='img' />
       </div>
      
    </div>
  )
}

