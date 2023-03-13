import React, { useContext, useEffect, useRef } from 'react'
import Comp from './comp'
import { useSelector } from 'react-redux'
import { energyReport } from '@api/api'
import { message } from 'antd'
export default function Energytimeshare({ areavalue, arealistRef }) {
  const contentRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const columns =[
    {
      title:'名称',
      dataIndex:'name'
    },
    {
      title:'测点',
      dataIndex:'type'
    },
    {
      title:'总计(kWh)',
      dataIndex:'e'
    },
    {
      title:'尖',
      dataIndex:'e1'
    },
    {
      title:'峰',
      dataIndex:'e2'
    },
    {
      title:'平',
      dataIndex:'e3'
    },
    {
      title:'谷',
      dataIndex:'e4'
    },
    {
      title:'总计(元)',
      dataIndex:'c'
    },
    {
      title:'尖(元)',
      dataIndex:'c1'
    },
    {
      title:'峰(元)',
      dataIndex:'c2'
    },
    {
      title:'平(元)',
      dataIndex:'c3'
    },
    {
      title:'谷(元)',
      dataIndex:'c4'
    }
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
    getTableData(areavalue)
  }, [areavalue])
  const compProps = {
    columns,
    ref: contentRef,
    getTableData,
    areavalue
  }
  return (
    <div>
       <Comp {...compProps}/>
    </div>
  )
}
