import React,{useState, useEffect} from 'react'
import moment from 'moment';
import styled from 'styled-components';
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout' 

const Chartwrap = styled.div`
 display: flex;
 flex:1;
 
 justify-content: space-between;
 .yb {
  flex-basis: 264px;
 }
 .line {
  display: flex;
  flex-basis: 1040px;
 }
`
const  comoption ={
  type: 5,
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  
  },
  tooltip: {
    formatter: ' {b} : {c}%'
  },
  color: ['#6395fa'],
  series:  [{
      type: 'gauge',

      center: ["50%", "50%"],
      radius: 90,
      progress: {
        show: true,
       // width: 18
      },
      axisLine: {
        lineStyle: {
         // width: 18
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
      //  length: 15,
        lineStyle: {
          width: 1,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 12,
        color: '#999',
        fontSize: 9
      },
      anchor: {
        show: true,
        showAbove: true,
       // size:10,
        itemStyle: {
       //  borderWidth: 5
        }
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        offsetCenter: [0, '70%']
      },
    
     
    }]
 
    }
export default function Chart({ht, data}) {
  const {tValue, hValue} = ht || {}
  console.dir(data)
  let {humidityTrends, name, tempTrends} = data
  // #6395fa
  const toption = {
        ...comoption,
        series: [{
          ...comoption.series[0],
          name:data.name,
          data: [ 
            {
              title: {
                show: true,
                fontSize: "14px",
                offsetCenter: [0, "30%"]
              },
            value: parseFloat(tValue),
            name: "温度 (℃)",
         }
      ]
        
      }]
    }  

    const voption = {
      ...comoption,
      series: [{
        ...comoption.series[0],
        name:data.name,
        data: [ 
          {
            title: {
              show: true,
              fontSize: "14px",
              offsetCenter: [0, "30%"]
            },
          value: parseFloat(hValue),
          name: "湿度 (%)",
       }
    ]
      
    }]
  }
  const [option, setOption] = useState({
    grid: {
        left: "36px",
        right: "72px"
    },
    legend: {
      data: ["温度", "湿度"],
      left: 'auto'
    },
    xAxis: {
        axisLabel: {
            formatter: (value, index) => {
                return moment(value, "YYYY-MM-DD hh:mm:ss").format("HH:mm")
            }
         }
       },
   series: [{type: 'line', yAxisIndex: 0, smooth: true, areaStyle: null}, {type: "line", yAxisIndex: 1,smooth: true, areaStyle: null}],
   yAxis: [
     {
        type: 'value',
      //  name: '温度', 
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
 
 </div>}>
 
    <Chartwrap >
      <div className='yb'>
      <Ichart custoption={toption} />
      </div>
      <div className='yb'>
      <Ichart custoption={voption} />
      </div>
      <div className='line'>
      <Ichart {...option} />
      </div>
    </Chartwrap>
 </Titlelayout >
  )
}
