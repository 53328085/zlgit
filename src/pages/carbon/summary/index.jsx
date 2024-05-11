import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Form, Image, message, Progress, Select } from 'antd'
import Pagecount from '@com/pagecontent'
import Card from './card'
 
import styled from 'styled-components'
 
import { Radiogroup, Cdivider } from "@com/comstyled"
import {enterprise} from "@redux/systemconfig"
import Titlelayout from '@com/titlelayout';
 
import Ichart from '@com/useEcharts/Ichart'
 
import Table from '@com/useTable'
import {SummarySlice,useOverviewQuery,useRealTimeQuery, useRankingQuery, useMonthQuery, useRatioQuery} from './summaryslice'
 
const Mainbox =styled.div`
  flex:1;
  display: grid;
  grid-template-rows: 128px 386px 318px;
  row-gap: 16px;
  .custTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chart {
    flex:1;
    display: flex;
    padding-top: 16px;
  }
  .up{
    display: grid;
    column-gap: 16px;
    grid-template-columns: repeat(3, 320px) 2px repeat(2, 320px) ;
  }
  .center {
     display: grid;
     grid-template-columns:1200px 464px;
     column-gap: 16px;
  }
  .down {
    display: grid;
    grid-template-columns: 769px 415px 464px;
    column-gap: 16px;
  }
`  
const options = [
  {
    label: '月',
    value: 1,
  },
  {
    label: '年',
    value: 2,
  },
];
/* 月，年。没有日 */
export default function Index() {
  const {id:enterpriseId} = useSelector(enterprise)
 // 概览数据查询
 let Quota ={}
 const {isSuccess, data: quotaData } = useOverviewQuery(enterpriseId, {
  skip: !Number.isInteger(enterpriseId)
 })
 if(isSuccess) {
  Quota = quotaData?.data ?? {}
 }

 // 实时碳排放
  let roption ={
    series: [{type: "line", seriesLayoutBy: 'row'}],
    grid: {
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
         containLabel: true,
     },
     legend: {
      show: false
    },
    dataset: { 
    }
}
  const {isSuccess: rsuc, data: realData} = useRealTimeQuery({enterpriseId, type: undefined}, {
    skip: !Number.isInteger(enterpriseId)
  })
 const [getRealData] =SummarySlice.useLazyRealTimeQuery()
 if(rsuc) {
  
   let {x=[], y=[]} = realData?.data || {}
    roption =Object.assign(roption, {
     dataset: {  dimensions: [
        {name: '日期', type: "time"},
        {name: '碳排放'}
       ],
       source: [x, y]
      }
    })
    
 }

// 碳排放排名
let dataSource=[] 
 
const columnstable = [
  {
    title: '序号',    
    width:80,
    render:(text,record,index)=>`${index+1}`
  },
  { title: '名称', dataIndex: 'name', key: 'name', align: "center", },
  { title: '碳排放(tCO₂)', dataIndex: 'value',key: 'value', align: "center", },
  { title: '占比', dataIndex: 'proportion', key: 'proportion',align: "center", },
]

const {isSuccess: rksuc, data: rankingData} = useRankingQuery({enterpriseId, type: 1}, {
  skip: !Number.isInteger(enterpriseId)
})
const [getRankingData] =SummarySlice.useLazyRankingQuery() 
if(rksuc) {
   dataSource=rankingData?.data??[]
}

 // 月度碳排放
const {isSuccess: msuc, data: monthData} =useMonthQuery(enterpriseId, {
  skip: !Number.isInteger(enterpriseId)
})

console.log(monthData)
let moption ={
  color: ["#ff7345","#6a6e88"],
  series: [{type: "bar", stack:"total", seriesLayoutBy: 'row'},{type: "bar", stack:"total", seriesLayoutBy: 'row'}],
  grid: {
      right: 0,
      left: 0,
      top: "16px",
      bottom: 0,
       containLabel: true,
   },
   legend: {
     top: "0px",
     icon:'rect',
     right: "32px"
  },
  dataset: { 
  }
}
if(msuc) {
  let {x=[], y=[], y1=[]} = monthData?.data ?? {}
  moption.dataset = {
    dimensions: [
      {name: '时间', type: "time"},
      {name: '间接排放'},
      {name: '直接排放'}
     ],
     source: [x, y, y1]
  }

}
// 碳排占比
const {isSuccess: rasuc, data: ratioData} = useRatioQuery({enterpriseId, type: 1}, {
   skip: !Number.isInteger(enterpriseId)
})


 
 

 
 
 
 
 

 

 

 const Ctitle = (
  <div className='custTitle'>
     <span>实时碳排放(tCO₂)</span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={(e) => {
                    getRealData({enterpriseId, type: e.target.value})
                  }} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )
 const Rtitle = (
  <div className='custTitle'>
     <span>碳排放排名</span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={(e) => {
                    getRankingData({enterpriseId, type: e.target.value})
                  }} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )

 const Raitle = (
  <div className='custTitle'>
     <span>碳排占比</span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={(e) => {
                    getRankingData({enterpriseId, type: e.target.value})
                  }} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )

  return (
    <Pagecount bgcolor="#eeeff3" pd={0}>
      <Mainbox>
      <div className='up' key="up">
           <Card name="年度配额 (tCO₂)" bgcolor='#333399'  title="" value={Quota.annualQuota} yoy={Quota.annualQuotaYoy} key="a"/> 
           <Card name="年度排放当量(tCO₂)" bgcolor='#0066CC'  title="" value={Quota.annualEmissionEquivalent} yoy={Quota.annualEmissionEquivalentYoy} key="b" /> 
           <Card title="年度剩余碳排放额(tCO₂)" bgcolor='#006699'  value={Quota.annualResidualCarbonEmission} yoy={Quota.annualResidualCarbonEmissionPercent} key="c"/>
           <Cdivider type="h" borderColor="#bcbcbc" />
           <Card title="直接排放(tCO₂)" bgcolor='#6633CC'   value={Quota.directEmission} yoy={Quota.directEmissionPercent} key="d" />
           <Card title="间接排放(tCO₂)" bgcolor='#660099'   value={Quota.indirectEmission} yoy={Quota.indirectEmissionPercent} key="e" />
      </div>
      <div className='center' key="center">
        
          <Titlelayout title={Ctitle} layout="flex" key="real">
            <div className='chart'>
                <Ichart {...roption} /> 
            </div>
          </Titlelayout>        
          <Titlelayout title={Rtitle}  key="rank">
            <div className='chart'>  
                <Table columns={columnstable} className="tablestyle" rowKey={(columns) => columns.key} dataSource={dataSource} scroll={{
                  y: 300,
                }} />
            </div>

          </Titlelayout>
      </div>
      <div className='down' key="down">
          <Titlelayout title="月度碳排放(tCO₂)" layout="flex" >
            <div className='chart'>
              <Ichart {...moption}/>
            </div>
          </Titlelayout>

        
          <Titlelayout title="碳排占比" >
            <div className='chart'>
               
            </div>

          </Titlelayout>

        
          <Titlelayout title="分类能耗" >
          
          </Titlelayout>

      </div>
      </Mainbox>
    </Pagecount>

  )
}
