// 参数报表

import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
 
import { useOutletContext } from 'react-router-dom'
 import {nanoid} from "@reduxjs/toolkit"
 import {RadiogroupSolid,Tabsbox} from "@com/comstyled"
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree/nodeTree"
 
import { getTime, isObject } from '@com/usehandler'
 

import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   Cscol,CscolW,Csconfig,CstbTitle, defaultfilteredValue,labelStyle, contentStyle } from '../reportdata'
import  {useCsCol} from '../usehook'

import {Contentbox,Chartwrap} from "../style"
import {useQueryParameterReport,useQuerysParameterReportTabs} from "../api"
import { t } from 'i18next'
 
 


export default function Index() {

  let { exparams  } = useOutletContext()
 

 
   const [columnsStateMap, setColumnsStateMap] = useState(Csconfig)
   const [key, setKey]=useState(1)
   const [header, setHeader] = useState()
   const [options, setOptions]=useState([])
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
    const [filtere, setFiltere] =  useState(defaultfilteredValue)
  let {projectId, onedaytype:type,cycleTime, oneday:date, energytype, alike,onedayrange:publicrangedate } = exparams  
  const [unit, setUnit] = useState()
  const  [title, headerTitle] = useMemo(() => {
    let label = options?.find(d => d.key == key)?.label ?? ''
    let text =key==2 ? `有功总${label}` : label;
    return [(unit || text) ?`${text}(${unit})` :  "", `参数报表-${label}`]
  }, [unit, key])


 const [frontRows, index, filters] = useMemo(() => {
     if (energytype == 1){
       return [4, 4, CstbTitle[key]]
      }else {
         return [0, NaN,[]]
      }
     
    }, [key,energytype ])
const [spans, setSpans] = useState(()=>defaultfilteredValue[key]?.length)
   const values =useMemo(() => {  
     return filtere[key]
    }, [key,filtere]) 


  const columns = useCsCol({  index, title, frontRows, spans,header, energytype, filters,filteredValue:values})
  
 
  const tbonChange=useCallback((_, filter)=>{
     
     let {power} = filter

     if(Array.isArray(power)) {
     setFiltere({...filtere, [key]: power})
     setSpans(power?.length)
     }else {
       setSpans(CstbTitle[key]?.length)
     }
    
  },[key])

  const tabOnchange=(key)=>{
     
     setKey(key)
     setSpans(filtere[key]?.length)
  }

  
  const getParameterTabs = async  ()=>{ 
   try {
      let {success, data} = await useQuerysParameterReportTabs({projectId,meterType:energytype})
      if (success && Array.isArray(data) && data.length) { 
        setOptions(data.map(d =>({...d, label:d.value})))
        setKey(data[0].key)
      }else {
        setOptions([])
        setKey(null)
        message.error('获取参数失败')
      }
   } catch (error) {
      console.log(error)
   }
     
   }






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
      
    
      cycleTime,
      tab:key,
    }
  }, [projectId,  type, date, energytype, treeId, key,cycleTime, line,   alike,publicrangedate])

 
  const tbref = useRef()
 
  const getTableData =async (params) => {
    
 
    params.pageNum = params.current
    let  {  projectId, type,  meterType, ids,   queryType, tab,  startDate,endDate}= params
     try { 
    let f = [ projectId, type, meterType,  tab,  queryType].every(v => Number.isInteger(v)) && Array.isArray(ids) && ids?.length && startDate && endDate
 
  //  console.log("tab",tab)
    if (!f) return;
 
      let { success, data }= await useQueryParameterReport({},params) 
    
      
      const  {detailDatas,detailHeaders} = data
      if (success && Array.isArray(detailDatas) ) { 
         setUnit(detailDatas?.[0]?.unit)
         setHeader(detailHeaders)
         let datas =[]
         detailDatas.forEach((item,idx) => { 
          const  {detailValues} = item
          detailValues.forEach((col,index) =>{ 
                col.forEach((val,idx) =>{ 
                  item[detailHeaders[idx]] = val
                   
                })
              
              if (meterType==1) {
                item["power"]= CstbTitle[tab][index]
              }
               
               item["keysn"]=nanoid()
               datas.push({...item})
          })
         
        })
        
        return {
          data: datas,
          total: detailDatas?.length,
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
    return getTableData(params)
  }, [params])
 useEffect(() => { 
  if( [energytype, projectId].every(d =>Number.isInteger(Number.parseInt(d)))) {
    getParameterTabs()
  }
 
}, [projectId,energytype])

  const columnsState = energytype == 1 ? {
                  defaultValue:Csconfig,
                  value:columnsStateMap,
                  onChange:setColumnsStateMap,
                  
                }: {

                }
  const toolbar = [<ProExportExcel tb={tbref} className="reportCs" single={true}   />]
  
  return (
   
      <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none" >
        <Contentbox>
          <UserTree correlation={1} isshow={true} areaId={0} showSearch={true} allselect={false} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true}   />
          
               <div className="rightwrap">
                 <Tabsbox items={options} tabwidth="88px" activeKey={key} tabBarGutter={4} size='small'  onChange={tabOnchange}  ></Tabsbox>
                                  <div className="tbwrap"> 
                <UseProTable 
                headerTitle= {headerTitle}
                tableClassName="reportCs"
               rowKey={row=> row.keysn}
                columns={columns} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
                 pagination={false}
                columnsState={columnsState}
                options={
                energytype == 1?  {
                    setting: true,
                  }:{
                    setting: false,
                  }
                }
                ref={tbref}
               sheetName="参数报表"
               onExport={onExport} 
               onChange={tbonChange}
                ></UseProTable>
                </div>
                </div>
        </Contentbox>
   
      </Pagecount>
    
  )
}


