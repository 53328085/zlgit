import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Form, Image, message, Progress, Select, Typography } from 'antd'
import Pagecount from '@com/pagecontent'
import Card from './card'
import {isObject} from "@com/usehandler"
import {CustTransO, i18t, i18warning} from "@com/useButton"
import styled , {css} from 'styled-components'
 
import { Radiogroup, Cdivider } from "@com/comstyled"
import {enterprise,selectProjectId,adaptation} from "@redux/systemconfig"
import Titlelayout from '@com/titlelayout';
import imgsrcs from "@imgs"
import Ichart from '@com/useEcharts/Ichart'
 
import Table from '@com/useTable'
import {carbonSlice, useOverviewQuery,useRealTimeQuery, useRankingQuery, useMonthQuery, useRatioQuery, useProjectPhotoQuery, useEnergyQuery} from '@redux/carbon'
 
const {Text} = Typography
const sty = css`
.up {
  grid-template-columns: repeat(5, 1fr)  ;
}
.center {
  grid-template-columns: repeat(3, 1fr);
}
.down {
  grid-template-columns: 3fr 1fr;
}
`

const Mainbox =styled.div`
  flex:1;
  display: grid;
  grid-template-rows: 112px minmax(400px, 1fr) minmax(320px, 1fr);
  row-gap: 16px;
  overflow: hidden;
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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) ;
    
  }
  .center {
     display: grid;
     grid-template-columns:656px 544px 448px;
     column-gap: 16px;
     .imgbox {
      background-color: ${props => props.theme.primaryderived};
      display: flex;
      align-items: center;
    //  height:100%;
      img {
       max-width: 100%;
        
      }
     
     }
  }
  .down {
    display: grid;
    grid-template-columns: 1216px 448px;
    column-gap: 16px;
   // height: 320px;
      .wrap {
        margin-top: 16px;
        height: 254px;
        width: 100%;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
        .content {
         min-height:254px;
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
         p {
        background-color: #E4F4FF;
        display: grid;
        height: 50px;
        grid-template-columns: repeat(4, 1fr);
        justify-items: center;
        align-items: center;
        &:nth-of-type(2n) {
          background-color: #f4f7ff;
        }
      }

       }

      }
      .wrap::-webkit-scrollbar {
      display: none;
      
      }
  }
  ${props => props.laptop ? sty : null}
`  
const options = [
  {
    label: i18t("comm","month"),
    value: 1,
  },
  {
    label: i18t("comm","year"),
    value: 2,
  },
];





/* 月，年。没有日 */
export default function Index() {
  const {enterpriseId} = useSelector(enterprise)
  let {laptop} = useSelector(adaptation)
 // 概览数据查询
 let Quota ={}
 const {isSuccess, data: quotaData } = useOverviewQuery(enterpriseId, {
  skip: !Number.isInteger(enterpriseId)
 })
 if(isSuccess) {
  Quota = quotaData?.data ?? {}
 }


 // 获取园区图片

const projectId =useSelector(selectProjectId)
let projectImg =useRef()

const {isSuccess: imgsuc, data: imgData, refetch } = useProjectPhotoQuery(projectId, {
  skip: !Number.isInteger(projectId),
  refetchOnMountOrArgChange: true,
 })
 
 if(imgsuc) {
  projectImg.current = imgData ?? null
 }

  

 

// 碳排放排名
const  dataSource = useRef([])
 
const columnstable = [
  {
    title: i18t("comm", "index"),    
    width:80,
    render:(text,record,index)=>`${index+1}`
  },
  { title: i18t("comm", "name"), dataIndex: 'name', key: 'name', align: "center", },
  { title: i18t("carbon", "Carbonratio", {param: '(tCO₂)'}), dataIndex: 'value',key: 'value', align: "center", },
  { title: i18t("comm", "ratio"), dataIndex: 'proportion', key: 'proportion',align: "center", },
]

const [rankparam, setRankParam] = useState({enterpriseId, type: 1})
const  {isSuccess: ranksuc, data: rankData} =useRankingQuery(rankparam, {
  skip: !Number.isInteger(rankparam.enterpriseId)
}) 
 
 if(ranksuc) {
  let {success, data,errMsg} =  rankData
  if(success && Array.isArray(data)) {
    dataSource.current = data
    
  }else {
    if(!success) i18warning(errMsg)
    dataSource.current = data
  }

 }else {
  dataSource.current = []
 }
 


 // 月度碳排放
const [montharg, setMontharg] = useState({
  enterpriseId,
  type: 1,
})

const monthchange =(e) => {
   setMontharg({
   ...montharg,
   type: e.target.value
   })
}
const {isSuccess: msuc, data: monthData} =useMonthQuery(montharg, {
  skip: !Number.isInteger(montharg.enterpriseId)
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
      {name: i18t("comm","time"), type: "time"},
      {name: i18t("carbon","directe", {param: ''})},
      {name: i18t("carbon","indirecte", {param: ''})},
     ],
     sourceHeader: false,
     source: [x, y, y1]
  }

}
// 碳排占比
const poptions = useRef({
  type: 3,
  pieData: { data: [], total: "100%", radius: ["50%",  "65%"],  center: ['50%', '50%']},
  legend: {
    bottom: 5,
    top: 'auto'
  },
 
})
const [ratioparm, setRatioparm] = useState({enterpriseId, type: 1})

const {isSuccess:ratiosuc, data:ratiodata} = useRatioQuery(ratioparm, {
  skip:!Number.isInteger(ratioparm.enterpriseId),
})
 
