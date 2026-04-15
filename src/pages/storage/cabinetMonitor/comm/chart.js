import React, {useContext,useEffect, useState} from 'react'
import { Space, Form, DatePicker,Badge, Select} from 'antd'
import dayjs from 'dayjs'
import {Paramscontext} from  '../context'
import {isObject} from '@com/usehandler'
 
import {useLine,lineoptdoub} from '../data'
import Titlelayout from "@com/titlelayout"
import Ichart  from '@com/useEcharts/Ichart'
import { parseInt } from 'lodash'
export default function Index({title,getData,dataZoom }={}) {
   
  const [form] = Form.useForm()
 
  const {areaId, stationName,  projectId,containerId} = useContext(Paramscontext)
  const [data, setData] = useState({})
  console.log("充放电功率",data)
  const  [time, setTime] = useState({startTime:dayjs().subtract(1, 'days'),
    endTime:dayjs()})
 
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
    try {
      const data = await getData(params)
      setData(data)
    } catch (error) {
      console.log(error)
    }
    
  }
  let lineopt = lineoptdoub(data,time?.startTime, time?.endTime)
console.log("lineopt",lineopt)
  useEffect(()=>{
    const {startTime, endTime} = time 
    if([projectId].every((id)=>Number.isInteger(parseInt(id))) && Number.isInteger(parseInt(containerId?.value)) && startTime && endTime) { 
      let params = { 
        containerId:containerId?.value,
        projectId,
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
      }  
      getChartData(params) 
   }
  }, [containerId,  projectId,time ])
 
  const extra=<Form form={form}
   
    onValuesChange={onValuesChange}
  > 
     <Space><Form.Item name="startTime" style={{marginBottom:0}} initialValue={time?.startTime}   >
  <DatePicker style={{width: "120px"}} allowClear={false} />
</Form.Item>
<Form.Item noStyle>
<span>对比</span>
</Form.Item>
<Form.Item name="endTime" style={{marginBottom:0}} initialValue={time?.endTime}  >
  <DatePicker style={{width: "120px"}} allowClear={false} />
</Form.Item></Space>
       </Form>
    const props ={ 
      bordered:'no',
      layout:"flex",
      
      extra
    }
  return (
    <Titlelayout title={title} {...props} > 
       <Ichart custoption={lineopt} />
          </Titlelayout>
  )
}
