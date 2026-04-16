import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'

import { useOutletContext } from 'react-router-dom'

 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree"
import {Tabsbox} from "@com/comstyled"
import { getTime, isObject } from '@com/usehandler'
 
import CModal from '@com/useModal'
import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   shitcols,tabs, labelStyle, contentStyle } from '../reportdata'

import {Contentbox,Chartwrap} from "../style"
import {useQueryShiftEnergy} from "../api"
import {useCol} from "../usehook"

export default function Index() {

  let { exparams  } = useOutletContext()
 
  const [key, setKey]=useState('1')
  
 
 
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type, publicdate:date, energytype, alike,publicrangedate } = exparams  

 
  
  let columns = useCol(shitcols,3, '用能(kWh)')






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
     // customTime: type== 4,
      areaId,
      tab:key
    }
  }, [projectId, areaId, type, date, energytype, treeId,  line, key,  alike,publicrangedate])

  const [total, setTotal] = useState(0)
  const tbref = useRef()
 
  const getTableData =async (params) => {
    params.pageNum = params.current
    let  {  projectId, type,  meterType, ids, areaId,  queryType,   startDate,endDate}= params
     try { 
    let f = [ projectId, type, meterType,areaId,   queryType].every(v => Number.isInteger(v)) && Array.isArray(ids) && startDate && endDate && key
 
    
    if (!f) return;
 
      let { success, data, total = 0 }= await useQueryShiftEnergy({},params) 
    
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

 
  const toolbar = [<ProExportExcel tb={tbref} className="reportFs"   />]
  // fromlot,Zdconfig
  return (
   
      <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none" >
        <Contentbox rtbg="none">
          <UserTree areaId={areaId} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true} datatype={NaN} />
          
                <div className='rightwrap'>
                <Tabsbox items={tabs} activeKey={key} onTabClick={setKey} size="small"></Tabsbox>
                  <div className="tbwrap">
                <UseProTable 
                headerTitle="班次能耗"
                tableClassName="reportBc"
                columns={columns} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
                options={{
                  setting: false,

                }}
               sheetName="班次能耗"
               onExport={onExport} 
                ></UseProTable>
                </div>
                </div>
        </Contentbox>
   
      </Pagecount>
    
  )
}


