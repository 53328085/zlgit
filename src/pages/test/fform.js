import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {Button} from 'antd'
import mqtt from 'mqtt'
 
export default function Index() {
  const {hostServer} = useSelector(state => state.user)

  const option = {
    clientId:   "HMI_" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
    username: '',
    password: ''
  }
  const client = mqtt.connect(hostServer, option) // 创建客户端实例
 
  const getMqtt = () => {
    client.on("connect", e => { // 创建连接
     
      client.subscribe("HMI", {qos: 1}, (error, granted) => { 
        console.log(granted)
        console.log(error)
        if(error) {
          console.log("订阅失败")



        }else {
          console.log("订阅成功")
        }
      })
    })
    client.on("error", e => {
      console.log(e)
    })
  }
 
 client.on('message', (topic, message) => {
    console.log(message.toString())

 })

  useEffect(() => {
    
     getMqtt();
  }, [client])
  return (
    <div style={{flex: 1}}>
        
    </div>
  )
}
