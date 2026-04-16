import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
import dayjs from 'dayjs'
import { ProTable  } from '@ant-design/pro-components';
import { useOutletContext } from 'react-router-dom'
import { useAntdTable } from 'ahooks'
 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree"
 
import { getTime, isObject } from '@com/usehandler'
 
import CModal from '@com/useModal'
import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   timecols,Zdconfig, labelStyle, contentStyle } from '../reportdata'

import {Contentbox,Chartwrap} from "../style"
import {useQueryEnergy} from "../api"


export default function Index() {

  let { exparams  } = useOutletContext()
 
  console.log(exparams)
 
   const [columnsStateMap, setColumnsStateMap] = useState(Zdconfig)
 
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type, publicdate:date, energytype, alike,publicrangedate } = exparams  

 
  
  const colsettingChange =(v) =>{
    console.log(v)
    setColumnsStateMap(v)
  }
 






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
 
      let { success, data, total = 0 }= await useQueryEnergy({},params) 
    
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

 
  const toolbar = [<ProExportExcel tb={tbref} className="reportFl"   />]
  // fromlot,Zdconfig
  return (
   
      <Pagecount showSearch={false} custserach={true} >
        <Contentbox>
          <UserTree datatype={6} allselect={false} energytype={energytype} areaId={0} multiple={false} showline={false} setTreeId={setTreeId}/>
          
              
                <UseProTable 
                headerTitle="分类能耗"
                tableClassName="reportFl"
                columns={timecols} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
                options={{
                  setting: false,

                }}
               sheetName="分类能耗"
               onExport={onExport} 
                ></UseProTable>
        </Contentbox>
   
      </Pagecount>
    
  )
}


