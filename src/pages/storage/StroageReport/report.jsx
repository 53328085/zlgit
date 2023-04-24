import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions, Divider, Tag, Radio, message } from 'antd'
 import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import {useSelector} from 'react-redux'
import {selectOneLevel, selectOneLevelDefaultId} from '@redux/systemconfig.js'
 import {CustButton} from '@com/useButton'
 import {StorageRunReport} from '@api/api'
 import { drawEcharts } from "@com/useEcharts";
 import log from './log.png'
 import bg from './bg.png'
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
      padding-top: 16px;
       display: grid;
       grid-template-columns: 384px 678px;
       column-gap: 32px; 
       flex: 1;
       color:#515151;
       .left {
         padding: 32px;
         display: flex;
         flex-direction: column;
         background: #fff; 
         .content {
          padding: 32px 0;
          display: grid;
          row-gap: 32px;
          .ant-radio-group.ant-radio-group-solid {
            width: 100%;
            .ant-radio-group.ant-radio-group-solid {
              width: 50%;
            }
          }
         }
         .btns {
         
          display: grid; 
          row-gap: 16px;
          justify-items: center;
         }
       }
       .right {
        background-color: #f2f2f2;
        padding: 16px 32px;
        border: 1px solid #ccc;
        height: 840px;
        overflow-y: auto;
        display: grid;
        grid-auto-rows: 806px;
        row-gap: 32px;
        .front {
          background-color: #fff;
          padding: 8px;
          
          display: flex;
          flex-direction: column;
          position: relative;
          .title{
            position: absolute;
            left: 0;
            top:0;
            display: flex;
            align-items: center;
            height: 58px;
            span {
              color: #999;
              font-size: 16px;
              padding-left: 16px;
            }
           
          }
          .head {
              width: 432px;
              display: flex;
              flex-direction: column;
              justify-self: center;
              align-self: center;

              h1 {
                color: #ccc;
                font-size: 32px;
                text-align: center;
                margin-bottom: 32px;

              }
              .box {
                width: 432px;
                height: 136px;                
                background-color: rgba(242, 242, 242, 1);                
                border: 1px solid rgba(204, 204, 204, 1);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 16px;
                p {
                  color: #ccc;
                  font-size: 18px;
                }
              }
            }
           
        }
       }
       .ant-form-inline.ant-form-item {
          margin-right: 0px
        } 
       }
`

const Ccontent = styled.div`
              height: 806px;
              display: grid;
              grid-template-rows: 36px 1fr;
              row-gap: 32px;
              background-color: #fff;
              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: #237ae4;
                color: #fff;
                font-size: 14px;
                padding: 0 16px;
              }
              .main {
                padding: 0 16px 16px 16px;
                display: grid;
                grid-template-rows: ${({count, rows}) => count ? `repeat(${count}, auto) 1fr` : rows };
                row-gap: 32px;
              }
