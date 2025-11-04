import React, { useEffect, useMemo, useState } from 'react'
 
 
import { message,Select } from 'antd'
import { useSelector } from 'react-redux'
import {useOutletContext} from 'react-router-dom' 
import moment from 'moment'
 
import {selectOneLevel} from '@redux/systemconfig.js'
import Pagecount from "@com/pagecontent";
import {getTime, isObject} from '@com/usehandler'
import {Mainbox,CustTitle} from  "./style"
import UseTree from '@com/useTree'
import Powercom from "./component/power"
import Datashow from "./component/Datashow"
import {energyOpt} from  "./data"
import {useQueryEnergy,useQueryEnergyDetail,useQueryEnergyCost} from "./api"
export default function Index() {
  const [energytype, setEnergytype] = useState(1)
  const [treeId, setTreeId] = useState([]) 
  const [active, setActive] = useState(0)
  
  let {exparams} = useOutletContext()
  let { areaId, date, type:dateType, view,  projectId} = exparams 
 
 
  
  const [datas, setDatas] = useState({})
  const [chartdatas, setChartDatas] = useState({})
  const energyName = datas?.consumeTotal?.[0]  ||  {}
  // 查询分类能耗明细
  const queryEnergyDetail = async(name, idx=0)=> {
    try {
      let body = {
        projectId,
        dayMonthYear: dateType,
        date: getTime(date, dateType),
        areaId,
        type: energytype,
        name, 
      }
      const {success, data} = await useQueryEnergyDetail({}, body)
      if(success, isObject(data)) {
        setChartDatas(data)
        setActive(idx)
      }else {
        setChartDatas({})
      }
      
    } catch (error) {
      
    }
  }
  //查询分类能耗
  const getEnergyData = async ({areaId, date, dateType,   projectId,treeId, view}) => {
    try {  
      let params =view==1? {
        projectId,
        dayMonthYear: dateType,
        date: getTime(date, dateType),
        areaId,
        type: energytype,
        classifyId:   treeId?.[0] || 0,
      }:{
        projectId,
        dayMonthYear: dateType,
        date: getTime(date, dateType),
        areaId,
        type: energytype,
      }

      let   res= view==1 ?  await useQueryEnergy({}, params) : await useQueryEnergyCost(params, treeId)
    
      if (res.success && isObject(res.data)) {
          setDatas(res.data)
        
      } else {
        setDatas({})
       if(!res.success) message.error(res.errMsg)
      }
    } catch (e) { console.log(e) }
  }
 
  const cards = useMemo(() => { 
    return datas?.consumeTotal?.map((data, idx) => <div onClick={()=> queryEnergyDetail(data.name,idx)} key={data.name}><Powercom  active={active} idx={idx}  data={data} date={dateType} energytype={energytype}  /></div>)
  }, [datas, dateType,energytype,active])

  useEffect(() => {
    let f =  [ areaId, dateType,  projectId,energytype, view].every(v => Number.isInteger(v)) && date && Array.isArray(treeId)
    if(f) {
      getEnergyData({ areaId, date, dateType,  projectId,treeId,energytype,view})
    } 
  }, [ areaId, date, dateType, treeId, projectId,energytype, view])

  useEffect(() => {
    let f =  [ areaId, dateType,  projectId].every(v => Number.isInteger(v)) &&   typeof energyName?.name == "string"
    if(f) {
      queryEnergyDetail(energyName?.name)
    } 
  }, [ areaId, date, dateType,  projectId, energyName])

  const title =<CustTitle>
    <span>能源类型</span>
    <Select options={energyOpt} style={{width: "100px"}} size='small' value={energytype} onChange={setEnergytype}></Select>
  </CustTitle>
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <UseTree title={title} datatype={6} allselect={false} energytype={energytype} areaId={0} multiple={false} showline={false} setTreeId={setTreeId}></UseTree>
        <div className="right"> 
          <div className="topwrap">
           <div className="top">
                {cards}
           </div>
           </div>
           <Datashow datas={chartdatas} view={view} energytype={energytype}  />
        </div>
        
      </Mainbox>
    
     {/*  <Energy showData={showData} date={exparams.date} dateType={exparams.type} showType={exparams.view}/>  */}
    </Pagecount>

  )
}
