import React, {useContext,useEffect, useState} from 'react'
import { Space, Form, DatePicker,Badge, Select} from 'antd'
import dayjs from 'dayjs'
import {Paramscontext} from  '../context'
import {isObject} from '@com/usehandler'
 
import {useLine,option} from '../data'
import Titlelayout from "@com/titlelayout"
import Ichart  from '@com/useEcharts/Ichart'
export default function Index({title,getData  }={}) {
   
  const [form] = Form.useForm()
  const datetype = Form.useWatch('type', form)
  const {areaId, stationName,  projectId,containerId} = useContext(Paramscontext)
  const [data, setData] = useState([])
 
  const [typevalue, setTypevalue] =useState({
    type:1,
    date: dayjs()
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
  let lineopt = useLine({data,dimensions, type:"bar" })
  useEffect(()=>{
    const {type, date} = typevalue 
    if([areaId,  projectId,type].every((id)=>Number.isInteger(parseInt(id))) && isObject(stationName)&& isObject(containerId) && date) {
      
     
      let params = {
        areaId,
        siteId:stationName.value,
        containerId:containerId.value,
        projectId,
        type,
        date: date.format('YYYY-MM-DD'),
      }  
      getChartData(params) 
   }
  },[areaId, stationName, containerId, projectId,typevalue])

  const extra=(<Form form={form}
   
    onValuesChange={onValuesChange}
  > 
    <Space><Form.Item name="type" style={{marginBottom:0}} initialValue={0}  >
        <Select options={option} style={{width: "120px"}} />
      </Form.Item> 
      <Form.Item name="date" style={{marginBottom:0}} initialValue={dayjs()} >
        <DatePicker picker={['month',"year"][datetype]} style={{width: "120px"}} allowClear={false} />
      </Form.Item></Space>
       </Form>)
    const props ={ 
      bordered:'no',
      layout:"flex", 
      extra
    }
  return (
    <Titlelayout title={title} {...props} > 
       <Ichart {...lineopt} />
          </Titlelayout>
  )
}
