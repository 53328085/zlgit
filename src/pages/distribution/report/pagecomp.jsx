 import styled from 'styled-components'
import React,{useRef} from 'react'
 import {Descriptions} from 'antd'
import Page from "@com/reportPrint/page"
import Ichart from '@com/useEcharts/Ichart'
import _ from 'lodash'

const DesItem = styled(Descriptions)`
&& {
  margin-bottom: 32px;
 .ant-descriptions-item-label {
   height: 30px;
   padding: 0 16px;
 
   text-align: center;
   min-width: 120px;
   background: transparent;
 }
 .ant-descriptions-item-content {
   height: 30px;
   color:#515151;
   padding: 0 16px;
 }
 .ant-descriptions-header {
  margin-bottom: 10px;
 .ant-descriptions-title {
   font-weight: normal;
   color:#515151;
   font-size: 14px;
 }
}
}
`
const Trans = styled(DesItem)`
  && {
    .ant-descriptions-item-label {
       width: 200px
    }
  }
`

 const Cont = styled.div`
   && {
     
   }
 
 `
const Transformer = ({data}) => {  // 1
 return (
  <DesItem bordered size='small' column={1} >
      <DesItem.Item label="变压器名称">{data.name}</DesItem.Item>
      <DesItem.Item label="变压器型号">{data.category}</DesItem.Item>
      <DesItem.Item label="平均负荷率">{data.avgLoad}</DesItem.Item>     
      <DesItem.Item label="最大负荷率">{data.maxLoad}</DesItem.Item>  
      <DesItem.Item label="最大负荷率发生时间">{data.maxLoadTime}</DesItem.Item>  
      <DesItem.Item label="运行状态">{data.state}</DesItem.Item>  
  </DesItem> 

 )

}
export default function pagecomp({data,index, params}) {
  let {detail={}, transformers, temperature, water, smoke } = data.constructor===Object ? data : {} ;
  let temp = temperature?.constructor == Object ? temperature : {}
  let wat = water?.constructor == Object ? water : {}
  let smk = water?.constructor == Object ? smoke : {}
  let transformerD = useRef([])
  let len = 0  // 变压器是否超过3个
  let {type} = params?? {}
  console.log(type)
  if(Array.isArray(transformers)) {
    let arr = transformers.length
    if(arr>3) {
      len = arr
      transformerD.current = _.chunk(transformers, 3)
    }else if(arr > 0 && arr<4) {
      transformerD.current = transformers
      len = arr
    }else  {
      len = 0
    }
  }
  console.log(transformerD)
   let option =useRef({      
      series: [{ type: "line",  seriesLayoutBy: 'row', }],  
      grid:{
        // 图表 grid
        left: "0px",
        right: "0",
        top: "0px",
        bottom: "40px",
        containLabel: true,
      },
      legend: {
        bottom: 5,
        itemHeight: 3,
        itemWidth: 14,
      },
      xAxis:{
        axisLabel:{
          interval:'auto'
        }
      },
      yAxis: {
        show: false,
      },
      title: {
        text: '日用电量',
        textStyle: {
          fontSize: 14,
          color: '#51515',
        },
        left: 'auto'
      },
      dataset: {
        dimensions: [
          {name: '日期', type: 'time'},
          {name: "用电量"},
        ],
        source: [
        ],
       sourceHeader: false,
      }
   })
   if(detail?.constructor==Object && detail.x.length > 0) {
     let {x,y} = detail
      option.current.dataset.source = [
         x, y
      ]
   }else {
    option.current.dataset.source = []
   }
   const sty= {
     marginBottom: "10px",
     display: "inline-block"
   }
  let text = type==2 ? '日' : '月'
  return (
      <>
      <Page>        
        <DesItem title={`${index}.${data.name}`}   bordered size='small' column={1}>
          <DesItem.Item label="配电房名称">{data.name}</DesItem.Item>
          <DesItem.Item label="配电房详情">{`该变电站监测周期内总耗电量${data.sum}kWh， ${text}平均耗电量${data.avg}kWh，单${text}最大耗电量${data.max}kWh，${text}耗电情况详见下图`}</DesItem.Item>
        </DesItem> 
        <div style={{flex: 1, display: 'flex'}}>
         <Ichart {...option.current}  tip={`${data.name}${text}用电量`} />
         </div>
      </Page>
      {
       len>3 ?
       transformerD.current.map(ds => <Page>
        <span style={sty}>{index}.2变压器监控</span>
        {ds.current.map(d =>  <Transformer data={d}  key={d.category} />)}
        </Page>)
        :
       (len> 0 && len<4) ? (<Page>
           <span style={sty}>{index}.2变压器监控</span>
           {transformerD.current.map((d,dex) =>  <Transformer data={d} key={d.category + dex} />)}
        </Page>)
        : null
       }
       <Page>
          <DesItem title={`${index}.3变压器温度监控`}    bordered size='small' column={1}>
          <DesItem.Item label="最高温度发生时间">{temp.time}</DesItem.Item>
          <DesItem.Item label="最高温度发生地点">{temp.position}</DesItem.Item>
          <DesItem.Item label="最高温度值">{temp.value}</DesItem.Item>
        </DesItem> 

       
          <DesItem title={`${index}.4水浸报警`}   bordered size='small' column={1}>
          <DesItem.Item label="发生时间">{wat.time}</DesItem.Item>
          <DesItem.Item label="发生位置">{wat.position}</DesItem.Item>
        </DesItem> 
       
          <DesItem title={`${index}.5烟雾报警`}   bordered size='small' column={1}>
          <DesItem.Item label="发生时间">{smk.time}</DesItem.Item>
          <DesItem.Item label="发生位置">{smk.position}</DesItem.Item>
        </DesItem> 
       </Page>
      </>
  )
}
 
   