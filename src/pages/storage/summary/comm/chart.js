import React, {useContext,useEffect, useState} from 'react'
import { Space, Form, DatePicker,Badge, Select} from 'antd'
import moment from 'moment'
import {Paramscontext} from  '../context'
import {isObject} from '@com/usehandler'
 
import {useLine} from '../data'
import Titlelayout from "@com/titlelayout"
import Ichart  from '@com/useEcharts/Ichart'
export default function Index({title,getData,dataZoom }={}) {
   
  const [form] = Form.useForm()
 
  const {areaId, stationName,  projectId} = useContext(Paramscontext)
  const [data, setData] = useState([])
  const  [time, setTime] = useState({startTime:moment().subtract(1, 'days'),
    endTime:moment()})
 
   const dimensions = [
     {
     name: time?.startTime?.format?.('YYYY-MM-DD'),
    
   },
   {name: time?.endTime?.format?.('YYYY-MM-DD'),}
  ] 
  const onValuesChange = (_, b)=>{  
      setTime(b) 
  }
 
  const getChartData = async (params)=>{
    const data = await getData(params)
    setData(data)
  }
  let lineopt = useLine({data,dimensions, dataZoom})
  useEffect(()=>{
    const {startTime, endTime} = time 
    if([areaId,  projectId].every((id)=>Number.isInteger(parseInt(id))) && isObject(stationName) && startTime && endTime) { 
      let params = {
        areaId,
        siteId:stationName.value,
        projectId,
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
      }  
      getChartData(params) 
   }
  },[areaId, stationName,  projectId,time ])
 
  const extra=<Form form={form}
   
    onValuesChange={onValuesChange}
  > 
     <Space>
      <Form.Item name="" style={{marginBottom:0}}>
        <Select options={[]} style={{width:80}}></Select>
      </Form.Item>
      <Form.Item name="startTime" style={{marginBottom:0}} initialValue={time?.startTime}   >
  <DatePicker style={{width: "120px"}} />
</Form.Item>
 
<Form.Item name="endTime" style={{marginBottom:0}} initialValue={time?.endTime}  >
  <DatePicker style={{width: "120px"}} />
</Form.Item></Space>
       </Form>
    const props ={
      bg:'transparent',
      bordered:'no',
      layout:"flex",
      bl:"none",
      extra
    }
  return (
    <Titlelayout title={<Badge status="processing" text={title} />} {...props} > 
       <Ichart {...lineopt} />
          </Titlelayout>
  )
}
