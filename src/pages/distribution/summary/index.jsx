import React, { useEffect, useState,  } from 'react'
import { useSelector } from 'react-redux'
import {selectcurlRommid, selectProjectId, roomName } from "@redux/systemconfig";
 
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
 
import {message ,Image, Typography } from 'antd'
 
 
import { DistributionRoomRuntime } from '@api/api.js'
import dimg from './icon/3dimg.png'
import imgurl from '@imgs'
import {Cspin} from "@com/comstyled"
import {isObject} from "@com/usehandler"
const {Text} = Typography
 
const Mainbox = styled.div`
  flex: 1;
  position: relative;
  .cardList{
    position: absolute;
    right: 32px;
    top: 32px;
    color: #fff;
    border-radius: 4px;
    height: 732px;
   overflow-y: auto;
    .card{
      width: 256px;
      height: 48px;
      background-color: rgba(15, 34, 63, 0.8);
      border: 1px solid rgba(0, 153, 204, 1);
      padding: 4px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 6px;
      span{
        padding-left: 12px;
        display: inline-block;
        color: #fff;
        width: 130px;
      }
      .imgtip{
        display: flex;
        align-items: center;
      
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
  
  const init = {
    door:[],
    fire:[],
    ht: [], // 温湿度
    sF6: [], // 有害气体
    water:[], // 水浸
  //  humidness:"",
    noise:[],
    smoke:[],
   // temperature:"",
    water:[]
  }
  const [imgBg, setImgBg] = useState()
  const [envlist,setEnvList]=useState(init)
  const {door, fire, ht, noise, sF6, smoke, water} = isObject(envlist) ? envlist : {}
  const [spinning, setSpinging] = useState(true)
  const getEnvironment = async (roomId) => {
     try {
      setSpinging(true)
      setEnvList(init)
      const res = await DistributionRoomRuntime.GetEnvironment(projectId, roomId)
      if (res.success) {
        setEnvList(res.data)
        setImgBg(res?.data?.imgBg)
       
      } else {
        setImgBg(null)
        setEnvList(init)
        message.error(res.errMsg)
      }
     } catch (error) {
      setEnvList(init)
       console.log(error)
     } finally {
       setSpinging(false)
     }
    
  }
 
  const Custcard = ({src, value, name}) => {
  return(
    <div className='card'>
    <div className='imgtip'>
      <img src={src} alt="" />
      <Text ellipsis={{tooltip: name}}>{name}</Text>
    </div>
  <div className='cardval'>{value}</div> 
  </div>
  )
  }
  useEffect(() => {
   if(Number.isInteger(roomId))  getEnvironment(roomId)
   
  }, [roomId, rname])
  return (
  
      <Pagecount bgcolor="#eeeff3" pd="0px" custserach="true">
        <Cspin spinning={spinning} tip="图片下载中……">
        <Mainbox >
          <div style={{flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
        <div style={{position: "relative"}}>
        <img src={imgBg || dimg}   />
        <div className='cardList'>
            <div className='card headtext'>
             {rname}环境监控
            </div>
             
 
             {
              (ht && Array.isArray(ht)) ?  ht.map(t =>  <Custcard src={imgurl.temperature} name={t.name}  value={t.tValue}   />)  : null
             }
              {
              (ht && Array.isArray(ht)) ?  ht.map(t =>  <Custcard src={imgurl.humidness} name={t.name}  value={t.hValue}   />)  : null
             }
             {
               (noise && Array.isArray(noise)) ?  noise.map(t =>  <Custcard src={imgurl.nosie} name={t.name}  value={t.value}   />)  : null
             }
       
 
            {(water && Array.isArray(water)) ? water.map(w =><Custcard src={imgurl.water} name={w.name}  value={w.value}   /> ) : null}
        
 
          {(sF6 && Array.isArray(sF6)) ? sF6.map(w =><Custcard src={imgurl.smook} name={w.name}  value={w.value}   /> ) : null}  
 
          {(smoke && Array.isArray(smoke)) ? smoke.map(w =><Custcard src={imgurl.smook} name={w.name}  value={w.value}   /> ) : null}  
   
          {(fire && Array.isArray(fire)) ? fire.map(w =><Custcard src={imgurl.fire} name={w.name}  value={w.value}   /> ) : null}  
         
          {(door && Array.isArray(door)) ? door.map(w =><Custcard src={imgurl.door} name={w.name}  value={w.value}   /> ) : null}  
            
          </div>
        </div>
      
          </div>
          
        </Mainbox>
        </Cspin>
      </Pagecount>
    
  )
}