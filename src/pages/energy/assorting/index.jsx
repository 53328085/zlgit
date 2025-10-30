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
import {useQueryEnergy} from "./api"
export default function Index() {
  const [energytype, setEnergytype] = useState(1)
  const [treeId, setTreeId] = useState([])
  let {exparams} = useOutletContext()
  let { areaId, date, type:dateType,   projectId} = exparams 
 // const projectId = useSelector(selectProjectId)
  const oneLevel = useSelector(selectOneLevel)
  
  const [datas, setDatas] = useState({})
  //查询分类能耗
  const getEnergyData = async ({areaId, date, dateType,   projectId,treeId}) => {
    try {
    
  
      let params = {
        projectId,
        dayMonthYear: dateType,
        date: getTime(date, dateType),
        areaId,
        type: energytype,
        classifyId:   (treeId?.length>1||treeId?.length)?0:treeId[0],
      }

      
    
     
     
      let   res= await useQueryEnergy({}, params)
    
      if (res.success && isObject(res.data)) {
          setDatas(res.data)
        
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
    let f =  [ areaId, dateType,  projectId,energytype].every(v => Number.isInteger(v)) && date && Array.isArray(treeId)
    if(f) {
      getEnergyData({ areaId, date, dateType,  projectId,treeId,energytype})
    } 
  }, [ areaId, date, dateType, treeId, projectId,energytype])
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
           <Datashow datas={datas}  />
        </div>
        
      </Mainbox>
    
     {/*  <Energy showData={showData} date={exparams.date} dateType={exparams.type} showType={exparams.view}/>  */}
    </Pagecount>

  )
}
