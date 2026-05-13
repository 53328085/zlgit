import React, {  useEffect,useMemo,useState} from "react";

 
 
import {Centerup} from '../style'
import {delayTime} from "../data";
import {useGetHuaDongMapInfo} from '../api'
import Positioncom from "./posintion"
import {useGetData } from '../usehook'
 
export default function Index() {
   const [index, setIndex] = useState(0)

   const mapData = useGetData(useGetHuaDongMapInfo)
   const [data,len] = useMemo(()=>{
       if (Array.isArray(mapData) && mapData.length){
           for (let i = 0; i < mapData.length; i++) {
              let item = mapData[i];
              switch (item.id) {
                case 627: // 食堂
                 item.x=1117
                 item.y= 332;
                 break;
                case 639: // 研发楼
                 item.x= 661;
                 item.y= 550;
                 break;
                 case 640: // 宿舍楼F
                 item.x= 1048;
                 item.y= 195;
                 break;
                  case 641: // 宿舍楼G
                 item.x= 1132;
                 item.y= 250;
                 break;
                  case 661: // E厂房
                 item.x= 815;
                 item.y= 294;
                 break;
                  case 662: // D厂房
                 item.x= 650;
                 item.y= 460;
                 break;

              }
           }
           return [mapData, mapData.length]
        }else {
          return [[], 0]
        }
   },[mapData])
 
 
   
 
  
 useEffect(()=>{ 
   let timer, count=0
   if(len>0) {
      timer = setInterval(()=>{
        
          if(count>=len-1) {
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
        data?.map((d,i)=> <Positioncom key={d.id} visiable={index==i} {...d} onshow={()=>setIndex(i)} ></Positioncom>)
       }
    </Centerup>
  );
}
