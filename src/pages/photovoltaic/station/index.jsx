import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Building from '@com/building'
import * as XLSX from "xlsx";
import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { adaptation } from "@redux/systemconfig";
import { useReactive, useRequest } from "ahooks";
import Pagecount from "@com/pagecontent";
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout'
import UserTable from "@com/useTable";
import powerStation from './images/powerStation.png'
import inverter from './images/inverter.png'
import installedCapacity from './images/installedCapacity.png'
import runtimeDuration from './images/runtimeDuration.png'
import { DatePicker, Table, Checkbox, Space, Radio, Divider, Select, Tree, Button, message, Form} from "antd";
import { CustButtonT, ExportExcel, CustButton, ExportButton } from '@com/useButton'
import { Container, TopBox, FotterBox, Header } from "./style";

import { isObject,getTime } from '@com/usehandler';
import moment from "moment";
 
import { useNavigate, Link } from "react-router-dom";
import SolarPowerGenerationChart from './weatherEcharts.js';
import  {useQueryGirdCabinetInfo, useQueryInverterList,useQueryEnergyTrend} from './api'
import {options} from './data'
import imgurl from './images/index' 
const { RangePicker } = DatePicker;
const fs = {
  fc: '#333'
}
export default function Index() {
    const [form] = Form.useForm()
    const mode = Form.useWatch('mode', form)
    let { exparams } = useOutletContext()
    
    const { projectId, cabinet, refresh } = exparams || {cabinet:{value: ''}}
    const  {value: cabinetId} = cabinet || {value:NaN}
     
    const [cabinetDtl, setCabinetDtl] = useState({})
    const {coalInfo={},generationInfo={}  } =cabinetDtl || {}
    const [cabinetList, setCabinetList] = useState([])
    const [curstate, setCurstate] = useState("1")
    const [weather, setWeather] = useState({})
   
    const [filtrlist, states] = useMemo(()=> {
       let filtrlist = curstate == 0 ? cabinetList: cabinetList.filter(f => f.state == curstate)
       let all =  cabinetList?.length;
       let online= cabinetList.filter(f=>f.state==1)?.length ;
       let offline = cabinetList.filter(f=>f.state!=1)?.length;
       let states=[
        {label:`全部 (${all})`,value:'0'},
        {label: `在线 (${online})`,value:'1'},
        {label: `离线 (${offline})`,value:'2'},
     
    ]
       
      return [filtrlist, states]
    },[cabinetList, curstate])
    const weatherOpt = useMemo(()=> {
   
    return {
      series: [{ type: "bar", seriesLayoutBy: 'row' }], // [{ type: "bar",seriesLayoutBy: 'row' }], 
      grid: {
        left: "0px",
        right: "0",
        top: "40px",
        bottom: "16px",
        containLabel: true,
      },
      legend:{
        show: false,
      },
     /*  legend: {
        top: "5px",
      },
      xAxis: {
        type: 'category',
  
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => value + unit
        }
      }, */
      dataset: {
        dimensions:[{
          name: '时间', type: "date",
        }, {name: "发电量"}],
        source:[Array.isArray(weather?.x) ? weather?.x : [], Array.isArray(weather?.y) ? weather?.y : []],
        sourceHeader: false,
      },
     /*  toolbox: {
        show: true,
        feature: {
          magicType: {
            type: ['line', 'bar',]
          },
          saveAsImage: {},
  
        },
        top: "5px",
        right: "10px"
      } */
    }



    },[weather])
 

  const queryInfo=async()=> {
    try {
      
      let {success, data} =  await useQueryGirdCabinetInfo({projectId, cabinetId})
      if(success && isObject(data)) {
        setCabinetDtl(data)
      }else{
        setCabinetDtl({})
      }
    } catch (error) {
      
    }
  }
  const getList=async()=> { 
    try {
      let {success, data} = await useQueryInverterList({projectId, cabinetId})
      if(success && Array.isArray(data)){
        setCabinetList(data)
      }else {
        setCabinetList([])
      }
    } catch (error) {
      
    }
  }
  const getTrend =async()=> {
    try {
      let values = form.getFieldsValue();
      console.log("values",values)
      const {type, date} = values
      let body = {
        projectId,
        cabinetId,
        type,
        date:getTime(date, type)
      }
      let {success, data} = await useQueryEnergyTrend({}, body)
      if(success && isObject(data?.detail)){
        setWeather(data?.detail)
      }else {
        setWeather({})
      }
    } catch (error) {
      console.log(error)
    }
    
   }
  useEffect(() => {
   
    if(Number.isInteger(parseInt(projectId)) && Number.isInteger(parseInt(cabinetId)) && refresh){
      
      queryInfo()
      getList()
      getTrend()
    }
   
  }, [projectId, cabinetId,refresh])





  let { laptop } = useSelector(adaptation)
  const comoptionfn = (laptop) => ({
    type: 5,
    tooltip: {
      formatter: ' {b}<br/>{c}'
    },
    color: ['#6395fa'],
    series: [{
      type: 'gauge',
      min: 0,
      max: 3000,
      center: ["50%", "50%"],
      radius: laptop ? 65 : 110,
      progress: {
        show: true,
      },
      axisLine: {
        lineStyle: {
          width: laptop ? 8 : 10
        }
      },
      splitLine: {
        lineStyle: {
          width: 1,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 12,
        color: '#999',
        fontSize: laptop ? 7 : 9
      },
      anchor: {
        show: true,
        showAbove: true,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        offsetCenter: [0, '40%'],
        fontSize: laptop ? 20 : 30
      },


    }]

  })
  let comoption = comoptionfn(laptop)
  const custoption =useMemo(() => ({
    ...comoption,
    series: [
      {
        ...comoption.series[0],
        data: [
          {
            title: {
              show: true,
              fontSize: laptop ? "12px" : "14px",
              offsetCenter: [0, "70%"]
            },
            value: cabinetDtl?.curPower,
            name: "实时功率(kW)",
          }
        ]
      }
    ]
  }), [cabinetDtl])

 

 
  const tableRef = useRef()
  
  
 
 
  const disabledDate = (current) => {
    return current > moment().endOf('day');
  };

 

  const columns = [
    {
      title: "时间",
      dataIndex: `time`,
      align: 'center',
      width: 120,
      sorter: (a, b) => {
        const aTime = a.time.split(':').map(Number);
        const bTime = b.time.split(':').map(Number);
        return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1]);
      },
      sortDirections: ['ascend', 'descend'],
    }, {
      title: "发电量 (kWh)",
      dataIndex: `kWh`,
      align: 'center',
      sorter: (a, b) => a.kWh - b.kWh,
    }, {
      title: "天气状态",
      dataIndex: `weather`,
      align: 'center',
      render(_, record) {
        return (
          <div>{record.weather == 1 ? '晴' :
            record.weather == 2 ? '多云' :
              record.weather == 3 ? '雨' :
                '未知'}</div>
        )
      }
    }
  ]
  const tabledata = [
    { time: "00:00", kWh: 250.54, weather: 1 },
    { time: "01:00", kWh: 22, weather: 1 },
    { time: "02:00", kWh: 18.5, weather: 2 },
    { time: "03:00", kWh: 16.8, weather: 3 },
    { time: "04:00", kWh: 15.2, weather: 3 },
    { time: "05:00", kWh: 14.7, weather: 2 },
    { time: "06:00", kWh: 8.9, weather: 1 },
    { time: "07:00", kWh: 35.6, weather: 1 },
    { time: "08:00", kWh: 48.9, weather: 1 },
    { time: "09:00", kWh: 52.3, weather: 1 },
    { time: "10:00", kWh: 49.8, weather: 1 },
    { time: "11:00", kWh: 45.2, weather: 1 },
    { time: "12:00", kWh: 42.7, weather: 1 },
    { time: "13:00", kWh: 40.1, weather: 2 },
    { time: "14:00", kWh: 38.5, weather: 2 },
    { time: "15:00", kWh: 36.9, weather: 1 },
    { time: "16:00", kWh: 39.2, weather: 1 },
    { time: "17:00", kWh: 44.8, weather: 1 },
    { time: "18:00", kWh: 52.1, weather: 1 },
    { time: "19:00", kWh: 58.7, weather: 2 },
    { time: "20:00", kWh: 62.3, weather: 3 },
    { time: "21:00", kWh: 59.8, weather: 3 },
    { time: "22:00", kWh: 48.5, weather: 2 },
    { time: "23:00", kWh: 32.1, weather: 2 }
  ]

  const navigate = useNavigate();
  const toDevicePage = (item) => {
    navigate(`/index/runtimeSolar/device`, {
      state: {
        type: 'index', primary: 'runtimeSolar', title: '逆变器监控', nested: 'device'
      }
    })
  }

  const onExport = async () => {
    tableRef.current.download()
  }
  const typeChange = (e)=>{
     if(e!=3) {
      form.setFieldValue('date', moment())
     }
     getTrend()
  }
  return (
    // <div style={{flex: 1, display:"flex", justifyContent: 'center', alignContent: 'center'}}>
    //   <Building pagename="电站监控" />
    // </div>
    < Pagecount bgcolor="#eeeff4" pd={0} >
      <Container>
        <TopBox>
          <Titlelayout title={'并网柜信息'} {...fs}>
            <div className='infoBox1'>
              <img src={powerStation} className='powerStation' />
              <div className='content'>
                <div className='info'>
                  <span></span><span>名  称： </span> <span className='value'>{cabinetDtl?.name}</span></div>
                <div className='info'>
                  <span></span> <span>编  号：</span> <span className='value'>{cabinetDtl?.no}</span></div>
                <div className='info'>
                  <span></span> <span>总表名称：</span><span className='value'>{cabinetDtl?.meterName}</span></div>
                <div className='info'>
                  <span></span> <span>总表编号：</span><span className='value'>{cabinetDtl?.meterSn}</span></div>
                <div className='info'>
                  <span></span><span>安装地址：</span> <span className='value'>{cabinetDtl?.address}</span></div>
              </div>
            </div>
            <div className='powerNum'>
              <div className='numBox'>
                <img src={inverter} className='powerIcon' />
                <div className='num'>
                  <div>{cabinetDtl?.inverterCnt}</div>
                  <div>逆变器(个)</div>
                </div>
              </div>
              <div className='numBox'>
                <img src={installedCapacity} className='powerIcon' />
                <div className='num'>
                  <div>{cabinetDtl?.installedCapacity}</div>
                  <div>装机容量(kW)</div>
                </div>
              </div>
              <div className='numBox'>
                <img src={runtimeDuration} className='powerIcon' />
                <div className='num'>
                  <div>{cabinetDtl?.workHours}</div>
                  <div>运行时长(h)</div>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout
            title={'发电实时功率'}
            extra={
              <>
                <Header>
                  <Link
                    className='historicalData'
                    to={`/deviceDetail?sn=${encodeURIComponent("202304220001")}&deviceStyle=${encodeURIComponent(1)}`}
                    target="_blank"
                  >
                    历史数据
                  </Link>
                </Header>
              </>
            }>
            <Ichart custoption={custoption} />
          </Titlelayout>
          <Titlelayout title={'发电概览'}>
            <div className='infoBox2'>
              <div className='info'>
                <div className='box'>
                  <img src={imgurl['df']} className='powerIcon' />
                  <div className='num'>
                    <div>{generationInfo?.dayGeneration}</div>
                    <div>本日发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={imgurl['mf']} className='powerIcon' />
                  <div className='num'>
                    <div>{generationInfo?.monthGeneration}</div>
                    <div>本月发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={imgurl['yf']} className='powerIcon' />
                  <div className='num'>
                    <div>{generationInfo?.yearGeneration}</div>
                    <div>本年发电量(kWh)</div>
                  </div>
                </div>
              </div>

              <div className='info'>
                <div className='box'>
                  <img src={imgurl['ds']} className='powerIcon' />
                  <div className='num'>
                    <div>{generationInfo?.dayIncome}</div>
                    <div>本日发电收益(元)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={imgurl['ms']} className='powerIcon' />
                  <div className='num'>
                    <div>{generationInfo?.monthIncome}</div>
                    <div>本月发电收益(元)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={imgurl['ys']} className='powerIcon' />
                  <div className='num'>
                    <div>{generationInfo?.yearIncome}</div>
                    <div>本年发电收益(元)</div>
                  </div>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout title={'碳排概览'}>
            <div className='infoBox2'>
              <div className='info'>
                <div className='box'>
                  <img src={imgurl['dc']} className='powerIcon' />
                  <div className='num'>
                    <div>{coalInfo?.dayCoal}</div>
                    <div>本日等效碳排(kg)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={imgurl['mc']} className='powerIcon' />
                  <div className='num'>
                    <div>{coalInfo?.monthCoal}</div>
                    <div>本月等效碳排(kg)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={imgurl['yc']} className='powerIcon' />
                  <div className='num'>
                    <div>{coalInfo?.yearCoal}</div>
                    <div>本年等效碳排(kg)</div>
                  </div>
                </div>
              </div>
            </div>

          </Titlelayout>
        </TopBox>
        <FotterBox>
          <Titlelayout title={'逆变器'} layout="flex" extra={
            <Header>
              <div style={{ marginRight: "16px" }}>
                <Radio.Group options={states} value={curstate} onChange={(e)=>{
                  setCurstate(e.target.value)
                }}  optionType="button"
        buttonStyle="solid"></Radio.Group>                
              </div>
            </Header>}>

            <div className='infoBox3'>
              {filtrlist?.map((item, index) => (
                <div className='box' key={index} onClick={() => toDevicePage(item)} >
                  <div className={`title ${item.state == 1 ? 'online' : 'offline'}`}>
                    {item.name} ({item.sn})
                  </div>
                  <div className='con'>
                    <div className='top'>
                      <img src={runtimeDuration} className='powerIcon' />
                      <div className='info'>
                        <div><span className='name'>状 态：</span>
                          <span className={`status ${item.state == 1 ? 'online' : 'offline'}`}></span>
                          {item.state == 1 ? '并网' : '等待'}</div>
                        <div><span>型 号：</span> {item.category}</div>
                        <div><span className='name'>安装地址：</span>{item.address}</div>
                      </div>
                    </div>
                    <div className='bottom'>
                      <div><span className='name'>实时发电功率(kW)</span><div className='num'>{item.curPower}</div></div>
                      <div><span className='name'>当日发电量(kWh)</span><div className='num'>{item.curGeneration}</div></div>
                    </div>
                  </div>
                </div>))}
            </div>
          </Titlelayout>

          <Titlelayout title={'光伏发电量趋势'} layout="flex" extra={
            <Header> 
                <Form form={form} layout='inline'>
                  <Space size={16}> 
                  <Form.Item name="type" initialValue="1">
                    <Select   style={{ width: 96}} 
                  onChange={typeChange}
                  options={[
                    { value: '1', label: '日', },
                    { value: '2', label: '月', },
                    { value: '3', label: '年' },
                    // { value: '4', label: '自定义' },
                  ]}
                />
                </Form.Item>
                <Form.Item name="date" initialValue={moment()} >
                  <DatePicker picker={["date","date", "month","year"][Form.useWatch("type",form)]} style={{ width: 240 }} onChange={getTrend}   disabledDate={disabledDate} />
                 </Form.Item> 
                <Form.Item name="mode" initialValue="1">
                <Radio.Group
                block
                options={options}
                optionType="button"
                buttonStyle="solid"
                onChange={getTrend}
              />
                </Form.Item> 
              <CustButtonT text="export" src='export' onClick={onExport} disabled={mode == 1} />
              </Space>
              </Form>
            </Header>
          }>
            {mode == 1 ?
               <div style={{flex:1, display: "flex"}}>
                <Ichart  {...weatherOpt} />
               </div> :
              <UserTable
                scroll={{ y: 280 }} columns={columns} dataSource={[]}

                summary={(pageData) => {
                  let eleTotal = 0
                  pageData?.forEach(({ kWh }) => {
                    eleTotal = Math.round((eleTotal + kWh) * 100) / 100
                  });

                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row style={{ backgroundColor: "#f6f6f6", textAlign: "center" }}>
                        <Table.Summary.Cell index={0} >汇总</Table.Summary.Cell>
                        <Table.Summary.Cell index={1} colSpan={2} >{eleTotal}</Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>)
                }}
              >
              </UserTable>}
            <UserTable
              style={{ display: 'none' }} // 隐藏表格
              columns={columns} dataSource={tabledata}
              ref={tableRef} sheetName='光伏发电量趋势.xlsx'
              summary={(pageData) => {
                let eleTotal = 0
                pageData?.forEach(({ kWh }) => {
                  eleTotal = Math.round((eleTotal + kWh) * 100) / 100
                });

                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ backgroundColor: "#f6f6f6", textAlign: "center" }}>
                      <Table.Summary.Cell index={0} >汇总</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={2} >{eleTotal}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>)
              }}
            >
            </UserTable>
          </Titlelayout>
        </FotterBox>
      </Container >
    </Pagecount >
  )
}
