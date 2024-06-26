import React, { useEffect, useState, useRef, useMemo } from 'react'
import Pagecount from '@com/pagecontent'
import Card from './card'
import styled from 'styled-components'
import { useAntdTable } from 'ahooks';
import Titlelayout from '@com/titlelayout';
import {cloneDeep} from 'lodash' 
import Ichart from '@com/useEcharts/Ichart';
import UseTable from '@com/useTable'
import {Carbon} from '@api/api'
import {useOutletContext} from 'react-router-dom'
import {isObject} from "@com/usehandler"
import { message } from 'antd';
import {CustTransO, i18warning, i18t} from "@com/useButton"
import { 
  useAnnualQuery,
  useAnalysisQuery,
  useEmissionDataQuery,} from '@redux/carbon'
const {QueryAnnualData, QueryMonthlyAnalysis, QueryEmissionData} = Carbon

const Mainbox = styled.div`
  && {
    flex: 1;
    display: grid;
    grid-template-rows: 92px 472px 208px;
    row-gap: 16px;
    .flexuse {
      display: grid;
      grid-template-columns: repeat(5, 324px);
      justify-content: space-between;
    }
    .chartbox {
      flex: 1;
      display: flex;
      margin: 16px -16px -16px -16px;
      background-image: linear-gradient(to right, rgb(16,32,61), rgb(4,53,102),rgb(16,32,61)); 
      display: flex;
       padding-top: 16px;
       flex-direction: column;
       .ant-table.ant-table-small .ant-table-container .ant-table-tbody .ant-table-row .ant-table-cell {
         padding: 0;
       }
      
    }
    .tablebox {
      flex: 1;
      display: flex;
      padding-top: 16px;
      flex-direction: column;
      justify-content: space-between;
      .tip {
        display: flex;
        column-gap: 64px;
       }
    }
  }

`
const Custcul =({text,record, i}) => { 
  const {carbonMonthlyQuota, carbonMonthlyTarget} = record?.['carbonMonthlyDataList']?.[i]
  const bg = parseFloat(text) > carbonMonthlyQuota ? {backgroundColor: "#ff5f60", color: "#fff", padding: '4px'} : parseFloat(text) > carbonMonthlyTarget ? {backgroundColor:"#fc3", color: "#515151", padding: '4px'} : {padding: '4px'};
  return <div style={bg}>{text}</div>
}
export default function Index() {
  let {exparams, enterpriseId, iszh} = useOutletContext()   
  let {carbonY} = exparams
  //const [annualData, setAnnualData] = useState({})

  const  roption= useRef({
    series: [{type: "line", seriesLayoutBy: 'row', areaStyle: null, showSymbol: true, itemStyle: {
      color: "#63d98a"
    }},
     {type: "line", seriesLayoutBy: 'row',  areaStyle: null,showSymbol: true, itemStyle: {
      color: "#248fff"
     }},
     {type: "bar", seriesLayoutBy: 'row', itemStyle: {
      color: "#6fe392",
      
     }},
     {type: "bar", seriesLayoutBy: 'row', itemStyle: {
      color: "#f3cd61"
     }}, 
     {type: "bar", seriesLayoutBy: 'row', itemStyle: {
      color: "#ff6061"
     }}
    ],
    xAxis: {
      axisLabel: {
       interval: 0,
        textStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      }
    },
    grid: {
        right: 0,
        left: 16,
        top: "32px",
        bottom: "32px",
         containLabel: true,
         
     },
     legend: {
     // icon:'rect',
      bottom: "8px",
     itemWidth:36,
     itemHeight: 16,
   
     data: [
     {name:  i18t('carbon','Monthlyquota') , icon: "circle"},
     {name: i18t('carbon','Monthlytargetvalue'),icon: "circle"},
      {name: i18t('carbon','Monthlyemissions'), icon: 'roundRect'},
      {name: i18t('carbon','abovetarget'), icon: 'roundRect'},
      {name:i18t('carbon','overquota'),icon: 'roundRect'}
     ],
      textStyle: {
        color: "#fff"
      },
    },

    dataset: { 
    }
})
 
// 碳排年度数据
let annualData = useRef({})
let year = carbonY?.year()
let comparam = {
  enterpriseId,
  year
}
const {isSuccess: anusuc, data: anuData} = useAnnualQuery(comparam, {
  skip: !(Number.isInteger(comparam.enterpriseId) && comparam.year)
})
if(anusuc) {
  let {success, data, errMsg} = anuData
 
  if(success && isObject(data) ) {
    annualData.current = data
  }else {
    if(!success) i18warning(errMsg)
    annualData.current ={}
  }
}else {
  annualData.current ={}
}


// 碳排月度数据

/* const {isSuccess: monsuc, data: monData} = useAnalysisQuery(comparam, {
  skip: !(Number.isInteger(comparam.enterpriseId) && comparam.year)
}) */

const getMonthData =async () =>{
  try {

 let {success, data, errMsg} = await QueryMonthlyAnalysis(enterpriseId, year )

 if(success && isObject(data)) {
   
   let {x=[], y: yy=[], y1=[], y2=[]} = cloneDeep(data);  
   let len = x.length
   let y3 =new Array(len).fill(0),  y4 = new Array(len).fill(0);  // y4 超配额， y3超目标
   y2.forEach((value,index) => {   
    if(parseFloat(value) > parseFloat(yy[index])) {
      y4[index] =value
       y2[index] =0
     //  y2.splice(index, 1, 0)
      return
    }else if(parseFloat(value) >parseFloat(y1[index])) {      
       y3[index] =value
       y2[index] =0
    }

   })
/*    for(let [index, value] of y2.entries()) {
    console.log(index)
      if(parseFloat(value) > parseFloat(yy[index])) {
        y4.splice(index, 1, value)
       
        y2.splice(index, 0, 0)
        continue
      }else if(parseFloat(value) >parseFloat(y1[index])) {
         console.log(index)
         y3.splice(index, 1, value)
         y2.splice(index, 0, 0)
      }
   } */
  /*   {name:  i18t('carbon','Monthlyquota') , icon: "circle"},
     {name: i18t('carbon','Monthlytargetvalue'),icon: "circle"},
      {name: i18t('carbon','Monthlyemissions'), icon: 'roundRect'},
      {name: i18t('carbon','abovetarget'), icon: 'roundRect'},
      {name:i18t('carbon','overquota'),icon: 'roundRect'} */
   roption.current = ({
    ...roption.current,
    dataset: {
      ...roption.current.dataset,
      dimensions: [
        {name: '日期', displayName: '日期', type: "time"},
        {name: '月度配额', displayName: i18t('carbon','Monthlyquota'),},
        {name: '月度目标值', displayName: i18t('carbon','Monthlytargetvalue'),},
        {name: '月度排放量', displayName: i18t('carbon','Monthlyemissions'),},
        {name: '月度排放量(超目标)', displayName: i18t('carbon','abovetarget'),},
        {name: '月度排放量(超预配额)', displayName: i18t('carbon','overquota'),},
      ],
      source: [x, yy, y1, y2, y3, y4],
      sourceHeade: false,
    }
   })
}else {
  if(!success) i18warning(errMsg)
}
    
} catch (error) {
   console.log(error)
}
}
useEffect(() => {
   if(enterpriseId && year) {
    getMonthData()
   }

}, [enterpriseId, year])

 /*  const getAnnual = async () => {
    try {
      let year = carbonY.year()
      let promise =[QueryAnnualData(enterpriseId, year),  QueryMonthlyAnalysis(enterpriseId, year)] 
      let [{value: {success: asuc, data: AnnualData, errMsg: aerr}}
        ,{value: {success: msuc, data:monthlyData, errMsg: merr}} ] = await Promise.allSettled(promise)
      if(asuc && isObject(AnnualData) ) {
        setAnnualData(AnnualData)
      }else {
        if(!asuc) message.warning(aerr || '数据出错')
        setAnnualData({})
      }
      if(msuc && isObject(monthlyData)) {
         let {x=[], y=[], y1=[], y2=[]} = monthlyData;
         console.log(x)
         console.log(y)
         console.log(y1)
         console.log(y2)
         let len = x.length
         let y3 =new Array(len).fill(0),  y4 = new Array(len).fill(0);  // y4 超配额， y3超目标
         for(let [index, value] of y2.entries()) {
            if(parseFloat(value) > parseFloat(y[index])) {
              y4.splice(index, 1, value)
              y2.splice(index, 1, '-')
              continue
            }else if(parseFloat(value) >parseFloat(y1[index])) {
               y3.splice(index, 1, value)
               y2.splice(index, 1, '-')
            }
         }
         console.log(y3)
         console.log(y4)
         setRoption({
          ...roption,
          dataset: {
            ...roption.dataset,
            dimensions: [
              {name: '日期', displayName: '日期', type: "time"},
              {name: '月度配额', displayName: '月度配额',},
              {name: '月度目标值', displayName: '月度目标值',},
              {name: '月度排放量', displayName: '月度排放量',},
              {name: '月度排放量(超目标)', displayName: '月度排放量(超目标)',},
              {name: '月度排放量(超预配额)', displayName: '月度排放量(超预配额)',},
            ],
            source: [x, y, y1, y2, y3, y4],
            sourceHeade: false,
          //  
          }
         })
      }

    } catch (error) {
      console.log(error)
    }
  
   
  } */
  const [tableData, setTableData] = useState([])
  const getTableData = async ({current, pageSize }) => {
     if(Number.isInteger(enterpriseId) && carbonY) {
      let params = {
        enterpriseId,
        year:carbonY.year(),
        pageNum: current,
        pageSize
      }
      return QueryEmissionData(params).then(res => {
         let {success, errMsg, data, total} = res;
         if(success && isObject(data)) {
           let {carbonEmissionDataTable} = data
           if(Array.isArray(carbonEmissionDataTable) && carbonEmissionDataTable.length > 0) {
          
            carbonEmissionDataTable.forEach(car => {
               let  {carbonMonthlyDataList} = car
               if(Array.isArray(carbonMonthlyDataList)) {
                carbonMonthlyDataList.forEach(m => {
                   car[m.month] = m.carbonMonthlyEmission
                })
               }
            })
            setTableData(carbonEmissionDataTable)
            return  {
              list: carbonEmissionDataTable,
              total: 0
            }  
           }else {
            carbonEmissionDataTable([])
            return {
              list: [],
              total: 0
            }  
           }

         }else {
          if(!success) i18warning(errMsg)
          carbonEmissionDataTable([])
          /*   return {
              list: [],
              total: 0
            } */

         }


      })
    }

  }
 const {tableProps} = useAntdTable(getTableData, {
    refreshDeps: [enterpriseId, carbonY]
  })
  useEffect(() => {
    if(carbonY && Number.isInteger(enterpriseId)) {
     // getAnnual()

    }

  }, [carbonY, enterpriseId])
 

  const columnstable = [
    { title: i18t("comm", 'index'), dataIndex: 'key',width: 48, align: "center", render: (text, _,index) => <>{index +1}</>},
    { title: i18t("carbon", "carbonquota"), dataIndex: 'carbonQuotaItem', key: 'carbonQuotaItem', width: 210,ellipsis: true, align: "center", },
    { title: i18t("carbon", "totalAnnualQuota"), dataIndex: 'totalAnnualQuota',width: 96, key: 'totalAnnualQuota',ellipsis: true,align: "center", },
    { title: i18t("carbon", "totalAnnualTarget"), dataIndex: 'totalAnnualTarget',width: 96,key: 'totalAnnualTarget',ellipsis: true, align: "center", },
    { title: i18t("carbon", "cumEmissionEquivalent"), dataIndex: 'cumEmissionEquivalent',key: 'cumEmissionEquivalent',ellipsis: true, align: "center", },
    { title: i18t("carbon", "remainEmissionQuota"), dataIndex: 'remainEmissionQuota', key: 'remainEmissionQuota',ellipsis: true, align: "center", },
    { title: i18t("carbon", "remainEmissionTarget"), dataIndex: 'remainEmissionTarget',key: 'remainEmissionTarget',ellipsis: true, align: "center", },
     ...Array.from({length: 12}, (v, i) => {
      return {
         title:  i18t("comm", (i+1).toString()),
         dataIndex: i+1,
         key: i+1,
         width: 76,
         ellipsis: true,
         render: (text, record, index) =>  <Custcul record={record} text={text} i={i} />

      }
 
 
   })
  ]
  return (

    <Pagecount bgcolor="#eeeff3" pd={0}>
        <Mainbox>
        <div className='flexuse'>
          <Card title={<CustTransO ns="carbon" text="totalAnnualQuota" param="(tCO₂)" />} numberval={annualData.current.totalAnnualQuota} key="quota"/>
          <Card title={<CustTransO ns="carbon" text="totalAnnualTarget" param="(tCO₂)" />} numberval={annualData.current.totalAnnualTarget} key="target"/>
          <Card title={<CustTransO ns="carbon" text="cumEmissionEquivalent" param="(tCO₂)" />} numberval={annualData.current.cumEmissionEquivalent} key="equ"/>
          <Card title={<CustTransO ns="carbon" text="Remainingemissionsfromthetotalpre-quota" param="(tCO₂)" />} bgcolor='#333399' numberval={annualData.current.remainEmissionQuota} key="remain"/>
          <Card title={<CustTransO ns="carbon" text="Remainingemissionsfromtotaltarget" param="(tCO₂)" />} bgcolor='#333399' numberval={annualData.current.remainEmissionTarget} key="remainTarget"/>
        </div>
     
     
       
          <Titlelayout title={<CustTransO ns="carbon" text="Monthlyanalysis" param="(tCO₂)" />} layout="flex" bgcolor="#14223e" bg="#14223e" fc="#fff"  key="chart">
              <div  className='chartbox'>
                <Ichart {...roption.current} />
              </div>
          </Titlelayout>

        
        
          <Titlelayout title={<CustTransO ns="carbon" text="Carbonemissiondata" param="(tCO₂)" />} layout="flex" key="table">
            <div className='tablebox'>
            <UseTable columns={columnstable} istheme hc="#fff" dataSource={tableData} /> 
                <div className='tip'>
                  <p>
                    <span style={{backgroundColor:'#FFCC33',width:'24px',height:'10px',color:'#FFCC33',marginRight:'16px'}}>123456</span>
                    <span><CustTransO ns="carbon" text="superscalar"   /></span>
                  </p>
                  <p>
                    <span style={{backgroundColor:'#FF5F60',width:'24px',height:'10px',color:'#FF5F60',marginRight:'16px'}}>123456</span>
                    <span><CustTransO ns="carbon" text="superpreconfiguration"   /></span>
                  </p>
                </div>
            </div>
          </Titlelayout>

        
        </Mainbox>
    </Pagecount>
  )
}
