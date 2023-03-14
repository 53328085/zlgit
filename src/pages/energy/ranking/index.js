import React, { useEffect, useState } from 'react'
import SelectForm from '@com/useSelect'
import style from './ranking.module.less'
import { useSelector } from 'react-redux'
import RankCharts from './rankecharts'
import { Form, Select, DatePicker, message } from 'antd'
import { energyRanking } from '@api/api'
import moment from 'moment';

export default function Index() {
  const [datetype, setDatetype] = useState()
  const [arealist, setArealist] = useState()
  const [planlist, setPlanlist] = useState()
  const [form] = Form.useForm()
  const projectId = useSelector(state => state.system.menus.projectId)
  const typeoptions = [{
    label: '日',
    value: 'day'
  }, {
    label: '月',
    value: 'month'
  }, {
    label: '年',
    value: 'year'
  }]
  const energyoptions = [{
    label: '电',
    value: 1
  }, {
    label: '水',
    value: 2
  }, {
    label: '燃气',
    value: 3
  }]

  const changeDateType = (v) => {
    setDatetype(v)
  }
  //获取区域
  const getAreaAll = async () => {
    try {
      const resp = await energyRanking.AeraQueryAll(projectId)
      if (resp.success) {
        if (Array.isArray(resp.data)) {
          setArealist([{ name: '全部园区', id: 0 }, ...resp.data])
        } else {
          setArealist([])
        }
      } else {
        message.error(resp.errMsg)
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取班次
  const getQueryShifts = async () => {
    const res = await energyRanking.QueryShifts(projectId)
    if (res.success) {
      if (Array.isArray(res.data)) {
        setPlanlist([...res.data])
        console.log(1111)
      } else {
        setPlanlist([])
      }
    } else {
      message.error(res.errMsg)
    }
  }
  useEffect(() => {
    getAreaAll()
    getQueryShifts()
  }, [])
  // useEffect(() => {
  //   console.log('arealist', arealist)
  //   form.setFieldsValue({
  //     area: arealist[0],
  //   })
  // }, [arealist])
  // useEffect(() => {
  //   console.log('planlist', planlist)
  //   form.setFieldsValue({
  //     plan: planlist[0]
  //   })
  // }, [planlist])
  return (
    <div className={style.ranking}>
      {/* <SelectForm isset={false} ></SelectForm> */}
      <Form
        className={style.mgbt0}
        form={form}
        initialValues={
          {
            energytype: energyoptions[0],
            datetype: typeoptions[0],
            datevalue: moment(new Date()),
          }
        }
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: '#fff' }}>
          <div style={{ display: 'flex', }}>
            <Form.Item label="园区选择" name="area">
              <Select
                style={{ width: 200 }}
                options={arealist}
                fieldNames={{
                  label: "name",
                  value: "id"
                }}
              ></Select>
            </Form.Item>
            <Form.Item label="能源类型" style={{ marginLeft: 16 }} name="energytype">
              <Select style={{ width: 112 }} options={energyoptions}></Select>
            </Form.Item>
          </div>
          <div style={{ display: 'flex', }}>
            <Form.Item name='datetype'>
              <Select style={{ width: 80 }} options={typeoptions} onChange={changeDateType}></Select>
            </Form.Item>
            <Form.Item style={{ marginLeft: 16 }} name="datevalue">
              <DatePicker picker={datetype}></DatePicker>
            </Form.Item>
            <Form.Item style={{ marginLeft: 16 }} name="plan">
              <Select
                style={{ width: 96 }}
                fieldNames={{
                  label: "name",
                  value: "id"
                }}></Select>
            </Form.Item>
          </div>
        </div>
      </Form>
      <div className={style.ranklist}>
        <RankCharts name="按回路排名" />
        <RankCharts name="按建筑排名" />
        <RankCharts name="按房间排名" />
      </div>
    </div>
  )
}
