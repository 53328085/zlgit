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
  const [data, setData] = useState([])
 
  const [typevalue, setTypevalue] =useState({
    type:1,
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
    const data = await getData(params)
    setData(data)
  }
  let lineopt = useLine({data,dimensions, type:"bar",dataZoom})
  useEffect(()=>{
    const {type, date} = typevalue 
    if([areaId,  projectId,type].every((id)=>Number.isInteger(parseInt(id))) && isObject(stationName) && date) {
      
     
      let params = {
        areaId:1,
        siteId:stationName.value,
        projectId,
        type,
        date: date.format('YYYY-MM-DD'),
      }  
      getChartData(params) 
   }
  },[areaId, stationName,  projectId,typevalue])

  const extra=(<Form form={form}
   
    onValuesChange={onValuesChange}
  > 
    <Space><Form.Item name="type" style={{marginBottom:0}} initialValue={0}  >
        <Select options={option} style={{width: "120px"}} />
      </Form.Item> 
      <Form.Item name="date" style={{marginBottom:0}} initialValue={moment()} >
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
