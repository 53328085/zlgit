import React, {useContext,useEffect, useMemo, useState} from 'react'
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
  const [data, setData] = useState({
    "earlyData": [
        {
          "x" : "00:00",
          "y" : "392.00"   
        },
        {
          "x" : "01:00",
          "y" : "634.00"
        },
        {
           "x" : "02:00",
           "y" : "226.00"
        }
    ],
    "lateData" : [
        {
          "x" : "00:00",
          "y" : "623..00"   
        },
        {
          "x" : "01:00",
          "y" : "635.00"
        },
        {
           "x" : "02:00",
           "y" : "524.00"
        }
    ]
})
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
   // setData(data)
  }





  let lineopt = useMemo(()=>{ 
    const {startTime,endTime} = time
    const {earlyData=[], lateData=[]} = data
    const earlyX = earlyData.map(item=>item.x)
    const earlyY = earlyData.map(item=>item.y)
    const lateX = lateData.map(item=>item.x)
    const lateY = lateData.map(item=>item.y)
    const early = startTime?.format?.('YYYY-MM-DD'), late = endTime?.format?.('YYYY-MM-DD');

  return { 
      type:5,
      legend: {
          data: [early, late]
      }, 
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: "10px",
        right: "10px",
        top: "40px",
        bottom: "2px",
        containLabel:true,
      },
      xAxis: [
          {
              type: 'category',
              name: early,
              boundaryGap: true,
              data:  earlyX ,
          },
          {
              type: 'category',
              name: late,
              boundaryGap: true,
              data:  lateX ,
          }
      ],  
      yAxis: [
          {
              type: 'value',
              name: early
          },
          {
              type: 'value',
              name: late
          }
      ],
      // 系列列表
      series: [
          {
              name: early,
              type: 'line',
              xAxisIndex: 0, // 对应第一个X轴
              yAxisIndex: 0, // 对应第一个Y轴
              data: earlyY, // 数据集1的数据
              smooth:3,
          },
          {
              name: late,
              type: 'line',
              xAxisIndex: 1, // 对应第二个X轴
              yAxisIndex: 1, // 对应第二个Y轴
              data: lateY, // 数据集2的数据
              smooth:3
          }
      ]
  };
  
  },[data ])
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
     <Space><Form.Item name="startTime" style={{marginBottom:0}} initialValue={time?.startTime}   >
  <DatePicker style={{width: "120px"}} />
</Form.Item>
<Form.Item noStyle>
<span>对比</span>
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
       <Ichart   custoption={lineopt} />
          </Titlelayout>
  )
}