`
 const RadioGroup = styled(Radio.Group)`
   && {
    width: 100%;
    .ant-radio-button-wrapper {
      width: 50%;
      text-align: center;
    }
   }
 `
 const DesItem = styled(Descriptions)`
 && {
  .ant-descriptions-item-label {
    height: 30px;
    padding: 0 16px;
    background-color: #237ae4;
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
 
 function Maincom({projectId,  Statistical, CModal}) {
   const [form] = Form.useForm()
   const [type, setType] = useState(1)
   const levelone = useSelector(selectOneLevel)
   const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)  
   const [reportData, setReprotData] = useState({})
   const datetype = ['', 'month', 'year'][type]
   const lref = useRef()
   const eref = useRef()
   const bref = useRef()
   const wref = useRef()
   const [ldataset, setLdataset] = useState({
    source: [],
  })

  const [edataset, setEdataset] = useState({
    source: [],
  })

  const [bdataset, setBdataset] = useState({
    source: [],
  })
  const [wdataset, setWdataset] = useState({
    source: [],
  })
  const getReport = async () => {
     try {
      
    
     let {type, date} = form.getFieldsValue(true)
     let time;
     if(type == 1) {
         time = date.format('YYYY-MM') + '-01'
        
     }else if(type == 2) {
        time = date.format('YYYY') + '-01-01'
     }
    let {success, data, errMsg} = await  StorageRunReport.QueryRuntimeStatus(projectId, type, time)
    if(success) {
         const datas = data || {}
         setReprotData(datas)
         let {profitDetail: {x=[], y=[], y1=[], y2=[]}, chargeDetail={}, chargeDurationDetail={}, temperatureHumidityDetail={}} = datas          
             x.unshift('日期')
             y.unshift('充电金额（元）')
             y1.unshift('放电（元）')
             y2.unshift('储能收益（元）')
             setLdataset({
              source: [x, y1,y, y2]
             })

             setEdataset(() => {
              let {x=[], y=[], y1=[]} = chargeDetail
              x.unshift('日期')
              y.unshift('充电电量（kWh）')
              y1.unshift('放电电量（kWh）')
              return {
                source: [x, y1, y]
              }
             })
             setBdataset(() => {
               let {x=[], y=[], y1=[]} = chargeDurationDetail
               x.unshift('日期')
               y.unshift('充电时长(h)')
               y1.unshift('放电时长(h)')
               return {
                source: [x, y, y1]
              }
             })

             setWdataset(() => {
              let {x=[], y=[], y1=[]} = temperatureHumidityDetail
              x.unshift('日期')
              y.unshift('温度')
              y1.unshift('湿度')
              return {
               source: [x, y, y1]
             }
            })
 
    }else {
      setReprotData({})
      message.error({content: errMsg || '数据出错', duration: 0.3})
    }
  } catch (error) {
      console.log(error)
  }

  }
  const custSty = {height: '40px', color: '#515151', padding: '0 24px'}
  const custSty2 = {height: '30px', color: '#515151', padding: '0 24px', textAlign: 'center'}
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
  useEffect(() => {
    drawEcharts(
      lref.current, {
        dataset: ldataset,
        grid,
        color: ['#5c90f8', '#62daab', '#617395'],
       series: [{ type: "line", seriesLayoutBy: 'row', }, { type: "line", seriesLayoutBy: 'row', }, { type: "line", seriesLayoutBy: 'row',}]
     }
   )
  }, [ldataset])

  useEffect(() => {
    drawEcharts(
      eref.current, {
        dataset: edataset,
        grid,
        color: ['#5c90f8', '#62daab'],
       series: [{ type: "line", seriesLayoutBy: 'row', }, { type: "line", seriesLayoutBy: 'row', }]
     }
   )
  }, [edataset])

  useEffect(() => {
    drawEcharts(
      eref.current, {
        dataset: edataset,
        grid,
        color: ['#5c90f8', '#62daab'],
       series: [{ type: "line", seriesLayoutBy: 'row', }, { type: "line", seriesLayoutBy: 'row', }]
     }
   )
  }, [edataset])
  useEffect(() => {
    drawEcharts(
      bref.current, {
        dataset: bdataset,
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
        color: ['#5c90f8', '#62daab'],
       series: [{ type: "bar", seriesLayoutBy: 'row', }, { type: "bar", seriesLayoutBy: 'row', }]
     }
   )
  }, [bdataset])

  useEffect(() => {
    drawEcharts(
      wref.current, {
        dataset: wdataset,
        grid: {
          ...grid,
          top: '64px'
        },
        legend: {
          top: '32px'
        },
        title:{
          text:  '54. 环境温湿度监控',
          ...etitle,
          
        },
        color: ['#5c90f8', '#62daab'],
       series: [{ type: "line", seriesLayoutBy: 'row', }, { type: "line", seriesLayoutBy: 'row', }]
     }
   )
  }, [wdataset])
  return (
   
    <Mainbox>
         <div className='left'>
       {/*    <Titlelayout title='园区选择' bordered={'n'} style={{flex: 'auto'}} pv="0px">  
            <div className="content">
                    <Select options={levelone} defaultValue={oneLevelDefaultId}
                    fieldNames={{label: 'name', value: 'id', options: 'options'}}
                    style={{width: '320px'}}
                    ></Select> 
                     <Divider  style={{margin: '0px'}} />
                  </div>
                 
          </Titlelayout>  */}
          
           <Titlelayout title='运行报告' bordered={'n'} style={{flex: 'auto'}} pv="0px" > 
                 
            <Form className="content" form={form} initialValues={{type: 1, date: moment()}}>
              <Item name="type" noStyle>
              <RadioGroup  options={[{
                label: '月度报告',
                value: 1
              }, {
                label: '年度报告',
                value: 2
              }]}   value={type}
              optionType="button"
              buttonStyle="solid"
              />
              </Item>
              <Item name="date" noStyle>
               <DatePicker picker={datetype} allowClear={false} />
              </Item>
                  <Divider   style={{  margin: '0px'}} />
                 
             </Form>
             <div className='btns'>
                    <CustButton wh="192px" src="createrpt" onClick={getReport}>生成报告</CustButton>
                    <CustButton wh="192px" src="print">打印报告</CustButton>
                    <CustButton wh="192px" src="export">导出报告</CustButton>
             </div>
               
              
          </Titlelayout>      
          </div>
          <div className='right'>
               <div className='front' style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundSize: '614px 260px',
          backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 550px'}}>
                   <div className='title'>
                    <Image src={log} height={57} preview={false}></Image>
                    <span className='name'>正泰综合能源服务平台</span>
                   </div>
                   <div style={{display: 'flex', flex:1, alignContent: 'center', justifyContent: 'center'}}>
                   <div className='head'>
                      <h1>储能系统分析报告</h1>
                      <div className='box'>
                          <p>项目名称：{reportData.projectName}</p>
                          <p>项目地址：{reportData.projectAddress}</p>
                          <p>报告日期：{reportData.reportDate}</p>
                      </div>
                   </div>
                   </div>
               </div>
               <Ccontent count={2}>
                 <div className='header'>
                   <span>储能系统分析报告</span>
                   <span>本期报告分析周期为： {moment(reportData.reportDate).format('YYYY-MM')+'月'}</span>
                 </div>
                 <div className='main'>
                    
                   <Descriptions title="1. 项目情况" bordered column={1} contentStyle={custSty} labelStyle={{...custSty, textAlign: 'center'}}>
                      <Descriptions.Item label="项目名称">{reportData.projectName}</Descriptions.Item>
                      <Descriptions.Item label="项目地址">{reportData.projectAddress}</Descriptions.Item>
                   </Descriptions>
                   <DesItem title="2. 项目营收情况" bordered size='small' layout='vertical'>
                      <DesItem.Item label="储能收益">{reportData.profit}</DesItem.Item>
                      <DesItem.Item label="放电费用">{reportData.totalUnchargeFee}</DesItem.Item>
                      <DesItem.Item label="充电费用">{reportData.totalChargFee}</DesItem.Item>
                      <DesItem.Item label="放电量">{reportData.totalUncharge}</DesItem.Item>
                      <DesItem.Item label="充电量">{reportData.totalCharge}</DesItem.Item>
                      <DesItem.Item label="充放效率">{reportData.efficiency}</DesItem.Item>
                   </DesItem>
                   <div ref={lref} ></div>
                 </div>
                  
               </Ccontent>
               <Ccontent count={1}>
                 <div className='header'>
                   <span>储能系统分析报告</span>
                   <span>本期报告分析周期为： {moment(reportData.reportDate).format('YYYY-MM')+'月'}</span>
                 </div>
                 <div className='main'>
                   <DesItem title="3. 充放电趋势" bordered size='small' layout='vertical'>
                      <DesItem.Item label="放电电量">{reportData.totalUncharge}</DesItem.Item>
                      <DesItem.Item label="充电电量">{reportData.totalCharge}</DesItem.Item>
                   </DesItem>
                   <div ref={eref} ></div>
                 </div>
                  
               </Ccontent>
               <Ccontent rows='1fr 1fr'>
                 <div className='header'>
                   <span>储能系统分析报告</span>
                   <span>本期报告分析周期为： {moment(reportData.reportDate).format('YYYY-MM')+'月'}</span>
                 </div>
                 <div className='main'>                   
                   <div ref={bref} >
                      
                   </div>
                   <div ref={wref} ></div>
                 </div>
                  
               </Ccontent>
          </div>
          </Mainbox>
    
  )
}

const Statistical = ({data}) => {
  const contentStyle = {
    width: '172px',
    height: '40px',
    backgroundColor: 'rgba(0, 51, 204, 1)',
    fontsize: '14px',
    color: '#FFFFFF',
    alignItems: 'center',
    justifyCcontent: 'center',
    paddingBottom: '0px'
  }
  const labelStyle = {
    width: '172px',
    height: '40px',
    backgroundColor: 'rgba(0, 51, 102, 1)',
    fontsize: '12px',
    color: '#FFFFFF',
    alignItems: 'center',
    justifyCcontent: 'center',
    paddingBottom: '0px'
  }
  return (
     <div className='list'>
      <div style={{display: 'flex', border: '2px solid #fff'}}>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        </div>
        <div style={{display: 'flex', border: '2px solid #fff'}}>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        </div>
        <div style={{display: 'flex', border: '2px solid #fff'}}>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        </div>
     </div>
  )
}


export default function Index(props) {
    return (
        <Maincom {...props}   Statistical={Statistical}   />
    )
}