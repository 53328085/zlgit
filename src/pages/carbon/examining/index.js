import React, { useEffect, useState, useRef, useMemo } from 'react'
import Pagecount from '@com/pagecontent'
import Card from './card'
import styled from 'styled-components'
import { useAntdTable } from 'ahooks';
import Titlelayout from '@com/titlelayout';
import { drawEcharts } from '@com/useEcharts'
import Ichart from '@com/useEcharts/Ichart';
import Table from '@com/useTable'
import {Carbon} from '@api/api'
import {useOutletContext} from 'react-router-dom'
import {isObject} from "@com/usehandler"
import { message } from 'antd';
const {QueryAnnualData, QueryMonthlyAnalysis, QueryEmissionData} = Carbon
const Mainbox = styled.div`
  && {
    flex: 1;
    display: grid;
    grid-template-rows: 92px 325px 355px;
    row-gap: 16px;
    .flexuse {
      display: grid;
      grid-template-columns: repeat(5, 324px);
      justify-content: space-between;
    }
    .chartbox {
      flex: 1;
      display: flex;
    }
    .tablebox {
      display: flex;
       padding-top: 16px;
       flex-direction: column;
       .tip {
        display: flex;
        column-gap: 64px;
       }
    }
  }

`

export default function Index() {
  let {exparams, enterpriseId} = useOutletContext()   
  let {carbonY} = exparams
  const [annualData, setAnnualData] = useState({})

  const [roption, setRoption] =useState({
    series: [{type: "line", seriesLayoutBy: 'row'},{type: "line", seriesLayoutBy: 'row'},{type: "bar", seriesLayoutBy: 'row'}],
    xAxis: {
      axisLabel: {
        interval: 'auto',
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
        left: 0,
        top: "32px",
        bottom: "32px",
         containLabel: true,
     },
     legend: {
      icon:'rect',
      bottom: "0px",
      textStyle: {
        color: "#fff"
      },
      data: [
        {

        }
      ]
    },
    dataset: { 
    }
})
 
  const getAnnual = async () => {
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
         let {x, y, y1, y2} = monthlyData
         setRoption({
          ...roption,
          dataset: {
            dimensions: [
              {name: '日期', type: "time"},
              {name: '月度配额'},
              {name: '月度目标值'},
              {name: '月度排放量'}
            ],
            source: [x, y, y1, y2],
            sourceHeade: false
          }
         })
      }

    } catch (error) {
      
    }
  
   
  }
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
               let  {monthlyEmission} = car
               if(Array.isArray(monthlyEmission)) {
                monthlyEmission.forEach(m => {
                   car[m.month] = m.carbonMonthlyEmission
                })
               }
            })
            return  {
              list: carbonEmissionDataTable,
              total: 0
            }
           }else {
            return {
              list: [],
              total: 0
            }
           }

         }else {
            return {
              list: [],
              total: 0
            }

         }


      })
    }

  }
 const {tableProps} = useAntdTable(getTableData, {
    refreshDeps: [enterpriseId, carbonY]
  })
  useEffect(() => {
    if(carbonY && Number.isInteger(enterpriseId)) {
      getAnnual()

    }

  }, [carbonY, enterpriseId])
 
 
  const columnstable = [
    { title: '序号', dataIndex: 'key',width: 48, align: "center", render: (text, _,index) => <>{index +1}</>},
    { title: '碳配额项', dataIndex: 'carbonQuotaItem', key: 'carbonQuotaItem', width: 210,ellipsis: true, align: "center", },
    { title: '年度总预配额', dataIndex: 'cumEmissionEquivalent',width: 96, key: 'cumEmissionEquivalent',align: "center", },
    { title: '年度总目标值', dataIndex: 'totalAnnualTarget',width: 96,key: 'totalAnnualTarget', align: "center", },
    { title: '累计排放量', dataIndex: 'totalAnnualQuota',key: 'totalAnnualQuota', align: "center", },
    { title: '距预配剩余', dataIndex: 'remainEmissionQuota', key: 'remainEmissionQuota', align: "center", },
    { title: '距目标剩余', dataIndex: 'remainEmissionTarget',key: 'remainEmissionTarget', align: "center", },
     ...Array.from({length: 12}, (v, i) => {
      return {
         title: `${i+1}月`,
         dataIndex: i+1,
         key: i+1,
         width: 76,
         ellipsis: true
      }
 
 
   })
  ]
  return (

    <Pagecount bgcolor="#eeeff3" pd={0}>
        <Mainbox>
        <div className='flexuse'>
          <Card title="年度总配额 (tCO₂)" numberval={annualData.totalAnnualQuota} key="quota"/>
          <Card title="年度总目标值 (tCO₂)" numberval={annualData.totalAnnualTarget} key="target"/>
          <Card title="累计排放当量 (tCO₂)" numberval={annualData.cumEmissionEquivalent} key="cum"/>
          <Card title="距总预配额剩余排放量 (tCO₂)" bgcolor='#333399' numberval={annualData.remainEmissionQuota} key="cum"/>
          <Card title="距总目标剩余排放量 (tCO₂)" bgcolor='#333399' numberval={annualData.remainEmissionTarget} key="cum"/>
        </div>
     
     
       
          <Titlelayout title="月度碳排考核分析(tCO₂)" layout="flex" bgcolor="#043665" bg="#043665" fc="#fff"  key="chart">
              <div  className='chartbox' style={{  background: 'linear-gradient(to top right, rgb(16,32,61), rgb(4,53,102))' }}>
                <Ichart {...roption} />
              </div>
          </Titlelayout>

        
        
          <Titlelayout title="碳排放数据(tCO₂)" layout="flex" key="table">
            <div className='chartBox tablebox'>
              <Table columns={columnstable} istheme hc="#fff" {...tableProps} />
                <div className='tip'>
                  <p>
                    <span style={{backgroundColor:'#FFCC33',width:'24px',height:'10px',color:'#FFCC33',marginRight:'16px'}}>123456</span>
                    <span>月度排放量(超标值)</span>
                  </p>
                  <p>
                    <span style={{backgroundColor:'#FF5F60',width:'24px',height:'10px',color:'#FF5F60',marginRight:'16px'}}>123456</span>
                    <span>月度排放量(超预配值)</span>
                  </p>
                </div>
              {/* <div ref={linedom} style={{ width: '100%', height: '100%' ,background: 'linear-gradient(to right, rgb(16,32,61), rgb(3,60,95))'}}></div> */}
            </div>
          </Titlelayout>

        
        </Mainbox>
    </Pagecount>
  )
}
