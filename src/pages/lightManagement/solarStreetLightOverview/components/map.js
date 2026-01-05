import React, {useState, useMemo, useEffect, useContext} from 'react'
import {Radio, Image, Typography, message} from 'antd'
import {CloseOutlined} from "@ant-design/icons"
import {isObject} from "@com/usehandler"
import { Point} from '@com/comstyled'
import {tabs} from "../data"
 
import {Ctag,TitP} from '../style'
import {useDetail,useDetails} from "../api"
import  light from "./icon/light.png"
import { OverdataContext } from '../context'
const {Link} = Typography
export default function Index() {
  const [info, setInfo] = useState()
  const contxt= useContext(OverdataContext)
  const {lightdata, projectId} = contxt
  console.log(lightdata)
  const onPoint =async (rid, position)=> {
      let {success, data, errMsg} = await useDetail({rid, projectId})
      if(success) {
         if(isObject(data)) {
          setInfo({...data, ...position})
         }else {
          setInfo({})
         }
      }else {
        message.warning(errMsg || "数据出错")
        setInfo(null)
      }
  }
  const maps = useMemo(()=> {
    if (Array.isArray(lightdata?.locationInfos)) {
        return lightdata?.locationInfos?.map(l => <Point left={l.x} top={l.y} key={l.lightId} onClick={() => onPoint(l.lightId, {x:l.x, y:l.y}) } /> )
    }else {
        return null
    }
     
  }, [lightdata])
 
  return (
  <div className='mapwrap'>
          {lightdata?.image ? <img src={lightdata?.image} style={{clipPath: "inset(1px 1px 1px 1px)"}}></img>  :  null}   
          {maps}
          {info && <TitP left={info.x} top={info.y}>
          <h5 className="title">{info.name}({info.no}) <CloseOutlined onClick={() => setInfo(null)}  /> </h5>
          <div className="contentbox">
               {
                 info?.fields?.map(i=>(  <div className="content">
                  <p className="key">{i.name}: </p>
                  <p className="value">{i.value}</p>
              </div>))
               }
              
          </div>
          </TitP>}
        </div>
        )
}



