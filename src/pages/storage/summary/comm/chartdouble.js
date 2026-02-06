import React, {useContext,useEffect, useMemo, useState} from 'react'
import { Space, Form, DatePicker,Badge, Select, message} from 'antd'
import moment from 'moment'
import {Paramscontext} from  '../context'
import {isObject} from '@com/usehandler'
 
import {lineoptdoub} from '../data'
import Titlelayout from "@com/titlelayout"
import Ichart  from '@com/useEcharts/Ichart'
import {useQueryMeterPower,useQueryMeterList,useQuerySOC} from '../api'
export default function Index({title,type}) {
   
  const [form] = Form.useForm()
 
  const {areaId, stationName,  projectId} = useContext(Paramscontext)
  const [data, setData] = useState({})
 const [list, setList] = useState([])
  const  [formdata, setFormdata] = useState({
      startTime:moment().subtract(1, 'days'),
     endTime:moment(),
    sn:null
    }
  )
 
    let lineopt =  lineoptdoub(data, formdata?.startTime, formdata?.endTime) 
  const onValuesChange = (_, b)=>{  
      console.log("b",b)
      setFormdata(b) 
  }
 
  const getChartData = async (params)=>{
    try {
      const {data, success} = await type==202 ? useQuerySOC(params) : useQueryMeterPower(params)
      if(success && isObject(data)) {
        setData(data)
      }
    } catch (error) {
      console.log(error)
    }
  
   // setData(data)
  }

  const getList = async (params)=>{
     try{
      const {data, success, errMsg} = await useQueryMeterList(params)
      if(success && Array.isArray(data)){
        setList(data)
        form.setFieldValue("sn", data[0].sn)
        setFormdata({...formdata,  sn:data[0].sn})
      }else {
        if(!success) {
        //  message.error(errMsg || "数据出错")
        }
        form.setFieldValue("sn", null)
        setFormdata({...formdata,  sn:null})
        setList([])
      }
      
    } catch (error) {
      console.log(error)
    }
   
  }
  useEffect(()=>{ 
    if([areaId,  projectId, type].every((id)=>Number.isInteger(parseInt(id))) && Number.isInteger(parseInt(stationName?.value))) { 
      let params = {
        areaId,
        siteId:stationName.value,
        projectId, 
        type
      }  
      getList(params) 
   }
  },[areaId, stationName,  projectId, type  ])


  
  useEffect(()=>{
    const {startTime, endTime,sn} = formdata
   
    if([areaId,  projectId].every((id)=>Number.isInteger(parseInt(id)))   && startTime && endTime &&sn) { 
      console.log("222")
      let params = {
        areaId,
        sn,
        projectId,
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
      }  
      getChartData(params) 
   }
  },[areaId, formdata,  projectId  ])
  const wd =  {width: type==101 ?  140: 115 }
  const extra=<Form form={form}
   
    onValuesChange={onValuesChange}
  > 
     <Space size={4}>
       <Form.Item name="sn" style={{marginBottom:0}} size="small">
        <Select options={list} style={wd} fieldNames={{label:"name", value:"sn"}}></Select>
       </Form.Item>
      <Form.Item name="startTime" style={{marginBottom:0}} initialValue={formdata?.startTime}   >
  <DatePicker style={wd} />
</Form.Item>
<Form.Item name="endTime" style={{marginBottom:0}} initialValue={formdata?.endTime}  >
  <DatePicker style={wd} />
</Form.Item></Space>
       </Form>
    const props ={
      bg:'transparent',
      bordered:'no',
      layout:"flex",
      bl:"none",
      pr:"10px",
      extra
    }
  return (
    <Titlelayout title={<Badge status="processing" text={title} />} {...props} > 
       <Ichart   custoption={lineopt} />
          </Titlelayout>
  )
}
