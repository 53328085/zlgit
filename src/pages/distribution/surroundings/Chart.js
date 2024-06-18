import React,{useState, useEffect} from 'react'
import moment from 'moment';
import {Space,DatePicker} from 'antd'
import {SerachButton} from '@com/useButton'
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout' 
export default function Chart({EnvironmentTrend, data}) {
    const [dateval,setDateVal] =useState(moment())
    const changeTime=(time)=>{
        setDateVal(time) 
      }
  let {humidityTrends, name, tempTrends} = data
  const search= () => {
    EnvironmentTrend(dateval)
  }
  const [option, setOption] = useState({
    grid: {
        left: "36px"
    },
    xAxis: {
        axisLabel: {
            formatter: (value, index) => {
                return moment(value, "YYYY-MM-DD hh:mm:ss").format("HH:mm")
            }
         }
       },
   series: [{type: 'line', yAxisIndex: 0, areaStyle: null}, {type: "line", yAxisIndex: 1, areaStyle: null}],
   yAxis: [
    {
        type: 'value',
        name: '温度', 
        position: 'left',
        axisLabel: {
          formatter: '{value}°C'
        }
      },
    {
      type: 'value',
      name: '环境湿度',
      position: 'right',
      axisLabel: {
        formatter: '{value}%'
      }
    }
   
  ],
   dataset: {

   }
  })
  useEffect(() => {
    if(Array.isArray(humidityTrends) && Array.isArray(tempTrends)){
        let tp = tempTrends.map((t,index) => ({...t, y1:humidityTrends[index].y }))
       // console.log(tp);
        setOption({
            ...option,
            dataset: {
                dimensions: [
                    {name: 'x', type: "time"},
                    {name: 'y', displayName: '温度'},
                    {name: 'y1', displayName: '湿度'}
                ],
                source: tp
            }
        })
    }

  }, [humidityTrends, tempTrends])
  return (
    <Titlelayout layout="flex" style={{flexBasis: '296px'}} title={<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <span>{name}</span>
    <Space>
    <span >日期</span>
     <DatePicker  size='middle'  value={dateval} onChange={changeTime}></DatePicker>
     <SerachButton   onClick={search} /> 
    </Space>
 </div>}>
 
    <div style={{display: 'flex', flex: 1}}>
    
     <Ichart {...option} />
  
    </div>
 </Titlelayout >
  )
}
