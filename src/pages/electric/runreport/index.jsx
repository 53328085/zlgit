import React, { useEffect, useRef, useState,useCallback } from 'react'
import { Provider, useSelector } from 'react-redux'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, DatePicker, message } from 'antd'
import UseTable from '@com/useTable'
import logo from '@imgs/chintlog.png'
import PageComp from './pagecomp.jsx'
import { safeElectric } from '@api/api'
import moment from 'moment'
 
import { drawEcharts } from "@com/useEcharts"; 
import anaylse from './imgs/anaylse.svg'
import {exportPDF} from './topdf.js'
import imgurl from '@imgs/index'
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import './index.less'
import CusContext from '@com/content'
import styled from 'styled-components'
import backimg  from '@imgs/backimg.png'
import { systemConfigInfo} from '@redux/systemconfig.js'
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
        background-color: #237ae4;
        color: #fff;
        }
        .btnscsss{
            width: 192px;
            height: 36px;
            background-color: #237ae4;
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
       

    }
}
`
const RightDiv =styled.div`
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
const GridDiv =styled.div`
      display: grid;
      grid-template-rows: repeat(4,32px);
      grid-template-columns: repeat(3,172px);  
      .titlecolor{
        background: #ff6600;
        color: #fff;
      }
      .divcss{
        border: 1px solid #ccc; 
        text-align: center;   
        line-height: 32px;
        &:nth-child(3n+1){
          margin-bottom: -1px;
          margin-right: -1px;
        }
        &:nth-child(3n+2){
          margin-bottom: -1px;
          margin-right: -1px;
        }
        &:nth-child(3n){
          margin-bottom: -1px;
          margin-right: -1px;
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
  const [projectMes, setProjectMes] = useState([{ name: '项目名称', message: '', }, { name: '项目地址', message: '' }])  //项目情况
  const [elec, setElec] = useState([{ name: '最大电流发生时间', message: '', }, { name: '最大电流发生位置', message: '', }, { name: '最大电流值', message: '', }])  //电流监控  
 
  const {chineseTitle} = useSelector(systemConfigInfo)
  const [voltage, setVoltage] = useState([{
    name: '最大电压发生时间',
    message: '',
  },
  {
    name: '最大电压发生位置',
    message: '',
  },
  {
    name: '最大电压值',
    message: '',
  },])  //电压监控
  const [leaveElec,setLeaveElec]=useState([
    {
      name: '最大剩余电流发生时间',
      message: '',
    },
    {
      name: '最大剩余电流发生位置',
      message: '',
    },
    {
      name: '最大剩余电流值',
      message: '',
    },
  ])  //剩余电流
  const [temperature,setTemperature]=useState([{
    name: '最高温度发生时间',
    message: '',
  },
  {
    name: '最高温度发生位置',
    message: '',
  },
  {
    name: '最高温度值',
    message: '',
  },])
  const columns1 = [
    { title: '', dataIndex: 'name', width: 100, align: 'center' },
    { title: '', dataIndex: 'message', align: 'center' }
  ]
  const columns2 = [
    { title: '', dataIndex: 'name', width: 200, },
    { title: '', dataIndex: 'message', },

  ]
  const printRef =useRef()
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
          message: data.uMaxSn?data.uMaxTime:'/',
        },
        {
          name: '最大电压发生位置',
          message: data.uMaxSn?data.uMaxAddress:'/'          ,
        },
        {
          name: '最大电压值',
          message:data.uMaxSn?data.uMaxContent:'/',
        },]
      )
      setLeaveElec([
        {
          name: '最大剩余电流发生时间',
          message: data.irMaxSn?data.irMaxTime:'/',
        },
        {
          name: '最大剩余电流发生位置',
          message: data.irMaxSn?data.irMaxAddress:'/',
        },
        {
          name: '最大剩余电流值',
          message: data.irMaxSn?data.irMaxContent:'/',
        },
      ])
      setTemperature([{
        name: '最高温度发生时间',
        message: data.tMaxSn?data.tMaxTime:'/',
      },
      {
        name: '最高温度发生位置',
        message: data.tMaxSn?data.tMaxAddress:'/',
      },
      {
        name: '最高温度值',
        message: data.tMaxSn?data.tMaxContent:'/',
      },])
    } else {
      message.error(res.errMsg)
    }

  }
  //年度报告
  const getYearReport = async (date) => {
    try {
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
       
   } catch (error) {
      
   }
  }
   const pieref = useRef();
   const lineref = useRef();
   const pierefT = useRef();
   useEffect(() => {

    try {
   
    if(Array.isArray(report?.alarmTypeGroup)){
    let data = report?.alarmTypeGroup
    let total = data.map(d => Number(d.value)).reduce((a, b) => a +b, 0)
 
    drawEcharts(pieref.current, {
      pieData: {
         total,
         data,
      },
      type: 3
    })
    }
   if(report?.eTrend && report.eTrend.constructor  == Object) {
      let {x, y, y1, y2, y3, y4} = report.eTrend
      drawEcharts(lineref.current, {
        dataset: {
          dimensions: [
            {name: x, displayName: '时间', type: "time"},
            {name: y, displayName: '用电量(kWh)',  },
            {name: y1, displayName: '尖(kWh)', },
            {name: y2, displayName: '峰(kWh)',  },
            {name: y3, displayName: '平(kWh)',  },
            {name: y4, displayName: '谷(kWh)',  }
          ],
          source: [x, y, y1, y2, y3, y4],
          sourceHeader: false,
        
        },
        series: [
          {type: "line", seriesLayoutBy: 'row'},
          {type: "line", seriesLayoutBy: 'row'},
          {type: "line", seriesLayoutBy: 'row'},
          {type: "line", seriesLayoutBy: 'row'},
          {type: "line", seriesLayoutBy: 'row'},
        ],
        xAxis: {
          axisLabel: {
             formatter: (value, index) => {
               return  active == 2 ?  moment(value, "mm").format('m[月]') :  value
             },
             interval:0,
          },
          axisPointer: {
             label: {
               formatter: ({value}) => { 
                return  active == 2 ?  moment(value, "mm").format('m[月]') :  moment(value, 'DD').format('D') + '日'
              }
             }
          }
        }
      })
   }
       
   if(report?.eTypeGroup && report.eTrend.constructor  == Object) {
    let datas = report?.eTypeGroup
    let totals = datas.map(d => Number(d.value)).reduce((a, b) => a +b, 0)
     drawEcharts(pierefT.current, {
        pieData: {
          pieData: {
            total: totals,
            data: datas,
         },
       

        },
        type: 3

     })


   }

  
  } catch (error) {
      console.log(error)
  }
   }, [report])

  //生成报告
  const makeReport = () => {
    setIsshow(true)
    if (active === 1) {
      getMonthReport(datevalue)
    } else {
      getYearReport(datevalue)
    }
  }
  const disabledDate= (current) => {
    const type =  active === 1 ? 'month' : 'year'
    return current && current > moment().endOf(type);
  };
  useEffect(() => {
    console.log(printRef)
  }, [])
  return (
    <CusContext.Provider value={{active,datevalue}}>
      <ContainerDiv>
      <div className='container'>
      <div className='leftcss'>
        {/* <BlueColumn name={arealist[0]?.levelName} />
        <Select
          options={arealist}
          style={{ width: '100%', marginTop: 32 }}
          fieldNames={{ label: 'name', value: 'id' }}
        ></Select>
        <Divider dashed style={{ borderColor: '#d7d7d7' }} /> */}
        <BlueColumn name="运行报告" />
        <div style={{
          width: 320,
          display: 'flex',
          margin: '32px 0',
          borderRadius: 2,
          cursor: 'pointer'
        }}>
          <div
            onClick={() => { setActive(1); setIsshow(false);setReport(null)}}
            className={active === 1 ? 'active' : ''}
            style={{ flex: 1, textAlign: 'center', border: '1px solid #d7d7d7', height: 40, lineHeight: '40px' }}
          >月份报告
          </div>
          <div
            onClick={() => { setActive(2);setIsshow(false);setReport(null) }}
            className={active === 2 ? 'active' : ''}
            style={{ flex: 1, textAlign: 'center', border: '1px solid #d7d7d7', marginLeft: -1, height: 40, lineHeight: '40px' }}>
            年度报告
          </div>
        </div>
        <DatePicker picker={active === 1 ? 'month' : 'year'} style={{ width: '100%' }} defaultValue={moment()} onChange={changeDate} disabledDate={disabledDate}/>
        <Divider dashed style={{ borderColor: '#d7d7d7', margin: '48px 0' }} />
        <div className='btnscsss' onClick={makeReport}>
         <img src={imgurl.searchFile} alt="" style={{marginRight:8}}/> 生成报告
        </div>
        {/* <ReactToPrint
        trigger={()=>{return(<div className='btnscsss' >
          <img src={imgurl.print} alt="" style={{marginRight:8}}/> 打印报告
          </div>) }}
        content={()=>printRef.current}>

        </ReactToPrint> */}
        <div className='btnscsss' onClick={handlePrint}>
        <img src={imgurl.print} alt="" style={{marginRight:8}} /> 打印报告
        </div>
        <div className='btnscsss' onClick={()=>{exportPDF('pdf','pdfid')}}>
        <img src={imgurl.export} alt="" style={{marginRight:8}}/> 导出报告
        </div>
      </div>
      <div className='rightcss' >
        <div id='pdfid' ref={printRef} className='printContet'>
        <RightDiv>
        <div style={{ padding: 16 }}>
            <img src={logo} alt="" style={{ width: 77, height: 58, marginRight: 16 }} />
            <span style={{ fontSize: 20 }}>{chineseTitle}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',height:470 }}>
            <p style={{ fontSize: 32, color: '#515151', fontWeight: 'bold', marginBottom: 32 }}>电气安全运行分析报告</p>
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
              <p style={{ flex: 1 }}>报告日期:<span style={{ paddingLeft: 24 }}>{report?moment().format('YYYY-MM-DD'):''}</span></p>
            </div>
          </div>
          <div className='bgimage'>
            <img src={backimg} alt="" style={{width:559}}/>
          </div>
        </RightDiv>
        <div className="page-break" />
        {isshow ? <>
          <PageComp >
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>1.项目情况</p>
              <UseTable columns={columns1} dataSource={projectMes} showHeader={false} />

            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>2.电气安全详情</p>
              <GridDiv>
                  <div className='titlecolor divcss' >总报警次数</div>
                <div className='titlecolor divcss' >最大电流</div>
                <div className='titlecolor divcss' >最大电压</div>
                <div className='divcss'>{report?.alarmCnt ? report.alarmCnt : '/'}</div>
                <div className='divcss'>{report?.iMaxContent ? report?.iMaxContent : '/'}</div>
                <div className='divcss'>{report?.uMaxContent ? report.uMaxContent : '/'}</div>
                <div className='titlecolor divcss' >剩余电流</div>
                <div className='titlecolor divcss' >最高温度</div>
                <div className='titlecolor divcss' >烟雾报警</div>
                <div className='divcss'>{report?.irMaxContent ? report.irMaxContent : '/'}</div>
                <div className='divcss'>{report?.tMaxContent? report?.tMaxContent: '/'}</div>
                <div className='divcss'>{report?.smokeAlarmCnt ? report?.smokeAlarmCnt : '/'}</div>
              </GridDiv>
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>2.1告警类型分布</p>
               <div ref={pieref} style={{height: "360px"}}></div>
              {/* <PieCharts data={report?.alarmTypeGroup} /> */}
            </div>
          </PageComp>
          <div className="page-break" />
          <PageComp>
            <div style={{ marginBottom: 24 }} key="1">
              <p style={{ marginBottom: 6 }}>3.电流监控</p>
              <UseTable columns={columns2} dataSource={elec} showHeader={false} />
            </div>
            <div style={{ marginBottom: 24 }} key="2">
              <p style={{ marginBottom: 6 }}>4.电压监控</p>
              <UseTable columns={columns2} dataSource={voltage} showHeader={false} />
            </div>
            <div style={{ marginBottom: 24 }} key="3">
              <p style={{ marginBottom: 6 }}>5.剩余电流监控</p>
              <UseTable columns={columns2} dataSource={leaveElec} showHeader={false} />
            </div>
            <div style={{ marginBottom: 24 }} key="4">
              <p style={{ marginBottom: 6 }}>6.温度监控</p>
              <UseTable columns={columns2} dataSource={temperature} showHeader={false} />
            </div>
          </PageComp>
          <div className="page-break" />
          <PageComp>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>7.用电量趋势</p>
              <div style={{ width: 514, height: 320 }} ref={lineref}>
              {/*   <LineCharts data={report?.eTrend} type={active}/> */}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>7.1用电量类型分布</p>
              <div style={{ width: 516, height: 320 }} ref={pierefT}>
               {/*  <PieCharts data={report?.eTypeGroup}/> */}
              </div>

            </div>
          </PageComp>
          <div className="page-break" />
          <PageComp >
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 68 }}>8.本周期用电安全监测综合分析</p>
              <div style={{
                width: 283, height: 64, backgroundColor: '#237ae4', display: 'flex',
                alignItems: 'center', margin: '0 auto'
              }}>
                <img src={anaylse} alt="" style={{ width: 48, height: 48, margin: '0 42px' }} />
                <span style={{ fontSize: 28, color: '#fff' }}>{
                  report?.result==0?'无': report?.result==1?'优秀': report?.result==2?'良好': report?.result==3?'及格':report?.result==4?'待及':''
                }</span>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>9.建议</p>
              <p>{report?.suggest}</p>
            </div>
          </PageComp>
        </> : null}
        </div>
       

      </div>
      </div>
      </ContainerDiv>
    
    </CusContext.Provider>
    
  )
}


