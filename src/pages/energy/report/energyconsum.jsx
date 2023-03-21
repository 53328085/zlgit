import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import Comp from './comp'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { energyReport } from '@api/api'
import { message } from 'antd'

  function Energyconsum({ areavalue=0, arealistRef }) {
  const contentRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const times = []
  for (let i = 0; i < 24; i++) {
    if (i < 10) {
      times.push({
        title: `0${i}:00`,
        dataIndex: `0${i}:00`,

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
    
      })
    }
  }
  const columns =useMemo(()=>([{
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
  ]),[]) 

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
      console.log(areaId,arealistRef)
      if (areaId === 0) {
        // arealistRef.shift()
        arrs = arealistRef.map(it => it.id)
      } else {
        arrs = [areaId]
      }
      const res = await energyReport.QueryConsume(parmas, arrs)
      contentRef.current.setLoading(false)
      if (res.success) {
        if(Array.isArray(res.data)){
          contentRef.current.setDataSource([...res.data])
        }else{
          contentRef.current.setDataSource(null)
        } 
      } else {
        message.error(res.errMsg)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    // getTableData(areavalue)
  }, [])
  const compProps = {
    columns,
    scroll: { x: 3022},
    ref: contentRef,
    api:energyReport.QueryConsume
  }
  return (
    <div>
      <Comp {...compProps} />
    </div>
  )
}

export default Energyconsum


