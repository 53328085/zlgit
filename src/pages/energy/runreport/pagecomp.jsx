 import styled from 'styled-components'
import React,{useRef} from 'react'
 import {Descriptions} from 'antd'
import Page from "@com/reportPrint/page"
import Ichart from '@com/useEcharts/Ichart'
 

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
const Main =styled.div`
   && {
    color: #515151;
    display: flex;
    flex-direction: column;
    flex: 1;
    .title {
       font-size: 20px;
       margin-bottom: 16px;
    }
    .text {
      font-size: 16px;
      text-indent: 2em;
    }
   }

`

 
 
export default function pagecomp({data, params}) {
  let {eUse={}, timeEnergy={}, constEnergy={}, range=[]} = data.constructor===Object ? data : {} ;
  let time = timeEnergy?.constructor == Object ? timeEnergy : {}
  let {analysis={}, detail: td, proportion=[]} = time 
  let constE = constEnergy?.constructor == Object ? constEnergy : {}
  let {analysis: ean={}, detail: constD} = constE
  let {type} = params?? {}
  let ran = Array.isArray(range) ? range : [];
  let text = type==2 ? '日' : '月'
   let option =useRef({      
      series: [{ type: "line",  seriesLayoutBy: 'row'}],  
      grid:{
        // 图表 grid
        left: "0px",
        right: "0",
        top: "32px",
        bottom: "40px",
        containLabel: true,
      },
      legend: {
        bottom: 5,
        itemHeight: 3,
        itemWidth: 14,
      },        
      title: {
        text: `${text}用电量`,
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
   let eoption =useRef({      
    series: [{ type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'}],  
    grid: {
      bottom: "60px"
    },
    legend: {
       icon: "circle",
       bottom: "5px"
    },        
    title: {
      text: `总电量`,
      textStyle: {
        fontSize: 14,
        color: '#51515',
      },
      left: 'auto'
    },
    dataset: {
      dimensions: [
        {name: '日期', type: 'time'},
        {name: "尖电量度"},
        {name: "峰电量度"},
        {name: "平电量度"},
        {name: "谷电量度"},
      ],
      source: [
      ],
     sourceHeader: false,
    }
   })
   let epoption = useRef({
    pieData: { data: proportion, total: "100%" },
    type: 3,
    legend: {
      bottom: 0,
      top: 'auto',
      itemGap: 5
    },
    grid: {
      bottom: 20
    }
  })
 
  let coption =useRef({      
    series: [{ type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'},{ type: "bar",  seriesLayoutBy: 'row'}, { type: "bar",  seriesLayoutBy: 'row'}],  
    grid: {
      bottom: "60px"
    },
    legend: {
       icon: "circle",
       bottom: "5px"
    },        
    title: {
      text: `${text}电费`,
      textStyle: {
        fontSize: 14,
        color: '#51515',
      },
      left: 'auto'
    },
    dataset: {
      dimensions: [
        {name: '日期', type: 'time'},
        {name: "总用电费"},
        {name: "尖时段电费"},
        {name: "峰时段电费"},
        {name: "平时段电费"},
        {name: "谷时段电费"},
      ],
      source: [
      ],
     sourceHeader: false,
    }
   })

   let boption =useRef({      
    series: [{ type: "bar" }],  
    legend: {
      show: false
    },   
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      }
    },   
    
    dataset: { 
      dimensions: [
        "name",
        "value"
      ],
      source: [
      ],
    
    }
   })
   if(eUse?.detail?.constructor==Object && eUse?.detail?.x?.length > 0) {
     let {x,y} = eUse?.detail
      option.current.dataset.source = [
         x, y
      ]
   }else {
    option.current.dataset.source = []
   }
   if(td?.constructor==Object && td?.x?.length > 0) {
    let {x,y1,y2, y3,y4} = td
     eoption.current.dataset.source = [
        x, y1,y2,y3,y4
     ]
  }else {
   eoption.current.dataset.source = []
  }

  if(constD?.constructor==Object && constD?.x?.length > 0) {
    let {x,y,y1, y2,y3,y4} = constD
     coption.current.dataset.source = [
        x, y,y1,y2,y3,y4
     ]
  }else {
    coption.current.dataset.source = []
  }
  boption.current.dataset.source = ran
  const sty = {
    flex: 1,
    display: 'flex'
  }
  return (
      <>
      <Page key="a"> 
        <Main> 
      <p  className='title'>1.项目概况</p>    
        <DesItem title=""  bordered size='small' column={1}>
          <DesItem.Item label="项目名称">{data.project}</DesItem.Item>
          <DesItem.Item label="项目地址">{data.address}</DesItem.Item>
        </DesItem> 
        <div style={{flex: 1, display: 'flex', flexDirection: "column"}}>
        <p  className='title'>2.用电量分析</p> 
          <p className='text'>{`${data.project}监测周期内总耗电量${data.eUse?.sum}kW·h,${text}平均耗电量${data.eUse?.avg}kW·h，单${text}最大耗电量${data.eUse?.max}kW·h，${text}耗电情况详见下图：`}</p>
          <div style={sty}>
              
              <Ichart {...option.current}  tip={`${data.project}${text}用电量`} />
          </div>
         </div>
         </Main> 
      </Page>
       <Page key="b">
          <Main>
          <p  className='title'>3.分时段能耗</p>    
          <p className='text'>{` 监测周期内尖电量为${analysis.e1}kW·h，占总电量${analysis.percentE1}%,峰电量为${analysis.e2}kW·h，占总电量${analysis.percentE2}%,平电量为${analysis.e3}kW·h，占总电量${analysis.percentE3}%,谷电量为${analysis.e4}kW·h，占总电量${analysis.percentE4}%。`}</p>
          <div style={{display: "grid", gridTemplateRows: "1fr 1fr", flex: 1}}> 
              <Ichart {...eoption.current}  tip={`${data.project}${text}电费`} />
              <Ichart {...epoption.current}  tip={`${data.project}${text}尖峰平谷`} />
          </div>
        
          </Main>
        </Page>
       
        <Page key="c">
          <Main>
          <p  className='title'>4.电费</p>    
          <p className='text'>{`当${text}总用电费用${ean.e}元，其中尖时段电费为${ean.e1}元，占总电费${ean.percentE1}%，峰时段电费为${ean.e2}元，占总电费${ean.percentE2}%，平时段电费为${ean.e3}元，占总电费${ean.percentE3}%,谷时段电费为${ean.e4}元，占总电费${ean.percentE4}%。`}</p>
          <div style={{display: "flex", height: '214px', marginBottom: '32px'}}> 
              <Ichart {...coption.current}  tip={`${data.project}${text}电费`} />
          </div>
          <p  className='title'>5.线路能耗排名</p>
          <div style={{display: 'flex', height: '300px'}}>
             <Ichart {...boption.current}  tip={`${data.project}${text}线路能耗排名`} />
          </div>
          </Main>
        </Page>
      </>
  )
}
 
   