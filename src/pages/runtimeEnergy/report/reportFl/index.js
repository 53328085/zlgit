import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
import dayjs from 'dayjs'
import { ProTable  } from '@ant-design/pro-components';
import { useOutletContext } from 'react-router-dom'
import { useAntdTable } from 'ahooks'
 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree"
import {useRequest} from 'ahooks'
import { getTime, isObject } from '@com/usehandler'
 
import CModal from '@com/useModal'
import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   timecols,Zdconfig, labelStyle, contentStyle } from '../reportdata'

import {Contentbox,Chartwrap} from "../style"
import {useQueryClassifyConsumeReport} from "../api"


export default function Index() {

  let { exparams  } = useOutletContext()
 
 
 
   const [columns, setColumns] = useState([])
   const [dataSource, setDataSource] = useState([])
  const [node, setNode] = useState()
  console.log("node",node)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type, publicdate:date, energytype,  publicrangedate } = exparams  
 

  const params=useMemo(()=>{
  let dateType = { 1: "day", 2: "month", 3: "year" }[type]
  return  {
      projectId,
      type: energytype,
      startDate: type!=4 ?  date?.startOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[0]?.format("YYYY-MM-DD HH:mm"),
      endDate:   type!=4 ? date?.endOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[1]?.format("YYYY-MM-DD HH:mm"),
   //   pageNum: current,
     // pageSize,
   //   queryType: line,
      areaIds: treeId,
      dayMonthYear: type, // 
    //  reportType:1,
     // filterInfo: alike,
     // customTime: type== 4,
      areaId,
      name: node?.energyName

    }
  }, [projectId, areaId, type, date, energytype, treeId,node,    publicrangedate])

  
  const tbref = useRef()
 
  const getTableData =async () => {
    
    let  {  projectId, dayMonthYear,  type, areaIds, areaId,  name,  startDate,endDate}= params
     try { 
    let condition = [ projectId, type,areaId,dayMonthYear].every(v => Number.isInteger(v)) && Array.isArray(areaIds) && startDate && endDate && name
 
    
    if (!condition) return;
 
      let { success, data}= await useQueryClassifyConsumeReport({},params) 
    
    //  setTotal(total)
      if (success && isObject(data) ) {   
        const {tableDatas} = data
       if (isObject(tableDatas)) {
        let { datas, heads } = tableDatas


          let columns = heads.map(t => ({ ...t, spans: {} }))
               if (Array.isArray(datas) && Array.isArray(heads)) {
                 let tbdata = datas.map((d, i) => {
                   let { data, mergeInfo, ...rest } = d
                   for (let [key, value] of Object.entries(mergeInfo)) {
                     let idx = columns.findIndex(h => h.dataIndex === key)
                     if (isObject(columns[idx])) {
                       columns[idx].spans[i] = value
                     }
       
                   }
                   if (isObject(data)) {
                     return { ...rest, ...data }
                   } else {
                     return { ...rest }
                   }
                 })
                 columns?.forEach(c => {
                   let handlers = {}
                   if (Object.keys(c.spans)?.length > 0) {
                     for (let [key, value] of Object.entries(c.spans)) {
       
                       handlers[key] = () => value
       
                     }
                   }
                   c["handlers"] = handlers
                 })
                 columns?.forEach(c => {
                   const { spans, handlers } = c
                   c["onCell"] = (row, idx) => {
                     if (Object.keys(spans)?.length > 0) {
       
                       return handlers?.[idx]?.()
                     } else {
                       return {}
                     }
       
                   }
                 })
                 setColumns(columns)
                 setDataSource(tbdata)
               } else {
                  setColumns([])
                  setDataSource([])
       
               }
       
      }  
    }

     } catch (error) {
      console.log(error)
     }
  }

  useRequest(getTableData,{
   refreshDeps:[params]
  })

 
 
  const onExport = useCallback(() => { 
    return getTableData(params)
  }, [ params])

 
  const toolbar = [<ProExportExcel tb={tbref} className="reportFl"   />]
  // fromlot,Zdconfig
  return (
   
      <Pagecount showSearch={false} custserach={true} >
        <Contentbox>
          <UserTree datatype={6} allselect={false} setNode={setNode} energytype={energytype} areaId={0} multiple={false} showline={false} setTreeId={setTreeId}/>
          
              
                <UseProTable 
                headerTitle="分类能耗"
                tableClassName="reportFl"
                columns={columns} 
                dataSource={dataSource}
                search={false}
                toolBarRender={() => toolbar}
                options={{
                  setting: false,

                }}
               sheetName="分类能耗"
               pagination={false}
               onExport={onExport} 
                ></UseProTable>
        </Contentbox>
   
      </Pagecount>
    
  )
}


