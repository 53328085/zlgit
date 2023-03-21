import React, { useContext, useEffect, useRef } from 'react'
import Comp from './comp'
import moment from 'moment'
import { energyReport } from '@api/api'
import { useSelector } from 'react-redux'
import { message } from 'antd'
export default function Energymeter({ areavalue, arealistRef }) {

  const contentRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const columns = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '设备编号',
      dataIndex: 'sn'
    },
    {
      title: '测点',
      dataIndex: ''
    },
    {
      title: moment().startOf('month').format("YYYY-MM-DD"),
      dataIndex: 'start'
    },
    {
      title: moment().endOf('month').format("YYYY-MM-DD"),
      dataIndex: 'end'
    },
    {
      title: '差值(kWh)',
      dataIndex: 'consume'
    },
    {
      title: '费用(元)',
      dataIndex: 'cost'
    }
  ]
  //获取表格数据
  const getTableData = async (areaId = 0) => {
    try {
      console.log(44,contentRef)
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
        arealistRef.shift()
        arrs = arealistRef.map(it => it.id)
      } else {
        arrs = [areaId]
      }
      const res = await energyReport.QueryReading(parmas, arrs)
      console.log(62,contentRef)
      contentRef.current.setLoading(false)
      if (res.success) {
        if(Array.isArray(res.data)){
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
    // if(contentRef.current){
    //   getTableData(areavalue)
    // }
    
  }, [])
  const compProps = {
    columns,
    ref: contentRef,
    api:energyReport.QueryReading
  }
  return (
    <div>
      <Comp {...compProps} />
    </div>
  )
}
