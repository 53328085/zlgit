import { Pie ,Line} from '@ant-design/plots';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
//饼图
export let PieCharts = forwardRef(
    ({data},ref) => {
        const [config ,setConfig] = useState(
            {
                appendPadding: 10,
                data:[],
                angleField: 'value',
                colorField: 'name',
                radius: 0.8,
                width: 512,
                height: 360,
 
                label: {
                  type: 'outer',
                  content: ({ percent }) => `${(percent * 100).toFixed(0)}%`
                },
                legend: {
                  position: 'bottom',
                  flipPage: false,
                  itemSpacing: 15
                },
                interactions: [
                  {
                    type: 'element-active',
                  },
                ],
              }  
        )
        useEffect(()=>{
            if(data){
                const arr =data.map(it=>({...it,value:Number(it.value)}))
                setConfig({
                    ...config,
                    data:arr
                }) 
                console.log(data)
            }  
        },[JSON.stringify(data)])
        return <Pie {...config} />;
      }
)

//折线图
export let LineCharts=({data,type})=>{
    let arr =[]
    data?.x.forEach((item,index)=>{
        const monthx = type===1?`${item}号`:`${item}月`
        arr.push({
            x:monthx,
            y:Number(data.y[index]),
            key:'用电量(kWh)'
        })
        arr.push({
            x:monthx,
            y:Number(data.y1[index]),
            key:'尖(kWh)'
        })
        arr.push({
            x:monthx,
            y:Number(data.y2[index]),
            key:'峰(kWh)'
        })
        arr.push({
            x:monthx,
            y:Number(data.y3[index]),
            key:'平(kWh)'
        })
        arr.push({
            x:monthx,
            y:Number(data.y4[index]),
            key:'谷(kWh)'
        })
     
    })
    console.log(arr)
    const config = {
      data:arr?arr:[],
      padding: 'auto',
      xField: 'x',
      yField: 'y',
      seriesField:'key',
      lineStyle:{
        lineWidth:1
      },
      paddingTop:64,
      legend:{
        position: 'top',
        itemSpacing:2
      },
    //   point: {
    //     size: 3,
    //     shape: 'cycle',
    //     style: {
    //       fill: '#5B8FF9',
    //       borderColor: '#fff'
    //     },
    //   },
      xAxis: {
        // type: 'timeCat',
        tickCount: 5,
      },
    }
    return <Line {...config} />;
  }