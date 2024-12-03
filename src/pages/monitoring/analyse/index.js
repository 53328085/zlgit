import React, { useState, useRef, useEffect, useCallback } from 'react'
import Pagecount from "@com/pagecontent";
import { useSelector } from 'react-redux'
import Titlelayout from '@com/titlelayout';
import { Serach, Cdivider, Borderleft } from "@com/comstyled"
import moment from 'moment'
import { Select, DatePicker, InputNumber, Checkbox, Radio, Pagination, message, Space, Form, Button } from "antd";

import { Monitoring } from '@api/api.js'

import Mask from '@com/mask.jsx'
import UseTransfer from './transfer';
import { drawEcharts } from "@com/useEcharts"
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
  const [form] = Form.useForm();
  const [typeSelected, setTypeSelected] = useState(1)
  const [baseLine, setBaseLine] = useState([])
  const [unit, setUnit] = useState('kWh')
  const [baseLineValue, setBaseLineValue] = useState(); // 初始化状态
  const comparisonType = [
    {
      value: 1,
      label: "用电量对比"
    }, {
      value: 2,
      label: "功率对比"
    }, {
      value: 4,
      label: "电压对比"
    }, {
      value: 3,
      label: "电流对比"
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
    if (Sns.length < 2) return message.warning('请至少选择两个设备进行对比分析！')
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
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn'
    }, {
      align: 'center',
      title: '设备名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      align: 'center',
      title: '安装地址',
      dataIndex: 'address',
      key: 'address'
    }
  ]

  const onSetDevices = async () => {
    setTransferTitle({
      subTitle: '选择需要对比的设备',
      unknownTitle: '未选中的设备',
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
    if (Sns.length < 2) return message.warning('请至少选择两个设备进行对比分析！')
    if (!typeSelected) {
      return message.warning('请选择对比数据')
    } else {
      if (baseLine.length != 0) {
        if (baseLineValue == undefined) {
          return message.warning('请填写对比基准线具体数值')
        }
      }
    }

    let params = {
      projectId,
      Type: typeSelected,
      Sns,
      Start: startTime,
      End: endTime
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
          top:"10%",
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
          top:"10%",
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

    <Titlelayout title='对比分析'>
      <Cdivider type="h" margin="16px 0" />
      <Form
        layout="line"
        form={form}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        initialValues={{
          alike: '',
          category: '',
          state: 0
        }}
      >
        <Space size={64} split={<Cdivider />}  >
          <Form.Item name="button" style={{ marginBottom: 0 }}>
            <Button type='primary' ghost onClick={() => onSetDevices()}>请选择要对比的设备</Button>
          </Form.Item>
          <Form.Item label="选择对比数据" name="type" style={{ marginBottom: 0 }}>
            <Select placeholder='请选择对比项目' options={comparisonType} defaultValue={typeSelected} style={{ width: 188, marginLeft: 16 }} onChange={onChangeType}></Select>
          </Form.Item>
          <Form.Item name="line" style={{ marginBottom: 0 }} >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox.Group value={baseLine} onChange={onChangeBaseLine}>
                <Checkbox value="selected">对比基准线</Checkbox>
              </Checkbox.Group>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <InputNumber style={{ width: '100%' }} value={baseLineValue} onChange={onChangeBaseLineValue} />
                <p style={{
                  width: '60px', textAlign: 'center',
                  height: '30px', lineHeight: '30px', background: '#f2f2f2',
                  color: '#afa7a7', position: 'absolute', right: '1px'
                }}>
                  {unit}
                </p>
              </div>
            </div>
          </Form.Item>
          <Form.Item label="请选择日期范围" name="time" style={{ marginBottom: 0 }}>
            <RangePicker
              value={dates || value}
              onChange={onChangeTime}
              onCalendarChange={(val) => setDates(val)}
              disabledDate={disabledDate}
              defaultValue={[moment().startOf('day'), moment()]}
              format="YYYY-MM-DD"
              style={{ width: '320px' }} />
            <Button type="primary" style={{ marginLeft: '16px' }} onClick={() => onSetcontrast()}>对比分析</Button>
          </Form.Item >
        </Space>
      </Form>
      <Mask task={transTag}>
        {transTag && <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>}

      </Mask>
      <div style={{ width: "100%", marginTop: '16px', height: '90%' }} ref={analysisRef}>

      </div>
    </Titlelayout>

  )
}

