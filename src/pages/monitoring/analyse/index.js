import React, { useState, useRef, useEffect, useCallback } from 'react'
import Pagecount from "@com/pagecontent";
import { useSelector } from 'react-redux'
import Titlelayout from '@com/titlelayout';
import { Serach, Cdivider, Borderleft } from "@com/comstyled"
import moment from 'moment'
import { Select, DatePicker, InputNumber, Checkbox, Radio, Pagination, message, Space, Form, Button } from "antd";

import { Monitoring } from '@api/api.js'
import {

  adaptation
} from "@redux/systemconfig.js";
import Mask from '@com/mask.jsx'
import UseTransfer from './transfer';
import { drawEcharts } from "@com/useEcharts"
import {CustTransO, i18t, i18warning,ExportExcel, RadioT,CustButtonT} from "@com/useButton"
const { RangePicker } = DatePicker;
const disabledDate = (current) => {
  return current && current > moment().endOf('day');
}
const {
  ComparativeAnalysis: {
    QueryCompareDevice,
    HistoryCompare
  }
} = Monitoring
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)
  const { laptop } = useSelector(adaptation)
  const [form] = Form.useForm();
  const [typeSelected, setTypeSelected] = useState(1)
  const [baseLine, setBaseLine] = useState([])
  const [unit, setUnit] = useState('kWh')
  const [baseLineValue, setBaseLineValue] = useState(); // 初始化状态
  const comparisonType = [
    {
      value: 1,
      label: i18t("comm","electricquantity",{text:"对比"})
    }, {
      value: 2,
      label: i18t("comm","power",{text:"对比"})
    }, {
      value: 3,
      label: i18t("comm","voltage",{text:"对比"})
    }, {
      value:4,
      label: i18t("comm","electricity",{text:"对比"})
    },
  ]
  const onChangeType = (val) => {
    setTypeSelected(val)
    console.log(val, 'val');
    if (val == 1) {
      setUnit('kWh')
    } else if (val == 2) {
      setUnit('kW')
    } else if (val == 3) {
      setUnit('A')
    } else if (val == 4) {
      setUnit('V')
    }

  }
  const onChangeBaseLine = (val) => {
    if (Sns.length < 2) return message.warning(i18t("monitor","info1"))
    setBaseLine(val)
    console.log(baseLine, val);
  }

  const onChangeBaseLineValue = (newValue) => {
    setBaseLineValue(newValue); // 更新状态
  };
  let dataToday = moment().format('YYYY-MM-DD 23:59:59')
  let [startTime, setstartTime] = useState(moment().startOf('day').format('YYYY-MM-DD 00:00:00'))
  let [endTime, setendTime] = useState(dataToday)
  // setBaseLine(val)
  const onChangeTime = (date = [], dataString) => {
    let f = dataString.some(d => d);
    if (!f) return
    setstartTime(dataString[0] + ' 00:00:00 ')
    setendTime(dataString[1] + ' 23:59:59')
    setValue(date)
  }

  const [transTag, setTransTag] = useState(false)
  const [transferTitle, setTransferTitle] = useState({})

  const [subTable, setSubTable] = useState([])

  const [unknownTable, setUnknownTable] = useState([])
  const [structureId, setStructureId] = useState(null)
  //配置穿梭框
  const columns = [
    {
      align: 'center',
      title: i18t("comm", "sn", {text: "设备"}),
      dataIndex: 'sn',
      key: 'sn'
    }, {
      align: 'center',
      title: i18t("comm", "name", {text: "设备"}),
      dataIndex: 'name',
      key: 'name'
    }, {
      align: 'center',
      title: i18t("comm", "address"),
      dataIndex: 'address',
      key: 'address'
    }
  ]

  const onSetDevices = async () => {
    setTransferTitle({
      subTitle: i18t("monitor","compare"),
      unknownTitle: i18t("monitor","unselected"),
    })
    const resp = await QueryCompareDevice(projectId, 0, '')
    if (resp.success && Array.isArray(resp.data)) {
      setUnknownTable(resp.data || [])

    } else {
      message.error(resp.errMsg)
    }
    setTransTag(true)

  }
  const [Sns, setSns] = useState([])
  const getSaveValue = values => {
    let snData = []
    console.log(values)

    values.subData.map(item => {
      snData.push(item.sn)
    })
    setSns(snData)
  }
  const getCloseValue = params => {
    setTransTag(false)

  }
  const analysisRef = useRef(null)
  const onSetcontrast = () => {
    if (Sns.length < 2) return message.warning(i18t("monitor","info1"))
    if (!typeSelected) {
      return message.warning(i18t("monitor","data"))
    } else {
      if (baseLine.length != 0) {
        if (baseLineValue == undefined) {
          return message.warning(i18t("monitor","info2"))
        }
      }
    }

    let params = {
      projectId,
      Type: typeSelected,
      Sns,
      Start: startTime,
      End: endTime,
      planId: 0,
      groupName: ""
    }
    HistoryCompare(params).then(res => {
      let { success, data } = res
      if (success) {
        let dimensions = ['time']
        let source = []
        let datalist = []
        data.map(item => {
          if (item.data) {
            for (let i = 0; i < item.data.length; i++) {
              dimensions.push(item.name + '_' + item.data[i].point)
              source.push(item.data[i].data)
            }
          }
        })
        console.log(dimensions, source)

        if (source.length > 0) {

          for (let i = 0; i < source[0].length; i++) {
            let item = {}
            dimensions.map((val, index) => {
              if (val == 'time') {
                item[val] = source[0][i].time
              } else {
                item[val] = source[index - 1][i] ? source[index - 1][i].value : ''
              }
            })
            datalist.push(item)
          }
        }
        console.log(datalist)
        let seriesList = []
        for (let i = 0; i < dimensions.length - 1; i++) {
          seriesList.push({
            type: "line", areaStyle: null, smooth: true, stack: null
          })
        }


        drawEchartData({
          dimensions,
          source: datalist
        }, seriesList)

      } else {
        message.error(res.errMsg)
      }
    })



  }

  const drawEchartData = (dataset, seriesList) => {
    let markLineData = [{
      yAxis: `${baseLineValue}`,
      lineStyle: {
        type: "line",
        color: "red",
        width: 2,
      },
      label: {
        show: true,// 确保标签显示设置为true
        //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
        position: "start",
        color: "white",
        backgroundColor: 'red',
        fontSize: 12,
        padding: 5, // 文字内边距
        lineHeight: 20, // 文字行高
        formatter: `${baseLineValue}` + `${unit}`,
      },
    }]
    if (baseLine.length != 0 && baseLineValue != undefined) {
      seriesList[0].markLine = {
        data: markLineData
      }
      drawEcharts(analysisRef.current, {
        dataset: dataset,
        series: seriesList,
        grid: {
          top: "10%",
          left: "3%",
          right: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: 0,
          icon: 'rect',
          itemHeight: 2,
          itemWidth: 12,
          itemGap: 20,
        }
      })
    } else {
      drawEcharts(analysisRef.current, {
        dataset: dataset,
        series: seriesList,
        grid: {
          top: "10%",
          left: "3%",
          right: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: 0,
          icon: 'rect',
          itemHeight: 2,
          itemWidth: 12,
          itemGap: 20,
        }
      })
    }
  }

  useEffect(() => {


  }, [])
  const [dates, setDates] = useState([moment().startOf('day'), moment()]);
  return (
<Pagecount bgcolor="transparent" pd="0">
    <Titlelayout title={i18t("monitor","contrastiveanalysis")}>      
      <Form
        layout={laptop ? "vertical" : "line"}
        form={form}

        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
        initialValues={{
          alike: '',
          category: '',
          state: 0
        }}
      >
        <Space size={16}   align="end"  >
          <Form.Item name="button" style={{ marginBottom: 0 }}>
            <CustButtonT ns="monitor" text="compare" ghost onClick={() => onSetDevices()} wh="auto" /> 
          </Form.Item>
          <Form.Item label={i18t("monitor","data")} name="type" style={{ marginBottom: 0 }}>
            <Select placeholder='' options={comparisonType} defaultValue={typeSelected} onChange={onChangeType}></Select>
          </Form.Item>
          <Form.Item name="line" style={{ marginBottom: 0 }} >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox.Group value={baseLine} onChange={onChangeBaseLine}>
                <Checkbox value="selected">{i18t("monitor","datumline")}</Checkbox>
              </Checkbox.Group>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <InputNumber value={baseLineValue} onChange={onChangeBaseLineValue} addonAfter={unit} />
                {/* <p style={{
                  width: '60px', textAlign: 'center',
                  height: '30px', lineHeight: '30px', background: '#f2f2f2',
                  color: '#afa7a7', position: 'absolute', right: '1px'
                }}>
                  {unit}
                </p> */}
              </div>
            </div>
          </Form.Item>
          <Form.Item label={i18t("monitor","datarang")} name="time" style={{ marginBottom: 0 }}>
            <RangePicker
              value={dates || value}
              onChange={onChangeTime}
              onCalendarChange={(val) => setDates(val)}
              disabledDate={disabledDate}
              defaultValue={[moment().startOf('day'), moment()]}
              format="YYYY-MM-DD"
              style={{ width: laptop ? '220px' : '320px' }} />
          </Form.Item >
          <Form.Item noStyle>
            <CustButtonT wh="auto" ns="monitor" text="contrastiveanalysis" onClick={() => onSetcontrast()} /> 
          </Form.Item>
        </Space>
      </Form>
      <Mask task={transTag}>
        {transTag && <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>}

      </Mask>
      <div style={{ width: "100%", marginTop: '16px', height: '90%' }} ref={analysisRef}>

      </div>
    </Titlelayout>
    </Pagecount>
  )
}

