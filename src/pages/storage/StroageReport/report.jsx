import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form,  DatePicker,   Descriptions, Divider,   Radio, message } from 'antd'
 import moment from 'moment'
 import {useReactToPrint} from 'react-to-print'

 import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import printJS from 'print-js'
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
      
       }
       .ant-form-inline.ant-form-item {
          margin-right: 0px
        } 
       }
`
const Front = styled.div`
   &&{
              background-color: #fff;
          page-break-after: always;
          height: 806px;
          display: flex;
          flex-direction: column;
          position: relative;
          .frontcont {
            display: flex;
             flex: 1; 
             align-content: center;
             justify-content: center;
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
          .title{ 
            display: flex;
            align-items: center; 
            padding: 16px;
            span {
              color: #999;
              font-size: 16px;
              padding-left: 16px;
            }
           
          }
          
           
        }
`
const Ccontent = styled.div`
              height: 806px;
              display: grid;
              grid-template-rows: 36px 1fr;
              row-gap: 32px;
              background-color: #fff;
              page-break-after: always;
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
    background-color:${({bgColor}) => bgColor || '#237ae4' };
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
 
 function Maincom({projectId}) {
   const [form] = Form.useForm()
   const [type, setType] = useState(1)
   const levelone = useSelector(selectOneLevel)
   const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)  
   const [reportData, setReprotData] = useState({})
   const datetype = ['', 'month', 'year'][type]
   const [loading, setLoading] = useState(false)
   const lref = useRef()
   const eref = useRef()
   const bref = useRef()
   const wref = useRef()
   const aref = useRef()
   const warnref = useRef() // 告警
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
  const [adataset, setAdataset] = useState({ // 空调运行时长
      dimensions: ["date", "空调运行时长(h)"],
      source: [],
  })

  const [wadataset, setWadataset] = useState({ // 告警趋势统计
    dimensions: ["date", "告警次数(次)"],
    source: [],
})
const printRef = useRef()
const reactToPrintContent = useCallback(() => {
  return printRef.current;
}, [printRef.current])

// 导出
const downloadReport = () => {
 
  //先生成图片再导出
  html2canvas(reactToPrintContent(), {
    // 导出pdf清晰度
    allowTaint: true,
    taintTest: false,
    scale: '1',//设置放大倍数
    height: reactToPrintContent().scrollHeight,
    windowHeight: reactToPrintContent().scrollHeight,
    // dpi: '192',
    background: '#fff',
    // 开启跨域配置
    useCORS: true,//支持图片跨域
  }).then((canvas) => {
   

    let contentWidth = canvas.width;
    let contentHeight = canvas.height;
    // 一页pdf显示html页面生成的canvas高度;
    let pageHeight = contentWidth / 592.28 * 841.89;
    // 未生成pdf的html页面高度
    let leftHeight = contentHeight;
    // pdf页面偏移
    let position = -8;
    // html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
    let imgWidth = 595.28;
    let imgHeight = 592.28 / contentWidth * contentHeight;

    let pageData = canvas.toDataURL('image/jpeg', 1);
    let pdf = new jsPDF('', 'pt', 'a4');
    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    
    
    pdf.save('运行报告.pdf');
  });
}



// 打印 start




const handlePrint = useReactToPrint({
  content: reactToPrintContent,
})
 
const onPrint = () => {  
  try {
    if(!loading) return message.warning('请先生成报告', 0.3)  
    handlePrint()
  } catch (error) {
    console.log(error)
  }

}

// 打印 end
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
         let {profitDetail: {x=[], y=[], y1=[], y2=[]}, chargeDetail={}, chargeDurationDetail={}, temperatureHumidityDetail=[], airConditionDurationDetail={}, alarmDetail={}} = datas          
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
               if (x.length > 0) {
                x.unshift('日期')
                y.unshift('充电时长(h)')
                y1.unshift('放电时长(h)')
                return {
                 source: [x, y, y1]
                }
               } else {
                return  {  
                  dimensions: ["日期", '充电时长(h)', '放电时长(h)'],
                  source: [],
                }
               }
              
             })
             setAdataset(() => {
              let {x=[], y=[]} = airConditionDurationDetail
              if (x.length > 0 ) {
                x.unshift('日期')
                y.unshift('空调运行时长(h)')
                return {
                  source: [x, y]
                }
              }else {
                return {  
                  dimensions: ["日期", "空调运行时长(h)"],
                  source: [],
              }
              }
             
             })

             setWadataset(() => {
              let {x=[], y=[]} = alarmDetail
              if (x.length > 0 ) {
                x.unshift('日期')
                y.unshift('告警次数(h)')
                return {
                  source: [x, y]
                }
              }else {
                return {  
                  dimensions: ["日期", "告警次数(h)"],
                  source: [],
              }
              }
             })
             setLoading(true)
            /*  setWdataset(() => {
              if(temperatureHumidityDetail.length < 1) return {source: []}
              let {x=[], y=[], y1=[]} = temperatureHumidityDetail[0]
              x.unshift('日期')
              y.unshift('温度')
              y1.unshift('湿度')
              return {
               source: [x, y, y1]
             }
            }) 暂时不显示 */
 
    }else {
      setReprotData({})
      setLoading(false)
      message.error({content: errMsg || '数据出错', duration: 0.3})
    }
  } catch (error) {
      console.log(error)
      setLoading(false)
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
      bref.current, {
        dataset: bdataset,
        grid,
        color: ['#5c90f8', '#62daab'],
       series: [{ type: "line", seriesLayoutBy: 'row', }, { type: "line", seriesLayoutBy: 'row', }]
     }
   )
  }, [bdataset])
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
      aref.current, {
        dataset: adataset,
        grid: {
          ...grid,
          top: '64px'
        },
        legend: {
          top: '32px'
        },
        title:{
          text:  '5. 空调运行时长统计',
          ...etitle,
          
        },
        color: ['#5c90f8'],
       series: [{ type: "bar", seriesLayoutBy: 'row', }]
     }
   )
  }, [adataset])

  useEffect(() => {
    drawEcharts(
      warnref.current, {
        dataset: wadataset,
        grid: {
          ...grid,
          top: '64px'
        },
        legend: {
          top: '32px'
        },
        title:{
          text:  '7. 告警趋势统计',
          ...etitle,
          
        },
        color: ['#5c90f8'],
       series: [{ type: "bar", seriesLayoutBy: 'row', }]
     }
   )
  }, [wadataset])
  /* useEffect(() => {
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
  }, [wdataset])  暂时不显示*/
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
                    <CustButton wh="192px" src="print" onClick={onPrint}>打印报告</CustButton>
                    <CustButton wh="192px" src="export" onClick={downloadReport}>导出报告</CustButton>
             </div>
               
              
          </Titlelayout>      
          </div>
          <div>
          <div className='right printContet' ref={printRef} id="printRef">
                         
               <Front>
                   <div className='title'>
                    <Image src={log} height={57} preview={false}></Image>
                    <span className='name'>正泰综合能源服务平台</span>
                   </div>
                   <div className="frontcont">
                   <div className='head'>
                      <h1>储能系统分析报告</h1>
                      <div className='box'>
                          <p>项目名称：{reportData.projectName}</p>
                          <p>项目地址：{reportData.projectAddress}</p>
                          <p>报告日期：{reportData.reportDate}</p>
                      </div>
                   </div>
                   </div>
                   <Image src={bg} preview={false} ></Image>
               </Front>
              
               {
               loading && <>
                <div className="page-break" />
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
               <div className="page-break" />
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
               <div className="page-break" />
               <Ccontent rows='1fr 1fr'>
                 <div className='header'>
                   <span>储能系统分析报告</span>
                   <span>本期报告分析周期为： {moment(reportData.reportDate).format('YYYY-MM')+'月'}</span>
                 </div>
                 <div className='main'>                   
                   <div ref={bref} >
                      
                   </div>
                   <div ref={aref}></div>
                  {/*  <div ref={wref} ></div> 暂时不显示*/}
                 </div>
                  
               </Ccontent>
               <div className="page-break" />
               <Ccontent count={1}>
                 <div className='header'>
                   <span>储能系统分析报告</span>
                   <span>本期报告分析周期为： {moment(reportData.reportDate).format('YYYY-MM')+'月'}</span>
                 </div>
                 <div className='main'>
                   <DesItem title="6. 告警信息" bordered size='small' layout='vertical' bgColor="#f60">
                      <DesItem.Item label="PCS告警">{reportData.pcsAlarmCount}</DesItem.Item>
                      <DesItem.Item label="电池告警">{reportData.batteryAlarmCount}</DesItem.Item>
                      <DesItem.Item label="温度告警">{reportData.temperatureAlarmCount}</DesItem.Item>

                      <DesItem.Item label="烟雾告警">{reportData.smokeAlarmCount}</DesItem.Item>
                      <DesItem.Item label="火灾告警">{reportData.fireAlarmCount}</DesItem.Item>
                      <DesItem.Item label="SOC低">{reportData.socLowAlarmCount}</DesItem.Item>
                   </DesItem>
                   <div  ref={warnref} ></div>
                 </div>
                  
               </Ccontent>
               </>
               }
          </div>
          </div>
          </Mainbox>
    
  )
}

export default function Index(props) {
    return (
        <Maincom {...props}     />
    )
}