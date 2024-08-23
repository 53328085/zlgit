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
  const [baseLine, setBaseLine] = useState()
  const [unit, setUnit] = useState('单位')
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
  }

  const onChangeTime = (val) => {
    // setBaseLine(val)
  }


  const [transTag, setTransTag] = useState('')
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

  const settingClick = async () => {
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
            <Button type='primary' ghost onClick={() => settingClick()}>请选择要对比的设备</Button>
          </Form.Item>
          <Form.Item label="选择对比数据" name="type" style={{ marginBottom: 0 }}>
            <Select placeholder='请选择对比项目' options={comparisonType} defaultValue={typeSelected} style={{ width: 188, marginLeft: 16 }} onChange={onChangeType}></Select>
          </Form.Item>
          <Form.Item name="line" style={{ marginBottom: 0 }} >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox.Group value={baseLine} onChange={onChangeBaseLine}>
                <Checkbox value="A">对比基准线</Checkbox>
              </Checkbox.Group>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <InputNumber style={{ width: '100%' }} />
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
            <Button type="primary" style={{ marginLeft: '16px' }}>对比分析</Button>
          </Form.Item >
        </Space>
      </Form>
      <Mask task={transTag}>
        <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>

      </Mask>
    </Titlelayout>

  )
}

