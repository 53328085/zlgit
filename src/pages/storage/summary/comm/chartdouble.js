import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Space, Form, DatePicker, Badge, Select, message } from 'antd'
import dayjs from 'dayjs'
import { Paramscontext } from '../context'
import { isObject ,disabledDate} from '@com/usehandler'

import { lineoptdoub } from '../data'
import Titlelayout from "@com/titlelayout"
import Ichart from '@com/useEcharts/Ichart'
import { useQueryMeterPower, useQueryMeterList, useQuerySOC,useQueryPCSList,useQueryPowerTrends } from '../api'
export default function Index({ title, type }) {

  const [form] = Form.useForm()

  const { areaId, stationName, projectId } = useContext(Paramscontext)
  const [datas, setDatas] = useState({})
  const [list, setList] = useState([])
  const [formdata, setFormdata] = useState({
    startTime: dayjs().subtract(1, 'days'),
    endTime: dayjs(),
    sn: null
  }
  )

  let lineopt = lineoptdoub(datas, formdata?.startTime, formdata?.endTime,type)
  const onValuesChange = (_, b) => {

    setFormdata(b)
  }

  const getChartData = async (params) => {
    try {
      let hander = type == 202 ? useQuerySOC : type==102 ? useQueryPowerTrends :   useQueryMeterPower
      const resp = await hander(params)

      if (resp?.success && isObject(resp?.data)) {
        setDatas(resp?.data)
      }
    } catch (error) {
      console.log(error)
    }

    // setData(data)
  }
  const getPclist=async (params)=>{ 
     try {
       let {success, data}  = await useQueryPCSList(params)
        if (success && Array.isArray(data)) {
        setList(data)
        form.setFieldValue("sn", data[0].sn)
        setFormdata({ ...formdata, sn: data[0].sn })
      } else {
        if (!success) {
          //  message.error(errMsg || "数据出错")
        }
        form.setFieldValue("sn", null)
        setFormdata({ ...formdata, sn: null })
        setList([])
      }
     } catch (error) {
      
     }
      
  }
  const getList = async (params) => {
    try {
      const { data, success, errMsg } = await useQueryMeterList(params)
      if (success && Array.isArray(data)) {
        setList(data)
        form.setFieldValue("sn", data[0].sn)
        setFormdata({ ...formdata, sn: data[0].sn })
      } else {
        if (!success) {
          //  message.error(errMsg || "数据出错")
        }
        form.setFieldValue("sn", null)
        setFormdata({ ...formdata, sn: null })
        setList([])
      }

    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    if ([areaId, projectId].every((id) => Number.isInteger(parseInt(id))) && Number.isInteger(parseInt(stationName?.value)) &&(type==101 || type == 103 || type==202)) {
      let params = {
        areaId,
        siteId: stationName.value,
        projectId,
        type
      }
      getList(params)
    }
  }, [areaId, stationName, projectId, type])

  useEffect(() => {
    if ([areaId, projectId].every((id) => Number.isInteger(parseInt(id))) && Number.isInteger(parseInt(stationName?.value)) &&type==102) {
      let params = {
        areaId,
        siteId: stationName.value,
        projectId,
        containerId:0
      }
      getPclist(params)
    }
  }, [areaId, stationName, projectId, type])

  useEffect(() => {
    const { startTime, endTime, sn } = formdata

    if ([areaId, projectId].every((id) => Number.isInteger(parseInt(id))) && startTime && endTime && sn) {
      
      let params = {
        areaId,
        sn,
        projectId,
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
        pcsId: list.find((item) => item.sn == sn)?.id
      }
      getChartData(params)
    }
  }, [areaId, formdata, projectId])
  const wd = { width: type == 101 ? 140 : 115 }
  const extra = <Form form={form}

    onValuesChange={onValuesChange}
  >
    <Space size={4}>
      <Form.Item name="sn" style={{ marginBottom: 0 }} size="small">
        <Select options={list} style={wd} fieldNames={{ label: "name", value: "sn" }}></Select>
      </Form.Item>
      <Form.Item name="startTime" style={{ marginBottom: 0 }} initialValue={formdata?.startTime}   >
        <DatePicker style={wd} disabledDate={disabledDate} allowClear={false} />
      </Form.Item>
      <Form.Item name="endTime" style={{ marginBottom: 0 }} initialValue={formdata?.endTime}  >
        <DatePicker style={wd} disabledDate={disabledDate} allowClear={false} />
      </Form.Item></Space>
  </Form>
  const props = {
    bg: 'transparent',
    bordered: 'no',
    layout: "flex",
    bl: "none",
    pr: "10px",
    extra
  }
  return (
    <Titlelayout title={<Badge status="processing" text={title} />} {...props} >
      <Ichart custoption={lineopt} />
    </Titlelayout>
  )
}
