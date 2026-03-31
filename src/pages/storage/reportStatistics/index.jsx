import React, { useState, useRef } from 'react'
 
import { Space,    } from 'antd'
import {nanoid} from "@reduxjs/toolkit"
import Ichart from '@com/useEcharts/Ichart'
import Usetable from '@com/useTable'
import {isObject} from "@com/usehandler"
import {useAntdTable,useRequest} from 'ahooks'
import {  useOutletContext} from 'react-router-dom'
import {Radiogroup} from "@com/comstyled"
import {  ExportExcel} from '@com/useButton'
import Pagecount from "@com/pagecontent";
import Titlelayout from '@com/titlelayout'
import {Mainbox} from './style'
 import {useRevenues} from "./api"
import {usebarline } from './usehook'
 import {columns, options} from './data'
 
 

 

 
 export default function Index() {
  const [datatype, setDataType]=useState("1")
  let {exparams} = useOutletContext()
   
  let {stationName,  projectId, areaId,date,type} = exparams
   const tableRef = useRef()
 
   
  const QueryReports = async() => {
      try {
        let flag = stationName.value && [projectId, areaId, type].every(it => Number.isInteger(parseInt(it))) && date
        if (!flag) return
         let body ={
           projectId,
           areaId,
           siteId:stationName.value,
          dayMonthYear:type,
           date: type==3 ? date?.startOf("year")?.format("YYYY-MM-DD") : date?.format('YYYY-MM-DD')
         }
         let {success, data} = await    useRevenues({},body)
         if (success && isObject(data)){
          return data
         }else {
          return  {}
         }
      } catch (error) {
        return  {}
        console.log(error)
      }
  }
 let {data} = useRequest(QueryReports, { 
   refreshDeps: [stationName,  projectId, areaId,date,type]
 })
  const {table=[], trend={}} = isObject(data) ? data : {}

 

 const extra = <Space><Radiogroup options={options}   optionType="button" onChange={v =>setDataType(v.target.value)}
        buttonStyle="solid" value={datatype}></Radiogroup></Space>
 

  const lineoptin = usebarline({datas:trend}) 
  return (
    <Pagecount pd={0} bgcolor='transparent'>
    <Titlelayout title="收益统计" layout="flex" extra={extra}>
      <Mainbox>
         {
          datatype=="1" ? 
          <div className='chartbox'>
<Ichart custoption={lineoptin}></Ichart>
          </div>
          :<div className='outtable'><div className='innertable'><Usetable ref={tableRef} columns={columns} hbc="#fff"  rowKey={nanoid()} dataSource={table} scroll={{y:650}}    sheetName='收益统计.xlsx'/></div></div>
         } 
          
      </Mainbox>
    </Titlelayout>
    </Pagecount>
  )
}
 