import React, {   useState, useEffect, useRef, useMemo } from 'react'
 
import { useNavigate, useOutletContext} from 'react-router-dom'
import {useSelector} from "react-redux"
 
import { message, Typography,   Badge, Empty, Timeline, Carousel } from 'antd'
import Ichart  from '@com/useEcharts/Ichart'; 
 
import imgurl from './imgs'
 
import light from './imgs/light.svg'
 
import {isObject} from "@com/usehandler"
import Pagecount from "@com/pagecontent";
 
import Titlelayout from "@com/titlelayout";
import Cempty from '@com/useEmpty'
import { themeColor } from '@redux/systemconfig.js'
 
import {Mainbox,Station,CTimeline  } from "./style"
 
import {Power,Topology } from "./comm"
import {useQueryStorageContainerInfo} from './api'
import {Paramscontext} from './context'
const {Link, Paragraph, Text} = Typography
 
 
 
export default function Index() {
   const [tabvalue, setTabvalue] = useState(1)
  let {exparams} = useOutletContext()
 const [cardData, setCardData] = useState(null)//卡片数据
  let {containerId,areaId, stationName, projectId} = exparams
  const [title,cid] =useMemo(()=>{
    return [cardData?.no ? `${containerId?.label}(${cardData?.no})` :containerId?.label ,containerId?.value]
  },[containerId,cardData])  
  console.log("cid",cid,projectId)
  let {islight} = useSelector(themeColor)
  
  const navigate = useNavigate()
 
 
 
 const getContainerData =async () => {  // 查询储能柜信息
    try {
       let {data, success} = await  useQueryStorageContainerInfo({projectId,storageContainerId:containerId?.value})
       if(success && isObject(data)) {
        setCardData(data)
       }else{
        setCardData({})
       }
    } catch (error) {
      console.log(error)
    }
  }
 

  useEffect(() => {
    if([cid, projectId].every(item => Number.isInteger(parseInt(item)))) { 
      getContainerData() 
    }
    
  }, [cid, projectId])
 
 
 
 
 
 
  const toPage = (key, label) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    })
  }
 
 
  return (
    <Pagecount  pd={0} bgcolor='transparent'  >
      <Mainbox>
      <Paramscontext.Provider value={{areaId, containerId,  projectId,stationName}}>
        <div className="left">
          <Topology />
        </div>
        <div className="right">
          <div className="rightup">
                  <Titlelayout title={title} layout="flex" pv="16px">
                    <Station>
                      <div className='imgbox'>
                         <img src={cardData?.image || imgurl["bg"]} alt="" className='img' />
                      </div>
                      <div className="right">
                         <div className="part">
                           <div className='value'>{cardData?.cumulativeChargingCapacity}</div>
                           <div className='label'>累积充电电量(kWh)</div>
                         </div>
                         <div className="part">
                         <div className='value'>{cardData?.cumulativeDischargedCapacity}</div>
                         <div className='label'>累积放电电量(kWh)</div>
                         </div>
                         <div className="info">
                         <div className='text'><Badge status="processing" /><div className='label'>总SOC</div><span className='value'>{cardData?.sumSOC}</span></div>
                         <div className='text'><Badge status="processing" /><div className='label'>电芯最高温度</div><span className='value'>{cardData?.maxTemp}</span></div>
                         </div>
                         <div className="info">
                         <div className='text'><Badge status="processing" /><div className='label'>总有功功率</div><span className='value'>{cardData?.sumActivePower}</span></div>
                         <div className='text'><Badge status="processing" /><div className='label'>电芯最低温度</div><span className='value'>{cardData?.minTemp}</span></div>
                         </div>
                      </div>
                    </Station>
                  </Titlelayout> 
                   
          </div>
          <div className="rightdown">
          <Power /> 
          </div>
        </div>
        </Paramscontext.Provider>
      </Mainbox>
    </Pagecount>
   
  )
}
