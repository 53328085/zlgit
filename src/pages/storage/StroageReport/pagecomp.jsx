 import styled from 'styled-components'
import React, {useState} from 'react'
 import {Descriptions} from 'antd'
import Page from "@com/reportPrint/page"
 
 import Ichart from "@com/useEcharts/Ichart"
 
const DesItem = styled(Descriptions)`
&& {
 .ant-descriptions-item-label {
   height: 30px;
   padding: 0 16px;
   background-color:${({bgColor, theme}) => bgColor || theme?.primaryColor };
   color:#fff;
   text-align: center;
 }
 .ant-descriptions-item-content {
   height: 30px;
   color:#515151;
   padding: 0 16px;
   text-align: center;
 }
 .ant-descriptions-title {
   font-weight: normal;
   color:#515151;
 }
}
`
const Main =styled.div`
   && {
    color: #515151;
    display: flex;
    flex-direction: column;
    flex: 1;
    row-gap: 16px;
    .chart {
       display: flex;
       flex: 1;
    }
    .title {
       font-size: 16px;
       margin-bottom: 16px;
    }
    .text {
      font-size: 16px;
      text-indent: 2em;
    }
   }

`
 
 
const grid = {
  left: '16px',
  right: '16px',
  bottom: '20px',
}
const etitle = {
  textStyle: {
    fontSize: '16px',
    color: '#515151',
    fontWeight: 'normal',
  },
}
export default function pagecomp({data}) {
  let  reportData=  Object.prototype.toString.call(data).slice(8,-1)==="Object" ? data : {} ;
  const {projectAddress, projectName, profitDetail={}, chargeDetail={},chargeDurationDetail={},airConditionDurationDetail={}, alarmDetail={} } = reportData
  const {x=[], y=[], y1=[], y2=[]} = profitDetail
  const loption = {
    grid,
    series: [{ type: "line", seriesLayoutBy: "row"}, { type: "line", seriesLayoutBy: "row"}, { type: "line", seriesLayoutBy: "row"}],
    dataset: {
      dimensions: [
        {name: 'x', displayName: '日期', type: "time"},
        {name: 'y', displayName: '充电金额（元）'},
        {name: 'y1', displayName: '放电（元）'},
        {name: 'y2', displayName: '储能收益（元）'},
      ],
      source: [x, y, y1, y2],
      sourceHeader: false,
    }

  }
const eoption = {
  grid,
  series: [{ type: "line", seriesLayoutBy: 'row', }, { type: "line", seriesLayoutBy: 'row', }],
  dataset: {
      dimensions: [
        {name: 'x', displayName: '日期', type: "time"},
        {name: 'y', displayName: '充电电量（kWh）'},
        {name: 'y1', displayName: '放电电量（kWh）'},
      ],
      source: [chargeDetail.x,chargeDetail.y, chargeDetail.y1 ],
      sourceHeader: false,
  }
} 
const boption = {
  grid: {
    ...grid,
    top: '64px'
  },
  legend: {
    top: '32px'
  },
  title:{
    ...etitle,
    text:  '4. 充放电统计',
    
  },
 series: [{ type: "bar", seriesLayoutBy: 'row', }, { type: "bar", seriesLayoutBy: 'row', }],
 dataset: {
  dimensions: [
    {name: 'x', displayName: '日期', type: "time"},
    {name: 'y', displayName: '充电时长(h)'},
    {name: 'y1', displayName: '放电时长(h)'},
  ],
  source: [chargeDurationDetail.x,chargeDurationDetail.y, chargeDurationDetail.y1 ],
  sourceHeader: false,
}
} 
const aoption = {
  grid: {
    ...grid,
    top: '64px'
  },
  legend: {
    top: '32px'
  },
  title:{
    ...etitle,
    text:  '5. 空调运行时长统计',
    
  },
 series: [{ type: "bar", seriesLayoutBy: 'row', }],
 dataset: {
  dimensions: [
    {name: 'x', displayName: '日期', type: "time"},
    {name: 'y', displayName: '空调运行时长(h)'},
   
  ],
  source: [airConditionDurationDetail.x,airConditionDurationDetail.y],
  sourceHeader: false,
}
}  
const woption = {
  grid: {
    ...grid,
    top: '64px'
  },
  legend: {
    top: '32px'
  },
  title:{
    ...etitle,
    text:  '7. 告警趋势统计',
    
  },
 series: [{ type: "bar", seriesLayoutBy: 'row', }],
 dataset: {
  dimensions: [
    {name: 'x', displayName: '日期', type: "time"},
    {name: 'y', displayName: '告警次数(h)'},
   
  ],
  source: [alarmDetail.x,alarmDetail.y],
  sourceHeader: false,
}
}
const custSty = {height: '40px', color: '#515151', padding: '0 24px'}
  return (
      <>
      <Page key="a"> 
        <Main>            
          <Descriptions title="1. 项目情况" bordered column={1} contentStyle={custSty} labelStyle={{...custSty, textAlign: 'center'}}>
                      <Descriptions.Item label="项目名称">{projectName}</Descriptions.Item>
                      <Descriptions.Item label="项目地址">{projectAddress}</Descriptions.Item>
          </Descriptions>
          <DesItem title="2. 项目营收情况" bordered size='small' layout='vertical'>
                      <DesItem.Item label="储能收益">{reportData.profit}</DesItem.Item>
                      <DesItem.Item label="放电费用">{reportData.totalUnchargeFee}</DesItem.Item>
                      <DesItem.Item label="充电费用">{reportData.totalChargFee}</DesItem.Item>
                      <DesItem.Item label="放电量">{reportData.totalUncharge}</DesItem.Item>
                      <DesItem.Item label="充电量">{reportData.totalCharge}</DesItem.Item>
                      <DesItem.Item label="充放效率">{reportData.efficiency}</DesItem.Item>
          </DesItem>
           <div className='chart'>
               <Ichart {...loption} tip="2. 项目营收情况"/>
           </div>
         </Main> 
      </Page>
      <Page key="b"> 
        <Main>            
          <DesItem title="3. 充放电趋势" bordered  size="small" layout='vertical' >
                      <DesItem.Item label="放电电量">{reportData.totalUncharge}</DesItem.Item>
                      <DesItem.Item label="充电电量">{reportData.totalCharge}</DesItem.Item>
          </DesItem>
           <div className='chart'>
               <Ichart {...eoption} tip="3. 充放电趋势" />
           </div>
         </Main> 
      </Page>
      <Page key="c"> 
        <Main>            
          <div className='chart'>
               <Ichart {...boption} tip="4.充放电统计"/>
           </div>
           <div className='chart'>
               <Ichart {...aoption} tip="5.空调运行时长统计"/>
           </div>
         </Main> 
      </Page>
      <Page key="c"> 
        <Main>            
        <DesItem title="6. 告警信息" bordered size='small' layout='vertical' bgColor="#f60">
                      <DesItem.Item label="PCS告警">{reportData.pcsAlarmCount}</DesItem.Item>
                      <DesItem.Item label="电池堆告警">{reportData.batteryStackAlarmCount}</DesItem.Item>
                      <DesItem.Item label="电池簇告警">{reportData.batteryClusterAlarmCount}</DesItem.Item>

                      <DesItem.Item label="电池组告警">{reportData.batteryPackAlarmCount}</DesItem.Item>
                      <DesItem.Item label="空调告警">{reportData.airAlarmCount}</DesItem.Item>
                      <DesItem.Item label="温湿度">{reportData.tmpHumAlarmCount}</DesItem.Item>
                      <DesItem.Item label="水浸告警">{reportData.tmpHumAlarmCount}</DesItem.Item>
        </DesItem>
         <div className='chart'>
            <Ichart  {...woption} tip="7. 告警趋势统计" />
         </div>
         </Main> 
      </Page>
      </>
  )
}
 
   