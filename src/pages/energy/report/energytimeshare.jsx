
// import Comp from './comp'
import { useSelector } from 'react-redux'
import { energyReport } from '@api/api'
import React, { useRef, forwardRef, useImperativeHandle, useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { Form, Select, Button, Divider, DatePicker, Input, message } from 'antd'
import Table from '@com/useTable'
import style from './style.module.less'
import CustContext from '@com/content'
import moment from 'moment'



export default function Energytimeshare({ areavalue, arealistRef }) {
  const contentRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const columns = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '测点',
      dataIndex: 'type'
    },
    {
      title: '总计(kWh)',
      dataIndex: 'e'
    },
    {
      title: '尖',
      dataIndex: 'e1'
    },
    {
      title: '峰',
      dataIndex: 'e2'
    },
    {
      title: '平',
      dataIndex: 'e3'
    },
    {
      title: '谷',
      dataIndex: 'e4'
    },
    {
      title: '总计(元)',
      dataIndex: 'c'
    },
    {
      title: '尖(元)',
      dataIndex: 'c1'
    },
    {
      title: '峰(元)',
      dataIndex: 'c2'
    },
    {
      title: '平(元)',
      dataIndex: 'c3'
    },
    {
      title: '谷(元)',
      dataIndex: 'c4'
    }
  ]
  useEffect(() => {
  }, [])
  const compProps = {
    columns,
    ref: contentRef,
    api: energyReport.QueryTimeConsume,

  }
  return (
    <div>
      <Comp {...compProps} />
    </div>
  )
}




function Comp({ api,  ...other }, ref) {
  const [dataSource, setDataSource] = useState([])
  const [pickertype, setPickertype] = useState(1)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const { areavalue, arealistRef } = useContext(CustContext)
  const tableRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const btncss = {
    width: 96,
    height: 32
  }
  const energyoptions = [
    {
      label: '电',
      value: 1
    }, {
      label: '水',
      value: 2
    }, {
      label: '燃气',
      value: 3
    }
  ]
  //日期选项
  const dateOptions = [{
    label: '天',
    value: 1
  }, {
    label: '月',
    value: 2
  }, {
    label: '年',
    value: 3
  }]

  //日期类型改变
  const changeTime = (v) => {
    setPickertype(v)
    if(v===1){
      form.setFieldsValue({
        starttime:moment().startOf('month'),
        endtime:moment().endOf('month')
      })
    }else if(v===2){
      form.setFieldsValue({
        starttime:moment().startOf('year'),
        endtime:moment().endOf('year')
      })
    }else if(v===3){
      form.setFieldsValue({
        starttime:moment(),
        endtime:moment()
      })
    }
    console.log(v, typeof v)
  }
  //查询
  const search = () => {

    getTableData(areavalue)
  }

  //开始时间禁用
  const disabledStartDate = (current) => {
    return current && current > form.getFieldValue('endtime');
  }
  //结束时间禁用
  const disabledEndDate = (current) => {
    return current && current < form.getFieldValue('starttime');
  }
  //获取数据
  const getTableData = async (areaId = 0) => {
    try {
      const formvalues = form.getFieldValue()
      const startstyle = pickertype === 3 ?'YYYY-01-01' :pickertype === 2?'YYYY-MM-01':'YYYY-MM-DD'  
      const endDate = pickertype === 1 ? moment(formvalues.endtime).format('YYYY-MM-DD')
        : pickertype === 2 ? moment(formvalues.endtime).format('YYYY-MM-01')
          : moment(formvalues.endtime).format('YYYY-01-01')
      let parmas = {
      projectId,
      meterType: formvalues.energytype,
      type: 1,
      startDate: moment(formvalues.starttime).format(startstyle),
      endDate,
    }
  let arrs = []
  let list = [...arealistRef]
  if (areaId === 0) {
    list?.shift()
    arrs = list?.map(it => it.id)
  } else {
    arrs = [areaId]
  }
  const res = await api(parmas, arrs)
  setLoading(false)
  if (res.success) {
    if (Array.isArray(res.data)) {
      setDataSource([...res.data])
    } else {
      setDataSource([])
    }
  } else {
    message.error(res.errMsg)
  }
} catch (e) {
  console.log(e)
}
  }
useEffect(() => {
  getTableData(areavalue)
}, [areavalue])

return (
  <div>
    <Form
      form={form}
      layout="inline"
      initialValues={
        {
          energytype: 1,
          time: 1,
          starttime:moment().startOf('month'),
          endtime:moment().endOf('month')
        }
      }
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Form.Item label="能源类型" style={{ marginBottom: 0 }} name="energytype">
          <Select style={{ width: 112 }} options={energyoptions} disabled={ true}></Select>
        </Form.Item>
        <Divider type="vertical" style={{ height: 30, margin: '0 32px' ,borderColor:'#d7d7d7' }} dashed></Divider>
        <Form.Item label="时间" style={{ marginBottom: 0, marginRight: 16 }} name="time">
          <Select style={{ width: 80 }} options={dateOptions} onChange={changeTime}></Select>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }} name="starttime">
          <DatePicker
            disabledDate={disabledStartDate}
            picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
          />
        </Form.Item>
        <p style={{ margin: '0 16px' }}>至</p>
        <Form.Item style={{ marginBottom: 0 }} name="endtime">
          <DatePicker
            picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
            disabledDate={disabledEndDate}
          />
        </Form.Item>


      </div>
      <div>
        <Button style={btncss} onClick={search}>查询</Button>
        <Button style={{ ...btncss, marginLeft: 16 }} onClick={() => { tableRef.current.download() }}>导出</Button>
      </div>

    </Form>
    <Divider dashed style={{borderColor:'#d7d7d7' }}></Divider>
    <div style={{ width: 1645 }} className={style.tablecss}>
      <Table dataSource={dataSource} {...other} ref={tableRef} loading={loading} ></Table>

    </div>

  </div>

)
}