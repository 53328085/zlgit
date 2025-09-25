import React, {useMemo, useState} from 'react'
import  Titlelayout from '@com/titlelayout'
import {Radio} from 'antd'
import {CustTitle,ChartWrap} from  "../style"
import {viewOpt} from '../data'
import Ichart from '@com/useEcharts/Ichart'
export default function Index({datas={}, view}) {
  console.log(datas)
  const {proportion=[],consumeDetail=[]} = datas
  const pieopt = useMemo(()=>{
    let total = proportion?.reduce((a,b)=> a+ parseFloat(b.value),0)
    return{
        type: 3,
        pieData: { data: proportion, total,radius:"50%", label: {
            formatter: "{c}",
          }, },
        legend: {
          top: 'auto',
          bottom: 16,
          //  orient: 'vertical',
          // left: 'left'
        },
        grid: {
          containLabel: true,
          left: 0,
          right: 0,
        },
       
    }
},[proportion])
const lineopt=useMemo(()=>{
    return{
        title: {
            text: '发电量(kWh)',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
                color: 'rgba(144, 147, 153, 1)',
            },
        },
        series: [{ type: "bar", seriesLayoutBy: 'row' }],
        grid: {
          left: "0px",
          right: "0",
          top: "40px",
          bottom: "0px",
          containLabel: true,
        },
        legend: {
          show:false
          // itemHeight: 4,
          // itemWidth: 16,
        },
        xAxis: {
          axisLabel: {
            showMaxLabel: true,
            hideOverlap: true,
            interval: "auto"
          }
        },
        dataset: {
            dimensions: [
                { name: '时间', type: 'time' },
                { name: view === 1 ? 'kWh' : '元' },
    
              ],
              source: [consumeDetail?.[0]?.x, consumeDetail?.[0]?.y],
              sourceHeader: false,
        },
    }
}, [consumeDetail])
  const [value,setValue]=useState(1)
  const title=<CustTitle>
    <span>实时数据</span>
    <Radio.Group options={viewOpt} buttonStyle="solid" optionType='button' value={value} onChange={(e)=>setValue(e.target.value)} ></Radio.Group>
  </CustTitle>
  return (
    <Titlelayout title={title} layout="flex">
     <ChartWrap> 
        <div className="pip">
         <Ichart {...pieopt} />
        </div>
        <div className='bar'>
          <Ichart {...lineopt} />
        </div>
      </ChartWrap>
    </Titlelayout>
  )
}
