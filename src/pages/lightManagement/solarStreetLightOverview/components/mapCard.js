import React, {useState } from 'react'
import {Radio } from 'antd'
import {tabs} from "../data"
import Mapcom from './map'
import Cardcom from "./card"
export default function Index() {
  const [type, setType] = useState("map")
  console.log(type)
  const onChange =(e) => {
    setType(e.target.value)
  }
 
  const Com = {
    map: Mapcom,
    card: Cardcom,
  }[type]
  return (
    <div className='leftdown'>
        <div className='operate'>
            <Radio.Group options={tabs} value={type}  buttonStyle='solid' optionType="button" onChange={onChange}></Radio.Group>
        </div>
        <Com />
    </div>
  )
}



