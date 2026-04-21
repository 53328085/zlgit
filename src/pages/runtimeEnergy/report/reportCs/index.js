// 参数报表

import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
 
import { useOutletContext } from 'react-router-dom'
 
 import {RadiogroupSolid,Tabsbox} from "@com/comstyled"
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree"
 
import { getTime, isObject } from '@com/usehandler'
 

import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   Cscol,Csconfig, labelStyle, contentStyle } from '../reportdata'

import {Contentbox,Chartwrap} from "../style"
import {useQueryParameterReport,useQuerysParameterReportTabs} from "../api"
import { t } from 'i18next'


export default function Index() {

  let { exparams  } = useOutletContext()
 
  console.log(exparams)
 
   const [columnsStateMap, setColumnsStateMap] = useState(Csconfig)
   const [key, setKey]=useState(1)
   
   const [options, setOptions]=useState([])
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type,cycleTime, publicdate:date, energytype, alike,publicrangedate } = exparams  

  console.log(exparams)
  
  const getParameterTabs = async  ()=>{ 
   try {
      let {success, data} = await useQuerysParameterReportTabs({projectId})
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
      
      areaId,
      cycleTime,
      tab:key,
    }
  }, [projectId, areaId, type, date, energytype, treeId, key,cycleTime, line,   alike,publicrangedate])

  const [total, setTotal] = useState(0)
  const tbref = useRef()
 
  const getTableData =async (params) => {
    params.pageNum = params.current
    let  {  projectId, type,  meterType, ids, areaId,  queryType,   startDate,endDate}= params
     try { 
    let f = [ projectId, type, meterType,areaId,   queryType].every(v => Number.isInteger(v)) && Array.isArray(ids) && startDate && endDate
 
    
    if (!f) return;
 
      let { success, data, total = 0 }= await useQueryParameterReport({},params) 
    
      setTotal(total)
      if (success && Array.isArray(data) ) {   
        return {
          data:  data  ,
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
  }, [total,  params])
 useEffect(() => { 
  if(Number.isInteger(Number.parseInt(projectId))) {
    getParameterTabs()
  }
 
}, [projectId])
 
  const toolbar = [<ProExportExcel tb={tbref} className="reportFs"   />]
  // fromlot,Zdconfig
  return (
   
      <Pagecount showSearch={false} custserach={true} >
        <Contentbox>
          <UserTree correlation={1} isshow={true} areaId={areaId} showSearch={true} allselect={false} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true} datatype={8} />
          
               <div className="rightwrap">
                 <Tabsbox items={options} tabwidth="88px" activeKey={key} tabBarGutter={4} size='small'  onChange={setKey}  ></Tabsbox>
                                  <div className="tbwrap"> 
                <UseProTable 
                headerTitle="参数报表"
                tableClassName="reportCs"
           
                columns={Cscol} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
            
                columnsState={{
                  defaultValue:Csconfig,
                  value:columnsStateMap,
                  onChange:setColumnsStateMap,
                  
                }}
              

                        
           
               sheetName="参数报表"
               onExport={onExport} 
                ></UseProTable>
                </div>
                </div>
        </Contentbox>
   
      </Pagecount>
    
  )
}


