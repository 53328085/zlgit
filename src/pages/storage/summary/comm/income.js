import React, {useContext,useEffect, useState} from 'react'
import { Space, Form, DatePicker,Badge} from 'antd'
import dayjs from 'dayjs'
import {Paramscontext} from  '../context'
import {isObject, disabledDate} from '@com/usehandler'
import {useQueryStorageIncome} from '../api'
import {useLine} from '../data'
import Titlelayout from "@com/titlelayout";
import Ichart  from '@com/useEcharts/Ichart'; 
import Cempty from '@com/useEmpty'
export default function Index() {
   
  const [form] = Form.useForm()
  const {areaId, stationName,  projectId} = useContext(Paramscontext)
  const [data, setData] = useState([])
  const  [time, setTime] = useState({startTime:dayjs().subtract(1, 'days'),
    endTime:dayjs()})

   const dimensions =[
     {
     name: time?.startTime.format('YYYY-MM-DD'),
    
   },
   {name: time?.endTime.format('YYYY-MM-DD'),}
  ]
  const onValuesChange = (_, b)=>{ 
    setTime(b)
  }
 
  const getChartData = async (params)=>{
    try {
        const {data, success} = await useQueryStorageIncome(params)
        if(success && Array.isArray(data)) {
            setData(data)
        }else {
            setData([])
        }
   
    } catch (error) {
        
    }
    
  }
  let lineopt = useLine({data,dimensions})
  useEffect(()=>{
    const {startTime, endTime} = time
    if([areaId,  projectId].every((id)=>Number.isInteger(parseInt(id))) && isObject(stationName) && startTime && endTime) {
      let values = form.getFieldsValue()
      console.log(values)
      let params ={
        areaId,
        siteId:stationName.value,
        projectId,
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
      } 
      getChartData(params) 
   }
  },[areaId, stationName,  projectId,time])
  const extra=<Form form={form}
    initialValues={time}
    onValuesChange={onValuesChange}
  > 
      <Space><Form.Item name="startTime" style={{marginBottom:0}}   >
        <DatePicker style={{width: "120px"}} disabledDate={disabledDate} allowClear={false}   />
      </Form.Item>
      <Form.Item noStyle>
      <span>对比</span>
      </Form.Item>
      <Form.Item name="endTime" style={{marginBottom:0}} >
        <DatePicker style={{width: "120px"}} disabledDate={disabledDate} allowClear={false} />
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
    <Titlelayout title={<Badge status="processing" text="收益数据总览" />} {...props} > 
    <Cempty></Cempty>
      {/*  <Ichart {...lineopt} /> */}
          </Titlelayout>
  )
}