if(ratiosuc) {
  let {success, data,errMsg} = ratiodata
  if(success && Array.isArray(data) && data.length > 0) {
    poptions.current = ({
     ...poptions.current,
      pieData: {
        ...poptions.current.pieData,
        data,
      }
    })
    
  }else {
    if(!success) i18warning(errMsg)
    poptions.current = ({
      ...poptions.current,
       pieData: {
         ...poptions.current.pieData,
         data: [],
       }
     })
  }

}
 
 
// 分类能耗
const [classarg, setClassarg] = useState({
  enterpriseId,
  type: 1,
})
let ClassEData =[]
const classChange = (e) => {
  setClassarg({
    ...classarg,
    type: e.target.value
  })
}
const  {isSuccess: classSuc, data: classData} =useEnergyQuery(classarg, {
  skip: !Number.isInteger(classarg.enterpriseId)
})
if(classSuc) {
  ClassEData = classData?.data ?? []
}
 

 

/*  const Ctitle = (
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
 ) */
 const Rtitle = (
  <div className='custTitle'>
     <span><CustTransO text="Carboner" ns="carbon" /></span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={(e) => setRankParam({...rankparam, type: e.target.value})} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )
 
 const Raitle = (
  <div className='custTitle'>
     <span><CustTransO text="Carbonratio" ns="carbon" /></span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={(e) => {                   
                    setRatioparm({...ratioparm, type: e.target.value})
                  }} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )
 const CItitle = (
  <div className='custTitle'>
     <span><CustTransO text="Classificationratio" ns="carbon" /></span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={classChange} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )

 const Mtitle = (
  <div className='custTitle'>
     <span><CustTransO text="Classificationratio" ns="carbon" param="(tCO₂)" /></span>
     <Radiogroup options={options}
                  defaultValue={1}
                  onChange={monthchange} 
                  optionType="button"
                  buttonStyle="solid" /> 
  </div>
 )

 // 文字滚动
 const [isScrolle, setIsScrolle] = useState(true);
 const speed = 30;
 const contentref= useRef()
 const contentref2= useRef()
 const wrapref = useRef()
 const hoverHandler = (flag) => setIsScrolle(flag);


 useEffect(() => {   
  if(ClassEData?.length < 6) {
    wrapref.current.scrollTop = 0
    contentref2.current.style.display="none"
    contentref2.current.innerHTML =''
    return 
  }  
  contentref2.current.style.display="flex"
  contentref2.current.innerHTML = contentref.current.innerHTML;
  let timer;
  if (isScrolle) {
    timer = setInterval(
      () => wrapref.current.scrollTop >= contentref.current.scrollHeight ? (wrapref.current.scrollTop = 0) : wrapref.current.scrollTop++
      ,
      speed
    );
    }
  return () => {    
    clearInterval(timer)
  }

 }, [isScrolle, ClassEData])

  return (
    <Pagecount bgcolor="#eeeff3" pd={0}>
      <Mainbox laptop={laptop}>
      <div className='up' key="up" >
           <Card name={<CustTransO ns="carbon" text="annualquota" param="(tCO₂)" />} laptop={laptop}   title="" value={Quota.annualQuota} yoy={Quota.annualQuotaYoy} key="a"/> 
           <Card name={<CustTransO ns="carbon" text="Annualee" param="(tCO₂)" />} laptop={laptop}  title="" value={Quota.annualEmissionEquivalent} yoy={Quota.annualEmissionEquivalentYoy} key="b" /> 
           <Card title={<CustTransO ns="carbon" text="Annualce" param="(tCO₂)" />} laptop={laptop}  value={Quota.annualResidualCarbonEmission} yoy={Quota.annualResidualCarbonEmissionPercent} key="c"/>
          {/*  <Cdivider type="h" borderColor="#bcbcbc" /> */}
           <Card title={<CustTransO ns="carbon" text="directe" param="(tCO₂)" />} laptop={laptop}   value={Quota.directEmission} yoy={Quota.directEmissionPercent} key="d" />
           <Card title={<CustTransO ns="carbon" text="indirecte" param="(tCO₂)" />} laptop={laptop}   value={Quota.indirectEmission} yoy={Quota.indirectEmissionPercent} key="e" />
      </div>
      <div className='center' key="center">
        <div className='imgbox'>
          <img src={projectImg.current || imgsrcs['carbon']} alt="" />
        </div>
       
       
          <Titlelayout title={Rtitle}  key="rank">
            <div className='chart'>  
                <Table columns={columnstable} className="tablestyle" rowKey={(columns) => columns.key} dataSource={dataSource.current} scroll={{
                  y: 300,
                }} />
            </div>

          </Titlelayout>
          <Titlelayout title={Raitle} layout="flex" >
            <div className='chart'>
              <Ichart {...poptions.current} />
            </div>

          </Titlelayout>    
      </div>
      <div className='down' key="down">
          <Titlelayout title={Mtitle} layout="flex" >
            <div className='chart'>
              <Ichart {...moption}/>
            </div>
          </Titlelayout>        
             
          <Titlelayout title={CItitle} layout="flex">
                <div className='wrap' ref={wrapref}>
                  <div className="content" ref={contentref}>
                     {ClassEData?.map(d => (<p onMouseOver={() => hoverHandler(false)}
                        onMouseLeave={() => hoverHandler(true)}><Text ellipsis={{tooltip: d.name}}>{d.name}</Text><Text ellipsis={{tooltip:d.value}}>{d.value}</Text><Text ellipsis={{tooltip:d.unit}}>{d.unit}</Text><Text ellipsis={{tooltip:d.proportion}}>{d.proportion}</Text></p>))}
                 </div>
                 <div className='content' ref={contentref2}></div>
              </div>
              
          </Titlelayout>

      </div>
      </Mainbox>
    </Pagecount>

  )
}
