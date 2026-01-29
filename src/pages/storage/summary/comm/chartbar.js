import React, {useContext,useEffect, useState} from 'react'
import { Space, Form, DatePicker,Badge, Select} from 'antd'
import moment from 'moment'
import {Paramscontext} from  '../context'
import {isObject} from '@com/usehandler'
 
import {useLine,option} from '../data'
import Titlelayout from "@com/titlelayout"
import Ichart  from '@com/useEcharts/Ichart'
export default function Index({title,getData, dataZoom }={}) {
   
  const [form] = Form.useForm()
  const datetype = Form.useWatch('type', form)
  const {areaId, stationName,  projectId} = useContext(Paramscontext)
  const [data, setData] = useState({})
  console.log("data",data)
 
  const [typevalue, setTypevalue] =useState({
    type:0,
    date: moment()
  })
   const dimensions =[
    {name:"充电量"},
    {name:"放电量"}
  ]
  const onValuesChange = (_, b)=>{ 
    setTypevalue(b)
  }
/*   const getData = async ()=>{
    const {data} = await useQueryMeterPower({areaId, stationName,  projectId})
    return data
  }
 */
  const getChartData = async (params)=>{
    try {
       let data= await getData(params)
       setData(data)
   
    } catch (error) {
      console.log(error)
    }
    
  }
  let lineopt = useLine({data,dimensions, type:"bar",dataZoom})
  useEffect(()=>{
    const {type, date} = typevalue 
    if([areaId,  projectId,type].every((id)=>Number.isInteger(parseInt(id))) && isObject(stationName) && date) {
      
     
      let params = {
        areaId,
        siteId:stationName.value,
        projectId,
        type,
        date: type==0 ? date.format('YYYY-MM') : date.format("YYYY")+"-01-01",
      }  
      getChartData(params) 
   }
  },[areaId, stationName,  projectId,typevalue])

  const extra=(<Form form={form}
   
    onValuesChange={onValuesChange}
  > 
    <Space><Form.Item name="type" style={{marginBottom:0}} initialValue={typevalue.type}  >
        <Select options={option} style={{width: "120px"}} />
      </Form.Item> 
      <Form.Item name="date" style={{marginBottom:0}} initialValue={typevalue.date} >
        <DatePicker picker={['month',"year"][datetype]} style={{width: "120px"}} />
      </Form.Item></Space>
       </Form>)
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
