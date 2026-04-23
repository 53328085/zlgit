// 最大需求

import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
 
import { useOutletContext } from 'react-router-dom'
 
 import {RadiogroupSolid,Tabsbox} from "@com/comstyled"
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree/nodeTree"
 
import { getTime, isObject } from '@com/usehandler'
 

import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   Cscol,CscolW,Csconfig,CstbTitle, labelStyle, contentStyle } from '../reportdata'
import  {useCsCol} from '../usehook'

import {Contentbox,Chartwrap} from "../style"
import {useQueryMaxNeedInfo} from "../api"
import { t } from 'i18next'
 


export default function Index() {

  let { exparams  } = useOutletContext()
 

 
   const [columnsStateMap, setColumnsStateMap] = useState(Csconfig)
   const [key, setKey]=useState(1)
   const [header, setHeader] = useState()
   const [options, setOptions]=useState([])
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type,cycleTime, publicdate:date, energytype, alike,publicrangedate } = exparams  
  const [unit, setUnit] = useState()
  const  [title, headerTitle] = useMemo(() => {
    let label = options?.find(d => d.key == key)?.label ?? ''
    let text =key==2 ? `有功总${label}` : label;
    return [`${text}(${unit})`, `参数报表-${label}`]
  }, [unit, key])


 const [spans, frontRows, index, ] = useMemo(() => {
     if (energytype == 1){
       return [[7,7,3,3,3,5,4,4][key], 4, 4]
      }else {
         return [1,0, NaN]
      }
     
    }, [key,energytype ])
 
  const columns = useCsCol({  index, title, frontRows, spans,header, energytype})
  console.log("columns", columns)
 






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
      cycleTime,
      tab:key,
    }
  }, [projectId, areaId, type, date, energytype, treeId, key,cycleTime, line,   alike,publicrangedate])

 
  const tbref = useRef()
 
  const getTableData =async (params) => {
    params.pageNum = params.current
    let  {  projectId, type,  meterType, ids, areaId,  queryType, tab,  startDate,endDate}= params
     try { 
    let f = [ projectId, type, meterType,areaId, tab,  queryType].every(v => Number.isInteger(v)) && Array.isArray(ids) && ids?.length && startDate && endDate
 
    
    if (!f) return;
 
      let { success, data }= await useQueryMaxNeedInfo({},params) 
    
      
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
               let titles = CstbTitle[tab]
              if (meterType==1) {
                item["power"]=titles[index]
              }
               
               item["keysn"]=item.sn+index
               datas.push({...item})
          })
         
        
          
        })
       
        return {
          data: [], //datas,
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
 

 
  const toolbar = [<ProExportExcel tb={tbref} className="reportFs"   />]
  const  parameter={
    params:{
      showDevice:false
    },
    limit:Number.isNaN
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
                 pagination={false}
              
                options={
                energytype == 1 ?  {
                    setting: false,
                  }: {}
                }
               sheetName="最大有功总需量报表"
               onExport={onExport} 
                ></UseProTable>
                </div>
                </div>
        </Contentbox>
   
      </Pagecount>
    
  )
}


