import React, { useContext, useEffect, useRef } from 'react'
import Comp from './comp'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { energyReport } from '@api/api'
import { message } from 'antd'
export default function Energyconsum({ areavalue, arealistRef }) {
  const contentRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const times = []
  for (let i = 0; i < 24; i++) {
    if (i < 10) {
      times.push({
        title: `0${i}:00`,
        dataIndex: `0${i}:00`,
        width: 100
      })
    } else if (i == 23) {
      times.push({
        title: `${i}:00`,
        dataIndex: 'i',
        
      })
    } else {
      times.push({
        title: `${i}:00`,
        dataIndex: 'i',
        width: 100
      })
    }
  }
  const columns = [{
    title: '名称',
    dataIndex: 'name',
    width: 200,
    fixed: 'left',
  }, {
    title: '设备编号',
    dataIndex: 'sn',
    width: 100,
    fixed: 'left',
  }, {
    title: '测点',
    dataIndex: 'type',
    width: 100,
    fixed: 'left',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
    fixed: 'left',
  }, {
    title: '合计',
    dataIndex: 'total',
    width: 122,
    fixed: 'left',
  },
  ...times
  ]
  //获取表格数据
  const getTableData = async (areaId = 0) => {
    try {
      const formvalues = contentRef.current.form.getFieldValue()
      const pickertype = contentRef.current.pickertype
      const fomatstyle = pickertype === 1 ? 'YYYY-MM-DD' : pickertype === 2 ? 'YYYY-MM-01' : 'YYYY-01-01'
      let parmas = {
        projectId,
        meterType: formvalues.energytype,
        type: formvalues.time,
        startDate: formvalues.starttime.format(fomatstyle),
        endDate: formvalues.endtime.format(fomatstyle)
      }
      let arrs = []
      if (areaId === 0) {
        arealistRef.current.shift()
        arrs = arealistRef.current.map(it => it.id)
      } else {
        arrs = [areaId]
      }
      const res = await energyReport.QueryConsume(parmas, arrs)
      if (res.success) {
        if(Array.isArray(res.data)&&res.data.length>0){
          contentRef.current.setDataSource([...res.data])
        }else{
          contentRef.current.setDataSource([])
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
  const compProps = {
    columns,
    scroll: { x: 3022 },
    ref: contentRef,
    getTableData,
    areavalue
  }
  return (
    <div>
      <Comp {...compProps} />
    </div>
  )
}
