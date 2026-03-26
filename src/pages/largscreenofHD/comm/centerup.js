import React, {  useEffect,useState} from "react";

import {useRequest} from 'ahooks'
import {isObject} from "@com/usehandler"
 
import {Centerup} from '../style'
import { intervalTime ,delayTime} from "../data";
import {useGetHuaDongMapInfo} from '../api'
import Positioncom from "./posintion"
export default function Index({projectId}) {
   const [index, setIndex] = useState(0)
   const getData = async()=>{
     try{
       console.log("启动轮询")
        const {data, success} = await useGetHuaDongMapInfo({projectId})
        if (success && Array.isArray(data) && data.length){
           for (let i = 0; i < data.length; i++) {
              let item = data[i];
              switch (item.id) {
                case 627: // 食堂
                 item.x=1117
                 item.y= 332;
                 break;
                case 639: // 研发楼
                 item.x= 661;
                 item.y= 500;
                 break;
                 case 640: // 宿舍楼F
                 item.x= 1041;
                 item.y= 223;
                 break;
                  case 641: // 宿舍楼G
                 item.x= 1192;
                 item.y= 283;
                 break;
                  case 661: // E厂房
                 item.x= 915;
                 item.y= 355;
                 break;
                  case 662: // D厂房
                 item.x= 783;
                 item.y= 467;
                 break;

              }
           }
           return data
        }else {
          return []
        }
         
     } catch (error) {
      
       console.log(error)
       return []
     }
    
     
   }
  const {data} = useRequest(getData,{
     manual:false,
     pollingInterval: intervalTime,
     pollingErrorRetryCount: 3,
     refreshDeps:[projectId],
   
  })
   
 const len = data?.length
  
 useEffect(()=>{ 
   let timer, count=0
   if(len>0) {
      timer = setInterval(()=>{
        
          if(count>=len) {
            count=0
          }
         count++
          setIndex(count)
       },delayTime)
   }
   return ()=>{
     clearInterval(timer)
   }
  },[len])
 
   
  return (
    <Centerup>
       {
        data?.map((d,i)=> <Positioncom key={d.id} visiable={index == i} {...d}></Positioncom>)
       }
    </Centerup>
  );
}
