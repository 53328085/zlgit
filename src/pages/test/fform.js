import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import mqtt from 'mqtt'
export default function Index() {
  const {hostServer} = useSelector(state => state.user)

  const option = {
    clientId:   "HMI_" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
    username: '',
    password: ''
  }
  const client = mqtt.connect(hostServer, option) // 
 
  const getMqtt = () => {
    client.on("connect", e => {
      console.log("连接成功")
      client.subscribe("HMI", {qos: 1}, (error, granted) => {
        console.log(granted)
        if(error) {
          console.log("订阅成功")



        }else {
          console.log("订阅失败")
        }
      })
    })
    client.on("error", e => {
      console.log(e)
    })
  }
  useEffect(() => {
    // getMqtt();
  }, [client])
  return (
    <div>fform</div>
  )
}
