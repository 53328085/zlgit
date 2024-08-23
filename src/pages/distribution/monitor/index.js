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
   .cardlocal{
    position: absolute;
    left:16px;
    top:16px;
    display:flex;
   }
  .cardList{
    position: absolute;
    right: 32px;
    top: 32px;
    color: #fff;
    border-radius: 4px;
    height: 732px;
   overflow-y: auto;
    .card{
    //  width: max-content;
     column-gap: 4px;
      height: 48px;
      background-color: rgba(15, 34, 63, 0.8);
      border: 1px solid rgba(0, 153, 204, 1);
      padding: 4px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        padding-left: 12px;
        display: inline-block;
        color: #fff;
      //  width: 130px;
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



const keys1=["电压等级","变压器台数","负载率","额定容量","监测设备"]
const keys2=["当日用电","昨日同期","环比","最大用电功率","最大用电时间","平均功率"]
const keys3=["电压","电流","功率","谐波","功率因数"]
const keys4=["控母电压","控母电流","充电电压","电池温度","合母电压"]
const keys5=["温度1","湿度1","温度2","湿度2","噪音","水浸","烟感","明火","门禁"]
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
   if(Number.isInteger(roomId)){
    getEnvironment(roomId)
   }  else{
    setSpinging(false)
   }
   
  }, [roomId, rname])
  return (
  
      <Pagecount bgcolor="#eeeff3" pd="0px" custserach="true">
        <Cspin spinning={spinning} tip="图片下载中……">
        <Mainbox >
          <div style={{flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
        {/*   <img className='bgiamge' src={imgBg || dimg}></img> */}


        {/* door, fire, ht, noise, sF6, smoke, water */}
        <Image src={imgBg} preview={false} fallback={dimg} />
          </div>
          <div  className='cardlocal'>
            <HoverList keys={keys1} values={['10/0.4',1,64.25,100,350,12]}>配电房概述</HoverList>
            <HoverList keys={keys2}>运行状态</HoverList>
            <HoverList keys={keys3}>变压器控制</HoverList>
            <HoverList keys={keys4}>直流屏监控</HoverList>
            <HoverList keys={keys5}>环境监控</HoverList>
          </div>
          {/* <div className='cardList'>
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
            
          </div> */}
        </Mainbox>
        </Cspin>
      </Pagecount>
    
  )
}

const HoverDiv=styled.div`
  width:257px;
  height:43px;
  background:#1b3b64;
  color:#fff;
  margin-right:16px;
  text-align:center;
  line-height:43px;
  position:relative;
  .list{
    transform:scale(1,0);
    position:absolute;
    top:43px;
    width:100%;
    background-color:RGB(51,68,97,.9);
    font-size:14px;
    transition:.3s;
    transform-origin:center top;
    .line{
      border-bottom:1px solid #1d7096;
      display:flex;
      justify-content:space-between;
      padding:8px;
      height:43px;
      align-items:center;
      span:nth-of-type(1){
        color:#fff
      }
      span:nth-of-type(2){
        color:#00ff00
      }
    }
  }
  &:hover{
    background:rgb(102,51,255);
    cursor:pointer;
    
  }
  &:hover>.list{
    transform:scale(1,1);
    }

`
const HoverList=(props)=>{
  const {keys,values=[]} =props
  console.log(keys)
  return (
  
    <HoverDiv>
      {props.children}
      <div className="list" >
          {
            keys.map((it,i)=>{
              return( <div className="line">
                <span>{it}</span>
                <span>{values[i]}</span>
               </div>  )
            })
          }
      </div>
    </HoverDiv>
    
 
    
  )
}
