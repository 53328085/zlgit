import React, { useState, useCallback, useRef,   useMemo   } from 'react'
 
import { useOutletContext } from 'react-router-dom'
 
 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree"
 
 
import { ProExportExcel } from '@com/useButton'
 
import {   fromlot,Zdconfig } from '../reportdata'

import {Contentbox } from "../style"
import {useQueryBillReport} from "../api"
import {useCols} from "../usehook"

export default function Index() {

  let { exparams  } = useOutletContext()
 
 
 
   const [columnsStateMap, setColumnsStateMap] = useState(Zdconfig)
 
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  const [unit, setUnit] = useState('(kWh)')
  let { areaId, projectId, publictype:type, publicdate:date, energytype, alike,publicrangedate } = exparams  

 
  
  const colsettingChange =(v) =>{
    console.log(v)
    setColumnsStateMap(v)
  }
  


const titles = useMemo(()=>{ 
 
   return {
    2: unit ? `起始(${unit})` : `起始`,
    3: unit ? `结束(${unit})` : `结束`,
   8:unit ? `用能(${unit})` : `用能`,
   }
},[unit ])
 const columns = useCols(fromlot, titles, energytype)


  const params=useMemo(()=>{
  let dateType = { 1: "day", 2: "month", 3: "year" }[type]
  return  {
      projectId,
      meterType: energytype,
      startDate: type!=4 ?  date?.startOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[0]?.format("YYYY-MM-DD HH:mm"),
      endDate:   type!=4 ? date?.endOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[1]?.format("YYYY-MM-DD HH:mm"),
   //   pageNum: current,
     // pageSize,
      queryType: line,
      ids: treeId,
      type: type, // 
      reportType:1,
      filterInfo: alike,
      customTime: type== 4,
      areaId
    }
  }, [projectId, areaId, type, date, energytype, treeId,  line,   alike,publicrangedate])

  const [total, setTotal] = useState(0)
  const tbref = useRef()
 
  const getTableData =async (params) => {
    params.pageNum = params.current
    let  {  projectId, type,  meterType, ids, areaId,  queryType,   startDate,endDate}= params
     try { 
    let f = [ projectId, type, meterType,areaId,   queryType].every(v => Number.isInteger(v)) && Array.isArray(ids) && startDate && endDate
 
    
    if (!f) return;
 
      let { success, data, total = 0,data1="" }= await useQueryBillReport({},params) 
    
      setTotal(total)
       setUnit(data1)
      if (success && Array.isArray(data) && data.length) {  
         // 单位

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

 
  const toolbar = [<ProExportExcel tb={tbref}  className="reportZd"   />]
  // fromlot,Zdconfig
  return (
   
      <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none" >
        <Contentbox>
          <UserTree areaId={areaId} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showSearch={true} showline={true} datatype={NaN} />
          <div className="rightwrap">
               <div className="tbwrap">
                <UseProTable 
                headerTitle="账单报表"
                tableClassName="reportZd"
                ref={tbref}
                columns={columns} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
            
                columnsState={{
                  defaultValue:Zdconfig,
                  value:columnsStateMap,
                  onChange:colsettingChange,
                }}
           
               sheetName="账单报表"
               onExport={onExport} 
                ></UseProTable>
                </div>
                </div>
        </Contentbox>
   
      </Pagecount>
    
  )
}


