import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Provider, useSelector } from 'react-redux'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, DatePicker, message } from 'antd'
import UseTable from '@com/useTable'
import logo from '@imgs/chintlog.png'
import PageComp from './pagecomp.jsx'
import { safeElectric } from '@api/api'
import moment from 'moment'
import { PieCharts, LineCharts } from './charts'
import anaylse from './imgs/anaylse.svg'
import { exportPDF } from './topdf.js'
import imgurl from '@imgs/index'
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import './index.less'
import CusContext from '@com/content'
import styled from 'styled-components'
import backimg from '@imgs/backimg.png'
import { systemConfigInfo } from '@redux/systemconfig.js'
import { Descriptions } from 'antd'

const ContainerDiv = styled.div`

.container{
    display: grid;
    grid-template-columns: 384px 678px;
    grid-template-rows: 864px;
    column-gap:32px ;
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-after: always;
    }
    .leftcss{
       background-color: #fff;
       border: 1px solid #ccc;
       border-radius: 2px;
       padding: 32px;
       .active{
        background-color: ${props => props.theme.primaryColor} ;
        color: #fff;
        }
        .btnscsss{
            width: 192px;
            height: 36px;
            background-color: ${props => props.theme.primaryColor} ;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            border-radius: 2px;
            cursor: pointer;
            &:hover{
                opacity: .7;
            }
        }   
    }
    .rightcss {
        background-color: #f2f2f2;
        border: 1px solid #ccc;
        border-radius: 2px;
        overflow-y: auto;
        padding: 20px;
        .report {
            width: 562px;
            height: 806px;
            background-color: #fff;
            margin: auto;
            border: 1px solid #ccc;
            display: grid;
            grid-template-rows: 90px 1fr 244px;
  
            .bgimage {
                height: 244px;
                
            }
        }
        
    .onePageInfo{
      p{
        line-height: 35px;
        span{
          margin-left:30px;
        }
      }
    }

    }
}
`
const RightDiv = styled.div`
            width: 562px;
            height: 806px;
            background-color: #fff;
            margin: auto;
            border: 1px solid #ccc;
            display: grid;
            grid-template-rows: 90px 1fr 244px;
  
            .bgimage {
                height: 244px;
                
            }
`
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
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)
  // const arealist = useSelector(state => state.system.onelevel)
  const [active, setActive] = useState(1)
  const [datevalue, setDatevalue] = useState()
  const [isshow, setIsshow] = useState(false)
  const [report, setReport] = useState()

  const { chineseTitle } = useSelector(systemConfigInfo)

  // 化石燃料燃烧
  const combustionTable1 = [
    { id: "0", name: "无烟煤", consume: "", heating: "" },
    { id: "1", name: "烟煤", consume: "", heating: "" },
    { id: "2", name: "褐煤", consume: "", heating: "" },
    { id: "3", name: "洗精煤", consume: "", heating: "" },
    { id: "4", name: "其他洗煤", consume: "", heating: "" },
    { id: "5", name: "其他煤制品", consume: "", heating: "" },
    { id: "6", name: "焦炭", consume: "", heating: "" },
    { id: "7", name: "原油", consume: "", heating: "" },
    { id: "8", name: "燃料油", consume: "", heating: "" },
    { id: "9", name: "汽油", consume: "", heating: "" },
    { id: "10", name: "柴油", consume: "", heating: "" },
    { id: "11", name: "一般煤油", consume: "", heating: "" },
    { id: "12", name: "液化天然气", consume: "", heating: "" },
    { id: "13", name: "液化石油气", consume: "", heating: "" },
    { id: "14", name: "焦油", consume: "", heating: "" },
    { id: "15", name: "粗苯", consume: "", heating: "" },
    { id: "16", name: "焦炉煤气", consume: "", heating: "" },
    { id: "17", name: "高炉煤气", consume: "", heating: "" },
    { id: "18", name: "转炉煤气", consume: "", heating: "" },
    { id: "19", name: "其他煤气", consume: "", heating: "" },
    { id: "20", name: "天然气", consume: "", heating: "" },
    { id: "21", name: "炼厂干气", consume: "", heating: "" },
  ]
  //工业生产过程**
  const produceTable1 = [
    { id: "1", name: "碳酸盐的消耗量", data: "", unit: "t" },
    { id: "2", name: "工业生产的二氧化碳消耗量", data: "", unit: "t" },
  ]
  // 废水厌氧处理
  const wasteTable = [
    { id: "1", name: "废水厌氧处理去除的有机物总量", data: "", unit: "kg COD" },
    { id: "2", name: "厌氧处理过程产生的废水量", data: "", unit: "m³" },
    { id: "3", name: "厌氧处理系统进口废水中的化学需氧量浓度", data: "", unit: "kg COD/m3" },
    { id: "4", name: "厌氧处理系统出口废水中的化学需氧量浓度", data: "", unit: "kg COD/m3" },
    { id: "5", name: "以污泥方式清除掉的有机物总量", data: "", unit: "kg COD" },
    { id: "6", name: "甲烷回收量", data: "", unit: "kg" },
  ]

  //净闬右购入使用电力、热力
  const purchaseTable = [
    { id: "1", name: "电力净购入量", data: "", unit: "MWh" },
    { id: "2", name: "热力净购入量", data: "", unit: "GJ" },
  ]


  // 化石燃料燃烧2
  const combustionTable2 = [
    { id: "0", name: "无烟煤", consume: "", heating: "" },
    { id: "1", name: "烟煤", consume: "", heating: "" },
    { id: "2", name: "褐煤", consume: "", heating: "" },
    { id: "3", name: "洗精煤", consume: "", heating: "" },
    { id: "4", name: "其他洗煤", consume: "", heating: "" },
    { id: "5", name: "其他煤制品", consume: "", heating: "" },
    { id: "6", name: "焦炭", consume: "", heating: "" },
    { id: "7", name: "原油", consume: "", heating: "" },
    { id: "8", name: "燃料油", consume: "", heating: "" },
    { id: "9", name: "汽油", consume: "", heating: "" },
    { id: "10", name: "柴油", consume: "", heating: "" },
    { id: "11", name: "一般煤油", consume: "", heating: "" },
    { id: "12", name: "液化天然气", consume: "", heating: "" },
    { id: "13", name: "液化石油气", consume: "", heating: "" },
    { id: "14", name: "焦油", consume: "", heating: "" },
    { id: "15", name: "粗苯", consume: "", heating: "" },
    { id: "16", name: "焦炉煤气", consume: "", heating: "" },
    { id: "17", name: "高炉煤气", consume: "", heating: "" },
    { id: "18", name: "转炉煤气", consume: "", heating: "" },
    { id: "19", name: "其他煤气", consume: "", heating: "" },
    { id: "20", name: "天然气", consume: "", heating: "" },
    { id: "21", name: "炼厂干气", consume: "", heating: "" },
  ]

  //工业生产过程2
  const produceTable2 = [
    { id: "1", name: "碳酸盐的排放因子", data: "", unit: "tCO₂/t" },
    { id: "", name: "二氧化碳的损耗比例", data: "", unit: "%" },
  ]
  
  // 废水厌氧处理2
  const wasteTable2 = [
    { id: "1", name: "废水厌氧处理系统的甲烷最大生产能力", data: "", unit: "kg CH₄/kg COD" },
    { id: "2", name: "甲烷修正因子", data: "", unit: "-" },
  ]

  //净闬右购入使用电力、热力2
  const purchaseTable2 = [
    { id: "1", name: "电力", data: "", unit: "tCO₂/MWh" },
    { id: "2", name: "热力", data: "", unit: "tCO₂/GJ" },
  ]
  const printRef = useRef()
  const reactToPrintContent = useCallback(() => {
    return printRef.current;
  }, [printRef.current])
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  })
  //修改日期类型
  const changeDate = (v) => {
    setDatevalue(v)

  }
  //月度报告
  const getMonthReport = async (date) => {
    const res = await safeElectric.MonthReport({
      projectId,
      date: date ? date.format('YYYY-MM-01') : moment().format('YYYY-MM-01'),
    })
    const data = res.data
    if (res.success) {
      setReport(() => res.data)
      setProjectMes([
        {
          name: '项目名称',
          message: data.project,
        },
        {
          name: '项目地址',
          message: data.address
        }
      ])
      setElec([
        {
          name: '最大电流发生时间',
          message: data.iMaxSn ? data.iMaxTime : '/',
        },
        {
          name: '最大电流发生位置',
          message: data.iMaxSn ? data.iMaxAddress : '/',
        },
        {
          name: '最大电流值',
          message: data.iMaxSn ? data.iMaxContent : '/',
        },
      ])
      setVoltage(
        [{
          name: '最大电压发生时间',
          message: data.uMaxSn ? data.uMaxTime : '/',
        },
        {
          name: '最大电压发生位置',
          message: data.uMaxSn ? data.uMaxAddress : '/',
        },
        {
          name: '最大电压值',
          message: data.uMaxSn ? data.uMaxContent : '/',
        },]
      )
      setLeaveElec([
        {
          name: '最大剩余电流发生时间',
          message: data.irMaxSn ? data.irMaxTime : '/',
        },
        {
          name: '最大剩余电流发生位置',
          message: data.irMaxSn ? data.irMaxAddress : '/',
        },
        {
          name: '最大剩余电流值',
          message: data.irMaxSn ? data.irMaxContent : '/',
        },
      ])
      setTemperature([{
        name: '最高温度发生时间',
        message: data.tMaxSn ? data.tMaxTime : '/',
      },
      {
        name: '最高温度发生位置',
        message: data.tMaxSn ? data.tMaxAddress : '/',
      },
      {
        name: '最高温度值',
        message: data.tMaxSn ? data.tMaxContent : '/',
      },])
    } else {
      message.error(res.errMsg)
    }

  }
  //年度报告
  const getYearReport = async (date) => {
    const res = await safeElectric.YearReport({
      projectId,
      date: date ? date.format('YYYY-01-01') : moment().format('YYYY-01-01'),
    })
    if (res.success) {
      setReport(() => res.data)
      setProjectMes([
        {
          name: '项目名称',
          message: res.data.project,
        },
        {
          name: '项目地址',
          message: res.data.address
        }
      ])

    } else {
      message.error(res.errMsg)
    }
  }
  //生成报告
  const makeReport = () => {
    setIsshow(true)
    if (active === 1) {
      getMonthReport(datevalue)
    } else {
      getYearReport(datevalue)
    }
  }
  const disabledDate = (current) => {
    const type = active === 1 ? 'month' : 'year'
    return current && current > moment().endOf(type);
  };
  useEffect(() => {
    console.log(printRef)
  }, [])
  return (
    <CusContext.Provider value={{ active, datevalue }}>
      <ContainerDiv>
        <div className='container'>
          <div className='leftcss'>
            <BlueColumn name="运行报告" />
            <div style={{
              width: 320,
              display: 'flex',
              margin: '32px 0',
              borderRadius: 2,
              cursor: 'pointer'
            }}>
              <div
                onClick={() => { setActive(1); setIsshow(false); setReport(null) }}
                className={active === 1 ? 'active' : ''}
                style={{ flex: 1, textAlign: 'center', border: '1px solid #d7d7d7', height: 40, lineHeight: '40px' }}
              >月份报告
              </div>
              <div
                onClick={() => { setActive(2); setIsshow(false); setReport(null) }}
                className={active === 2 ? 'active' : ''}
                style={{ flex: 1, textAlign: 'center', border: '1px solid #d7d7d7', marginLeft: -1, height: 40, lineHeight: '40px' }}>
                年度报告
              </div>
            </div>
            <DatePicker picker={active === 1 ? 'month' : 'year'} style={{ width: '100%' }} defaultValue={moment()} onChange={changeDate} disabledDate={disabledDate} />
            <Divider dashed style={{ borderColor: '#d7d7d7', margin: '48px 0' }} />
            <div className='btnscsss' onClick={makeReport}>
              <img src={imgurl.searchFile} alt="" style={{ marginRight: 8 }} /> 生成报告
            </div>

            <div className='btnscsss' onClick={handlePrint}>
              <img src={imgurl.print} alt="" style={{ marginRight: 8 }} /> 打印报告
            </div>
            <div className='btnscsss' onClick={() => { exportPDF('碳排放分析报告', 'pdfid') }}>
              <img src={imgurl.export} alt="" style={{ marginRight: 8 }} /> 导出报告
            </div>
          </div>
          <div className='rightcss' >
            <div id='pdfid' ref={printRef} className='printContet'>
              <RightDiv>
                <div style={{ padding: 16 }}>
                  <img src={logo} alt="" style={{ width: 77, height: 58, marginRight: 16 }} />
                  <span style={{ fontSize: 20 }}>{chineseTitle}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 470 }}>
                  <p style={{ fontSize: 32, color: '#515151', fontWeight: 'bold', marginBottom: 32 }}>碳排放分析报告</p>
                  <div style={{
                    width: 431,
                    height: 136,
                    background: '#f2f2f2',
                    border: '1px solid #ccc',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 18
                  }}>
                    <p style={{ flex: 1 }}>项目名称:<span style={{ paddingLeft: 24 }}>{report?.project}</span></p>
                    <p style={{ flex: 1 }}>项目地址:<span style={{ paddingLeft: 24 }}>{report?.address}</span></p>
                    <p style={{ flex: 1 }}>报告日期:<span style={{ paddingLeft: 24 }}>{report ? moment().format('YYYY-MM-DD') : ''}</span></p>
                  </div>
                </div>
                <div className='bgimage'>
                  <img src={backimg} alt="" style={{ width: 559 }} />
                </div>
              </RightDiv>
              <div className="page-break" />
              {isshow ? <>
                <PageComp >
                  <div style={{ marginBottom: 24 }} className="onePageInfo">
                    <p style={{ textAlign: 'center' }}>中国食品、烟草及酒、饮料和精制茶企业温室气体排放报告</p>
                    <p>报告主体（盖章）：</p>
                    <p>报告年度：</p>
                    <p>编制日期：<span>年</span><span>月</span><span>日</span></p>
                    <p style={{ textIndent: '2em' }}>根据国家发展和改革委员会发布的《中国食品、烟草及酒、饮料和精制茶生产企业温室气体排放核算方法与报告指南（试行）》，本报告主体核算了年度温室气体排放量，并填写了相关数据表格。现将有关情况报告如下：</p>
                    <p>一、企业基本情况</p>
                    <p>二、温室气体排放情况</p>
                    <p>三、活动水平数据及来源说明</p>
                    <p>四、排放因子数据及来源说明</p>
                    <p>本报告真实、可靠，如报告中的信息与实际情况不符，本企业将承担相应的法律责任。</p>
                    <p>法人（签字）：</p>
                    <p><span>年</span><span>月</span><span>日</span></p>

                  </div>
                </PageComp>
                <div className="page-break" />
                <PageComp >
                  <div style={{ marginBottom: 24 }} className="onePageInfo">
                    <p>附表1 报告主体二氧化碳排放量报告</p>
                    <p>附表2 报告主体活动水平数据</p>
                    <p>附表3 报告主体排放因子和计算系数</p>
                    <p style={{
                      textAlign: 'center', marginTop: 50, marginBottom: 10, fontSize: 15, fontWeight: 700,
                      fontFamily: 'cursive'
                    }}>附表1 报告主体年二氧化碳排放报告</p>
                    <DesItem title="" bordered size='small' column={3} >
                      <DesItem.Item>源类别</DesItem.Item>
                      <DesItem.Item>温室气体本身质量(单位:吨)</DesItem.Item>
                      <DesItem.Item>CO₂当量(单位:吨 CO₂当量)</DesItem.Item>
                      <DesItem.Item>化石燃料燃烧二氧化碳排放量</DesItem.Item >
                      <DesItem.Item> </DesItem.Item><DesItem.Item> </DesItem.Item>
                      <DesItem.Item>工业生产过程二氧化碳排放量</DesItem.Item>
                      <DesItem.Item> </DesItem.Item><DesItem.Item> </DesItem.Item>
                      <DesItem.Item>废水厌氧处理过程产生的甲烷排放量</DesItem.Item>
                      <DesItem.Item> </DesItem.Item><DesItem.Item> </DesItem.Item>
                      <DesItem.Item>净购入使用的电力二氧化碳排放量
                      </DesItem.Item>
                      <DesItem.Item> </DesItem.Item><DesItem.Item> </DesItem.Item>
                      <DesItem.Item>净购入使用的热力二氧化碳掉放量
                      </DesItem.Item>
                      <DesItem.Item> </DesItem.Item><DesItem.Item> </DesItem.Item>
                      <DesItem.Item span='2'>企业二氧化碳排放总量(吨二氧化碳当量)
                      </DesItem.Item>
                      <DesItem.Item> </DesItem.Item>
                    </DesItem>
                  </div>
                </PageComp>
                <div className="page-break" />
                <PageComp >
                  <p style={{
                    textAlign: 'center', marginBottom: 10, fontSize: 15, fontWeight: 700,
                    fontFamily: 'cursive'
                  }}>附表2 活动水平数据表</p>
                  <table border="1" align="center">
                    <tr align="center">
                      <td width="120" rowspan="23">化石燃料燃烧*</td>
                      <th width="150">燃料品种</th>
                      <th width="120">净消耗量(t,万Nmm3)</th>
                      <th width="120">低位发热量(GJ/t，(GJ/万Nm3)</th>
                    </tr>

                    {combustionTable1.map((item => {
                      return <tr align="center" key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.consume}</td>
                        <td>{item.heating}</td>
                      </tr>
                    })
                    )}
                    <tr align="center" >
                      <td width="120" rowspan="3">工业生产过程**</td>
                      <td width="150"></td>
                      <th width="120">数据</th>
                      <th width="120">单位</th>
                    </tr>
                    {produceTable1.map((item => {
                      return <tr align="center" key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.data}</td>
                        <td>{item.unit}</td>
                      </tr>
                    })
                    )}
                  </table>
                </PageComp>
                <div className="page-break" />
                <PageComp >
                  <table border="1" align="center">
                    <tr align="center">
                      <td width="120" rowspan="7">废水厌氧处理</td>
                      <td width="150"></td>
                      <th width="120">数据</th>
                      <th width="120">单位</th>
                    </tr>
                    {wasteTable.map((item => {
                      return <tr align="center" key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.data}</td>
                        <td>{item.unit}</td>
                      </tr>
                    })
                    )}

                    <tr align="center" >
                      <td width="120" rowspan="3">净购入使用电力、热力</td>
                      <td width="150"></td>
                      <th width="120">数据</th>
                      <th width="120">单位</th>
                    </tr>
                    {purchaseTable.map((item => {
                      return <tr align="center" key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.data}</td>
                        <td>{item.unit}</td>
                      </tr>
                    })
                    )}
                  </table>
                  <p style={{
                    fontSize: 15, fontWeight: 700,
                    fontFamily: 'fangsong', marginTop: 15
                  }}>*企业应自行添加未在表中列出但企业实际消耗的其他能源品种</p>

                  <p style={{
                    fontSize: 15, fontWeight: 700,
                    fontFamily: 'fangsong'
                  }}>** 企业应自行添加未在表中列出但企业实际消耗的其他碳酸盐原料品种</p>
                </PageComp>
                <div className="page-break" />
                <PageComp >
                  <p style={{
                    textAlign: 'center', marginBottom: 10, fontSize: 15, fontWeight: 700,
                    fontFamily: 'cursive'
                  }}>附表3 排放因子和计算系数</p>
                  <table border="1" align="center">
                    <tr align="center">
                      <td width="120" rowspan="23">化石燃料燃烧</td>
                      <th width="150">燃料品种</th>
                      <th width="120">单位热值含碳量(tC/GJ)</th>
                      <th width="120">碳氧化率(%)</th>
                    </tr>

                    {combustionTable2.map((item => {
                      return <tr align="center" key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.consume}</td>
                        <td>{item.heating}</td>
                      </tr>
                    })
                    )}
                    <tr align="center" >
                      <td width="120" rowspan="3">工业生产过程</td>
                      <td width="150"></td>
                      <th width="120">数据</th>
                      <th width="120">单位</th>
                    </tr>
                    {produceTable2.map((item => {
                      return <tr align="center" key={item.id}>
                        <td width="120">{item.name}</td>
                        <td>{item.data}</td>
                        <td>{item.unit}</td>
                      </tr>
                    })
                    )}
                  </table>
                </PageComp>
                <div className="page-break" />
                <PageComp >
                  <table border="1" align="center">
                    <tr align="center">
                      <td width="120" rowspan="3">废水厌氧处理</td>
                      <td width="150"></td>
                      <th width="120">数据</th>
                      <th width="120">单位</th>
                    </tr>
                    {wasteTable2.map((item => {
                      return <tr align="center" key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.data}</td>
                        <td>{item.unit}</td>
                      </tr>
                    })
                    )}

                    <tr align="center" >
                      <td width="120" rowspan="3">净购入使用电力、热力</td>
                      <td width="150"></td>
                      <th width="120">数据</th>
                      <th width="120">单位</th>
                    </tr>
                    {purchaseTable2.map((item => {
                      return <tr align="center" key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.data}</td>
                        <td>{item.unit}</td>
                      </tr>
                    })
                    )}
                  </table>
                </PageComp>
                <div className="page-break" />
              </> : null}
            </div>


          </div>
        </div>
      </ContainerDiv>

    </CusContext.Provider>

  )
}


