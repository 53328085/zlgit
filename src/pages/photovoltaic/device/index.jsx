import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'

import { useSelector } from 'react-redux'
import { adaptation } from "@redux/systemconfig";
import { useReactive } from "ahooks";
import Pagecount from "@com/pagecontent";
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout'
import UserTable from "@com/useTable";

import Modal from "@com/useModal"

import inverterpg from './images/inverter.png'

import imgurl from './images/index'
import { DatePicker, Table, Checkbox, Space, Radio, Divider, Select, Tree, Button, message, Form, Typography } from "antd";
import { ExportExcel, CustButton, ExportButton, CustButtonT } from '@com/useButton'
import { Container, TopBox, FotterBox, Header } from "./style";
import moment from "moment";

import { useOutletContext } from "react-router-dom";

import HistoricalDataModal from './comp.js'
import { isObject, getTime } from "@com/usehandler"
import { useQueryInverterInfo, useQueryInverterEnergyTrend } from './api';
import { DCColumns, options, communicationColumns } from './data'
const { RangePicker } = DatePicker;
const { Link } = Typography
const fs = {
  fc: '#333'
}
export default function Index() {
  const [form] = Form.useForm()
  const mode = Form.useWatch('mode', form)
  const [inverterInfo, setInverterInfo] = useState({})
  const [weather, setWeather] = useState({})
  const { coalInfo = {}, generationInfo = {}, dcSideDetail: DCData = [], acSideDetail: communicationData = [], ptDetail = {} } = useMemo(() => {
    return inverterInfo || {}
  }, [inverterInfo])
  let { exparams } = useOutletContext()

  const { projectId, inverter, refresh } = exparams
  console.log("inverter", inverter)
  const weatherOpt = useMemo(() => {

    return {
      series: [{ type: "bar", seriesLayoutBy: 'row' }], // [{ type: "bar",seriesLayoutBy: 'row' }], 
      grid: {
        left: "0px",
        right: "0",
        top: "40px",
        bottom: "16px",
        containLabel: true,
      },
      legend: {
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
        dimensions: [{
          name: '时间', type: "date",
        }, { name: "发电量" }],
        source: [Array.isArray(weather?.x) ? weather?.x : [], Array.isArray(weather?.y) ? weather?.y : []],
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



  }, [weather])

  const queryInfo = async () => {
    try {

      let { success, data } = await useQueryInverterInfo({ projectId, sn: inverter })
      if (success && isObject(data)) {
        setInverterInfo(data)
      } else {
        setInverterInfo({})
      }
    } catch (error) {

    }
  }
  const getTrend = async () => {
    try {
      let values = form.getFieldsValue();
      const { type, date } = values
      let body = {
        projectId,
        sn: inverter,
        type,
        date: getTime(date, type)
      }
      let { success, data } = await useQueryInverterEnergyTrend({}, body)
      if (success && isObject(data?.detail)) {
        setWeather(data?.detail)
      } else {
        setWeather({})
      }
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if (Number.isInteger(parseInt(projectId)) && inverter && typeof inverter === 'string' && Number.isInteger(parseInt(refresh))) {
      queryInfo()
      getTrend()
    }

  }, [projectId, inverter, refresh])

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
  const custoption = useMemo(() => {
    const temp = Number.parseFloat(inverterInfo?.curPower)
    return (
      {
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
                value: Number.isFinite(temp) ? temp : NaN,
                name: "实时功率(kW)",
              }
            ]
          }
        ]
      }
    )
  }, [inverterInfo?.curPower])
  const DCTableRef = useRef()
  const [modalType, setModalType] = useState(1) //1是直流 2是交流
  const communicationTableRef = useRef()
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
                ''}</div>
        )
      }
    }
  ]
  const tabledata = useMemo(() => {
    if (isObject(weather) && Array.isArray(weather.x) && Array.isArray(weather.y)) {
      let { x, y } = weather
      return x.map((item, index) => {
        return {
          time: item,
          kWh: y[index]
        }
      })
    } else {
      return []
    }
  }, [weather])
  //导出

  const onExport = async () => {
    tableRef.current.download()
  }

  const HistoricalRef = useRef()
  const onOpenModal = (type) => {
    setModalType(type)
    HistoricalRef.current.onOpen();
  }
  const typeChange = (e) => {
    if (e != 3) {
      form.setFieldValue('date', moment())
    }
    getTrend()
  }
  return (

    <Pagecount bgcolor="#eeeff4" pd={0} >
      <Container>
        <Modal mold='cust' custft={true} width={1087}
          closable={true} footer={null}
          ref={HistoricalRef} title={modalType === 1 ? '直流侧历史数据' : '交流侧历史数据'}>
          <HistoricalDataModal modalType={modalType} sn={inverter} projectId={projectId} />
        </Modal>
        <TopBox>
          <Titlelayout title={'逆变器信息'} {...fs} layout="flex" dr="column">
            <div className='infoBox1'>
              <img src={inverterpg} className='powerStation' />
              <div className='content'>
                <div className='info'>
                  <span></span><span>名  称： </span> <Typography.Paragraph className='value' ellipsis={{ tooltip: inverterInfo.name }}>{inverterInfo.name}</Typography.Paragraph></div>
                <div className='info'>
                  <span></span> <span>编  号：</span> <Typography.Paragraph className='value' ellipsis={{ tooltip: inverterInfo.sn }}>{inverterInfo.sn}</Typography.Paragraph></div>
                <div className='info'>
                  <span></span> <span>型  号：</span> <Typography.Paragraph className='value' ellipsis={{ tooltip: inverterInfo.category }}>{inverterInfo.category}</Typography.Paragraph></div>
                <div className='info'>
                  <span></span> <span>额定功率：</span><Typography.Paragraph className='value' ellipsis={{ tooltip: inverterInfo.ratedPower }}>{inverterInfo.ratedPower}</Typography.Paragraph></div>
                <div className='info'>
                  <span></span> <span>所属网关：</span><Typography.Paragraph className='value' ellipsis={{ tooltip: inverterInfo.gatewaySn }}>{inverterInfo.gatewaySn}</Typography.Paragraph></div>
                <div className='info'>
                  <span></span><span>安装地址：</span> <Typography.Paragraph className='value' ellipsis={{ tooltip: inverterInfo.address }}>{inverterInfo.address}</Typography.Paragraph></div>
              </div>
            </div>
            <div className='powerNum'>
              <div className='numBox'>
                <div className='num num2'>
                  <span className={`status ${inverterInfo.state == 1 ? 'online' : 'offline'}`}>
                    {inverterInfo.state == 1 ? '在线' : '离线'}
                  </span>
                  状  态：<span className={`circle ${inverterInfo.state == 1 ? 'online' : 'offline'}`}></span>
                  {inverterInfo.state == 1 ? '并网' : '等待'}
                </div>
              </div>
              <div className='numBox'>
                <img src={imgurl['temp']} className='powerIcon' />
                <div className='num'>
                  <div>{inverterInfo.cavityTemp}</div>
                  <div>腔体温度(℃)</div>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout title={'发电实时功率'}>
            <Ichart custoption={custoption} />
          </Titlelayout>
          <Titlelayout title={'发电概览'} layout="flex">
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
          <Titlelayout title={'碳排概览'} layout="flex">
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
          <div className='realTimeData'>
            <Titlelayout title={'直流侧实时数据'} extra={
              <Header>
                {/* <Link onClick={() => onOpenModal(1)} style={{ marginRight: "16px" }}>
                  历史数据
                </Link> */}
              </Header>}>

              <div className='infoBox3'>
                <UserTable columns={DCColumns} dataSource={DCData} ref={DCTableRef} scroll={{ y: 65 }} ></UserTable>
              </div>
            </Titlelayout>
            <Titlelayout title={'交流侧实时数据'} extra={
              <Header>
                <Link onClick={() => onOpenModal(2)} style={{ marginRight: "16px", }}>
                  历史数据
                </Link>
              </Header>}>

              <div className='infoBox3'>
                <UserTable columns={communicationColumns} dataSource={communicationData} ref={communicationTableRef}
                  summary={() => {
                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row style={{ backgroundColor: "#f6f6f6", textAlign: "center" }}>
                          <Table.Summary.Cell index={0} >{ptDetail?.name}</Table.Summary.Cell>
                          <Table.Summary.Cell index={1} colSpan={3} >{ptDetail?.total}</Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>)
                  }}
                ></UserTable>

              </div>
            </Titlelayout>
          </div>
          <Titlelayout title={'光伏发电量趋势'} layout="flex" extra={
            <Header>
              <Form form={form} layout='inline'>
                <Space size={16}>
                  <Form.Item name="type" initialValue="1">
                    <Select style={{ width: 96 }}
                      onChange={typeChange}
                      options={[
                        { value: '1', label: '日', },
                        { value: '2', label: '月', },
                        { value: '3', label: '年' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="date" initialValue={moment()} >
                    <DatePicker picker={["date", "date", "month", "year"][Form.useWatch("type", form)]} style={{ width: 240 }} onChange={getTrend} disabledDate={disabledDate} />
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
              /*  <SolarPowerGenerationChart /> */
              <div style={{ flex: 1, display: "flex" }}>
                <Ichart  {...weatherOpt} />
              </div> :
              <UserTable scroll={{ y: 280 }} columns={columns} dataSource={tabledata}
                ref={tableRef} sheetName='光伏发电量趋势.xlsx'
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
