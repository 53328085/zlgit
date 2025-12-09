import React, { useEffect, useMemo, useState } from 'react'
 
 
import { message,Select } from 'antd'
 
import {useOutletContext} from 'react-router-dom' 
 
import Pagecount from "@com/pagecontent";
import {getTime, isObject} from '@com/usehandler'
import {Mainbox,CustTitle} from  "./style"
import UseTree from '@com/useTree'
import Powercom from "./component/power"
import Datashow from "./component/Datashow"
import {energyOpt} from  "./data"
import {useQueryEnergy,useQueryEnergyDetail,useQueryEnergyCost,useGetPublicConsumeCategoryQuotas,useQueryEnergyType} from "./api"
export default function Index() {
  const [energytype, setEnergytype] = useState(1)
  const [treeId, setTreeId] = useState([]) 
  const [active, setActive] = useState(0)
  
  let {exparams} = useOutletContext()
  let { sublevel,areaId, date, type:dateType, view,  projectId} = exparams 
 
  
  const [quota, setQuota] =useState([])
  const [datas, setDatas] = useState({})
  const [chartdatas, setChartDatas] = useState({})
  const [energyTypes, setEnergyTypes] = useState([])
  const energyName = datas?.consumeTotal?.[0]  ||  {}
  const showquota =  useMemo(()=>{ 
    return  Array.isArray(sublevel) && dateType==3 && view==1
  },[sublevel,  dateType, view])
// 获取能源类型
const getEnergyType = async()=> {
   try {
     let {success, data} = await useQueryEnergyType({projectId})
     if(success && Array.isArray(data)) {
      setEnergyTypes(data)
     }else{
      setEnergyTypes([])
     }
   } catch (error) {
      console.log(error)
   }
  }


  // 查询分类能耗明细
  const queryEnergyDetail = async(name, idx=0)=> {
    try {
      
      let body = {
        projectId,
        dayMonthYear: dateType,
        date: getTime(date, dateType),
        areaIds:sublevel?.filter(id => id!=0),
        type: energytype,
        name, 
        areaId,
        group:view
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
  const getEnergyData = async ({sublevel,areaId, date, dateType,   projectId,treeId, view}) => {
    try {  
      let areaIds = (Array.isArray(sublevel) ? sublevel : [sublevel]).filter(item => item!=0) 
      let params ={
        projectId,
        dayMonthYear: dateType,
        date: getTime(date, dateType),
        areaId,
        areaIds,
        type: energytype,  
        classifyId:   treeId?.[0] || 0,
        group:view,  // 1.能耗2.费用
      }

      let   res=  await useQueryEnergy({}, params) 
    
      if (res.success && isObject(res.data)) {
          setDatas(res.data)
        
      } else {
        setDatas({})
       if(!res.success) message.error(res.errMsg)
      }
    } catch (e) { console.log(e) }
  }
 // 能耗分类定额获取 
   const getQuota =async (id)=> {
        try {
             if(typeof id !="number") return
            if(!(areaId == 0 && dateType == 3)) return
           
            let query = {
                projectId,
                year:date.format('YYYY'),
                publicConsumeCategoryId:id,
            }
          let {success, data} =  await useGetPublicConsumeCategoryQuotas(query)
          if(success &&Array.isArray(data?.datas)&& data?.datas.length ){  
               let   datas = data.datas.map(d => d.quotaValue)
               setQuota(datas)  
          }else {
            setQuota([])
          }

        } catch (error) {
            console.log(error)
        }

       
    }
  useEffect(() => { 
    if(Number.isInteger(projectId)) {
      getEnergyType()
    }

},[projectId])  

  const cards = useMemo(() => { 
    return datas?.consumeTotal?.map((data, idx) => <div className='card' onClick={()=> {
      queryEnergyDetail(data.name,idx)
   //   getQuota(id)
    }} key={data.name}><Powercom  active={active} idx={idx} view={view} data={data} date={dateType} energytype={energytype}  /></div>)
  }, [datas, dateType,energytype,active, sublevel])

  useEffect(() => {
    let f =  [dateType, areaId, projectId,energytype, view].every(v => Number.isInteger(v)) && date && Array.isArray(treeId) && (Array.isArray(sublevel) || typeof sublevel == 'number' )
    if(f) {
      getEnergyData({ sublevel, date, dateType, areaId, projectId,treeId,energytype,view})
    } 
  }, [ sublevel, date, dateType, treeId, projectId,energytype, view, areaId])

  useEffect(() => {
    let f =  [  dateType,  projectId].every(v => Number.isInteger(v)) &&   typeof energyName?.name == "string" && (Array.isArray(sublevel) || typeof sublevel == 'number' )
    if(f) {
      queryEnergyDetail(energyName?.name)
    } 
    if(f && areaId == 0 && dateType == 3) {
      getQuota(energyName?.id)
    } 
  }, [ areaId, date, dateType, sublevel, projectId, energyName])
 

  const title =<CustTitle>
    <span>能源类型</span>
    <Select options={energyTypes}  fieldNames={{label: "name", value: "type"}} style={{width: "100px"}} size='small' value={energytype} onChange={setEnergytype}></Select>
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
           <Datashow datas={chartdatas} showquota={showquota} quota={quota} view={view} energytype={energytype}  />
        </div>
        
      </Mainbox>
    
     {/*  <Energy showData={showData} date={exparams.date} dateType={exparams.type} showType={exparams.view}/>  */}
    </Pagecount>

  )
}
