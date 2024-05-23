import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Form, Image, message, Progress, Select } from 'antd'
import Pagecount from '@com/pagecontent'
import Card from './card'
import {isObject} from "@com/usehandler"
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
  const [roption, setRoption] =useState({
    series: [{type: "line", seriesLayoutBy: 'row'}],
    grid: {
        right: 0,
        left: 0,
        top: '16px',
        bottom: 0,
         containLabel: true,
     },
     legend: {
      show: false
    },
    dataset: { 
    }
})
 
 const [getRealData] =SummarySlice.useLazyRealTimeQuery()
 const onGetRealData =async (e) => {
    let type = e ? e.target.value : 1;
    let {success, data, errMsg} = await  getRealData({enterpriseId, type}).unwrap()
    console.dir(data)
    if(success && isObject(data)) {
      let {x=[], y=[]} = data
      setRoption({
        ...roption,
        dataset: { dimensions: [
          {name: '日期', type: "time"},
          {name: '碳排放'}
         ],
         source: [x, y]
        }
      })

    }else {
      setRoption({
        ...roption,
        dataset: { dimensions: [],
         source: []
        }
      })
      if(!success) message.warning(errMsg || '数据出错')
    }
 }

 

// 碳排放排名
const [dataSource, setDataSourc]=useState([])
 
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

const [getRankingData] =SummarySlice.useLazyRankingQuery() 

const OnGetRankingData = async (e) => {
   let type = e ? e.target.value : 1;
   let {success, data,errMsg} = await getRankingData({enterpriseId, type}).unwrap()
   if(success && Array.isArray(data)) {
     setDataSourc(data)
     
   }else {
     if(!success) message.warning(errMsg || '数据出错')
    setDataSourc([])
   }
   
}

 // 月度碳排放
const {isSuccess: msuc, data: monthData} =useMonthQuery({enterpriseId, type: 1}, {
  skip: !Number.isInteger(enterpriseId)
})

let moption ={
  color: ["#ff7345","#6a6e88"],
  series: [{type: "bar", stack:"total", seriesLayoutBy: 'row'},{type: "bar", stack:"total", seriesLayoutBy: 'row'}],
  grid: {
      right: 0,
      left: 0,
      top: "32px",
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
const [poptions, setPoptions] = useState({
  type: 3,
  pieData: { data: [], total: "100%", radius: ["40%",  "50%"],  center: ['50%', '50%']},
  legend: {
    bottom: 5,
    top: 'auto'
  },
 
})

const  [getRationData] =  SummarySlice.useLazyRatioQuery()
const onGetRationData = async (e) => {
  let type = e ? e.target.value : 1;
  let {success, data,errMsg} = await getRationData({enterpriseId, type}).unwrap()
  console.log(data)
  if(success && Array.isArray(data) && data.length > 0) {
    setPoptions({
      ...poptions,
      pieData: {
        ...poptions.pieData,
        data,
      }
    })
    
  }else {
    if(!success) message.warning(errMsg || '数据出错')
    setPoptions({
      ...poptions,
      pieData: {
        ...poptions.pieData,
        data:[],
      }
    })
  }

}
// 分类能耗
const [getEnergy] =SummarySlice.useLazyEnergyQuery()
const onGetEnergy = async (e) => {
  let type = e ? e.target.value : 1;
  let {success, data,errMsg} = await getEnergy({enterpriseId, type}).unwrap()
  console.log(data)
}


useEffect(() => {
  if(Number.isInteger(enterpriseId))  {
    OnGetRankingData()  // 碳排放排名
    onGetRealData() // 实时碳排放
    onGetRationData() // 碳排占比
    onGetEnergy() // 分类能耗
  }

}, [enterpriseId]) 

 const Ctitle = (
  <div className='custTitle'>
     <span>实时碳排放(tCO₂)</span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={(e) => {
                    onGetRealData(e)
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
                  onChange={(e) =>OnGetRankingData(e)} 
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
                      onGetRationData(e)
                  }} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )
 const CItitle = (
  <div className='custTitle'>
     <span>分类能耗占比</span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={(e) => {
                    onGetEnergy(e)
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
          <Titlelayout title={Raitle} layout="flex" >
            <div className='chart'>
              <Ichart {...poptions} />
            </div>

          </Titlelayout>        
          <Titlelayout title={CItitle} >
          
          </Titlelayout>

      </div>
      </Mainbox>
    </Pagecount>

  )
}
