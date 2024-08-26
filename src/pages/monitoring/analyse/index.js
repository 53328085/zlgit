import React, { useState, useRef, useEffect, useCallback } from 'react'
import Pagecount from "@com/pagecontent";
import { useSelector } from 'react-redux'
import Titlelayout from '@com/titlelayout';
import { Serach, Cdivider, Borderleft } from "@com/comstyled"
import moment from 'moment'
import { Select, DatePicker, InputNumber, Checkbox, Radio, Pagination, message, Space, Form, Button } from "antd";

import { useOutletContext } from 'react-router-dom'
import { Monitoring } from '@api/api.js'

import Mask from '@com/mask.jsx'
import UseTransfer from './transfer';
import { drawEcharts } from "@com/useEcharts"
const { RangePicker } = DatePicker;
const disabledDate = (current) => {
  return current && current > moment().endOf('day');
}
const {
  DeviceManager: {
    QueryByPageElectric,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddElectric,
    UpdateElectric,
    UpdateFactor,
    DeleteElectric,
    ImportElectric,
    OneLevel
  }
} = Monitoring
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)
  const [form] = Form.useForm();
  const [typeSelected, setTypeSelected] = useState()
  const [baseLine, setBaseLine] = useState([])
  const [unit, setUnit] = useState('单位')
  const [baseLineValue, setBaseLineValue] = useState(); // 初始化状态
  const comparisonType = [
    {
      value: 1,
      label: "用电量对比"
    }, {
      value: 2,
      label: "功率对比"
    }, {
      value: 3,
      label: "电压对比"
    }, {
      value: 4,
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
      setUnit('V')
    } else if (val == 4) {
      setUnit('A')
    }

  }
  const onChangeBaseLine = (val) => {
    setBaseLine(val)
    console.log(baseLine, val);
  }

  const onChangeBaseLineValue = (newValue) => {
    setBaseLineValue(newValue); // 更新状态
  };
  const onChangeTime = (val) => {
    // setBaseLine(val)
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
    let params = {
      projectId,
      pageNum: 1,
      areaId: 0,
      alike: '',
      customerType: 0
    }
    const resp = await QueryByPageElectric(params)
    if (resp.success && Array.isArray(resp.data)) {
      setUnknownTable(resp.data || [])

    } else {

    }
    setTransTag('open')

  }

  const getSaveValue = values => {
    let Sns = []
    values.subData.map(item => {
      Sns.push(item.sn)
    })
    let params = {
      EnergyStructureId: structureId,
      Sns
    }
    configEnergyStructure(projectId, params).then(res => {
      if (res.success) {
        messageContent('success', '能源节点配置成功!')
        setTransTag(false)
        setTimeout(() => { setDeleteDom(false) }, 600)
      } else {
        messageContent('error', res.errMsg)
      }
    })
  }
  const getCloseValue = params => {
    setTransTag(false)
    setTimeout(() => { setDeleteDom(false) }, 600)
  }
  const analysisRef = useRef(null)
  const onSetcontrast = () => {
    console.log(baseLine, '2222baseLine');
    if (!typeSelected) {
      return message.error('请选择对比数据')
    } else {
      console.log(baseLine, '1111baseLine', baseLineValue);
      if (baseLine.length != 0) {
        if (baseLineValue == undefined) {
          return message.error('请填写对比基准线具体数值')
        }
      }
    }
    if (baseLine.length != 0 && baseLineValue != undefined) {
      drawEcharts(analysisRef.current, {
        dataset: datasetContrast,
        series: [{
          type: "line", areaStyle: null, showSymbol: true,
          markLine: {
            data: [
              //第一条线
              {
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
              },
            ],
          }
        }, {
          type: "line", areaStyle: null, showSymbol: true,
        }],
        grid: {
          top: '30px',
          left: 30,
          right: 0,
          bottom: '30px',
          containLabel: true,
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
        dataset: datasetContrast,
        series: [{
          type: "line", areaStyle: null, showSymbol: true,
        }, {
          type: "line", areaStyle: null, showSymbol: true,
        }],
        grid: {
          top: '30px',
          left: 0,
          right: 0,
          bottom: '30px',
          containLabel: true,
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
  const datasetContrast = {
    dimensions: ["time", "实时辐射", "实时功率"],
    source: [
      { time: "1", "实时辐射": 5600, "实时功率": 9600 },
      { time: "2", "实时辐射": 4600, "实时功率": 3644 },
      { time: "3", "实时辐射": 3600, "实时功率": 4644 },
      { time: "4", "实时辐射": 5611, "实时功率": 9655 },
      { time: "5", "实时辐射": 5644, "实时功率": 3677 },
      { time: "6", "实时辐射": 4677, "实时功率": 3633 },
      { time: "7", "实时辐射": 3688, "实时功率": 4655 },
      { time: "8", "实时辐射": 5088, "实时功率": 2644 },
      { time: "9", "实时辐射": 6677, "实时功率": 2641 },
      { time: "10", "实时辐射": 5866, "实时功率": 5641 },
      { time: "11", "实时辐射": 4677, "实时功率": 7645 },
      { time: "12", "实时辐射": 1877, "实时功率": 2645 },
    ],
  };
  useEffect(() => {


  }, [])
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
            <RangePicker onChange={onChangeTime} format="YYYY-MM-DD" style={{ width: '320px' }} disabledDate={disabledDate} />
            <Button type="primary" style={{ marginLeft: '16px' }} onClick={() => onSetcontrast()}>对比分析</Button>
          </Form.Item >
        </Space>
      </Form>
      <Mask task={transTag}>
        <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>

      </Mask>
      <div style={{ width: "100%", marginTop: '16px', height: '90%' }} ref={analysisRef}>

      </div>
    </Titlelayout>

  )
}

