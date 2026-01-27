import React, {useState, useMemo, useEffect, useContext} from 'react'
import { message} from 'antd'
import {Link} from "react-router-dom"
import {isObject} from "@com/usehandler"
import sunlight from "./icon/sunlight.png" 
import {useDetails} from "../api"
import CommIcard from "@com/commIcard"
import { OverdataContext } from '../context'
 
export default function Index() {
  
  const contxt= useContext(OverdataContext)
  const {projectId} = contxt
  const [datas, setDatas]=useState([])
  const getData = async()=> {
     let {data, success, errMsg} =   await useDetails({projectId})
     if(success && isObject(data)) {
       let {details} = data
       if(Array.isArray(details)) {
         setDatas(details)
       }else{
        setDatas([])
       }
     }else {
      if(!success) message.warning(errMsg || "数据出错")
       setDatas([])
     }
  }
  useEffect(()=> {
    if(Number.isInteger(parseInt(projectId))){
      getData()
    }
    
  }, [projectId])
 
  return (
       <div className='cardwrap'>
         {
           datas?.map?.((item, index)=> (
            <div key={index}>
            <Link
              to={`/deviceDetail?sn=${encodeURIComponent(item.cSn)}&deviceStyle=22`}
              target="_blank"
            ><CommIcard
                img={item.image || sunlight}
                title={item.name}
                deviceStyle={22} 
                state={item.state}
                fields={item.fields} 
                category={item.cSn}
                value={item.address}
                lastSampleTime={item.lastSampleTime}
                device={3}
              />
            </Link>
          </div>
           ))
         }
        </div>
        )
}



