import React,{forwardRef, useImperativeHandle, useState} from 'react'
import { Column } from '@ant-design/plots';

export default forwardRef(function Timenergy({},ref) {
  const [list,setList] = useState([])
  
  // const data=[
  //     {
  //         "year": "09-06",
  //         "value": 2,
  //         "type": "尖电量"
  //       },
  //       {
  //         "year": "09-06",
  //         "value": 4,
  //         "type": "峰电量"
  //       },
  //       {
  //         "year": "09-06",
  //         "value": 3.5,
  //         "type": "平电量"
  //       },
  //       {
  //         "year": "09-06",
  //         "value": 5,
  //         "type": "谷电量"
  //       },
        
  // ]
  const data = list.map(it=>({type:it.name,value:it.value}))
  const config = {
      data,
      isStack: true,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      legend: {
          layout: 'horizontal',
          position: 'bottom'
      },
      xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
  };
  useImperativeHandle(ref,()=>({
    setList
  }))
  return <Column {...config} />;
})



