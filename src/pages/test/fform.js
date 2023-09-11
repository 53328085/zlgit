import React, {useEffect} from 'react'
import {Button, DatePicker, ConfigProvider} from 'antd'
import {useSelector} from 'react-redux'
import {themeColor } from "@redux/systemconfig";
 
export default function Index() {
   const config = useSelector(themeColor)
   console.log(config)
  return (
    
    <div style={{width: "600px", height: "600px"}} id="map">
       <Button type="primary">样式配置</Button>
       <Button type="dashed">dashed</Button>
       <Button type="text" success>danger</Button>
       <DatePicker />
    </div>
    
    
  )
}
