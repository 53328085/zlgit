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
  const ref =useRef()
  const quall = () => {

    ref.current.requestFullscreen();
  }

  useEffect(() => {
    ref.current.addEventListener('click', () => {
      document.exitFullscreen();
    })
    // getMqtt();
  }, [client])
  return (
    <div style={{flex: 1}}>
       <Button onClick={quall}>全屏</Button>
       <div style={{width: "300px", height: "300px", backgroundColor: "#ff7313"}} ref={ref}>全屏</div>
    </div>
  )
}
