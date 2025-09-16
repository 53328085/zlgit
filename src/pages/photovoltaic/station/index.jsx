import React, { useEffect, useRef, useState, useCallback } from 'react'
import Building from '@com/building'
import * as XLSX from "xlsx";
import { useSelector } from 'react-redux'
import { adaptation } from "@redux/systemconfig";
import { useReactive } from "ahooks";
import Pagecount from "@com/pagecontent";
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout'
import UserTable from "@com/useTable";
import powerStation from './images/powerStation.png'
import inverter from './images/inverter.png'
import installedCapacity from './images/installedCapacity.png'
import runtimeDuration from './images/runtimeDuration.png'
import { DatePicker, Table, Checkbox, Space, Radio, Divider, Select, Tree, Button, message } from "antd";
import { CustButtonT, ExportExcel, CustButton, ExportButton } from '@com/useButton'
import { Container, TopBox, FotterBox, Header } from "./style";
import moment from "moment";
import dayjs from 'dayjs';
import { useNavigate, Link } from "react-router-dom";
import SolarPowerGenerationChart from './weatherEcharts.js';
const { RangePicker } = DatePicker;
const fs = {
  fc: '#333'
}
export default function Index() {
  const state = useReactive({
    devices: [],
    snGroup: [],
    timeType: 1,
    xAxis: [],
    alltableData: [],
    detailtableData: [],
    tableData: [],
    current: 1,
    pageSize: 10,
    disabled: false,
    groupName: '',
    btnLength: [1, 2, 3],
    active: 0,
    chartsOpts: {
      type: 1,
    },
  });
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
  const custoption = {
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
            value: 413,
            name: "实时功率(kW)",
          }
        ]
      }
    ]
  }

  const [indeterminateAll, setIndeterminateAll] = useState(false)
  const [indeterminateOnline, setIndeterminateOnline] = useState(false)
  const [indeterminateOffline, setIndeterminateOffline] = useState(false)

  const [checkedAll, setCheckedAll] = useState(true)
  const [checkedOnline, setCheckedOnline] = useState(false)
  const [checkedOffline, setCheckedOffline] = useState(false)

  const allChagne = (e) => {
    if (e.target.checked) {
      setCheckedAll(true)
      setCheckedOnline(false)
      setCheckedOffline(false)
    } else {
      setCheckedAll(false)
    }
    setIndeterminateAll(false)
  }
  const onlineChagne = (e) => {
    if (e.target.checked) {
      setCheckedAll(false)
      setCheckedOnline(true)
      setCheckedOffline(false)
    } else {
      setCheckedOnline(false)
    }
    setIndeterminateOnline(false)
  }
  const offlineChagne = (e) => {
    if (e.target.checked) {
      setCheckedAll(false)
      setCheckedOnline(false)
      setCheckedOffline(true)
    } else {
      setCheckedOffline(false)
    }
    setIndeterminateOffline(false)
  }
  const tableRef = useRef()
  const today = moment().startOf('day');
  const tmonth = moment().startOf('month')
  const tyear = moment().startOf('year')
  const params = useReactive({
    siteId: 1,
    structureIds: [],
    type: 1,
    startDate: moment(today).format('YYYY-MM-DD'),
    endDate: moment(today).format('YYYY-MM-DD'),
  });

  const changeTime = (e) => {
    console.log(e)
    params.type = parseInt(e)
    if (params.type == 1) {
      params.startDate = moment(today).format('YYYY-MM-DD')
      params.endDate = moment(today).format('YYYY-MM-DD')
    } else if (params.type == 2) {
      params.startDate = moment(tmonth).format('YYYY-MM') + '-01'
      params.endDate = moment(tmonth).format('YYYY-MM') + '-01'
    } else if (params.type == 3) {
      params.startDate = moment(today).format('YYYY') + '-01-01'
      params.endDate = moment(today).format('YYYY') + '-01-01'
    } else {
      params.startDate = moment(today).format('YYYY-MM-DD')
      params.endDate = moment(today).format('YYYY-MM-DD')
    }
  }//切换日月年

  const onChangeDate = (date, dateString) => {
    if (!dateString) return;
    if (params.type == 1) {
      params.startDate = dateString
      params.endDate = dateString
    } else if (params.type == 2) {
      params.startDate = dateString + '-01'
      params.endDate = dateString + '-01'
    } else if (params.type == 3) {
      params.startDate = dateString + '-01-01'
      params.endDate = dateString + '-01-01'
    } else {
      params.startDate = dateString[0]
      params.endDate = dateString[1]
    }
  };
  const disabledDate = (current) => {
    return current > dayjs().endOf('day');
  };
  const options = [
    {
      label: '图表模式',
      value: 1,
    },
    {
      label: '列表模式',
      value: 2,
    },
  ];
  const inverterData = [
    {
      name: '1#逆变器',
      sn: '10232125322',
      status: 1,
      category: 'NBQ-293',
      address: '东区光伏车棚文字较长的情况',
      kw: 1123.0,
      kwh: 2893049,
    },
    {
      name: '2#逆变器',
      sn: '10232125322',
      status: 1,
      category: 'NBQ-293',
      address: '东区光伏车棚文字较长的情况',
      kw: 1123.0,
      kwh: 2893049,
    },
    {
      name: '3#逆变器',
      sn: '10232125322',
      status: 1,
      category: 'NBQ-293',
      address: '东区光伏车棚文字较长的情况',
      kw: 1123.0,
      kwh: 2893049,
    },
    {
      name: '4#逆变器',
      sn: '10232125322',
      status: 2,
      category: 'NBQ-293',
      address: '东区光伏车棚文字较长的情况',
      kw: 1123.0,
      kwh: 2893049,
    },
    {
      name: '5#逆变器',
      sn: '10232125322',
      status: 2,
      category: 'NBQ-293',
      address: '东区光伏车棚文字较长的情况',
      kw: 1123.0,
      kwh: 2893049,
    },
    {
      name: '6#逆变器',
      sn: '10232125322',
      status: 2,
      category: 'NBQ-293',
      address: '东区光伏车棚文字较长的情况',
      kw: 1123.0,
      kwh: 2893049,
    },
  ]

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
  return (
    // <div style={{flex: 1, display:"flex", justifyContent: 'center', alignContent: 'center'}}>
    //   <Building pagename="电站监控" />
    // </div>
    < Pagecount bgcolor="#eeeff4" pd={0} >
      <Container>
        <TopBox>
          <Titlelayout title={'电站信息'} {...fs}>
            <div className='infoBox1'>
              <img src={powerStation} className='powerStation' />
              <div className='content'>
                <div className='info'>
                  <span></span><span>名  称： </span> <span>东区光伏电站1</span></div>
                <div className='info'>
                  <span></span> <span>编  号：</span> <span>2893049</span></div>
                <div className='info'>
                  <span></span> <span>总表名称：</span><span>东区光伏车棚总表1</span></div>
                <div className='info'>
                  <span></span> <span>总表编号：</span><span>83894894</span></div>
                <div className='info'>
                  <span></span><span>安装地址：</span> <span>东区光伏车棚文字较长的情况是这样的</span></div>
              </div>
            </div>
            <div className='powerNum'>
              <div className='numBox'>
                <img src={inverter} className='powerIcon' />
                <div className='num'>
                  <div>5</div>
                  <div>逆变器(个)</div>
                </div>
              </div>
              <div className='numBox'>
                <img src={installedCapacity} className='powerIcon' />
                <div className='num'>
                  <div>5000</div>
                  <div>装机容量(kW)</div>
                </div>
              </div>
              <div className='numBox'>
                <img src={runtimeDuration} className='powerIcon' />
                <div className='num'>
                  <div>125</div>
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
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本日发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本月发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本年发电量(kWh)</div>
                  </div>
                </div>
              </div>

              <div className='info'>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本日发电收益(元)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本月发电收益(元)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
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
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>100</div>
                    <div>本日等效碳排(kg)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>1025</div>
                    <div>本月等效碳排(kg)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>1955</div>
                    <div>本年等效碳排(kg)</div>
                  </div>
                </div>
              </div>
            </div>

          </Titlelayout>
        </TopBox>
        <FotterBox>
          <Titlelayout title={'逆变器'} extra={
            <Header>
              <div style={{ marginRight: "16px" }}>
                <Checkbox indeterminate={indeterminateAll} checked={checkedAll} onChange={allChagne}>全部</Checkbox>
                <Checkbox indeterminate={indeterminateOnline} checked={checkedOnline} onChange={onlineChagne}>在线</Checkbox>
                <Checkbox indeterminate={indeterminateOffline} checked={checkedOffline} onChange={offlineChagne}>离线</Checkbox>
              </div>
            </Header>}>

            <div className='infoBox3'>
              {inverterData?.map((item, index) => (
                <div className='box' key={index} onClick={() => toDevicePage(item)} >
                  <div className={`title ${item.status == 1 ? 'online' : 'offline'}`}>
                    {item.name} ({item.sn})
                  </div>
                  <div className='con'>
                    <div className='top'>
                      <img src={runtimeDuration} className='powerIcon' />
                      <div className='info'>
                        <div><span className='name'>状 态：</span>
                          <span className={`status ${item.status == 1 ? 'online' : 'offline'}`}></span>
                          {item.status == 1 ? '并网' : '等待'}</div>
                        <div><span>型 号：</span> {item.category}</div>
                        <div><span className='name'>安装地址：</span>{item.address}</div>
                      </div>
                    </div>
                    <div className='bottom'>
                      <div><span className='name'>实时发电功率(kW)</span><div className='num'>{item.kw}</div></div>
                      <div><span className='name'>当日发电量(kWh)</span><div className='num'>{item.kwh}</div></div>
                    </div>
                  </div>
                </div>))}
            </div>
          </Titlelayout>

          <Titlelayout title={'光伏发电量趋势'} extra={
            <Header>
              <div style={{ marginRight: "16px" }}>
                <Select defaultValue="1" style={{ width: 96, marginRight: 16 }} onChange={changeTime}
                  options={[
                    { value: '1', label: '日', },
                    { value: '2', label: '月', },
                    { value: '3', label: '年' },
                    // { value: '4', label: '自定义' },
                  ]}
                />
                {params.type == 1 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={moment(today)} disabledDate={disabledDate} /> :
                  params.type == 2 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={moment(tmonth)} picker='month' disabledDate={disabledDate} /> :
                    params.type == 3 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} picker='year' defaultValue={moment(tyear)} disabledDate={disabledDate} /> : null
                  // <RangePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={[moment(today), moment(today)]} disabledDate={disabledDate} />
                }
              </div>
              <Radio.Group
                block
                options={options}
                optionType="button"
                buttonStyle="solid"
                value={state.timeType}
                onChange={(e) => {
                  state.timeType = e.target.value
                }}
                style={{ marginRight: "16px" }}
              />
              <CustButtonT text="export" src='export' onClick={onExport} disabled={state.timeType == 1} />
            </Header>
          }>
            {state.timeType == 1 ?
              <SolarPowerGenerationChart /> :
              <UserTable
                scroll={{ y: 280 }} columns={columns} dataSource={tabledata}

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
