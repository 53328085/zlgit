import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, DatePicker, message, Table } from 'antd'
import UseTable from '@com/useTable'
import logo from '@imgs/chintlog.png'
import PageComp from './pagecomp.jsx'
import { safeElectric } from '@api/api'
import moment from 'moment'
import { PieCharts, LineCharts } from './charts'
import anaylse from './imgs/anaylse.svg'
import {exportPDF} from './topdf.js'
import imgurl from '@imgs/index'
import ReactToPrint from 'react-to-print';
import { systemConfigInfo} from '@redux/systemconfig'
import './index.less'
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)
  const {chineseTitle} = useSelector(systemConfigInfo)
  // const arealist = useSelector(state => state.system.onelevel)
  const [active, setActive] = useState(1)
  const [datevalue, setDatevalue] = useState()
  const [isshow, setIsshow] = useState(false)
  const [report, setReport] = useState()
  const [projectMes, setProjectMes] = useState([{ name: '项目名称', message: '', }, { name: '项目地址', message: '' }])  //项目情况
  const [elec, setElec] = useState([{ name: '最大电流发生时间', message: '', }, { name: '最大电流发生位置', message: '', }, { name: '最大电流值', message: '', }])  //电流监控  
  const printRef =useRef()
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
  useEffect(() => {
    console.log(printRef)
  }, [])
  return (
    <div className={style.container}>
      <div className={style.leftcss}>
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
            className={active === 1 ? style.active : ''}
            style={{ flex: 1, textAlign: 'center', border: '1px solid #d7d7d7', height: 40, lineHeight: '40px' }}
          >月份报告
          </div>
          <div
            onClick={() => { setActive(2);setIsshow(false);setReport(null) }}
            className={active === 2 ? style.active : ''}
            style={{ flex: 1, textAlign: 'center', border: '1px solid #d7d7d7', marginLeft: -1, height: 40, lineHeight: '40px' }}>
            年度报告
          </div>
        </div>
        <DatePicker picker={active === 1 ? 'month' : 'year'} style={{ width: '100%' }} defaultValue={moment()} onChange={changeDate} />
        <Divider dashed style={{ borderColor: '#d7d7d7', margin: '48px 0' }} />
        <div className={style.btnscsss} onClick={makeReport}>
         <img src={imgurl.searchFile} alt="" style={{marginRight:8}}/> 生成报告
        </div>
        <ReactToPrint
        trigger={()=>{return(<div className={style.btnscsss} >
          <img src={imgurl.print} alt="" style={{marginRight:8}}/> 打印报告
          </div>) }}
        content={()=>printRef.current}>

        </ReactToPrint>
        {/* <div className={style.btnscsss} >
        <img src={imgurl.print} alt="" style={{marginRight:8}}/> 打印报告
        </div> */}
        <div className={style.btnscsss} onClick={()=>{exportPDF('pdf','pdfid')}}>
        <img src={imgurl.export} alt="" style={{marginRight:8}}/> 导出报告
        </div>
      </div>
      <div className={style.rightcss} >
        <div id='pdfid' ref={printRef}>
        <div className={style.report} style={{ marginBottom: isshow ? 24 : 0 }}>
          <div style={{ padding: 16 }}>
            <img src={logo} alt="" style={{ width: 77, height: 58, marginRight: 16 }} />
            <span style={{ fontSize: 20 }}>{chineseTitle}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
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
          <div className={style.bgimage}></div>
        </div>
        {isshow ? <>
          <PageComp>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>1.项目情况</p>
              <UseTable columns={columns1} dataSource={projectMes} showHeader={false} />

            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>2.电气安全详情</p>
              <div className={style.gridcss}>
                <div style={{ backgroundColor: '#ff6600', color: '#fff' }}>总报警次数</div>
                <div style={{ backgroundColor: '#ff6600', color: '#fff' }}>最大电流</div>
                <div style={{ backgroundColor: '#ff6600', color: '#fff' }}>最大电压</div>
                <div>{report?.alarmCnt ? report.alarmCnt : '/'}</div>
                <div>{report?.iMaxContent ? report?.iMaxContent : '/'}</div>
                <div>{report?.uMaxContent ? report.uMaxContent : '/'}</div>
                <div style={{ backgroundColor: '#ff6600', color: '#fff' }}>剩余电流</div>
                <div style={{ backgroundColor: '#ff6600', color: '#fff' }}>最高温度</div>
                <div style={{ backgroundColor: '#ff6600', color: '#fff' }}>烟雾报警</div>
                <div>{report?.irMaxContent ? report.irMaxContent : '/'}</div>
                <div>{report?.tMaxContent? report?.tMaxContent: '/'}</div>
                <div>{report?.smokeAlarmCnt ? report?.smokeAlarmCnt : '/'}</div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>2.1告警类型分布</p>
              <PieCharts data={report?.alarmTypeGroup} />
            </div>
          </PageComp>

          <PageComp>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>3.电流监控</p>
              <UseTable columns={columns2} dataSource={elec} showHeader={false} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>4.电压监控</p>
              <UseTable columns={columns2} dataSource={voltage} showHeader={false} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>5.剩余电流监控</p>
              <UseTable columns={columns2} dataSource={leaveElec} showHeader={false} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>6.温度监控</p>
              <UseTable columns={columns2} dataSource={temperature} showHeader={false} />
            </div>
          </PageComp>

          <PageComp>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>7.用电量趋势</p>
              <div style={{ width: 514, height: 320 }}>
                <LineCharts data={report?.eTrend} type={active}/>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 6 }}>7.1用电量类型分布</p>
              <div style={{ width: 516, height: 320 }}>
                <PieCharts data={report?.eTypeGroup}/>
              </div>

            </div>
          </PageComp>
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
  )
}


