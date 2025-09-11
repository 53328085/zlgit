import React, { useEffect, useRef, useState, useCallback } from 'react'
import Building from '@com/building'
import { useSelector } from 'react-redux'
import { adaptation } from "@redux/systemconfig";
import { useReactive } from "ahooks";
import Pagecount from "@com/pagecontent";
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout'
import UserTable from "@com/useTable";

import Modal from "@com/useModal"
import powerStation from './images/powerStation.png'
import inverter from './images/inverter.png'
import installedCapacity from './images/installedCapacity.png'
import runtimeDuration from './images/runtimeDuration.png'
import { DatePicker, Table, Checkbox, Space, Radio, Divider, Select, Tree, Button, message } from "antd";
import { ExportExcel, CustButton, ExportButton } from '@com/useButton'
import { Container, TopBox, FotterBox, Header } from "./style";
import moment from "moment";
import dayjs from 'dayjs';
import { Link } from "react-router-dom";
import SolarPowerGenerationChart from './weatherEcharts.js';
import HistoricalDataModal from './comp.js'
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
  const deviceInfo = {
    name: '光伏逆变器1',
    sn: '2893049',
    category: 'NBQ-293',
    kw: 1123.0,
    gateway: '389940',
    address: '东区光伏车棚',
    status: 2,//1是并网，2是等待
    cavityTemperature: 2,
  }
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
  const DCTableRef = useRef()
  const [modalType, setModalType] = useState(1) //1是直流 2是交流
  const communicationTableRef = useRef()
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

  const DCColumns = [
    {
      title: "输入回路",
      dataIndex: `name`,
      align: 'center',
    }, {
      title: "电压（V）",
      dataIndex: `v`,
      align: 'center',
    }, {
      title: "电流（A）",
      dataIndex: `a`,
      align: 'center',
    }
  ]
  const DCData = [
    {
      name: 'PV1',
      v: 30.25,
      a: 5.25
    },
    {
      name: 'PV2',
      v: 30.25,
      a: 5.25
    }, {
      name: 'PV1',
      v: 30.25,
      a: 5.25
    },
    {
      name: 'PV2',
      v: 30.25,
      a: 5.25
    }, {
      name: 'PV1',
      v: 30.25,
      a: 5.25
    },
    {
      name: 'PV2',
      v: 30.25,
      a: 5.25
    },
  ]
  const communicationColumns = [
    {
      title: "参数",
      dataIndex: `name`,
      align: 'center',
    }, {
      title: "A相",
      dataIndex: `a`,
      align: 'center',
      render: (value, record, index) => {
        // 对于总有功功率行，合并单元格
        if (index === 3) {
          return {
            children: <div style={{ textAlign: 'center' }}>{value}</div>,
            props: {
              colSpan: 3, // 跨3列
            },
          };
        }
        return value;
      }
    }, {
      title: "B相",
      dataIndex: `b`,
      align: 'center',
      render: (value, record, index) => {
        // 对于总有功功率行，隐藏单元格
        if (index === 3) {
          return {
            props: {
              colSpan: 0, // 隐藏单元格
            },
          };
        }
        return value;
      }
    }, {
      title: "C相",
      dataIndex: `c`,
      align: 'center', render: (value, record, index) => {
        // 对于总有功功率行，隐藏单元格
        if (index === 3) {
          return {
            props: {
              colSpan: 0, // 隐藏单元格
            },
          };
        }
        return value;
      }
    }
  ]
  const communicationData = [
    {
      a: 40, b: 40, c: 40, name: '电压（V）'
    },
    {
      a: 10, b: 10, c: 10, name: '电流（A）'
    },
    {
      a: 80, b: 80, c: 80, name: '频率（Hz）'
    },
    {
      a: 32, b: '', c: '', name: '总有功功率（kW）'
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
    {
      time: "00:00",
      kWh: "2250.54",
      weather: 1,
    }, {
      time: "01:00",
      kWh: "22",
      weather: 1,
    }, {
      time: "02:00",
      kWh: "111",
      weather: 2,
    }, {
      time: "03:00",
      kWh: "222",
      weather: 3,
    }, {
      time: "04:00",
      kWh: "3333",
      weather: 3,
    }, {
      time: "00:00",
      kWh: "2250.54",
      weather: 1,
    }, {
      time: "01:00",
      kWh: "22",
      weather: 1,
    }, {
      time: "02:00",
      kWh: "111",
      weather: 2,
    }, {
      time: "03:00",
      kWh: "222",
      weather: 3,
    }, {
      time: "04:00",
      kWh: "3333",
      weather: 3,
    }, {
      time: "00:00",
      kWh: "2250.54",
      weather: 1,
    }, {
      time: "01:00",
      kWh: "22",
      weather: 1,
    }, {
      time: "02:00",
      kWh: "111",
      weather: 2,
    }, {
      time: "03:00",
      kWh: "222",
      weather: 3,
    }, {
      time: "04:00",
      kWh: "3333",
      weather: 3,
    }
  ]
  //导出
  const onexprot = useCallback(() => {

    // let tbdata = tabledata.map(t => {
    //   let row = {
    //     '值班人员': t.userName,
    //     '班次': "早班 中班 晚班"
    //   }
    //   Array.from({ length: 31 }, (_, i) => {
    //     let text1 = t[i].no1 == 1 ? reactive.plans.name1 : ''
    //     let text2 = t[i].no2 == 1 ? reactive.plans.name2 : ''
    //     let text3 = t[i].no3 == 1 ? reactive.plans.name3 : ''
    //     let text4 = t[i]?.no4 == 1 ? reactive.plans.name4 : ''
    //     row[i + 1] = text1 + text2 + text3 + text4;
    //   })
    //   return row
    // })

    // tableRef.current.downloadByData({ header: excolums, data: tbdata, skipHeader: false })
  }, [tabledata])

  const HistoricalRef = useRef()
  const onOpenModal = (type) => {
    setModalType(type)
    HistoricalRef.current.onOpen();
  }
  return (
    // <div style={{flex: 1, display:"flex", justifyContent: 'center', alignContent: 'center'}}>
    //   <Building pagename="电站监控" />
    // </div>
    < Pagecount bgcolor="#eeeff4" pd={0} >
      <Container>
        <Modal mold='cust' custft={true} width={1087}
          closable={true} footer={[]}
          ref={HistoricalRef} title={modalType === 1 ? '直流侧历史数据' : '交流侧历史数据'}>
          <HistoricalDataModal modalType={modalType} />
        </Modal>
        <TopBox>
          <Titlelayout title={'逆变器信息'} {...fs}>
            <div className='infoBox1'>
              <img src={powerStation} className='powerStation' />
              <div className='content'>
                <div className='info'>
                  <span></span><span>名  称： </span> <span>{deviceInfo.name}</span></div>
                <div className='info'>
                  <span></span> <span>编  号：</span> <span>{deviceInfo.sn}</span></div>
                <div className='info'>
                  <span></span> <span>型  号：</span> <span>{deviceInfo.category}</span></div>
                <div className='info'>
                  <span></span> <span>额定功率：</span><span>{deviceInfo.kw}</span></div>
                <div className='info'>
                  <span></span> <span>所属网关：</span><span>{deviceInfo.gateway}</span></div>
                <div className='info'>
                  <span></span><span>安装地址：</span> <span>{deviceInfo.address}</span></div>
              </div>
            </div>
            <div className='powerNum'>
              <div className='numBox'>
                <div className='num num2'>
                  <span className={`status ${deviceInfo.status == 1 ? 'online' : 'offline'}`}>
                    {deviceInfo.status == 1 ? '在线' : '离线'}
                  </span>
                  状  态：<span className={`circle ${deviceInfo.status == 1 ? 'online' : 'offline'}`}></span>
                  {deviceInfo.status == 1 ? '并网' : '等待'}
                </div>
              </div>
              <div className='numBox'>
                <img src={installedCapacity} className='powerIcon' />
                <div className='num'>
                  <div>5000</div>
                  <div>腔体温度(℃)</div>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout title={'发电实时功率'}>
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
                    <div>本月发电收益(元)</div>
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
          <div className='realTimeData'>
            <Titlelayout title={'直流侧实时数据'} extra={
              <Header>
                <div onClick={() => onOpenModal(1)} style={{ marginRight: "16px", color: '#1E50E6' }}>
                  历史数据
                </div>
              </Header>}>

              <div className='infoBox3'>
                <UserTable columns={DCColumns} dataSource={DCData} ref={DCTableRef} scroll={{ y: 65 }} ></UserTable>
              </div>
            </Titlelayout>
            <Titlelayout title={'交流侧实时数据'} extra={
              <Header>
                <div onClick={() => onOpenModal(2)} style={{ marginRight: "16px", color: '#1E50E6' }}>
                  历史数据
                </div>
              </Header>}>

              <div className='infoBox3'>
                <UserTable columns={communicationColumns} dataSource={communicationData} ref={communicationTableRef} ></UserTable>

              </div>
            </Titlelayout>
          </div>
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
              {/* tb={tableRef} */}
              {/* <ExportExcel ></ExportExcel> */}
              <ExportButton onClick={onexprot} disabled={state.timeType == 1} />
            </Header>
          }>
            {state.timeType == 1 ?
              <SolarPowerGenerationChart /> :
              <UserTable scroll={{ y: 280 }} columns={columns} dataSource={tabledata} ref={tableRef}
                summary={(pageData) => {
                  let eleTotal = 0
                  pageData?.forEach(({ kWh }) => {
                    eleTotal = Math.round((eleTotal + Number(kWh)) * 100) / 100
                  });

                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row style={{ backgroundColor: "#f6f6f6", textAlign: "center" }}>
                        <Table.Summary.Cell index={0} >汇总</Table.Summary.Cell>
                        <Table.Summary.Cell index={1} colSpan={2} >{eleTotal}</Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>)
                }}>
              </UserTable>}
          </Titlelayout>
        </FotterBox>
      </Container >
    </Pagecount >
  )
}
