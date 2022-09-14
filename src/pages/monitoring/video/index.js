import React,{useEffect} from 'react'
import { Form, Select } from 'antd'
import Header  from './header'
import VideoList from './videolist'
import style from './style.module.less'
import {GetCamerasVideosByProjectId} from '@api/api'
export default function Index() {
  // useEffect(async ()=>{
  //   const res = await GetCamerasVideosByProjectId(12)
  //   return
  //   console.log(res)
  // },[])
  return (
    <div className={style.video}>
      <Header/>
      <div className={style.container}>
          <VideoList/>
          <VideoList/>
          <VideoList/>
          <VideoList/>
      </div>
    </div>
  )
}
