import React,{forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import { Column } from '@ant-design/plots';
import empty from './imgs/empty.png'
export default forwardRef(function Timenergy({},ref) {
  const [list,setList] = useState()
  
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

  let data=[]
  if(list?.x){
    for(let i=0;i<list.x.length;i++){
      data.push({
        xvalue:list.x[i],
        yvalue:Number(list.y[i]),
        type: "尖电量"
      },{
        xvalue:list.x[i],
        yvalue:Number(list.y1[i]),
        type: "峰电量"
      },{
        xvalue:list.x[i],
        yvalue:Number(list.y2[i]),
        type: "平电量"
      },{
        xvalue:list.x[i],
        yvalue:Number(list.y3[i]),  
        type: "谷电量"
      })
    }
  }

  const config = {
      data,
      isStack: true,
      xField: 'xvalue',
      yField: 'yvalue',
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
  // useEffect(()=>{
  //   if(list?.x){
     
  //     for(let i=0;i<list.x.length;i++){
  //       data.push({
  //         xvalue:list.x[i],
  //         yvalue:list.y[i],
  //       },{
  //         xvalue:list.x[i],
  //         yvalue:list.y1[i],
  //       },{
  //         xvalue:list.x[i],
  //         yvalue:list.y2[i],
  //       },{
  //         xvalue:list.x[i],
  //         yvalue:list.y3[i],  
  //       })
  //     }
  //   }
  //   console.log(data)
      
  // },[list])
  useImperativeHandle(ref,()=>({
    setList
  }))
  return (<>
  {

    data.length>0?<Column {...config} />:
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}><img src={empty} style={{width:280}} ></img></div>
  } 
  </>);
})



