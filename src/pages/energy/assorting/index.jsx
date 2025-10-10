import React, { useEffect, useMemo, useState } from 'react'
import Energy from './energy'
 
import { message,Select } from 'antd'
import { useSelector } from 'react-redux'
import {useOutletContext} from 'react-router-dom' 
import moment from 'moment'
import { energyClassified } from '@api/api'
import {selectOneLevel} from '@redux/systemconfig.js'
import Pagecount from "@com/pagecontent";
import {getTime, isObject} from '@com/usehandler'
import {Mainbox,CustTitle} from  "./style"
import UseTree from '@com/useTree'
import Powercom from "./component/power"
import Datashow from "./component/Datashow"
import {energyOpt} from  "./data"
export default function Index() {
  const [energytype, setEnergytype] = useState(1)
  const [treeId, setTreeId] = useState([])
  let {exparams} = useOutletContext()
  let {view, areaId, date, type:dateType, shiftNo, projectId} = exparams 
 // const projectId = useSelector(selectProjectId)
  const oneLevel = useSelector(selectOneLevel)
  
  const [datas, setDatas] = useState({})
  //查询分类能耗
  const getEnergyData = async ({view, areaId, date, dateType, shiftNo, projectId}) => {
    try {
      let params = {
        projectId,
        type: dateType,
        date: getTime(date, dateType),
        shiftsNo: shiftNo
      }
      let areaIds
      if(areaId!=0){
        areaIds= [areaId]
      }else{
        areaIds= oneLevel?.map(it=>it.id)
      }
      
    
      let res;
      if(view===1){
        res= await energyClassified.QueryEnergy(params, areaIds)
      }else{
        res= await energyClassified.QueryEnergyCost(params, areaIds)
      }
      if (res.success && isObject(res.data)) {
          setDatas(res.data)
         /*  let xlist=null
          if(dateType ===1 ){
          const hours =   moment().hours()
          xlist =  res.data.consumeDetail[0].x.filter(it=>parseInt(it)<=hours)
      
          }else if (dateType ===2){
           const date =  moment().date()
           xlist = res.data.consumeDetail[0].x.filter(it=>parseInt(it)<=date)
          }         
          setShowData({...res.data,x:xlist})
        } else {
          setShowData([])
        } */
      } else {
        setDatas({})
       if(!res.success) message.error(res.errMsg)
      }
    } catch (e) { console.log(e) }
  }
 
  const cards = useMemo(() => { 
    return datas?.consumeTotal?.map(data => <Powercom data={data} date={dateType} energytype={energytype} />)
  }, [datas, dateType,energytype])

  useEffect(() => {
    let f =  [view, areaId, dateType, shiftNo, projectId].every(v => Number.isInteger(v)) && date
    if(f) {
      getEnergyData({view, areaId, date, dateType, shiftNo, projectId})
    } 
  }, [view, areaId, date, dateType, shiftNo, projectId,energytype])
  const title =<CustTitle>
    <span>能源类型</span>
    <Select options={energyOpt} style={{width: "100px"}} size='small' value={energytype} onChange={setEnergytype}></Select>
  </CustTitle>
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <UseTree title={title} datatype={6}  energytype={energytype} areaId={0} showline={false} setTreeId={setTreeId}></UseTree>
        <div className="right"> 
          <div className="topwrap">
           <div className="top">
                {cards}
           </div>
           </div>
           <Datashow datas={datas} view={view} />
        </div>
        
      </Mainbox>
    
     {/*  <Energy showData={showData} date={exparams.date} dateType={exparams.type} showType={exparams.view}/>  */}
    </Pagecount>

  )
}
