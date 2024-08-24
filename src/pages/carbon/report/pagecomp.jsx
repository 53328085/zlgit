 import styled from 'styled-components'
import React from 'react'
 import {Typography} from 'antd'
import PageComp from "@com/reportPrint/page"
 
import Usetable from '@com/useTable'
import {useSelector} from 'react-redux'
import {currProject} from '@redux/systemconfig.js'
import {isObject} from "@com/usehandler"
const {Paragraph} = Typography
 
const Main =styled.div`
   && {
      color: #515151;
      padding: 0 16px 16px 16px;
      p {
        margin-bottom: 24px;
      }
      .title {
        font-size: 20px;
       
      }
      .tbhead {
        text-align: center;
        font-weight: bold;
      }
      .content {
        text-indent: 2em;
        line-height: 1.5;
        font-size: 14px;
        letter-spacing: 1px;
      }
   }

`
 const corboncolumns =[
  {
    title: "",
    dataIndex: "rowName",
    key: "rowName"
  },
  {
    title: "",
    dataIndex: "cell1Value",
    key: "cell1Value"
  },
  {
    title: "",
    dataIndex: "cell2Value",
    key: "cell2Value"
  }
  
 ]
 
export default function pagecomp({data}) {
  let  reptdata=isObject(data) ? data : {} ;
  let {carbonCategoryReports=[], activityDataReports=[],emissionCalculationFactors=[],enterpriseInfo,emissionFactorSource } = reptdata
  const activityTable =  activityDataReports.map(e => {
    let {subCategoryActivityDatas=[], categoryName} = e
    let rowSpan = subCategoryActivityDatas.length
    subCategoryActivityDatas[0].categoryName=categoryName 
    subCategoryActivityDatas[0].rowSpan = rowSpan
   return subCategoryActivityDatas
 }).flat()

  const emissionTable = emissionCalculationFactors.map(e => {
     let {subCategoryCalculationFactors=[], categoryName} = e
     let rowSpan = subCategoryCalculationFactors.length
       subCategoryCalculationFactors[0].categoryName=categoryName 
       subCategoryCalculationFactors[0].rowSpan = rowSpan
    return subCategoryCalculationFactors
  }).flat()
 
   console.log(emissionTable)
  const activityColumns = [
    {
    title: "",
    dataIndex: "categoryName",
     key: "categoryName",
    onCell: (record,index) => {
          if(record.hasOwnProperty('categoryName')) {
            return {
              rowSpan: record.rowSpan,
            }
          } else {
            return {
              rowSpan: 0,
            }
          }
     } 
    },
    {
      title: "",
      dataIndex: "rowName",
      key: "rowName"
    },
    {
      title: "净消耗量(t,万Nmm3)",
      dataIndex: "cell1Value",
      key: "cell1Value"
    },
    {
      title: "低位发热量(GJ/t，(GJ/万Nm3)",
      dataIndex: "cell2Value",
      key: "cell2Value"
    },
  ]


  const emissionColumns = [
    {
    title: "",
    dataIndex: "categoryName",
     key: "categoryName",
    onCell: (record) => {
          if(record.categoryName) {
            return {
              rowSpan: record.rowSpan,
            }
          } else {
            return {
              rowSpan: 0,
            }
          }
     } 
    },
    {
      title: "",
      dataIndex: "rowName",
      key: "rowName"
    },
    {
      title: "净消耗量(t,万Nmm3)",
      dataIndex: "cell1Value",
      key: "cell1Value"
    },
    {
      title: "低位发热量(GJ/t，(GJ/万Nm3)",
      dataIndex: "cell2Value",
      key: "cell2Value"
    },
  ]
 
  return (
      <>
      <PageComp key="a"> 
        <Main> 
            <p style={{ textAlign: 'center' }}>中国食品、烟草及酒、饮料和精制茶企业温室气体排放报告</p>
            <p>报告主体（盖章）：</p>
            <p>报告年度：</p>
            <p>编制日期：<span>年</span><span>月</span><span>日</span></p>
            <p style={{ textIndent: '2em' }}>根据国家发展和改革委员会发布的《中国食品、烟草及酒、饮料和精制茶生产企业温室气体排放核算方法与报告指南（试行）》，本报告主体核算了年度温室气体排放量，并填写了相关数据表格。现将有关情况报告如下：</p>
            <p>一、企业基本情况</p>
              <p className='content'>{reptdata.enterpriseInfo}</p>           
         </Main> 
      </PageComp>
      <PageComp>
        <Main>
        <p>二、温室气体排放情况</p>
        <p className='content'>{reptdata.carbonEmissionState}</p>
        </Main>
      </PageComp>
      <PageComp>
        <Main>
        <p>三、活动水平数据及来源说明</p>
        <p className='content'>{reptdata.activityDataSource}</p>
        </Main>
      </PageComp>
      <PageComp>
        <Main>
        <p>四、排放因子数据及来源说明</p>
        <p className='content'>{reptdata.emissionFactorSource}</p>
        </Main>
      </PageComp>
      <PageComp>
        <Main>
        <p>本报告真实、可靠，如报告中的信息与实际情况不符，本企业将承担相应的法律责任。</p>
            <p>法人（签字）：</p>
            <p><span>年</span><span>月</span><span>日</span></p>
        </Main>
      </PageComp>
      <PageComp >
                  <Main>
                    <p className='title'>附表1 报告主体二氧化碳排放量报告</p>
                    <p className='title'>附表2 报告主体活动水平数据</p>
                    <p className='title'>附表3 报告主体排放因子和计算系数</p>
                    <p className='title tbhead' style={{marginTop: "64px"}}>附表1 报告主体年二氧化碳排放报告</p>
                    <Usetable columns={corboncolumns} dataSource={carbonCategoryReports} showHeader={false} bordered /> 
                  </Main>
                </PageComp>
                <PageComp >
                   <Main>
                     <p className='title tbhead'>附表2 活动水平数据表</p>
                     <Usetable columns={activityColumns} dataSource={activityTable}  showHeader={false}  />
                   </Main>
                  
                </PageComp>
                <PageComp >
                  <Main>
                  <p style={{
                    fontSize: 15, fontWeight: 700,
                    fontFamily: 'fangsong', marginTop: 15
                  }}>*企业应自行添加未在表中列出但企业实际消耗的其他能源品种</p>

                  <p style={{
                    fontSize: 15, fontWeight: 700,
                    fontFamily: 'fangsong'
                  }}>** 企业应自行添加未在表中列出但企业实际消耗的其他碳酸盐原料品种</p>
                  <p className='title tbhead'>附表3 排放因子和计算系数</p>

                  <Usetable columns={emissionColumns} dataSource={emissionTable}  showHeader={false}  />
                 
                  </Main>
                </PageComp>
               
            
      </>
  )
}
 
   