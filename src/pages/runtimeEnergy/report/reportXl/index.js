// 最大需量

import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
 
 
import { useOutletContext } from 'react-router-dom'
 
 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree/nodeTree"
 
 
 

import { ProExportExcel } from '@com/useButton'
 
import {   Xlcos } from '../reportdata'
import  {usexlCol} from '../usehook'

import {Contentbox } from "../style"
import {useQueryMaxNeedInfo} from "../api"
import { t } from 'i18next'
 


export default function Index() {

  let { exparams  } = useOutletContext()
 

  const [total, setTotal] = useState(0)
 
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  const [spans, setSpans] = useState(2)
  let { areaId, projectId, publictype:type,cycleTime, publicdate:date, energytype, alike,publicrangedate } = exparams  
 
 


 
 
  const columns = usexlCol({cols:Xlcos, type, date, spans})
  
 






  const params=useMemo(()=>{
  let dateType = { 1: "day", 2: "month", 3: "year" }[type]
  return  {
      projectId,
      meterType: energytype,
      startDate: type!=4 ?  date?.startOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[0]?.format("YYYY-MM-DD HH:mm"),
      endDate:   type!=4 ? date?.endOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[1]?.format("YYYY-MM-DD HH:mm"),
 
      queryType: line,
      ids: treeId,
      type: type, // 
      reportType:1,
      filterInfo: alike,
      
     areaId,
     
    }
  }, [projectId, areaId, type, date, energytype, treeId,  line,   alike,publicrangedate])

 
  const tbref = useRef()
 const postData =(data)=>{
   let tableDatas=[]
   data.forEach((item,idx) =>{ 
      let {datas,...rest} = item
      let obj1={}, obj2={}
      datas.forEach((d,index) =>{
      let {month,dateTime1,dateTime2, value1, value2} = d
       obj1[`value${month}`]=value1
       obj1[ `dateTime${month}`]=dateTime1
       obj1["type"]="正向有功总需量（kW）"
       obj1["key"]=item.sn+"-"+month+"-正向"+idx+"_"+index
      
         obj2[`value${month}`]=value2
       obj2[ `dateTime${month}`]=dateTime2
       obj2["type"]="反向有功总需量（kW）"
       obj2["key"]=item.sn+"-"+month+"-反向"+idx+"_"+index
       
      })
      tableDatas.push({...rest,...obj1},{...rest,...obj2})
   })
   return tableDatas
 }
  const getTableData =async (params) => {
    params.pageNum = params.current
    let  {  projectId, type,  meterType, ids, areaId,  queryType,   startDate,endDate}= params
     try { 
    let f = [ projectId, type, meterType,areaId,  queryType].every(v => Number.isInteger(v)) && Array.isArray(ids) && ids?.length && startDate && endDate
 
    
    if (!f) return;
 
      let { success, data , total}= await useQueryMaxNeedInfo({},params) 
      setTotal(total)
      if (success && Array.isArray(data) && data?.length ) {

        return {
          data: postData(data), //datas,
          total: total,
          success,
        }
      } else {
        return {
          data: [],
          total: 0,
          success,
        }
      }
    

     } catch (error) {
      console.log(error)
     }
  }
 
 

 
 
  const onExport = useCallback(() => {
     params.pageSize=total
    params.current=1
    return getTableData(params)
  }, [params, total])
 

 
  const toolbar = [<ProExportExcel tb={tbref} className="reportXl"   />]
  const  parameter={
    params:{
      showDevice:false
    },
    limit:Number.isNaN
  }
  const tbonChange=(_, filter)=>{
    let {type} = filter
     console.log(type)
     setSpans(Array.isArray(type) ? type.length : 2)
  }
  return (
   
      <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none" >
        <Contentbox>
          <UserTree parameter={parameter} correlation={1} isshow={true} areaId={areaId} showSearch={true} allselect={false} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true}   />
          
               <div className="rightwrap">
                                  <div className="tbwrap"> 
                <UseProTable 
                headerTitle= "最大有功总需量报表"
                tableClassName="reportXl"
                 
                columns={columns} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
                 onChange={tbonChange}
             //   postData={postData}
                options={
                energytype == 1 ?  {
                    setting: false,
                  }: {}
                }
                ref={tbref}
               sheetName="最大有功总需量报表"
               onExport={onExport} 
                ></UseProTable>
                </div>
                </div>
        </Contentbox>
   
      </Pagecount>
    
  )
}


