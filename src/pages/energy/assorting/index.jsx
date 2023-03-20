import React, { useEffect, useMemo, useState } from 'react'
import Energy from './energy'
import style from './style.module.less'
import { Form, Input, Select, Divider, DatePicker, message } from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { energyClassified } from '@api/api'
export default function Index() {
  const shifts = useSelector(state => state.system.shifts)
  const shiftsOptions = useMemo(() => ([{ name: "全部班次", id: 0 }, ...shifts]), [shifts])
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions = useMemo(() => ([{ name: oneLevel[0].levelName, id: 0 }, ...oneLevel]), [oneLevel])
  const dateOptions = [{ label: '日', value: 1 }, { label: '月', value: 2 }, { label: '年', value: 3 }]
  const [dateType, setDateType] = useState(1)
  const [showType, setShowType] = useState(1)
  const [showData, setShowData] = useState()
  const [form] = Form.useForm()
  const {datetype} = form.getFieldsValue()
  //获取日期格式
  const getdateformat = () => {
    let date = form.getFieldsValue().datevalue
    if (dateType === 1) {
      date = moment(date).format('YYYY-MM-DD')
    } else if (dateType === 2) {
      date = moment(date).format('YYYY-MM-01')
    } else if (dateType === 3) {
      date = moment(date).format('YYYY-01-01')
    }
    return date
  }
  //日期类型改变
  const changDateType = (v) => {
    setDateType(v)
  }
  //查询分类能耗
  const getEnergyData = async () => {
    try {
      const formvalues = form.getFieldsValue()
      const date = getdateformat()
      let params = {
        projectId,
        type: formvalues.datetype,
        date,
        shiftsNo: formvalues.plan
      }
      let areaId = [formvalues.area]
      let res;
      if(showType===1){
        res= await energyClassified.QueryEnergy(params, areaId)
      }else{
        res= await energyClassified.QueryEnergyCost(params, areaId)
      }
      if (res.success) {
        if (res.data) {
          setShowData(res.data)
        } else {
          setShowData([])
        }
      } else {
        message.error(res.errMsg)
      }
    } catch (e) { console.log(e) }
  }
 
 
  useEffect(() => {
    getEnergyData()
  }, [showType,datetype])
  return (
    <>
      <div className={style.headform}>
        <Form
          className={style.formstyle}
          form={form}
          initialValues={{
            area: 0,
            datetype: 1,
            datevalue: moment(),
            plan: 0
          }}
        >
          <div className={style.divflex}>
            <Form.Item label="园区选择" name="area" className={style.mgbt0}>
              <Select
                options={areaOptions}
                fieldNames={{ label: 'name', value: 'id' }}
                style={{ width: 200 }}
                onChange={()=>{getEnergyData()}}
              ></Select>
            </Form.Item>
            <Divider style={{ background: '#d7d7d7', height: 32, margin: '0 32px' }} type="vertical" dashed></Divider>
            <div className={style.checkBox}>
              <div className={showType === 1 ? `${style.box} ${style.boxactive}` : style.box} onClick={() => { setShowType(1) }}>能耗</div>
              <div className={showType === 2 ? `${style.box} ${style.boxactive}` : style.box} onClick={() => { setShowType(2) }}>费用</div>
            </div>
          </div>
          <div className={style.divflex}>
            <Form.Item name="datetype" className={style.mgbt0} >
              <Select options={dateOptions} style={{ width: 80 }} onChange={changDateType}></Select>
            </Form.Item>
            <Form.Item name="datevalue" className={style.mgbt0} style={{ marginLeft: 16 }}>
              <DatePicker picker={dateType === 1 ? 'date' : dateType === 2 ? 'month' : 'year'} onChange={()=>{getEnergyData()}}/>
            </Form.Item>
            <Form.Item name="plan" className={style.mgbt0} style={{ marginLeft: 16 }}>
              <Select style={{ width: 100 }} options={shiftsOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={()=>{getEnergyData()}}></Select>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className={style.content}></div>
      <Energy showData={showData} dateType={dateType} /> 
    </>

  )
}
