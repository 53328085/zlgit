// 班次能耗

import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'

import { useOutletContext } from 'react-router-dom'

 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree"
import {RadiogroupSolid,Tabsbox} from "@com/comstyled"
import { getTime, isObject } from '@com/usehandler'
 
import CModal from '@com/useModal'
import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   shitcols,  labelStyle, contentStyle } from '../reportdata'

import {Contentbox,Chartwrap} from "../style"
import {useQueryShiftEnergy,useQueryShifts} from "../api"
import {useCol} from "../usehook"
 

export default function Index() {

  let { exparams  } = useOutletContext()
 
  const [key, setKey]=useState('1')
  
  const [options, setOptions]=useState([])
 
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type, publicdate:date, energytype, alike,publicrangedate } = exparams  

 
  
  let columns = useCol(shitcols,3, '用能(kWh)')
 

 const getShift = async  ()=>{ 
  try {
     let {success, data} = await useQueryShifts({projectId})
     if (success && Array.isArray(data) && data.length) { 
       setOptions(data.map(d =>({...d, label:d.name, key:d.no})))
       setKey(data[0].no)
     }else {
       setOptions([])
       setKey(null)
       message.error('获取班次失败')
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
   //   pageNum: current,
     // pageSize,
      queryType: line,
      ids: treeId,
      type: type, // 
   //   reportType:1,
      filterInfo: alike,
     // customTime: type== 4,
      areaId,
      tab:key 
    }
   
  }, [projectId, areaId, type, date, energytype, treeId,  line, key,  alike,publicrangedate])

  const [total, setTotal] = useState(0)

  const tbref = useRef()
  const headTitle = useMemo(() => { 
     console.log("option",options)
     let datas = options.find((item)=>item.key==key)
     console.log("datas",datas,key)
    return isObject(datas) ? `班次能耗-${datas?.name} (${datas?.startTime}-${datas?.endTime})`:`班次能耗`
  }, [options, key])
   const getTableData =async (params) => {
    const {current,...body} = params
    body.pageNum = current
    let  {  projectId, type,  meterType, ids, areaId,  queryType, tab,  startDate,endDate}= body
     try { 
    let f = [ projectId, type, meterType,areaId, tab,  queryType].every(v => Number.isInteger(Number.parseInt(v))) && Array.isArray(ids) && startDate && endDate && key
 
    
    if (!f) return;
 
      let { success, data, total = 0 }= await useQueryShiftEnergy({},body) 
    
      setTotal(total)
      if (success && Array.isArray(data) && data?.length ) {  
       
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
    if(Number.isInteger(projectId)) {
      getShift(params)
    }
   
  }, [projectId])
  const toolbar = [<ProExportExcel tb={tbref} className="reportBc"   />]
  // fromlot,Zdconfig
  return (
   
      <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none" >
        <Contentbox rtbg="none">
          <UserTree areaId={areaId} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true} datatype={NaN} />
          
                <div className='rightwrap'>
                <Tabsbox items={options} tabwidth="88px" activeKey={key} tabBarGutter={4} size='small'  onChange={setKey}  ></Tabsbox>
                  <div className="tbwrap">
                <UseProTable 
                headerTitle={headTitle}
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


