import React, { useEffect, useState,  } from 'react'
import { useSelector } from 'react-redux'
import {selectcurlRommid, selectProjectId, roomName } from "@redux/systemconfig";

import styled from 'styled-components'
import Pagecount from '@com/pagecontent'

import {message  } from 'antd'

 
import { DistributionRoomRuntime } from '@api/api.js'
import dimg from './icon/3dimg.png'
import imgurl from '@imgs'

 


const Mainbox = styled.div`
  flex: 1;
  position: relative;
   
  .cardList{
    position: absolute;
    right: 32px;
    top: 32px;
    color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .card{
      width: 256px;
      height: 48px;
      background-color: rgba(15, 34, 63, 0.8);
      border: 1px solid rgba(0, 153, 204, 1);
      padding: 4px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        padding-left: 12px;
      }
      .cardval{
        color: #00ff00;
        font-size: 16px;
      }
      &:first-child{
        border-radius: 4px 4px 0 0;
      }
      &:last-child {
        border-radius: 0 0 4px 4px;
      }
    }
    img{
      width: 32px;
    }
    .headtext{
      display: block;
      padding: 0;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 48px;
    }
  }
 `






export default function Index() {
 
  const projectId = useSelector(selectProjectId)

  const roomId = useSelector(selectcurlRommid)
  const rname = useSelector(roomName)
  console.log(rname)
  const init = {
    door:"",
    fire:"",
    humidness:"",
    noise:"",
    smoke:"",
    temperature:"",
    water:""
  }
  const [imgBg, setImgBg] = useState()
  const [envlist,setEnvList]=useState(init)
 

  const getEnvironment = async (roomId) => {
     try {
      const res = await DistributionRoomRuntime.GetEnvironment(projectId, roomId)
      if (res.success) {
        setEnvList(res.data)
        setImgBg(res?.data?.imgBg)
        
      } else {
        setImgBg(null)
        message.error(res.errMsg)
      }
     } catch (error) {
       console.log(error)
     }
   
  }
 
  
  useEffect(() => {
   if(roomId)  getEnvironment(roomId)
   
  }, [roomId])
  return (
  
      <Pagecount bgcolor="#eeeff3" pd="0px" custserach="true">
        <Mainbox >
          <div style={{flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          <img className='bgiamge' src={imgBg || dimg}></img>
          </div>
          <div className='cardList'>
            <div className='card headtext'>
             {rname}环境监控
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.temperature} alt="" />
                <span>温度</span>
              </div>
              <div className='cardval'>
                {envlist.temperature}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.humidness} alt="" />
                <span>湿度</span>
              </div>
              <div className='cardval'>
                {envlist.humidness}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.nosie} alt="" />
                <span>噪音</span>
              </div>
              <div className='cardval'>
              {envlist.noise}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.water} alt="" />
                <span>水浸</span>
              </div>
              <div className='cardval'>
              {envlist.water}
              </div>
            </div>
            <div className='card'>
              <div> <img src={imgurl.smook} alt="" />
                <span>烟感</span>
              </div>
                <div className='cardval'>
                {envlist.smoke}
              </div>
            </div>
            <div className='card'>
              <div> <img src={imgurl.fire} alt="" />
                <span>明火</span>
                </div>
                <div className='cardval'>
                {envlist.fire}
              </div>
            </div>
            <div className='card'>
              <div>
                <img src={imgurl.door} alt="" />
                <span>门禁</span>
              </div>
              <div className='cardval'>
              {envlist.door}
              </div>
            </div>
          </div>
        </Mainbox>
      </Pagecount>
    
  )
}
