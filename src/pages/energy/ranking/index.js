import React, { useEffect, useRef, useState,useMemo } from 'react'
import SelectForm from '@com/useSelect'
import style from './ranking.module.less'
import { useSelector } from 'react-redux'
import RankCharts from './rankecharts'
import { Form, Select, DatePicker, message } from 'antd'
import { energyRanking } from '@api/api'

import moment from 'moment';


export default function Index() {
  const [datetype, setDatetype] = useState(1)
  const datetypeRef =useRef()
  datetypeRef.current = datetype
  const [arealist, setArealist] = useState([{ name: '全部园区', id: 0 }])
  const [planlist, setPlanlist] = useState([{name:'全部班次',id:0}])
  const buildRef= useRef(null)//建筑
  const lineRef = useRef(null)//线路
  const roomRef = useRef(null)//房间
  const [form] = Form.useForm()
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state=>state.system.onelevel)
  const areaOptions =useMemo(()=>([{name:oneLevel[0].levelName,id:0},...oneLevel]),[oneLevel]) 
  const typeoptions = [{
    label: '日',
    value: 1
  }, {
    label: '月',
    value: 2
  }, {
    label: '年',
    value: 3
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


  //获取区域
  // const getAreaAll = async () => {
  //   try {
  //     const resp = await energyRanking.AeraQueryAll(projectId)
  //     if (resp.success) {
  //       if (Array.isArray(resp.data)) {
  //         setArealist([{ name: '全部园区', id: 0 }, ...resp.data])
  //         form.setFieldValue('area',0)
  //       } else {
  //         setArealist([])
  //       }
  //     } else {
  //       message.error(resp.errMsg)
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  //获取日期格式
  const getdateformat = ()=>{
    let date= form.getFieldsValue().datevalue
    console.log(datetypeRef)
    if(datetypeRef.current===1){
      date = moment(date).format('YYYY-MM-DD')
    }else if(datetypeRef.current ===2){
      date = moment(date).format('YYYY-MM-01')
    }else if(datetypeRef.current ===3){
      date = moment(date).format('YYYY-01-01')
    }
    return date
  }
  //获取班次
  const getQueryShifts = async () => {
    const res = await energyRanking.QueryShifts(projectId)
    if (res.success) {
      if (Array.isArray(res.data)) {
        setPlanlist([{name:'全部班次',id:0},...res.data])
        form.setFieldValue('plan',0)
      } else {
        setPlanlist([])
      }
    } else {
      message.error(res.errMsg)
    }
  }
  //获取能耗排名
  const getQuery=async (areaId,type,energytype,shiftId)=>{
    const date =getdateformat()
    console.log(date)
    const formvalues =form.getFieldsValue()
    let params={
        projectId,
        areaId:formvalues.area?formvalues.area:0,
        type:formvalues.datetype?formvalues.datetype:1,
        energytype:formvalues.energytype?formvalues.energytype:1,
        shiftId:formvalues.plan?formvalues.plan:0,
        date,
    }
    const res = await energyRanking.Query(params)
    if(res.success){
      buildRef.current.setlist([...res.data.building])
      lineRef.current.setlist([...res.data.line])
      roomRef.current.setlist([...res.data.room])
    }else{
      message.error(res.errMsg)
    }
  }
  //改变园区
  const changeArea=(v)=>{
    console.log(v)
    console.log(form.getFieldsValue())
    getQuery()
  }
  //改变能源类型
  const changeEnergy=(v)=>{
    console.log(v)
    console.log(form.getFieldsValue())
    getQuery()
  }
  //改变年月日
  const changeDateType = (v) => {
    setDatetype(v)
    datetypeRef.current =v
    console.log(form.getFieldsValue())
    getQuery()
  }
  //改变日期
  const changeDate=(v)=>{
    console.log(form.getFieldsValue())
    getQuery()
  }
  //改变班次
  const changePlan=(v)=>{
    console.log(form.getFieldsValue())
    getQuery()
  }
  useEffect(() => {         
    // getAreaAll()
    getQueryShifts()
    getQuery()
  }, [])
  
  return (
    <div className={style.ranking}>
      {/* <SelectForm isset={false} ></SelectForm> */}
      <Form
        className={style.mgbt0}
        form={form}
        colon={false}
        initialValues={
          {
            energytype: 1,
            datetype: 1,
            datevalue: moment(new Date()),
          }
        }
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: '#fff' }}>
          <div style={{ display: 'flex', }}>
            <Form.Item label={oneLevel[0].levelName} name="area">
              <Select
                style={{ width: 200 }}
                fieldNames={{
                  label: "name",
                  value: "id"
                }}
                colon={false}
                defaultValue={0}
                options={areaOptions}
                onChange={changeArea}
              ></Select>
            </Form.Item>
            <Form.Item label="能源类型" style={{ marginLeft: 16 }} name="energytype">
              <Select style={{ width: 112 }} options={energyoptions} onChange={changeEnergy}></Select>
            </Form.Item>
          </div>
          <div style={{ display: 'flex', }}>
            <Form.Item name='datetype'>
              <Select style={{ width: 80 }} options={typeoptions} onChange={changeDateType}></Select>
            </Form.Item>
            <Form.Item style={{ marginLeft: 16 }} name="datevalue">
              <DatePicker picker={datetype==1?'date':datetype==2?'month':'year'} onChange={changeDate}></DatePicker>
            </Form.Item>
            <Form.Item style={{ marginLeft: 16 }} name="plan">
              <Select
                style={{ width: 102 }}
                fieldNames={{
                  label: "name",
                  value: "id"
                }}
                options={
                  planlist
                }
                onChange={changePlan}
                ></Select>
            </Form.Item>
          </div>
        </div>
      </Form>
      <div className={style.ranklist}>
        <RankCharts name="按回路排名"   ref={lineRef}/>
        <RankCharts name="按建筑排名"   ref={buildRef}/>
        <RankCharts name="按房间排名"   ref={roomRef}/>
      </div>
    </div>
  )
}
