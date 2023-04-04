import React, {useState, useEffect} from "react";
import style from './style.module.less'
import { useRequest } from "ahooks";
import { Select, Form, Button, message } from 'antd'
import {useSelector} from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import MainPage from './mainPage'
import BatteryPage from './batteryPage'
import {BMSRuntime} from '@api/api.js'

export default function Index() {
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'
  const { queryBatterClusterList } = BMSRuntime
  const [form] = Form.useForm()
  const {Item}  = Form
  //PCS list
  const  [bmsList, setBmsList] = useState([])
  const [headerValues, setHeaderValues] = useState()
  const [bmsName, setBmsName] = useState('')
  const getbmsList = () => {
    return queryBatterClusterList(projectId, form.getFieldValue('areaId')).then(res=>{
      if(res.success && res.data){
        setBmsList(res.data)
        form.setFieldValue('bcId', res.data[0].id)
        setBmsName(res.data[0].name)
        setHeaderValues({
          bmsName: res.data[0].name,
          ...form.getFieldsValue(true)
        })
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const {run: runQuery } = useRequest(getbmsList, {manual: true})

  const changeArea = val => {
    runQuery()
  }

  const changeBMS = val => {
    bmsList.map(item => {
      if(item.id == val) {
        setBmsName(item.name)
        setHeaderValues( {
          bmsName: item.name,
          ...form.getFieldsValue(true)
        } )
      }
    })
    
  }

  const [showPage, setShowPage] = useState('mainPage')
  const [batteryData, setBatteryData] = useState({})
  const getFromChild = val => {
    let { pageName, batteryPackId, batteryPackName } = val
    setShowPage(pageName)
    setBatteryData({
      batteryPackId,
      batteryPackName,
      projectId,
      areaId:form.getFieldValue('areaId'),
    })
  }

  const backBMS = () => {
    setShowPage('mainPage')
  }

  useEffect(()=>{
    if(areaList.length == 0|| !areaList){
      message.error('当前项目尚未创建园区!')
    }else{
      form.setFieldValue('areaId', areaList[0].id)
      runQuery()
    }
  },[])
  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline'>
          { showPage == 'mainPage' ? <>
          <Item name='areaId' label={ areaName + '选择' } style={{marginLeft:16}}>
            <Select
              placeholder="请选择园区"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
              onChange={changeArea}
            >
              {areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='bcId' label='电池簇选择' style={{marginLeft:16}}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
              onChange={changeBMS}
            >
              {bmsList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          </> : null}
        </Form>
        {
          showPage == 'batteryPage' ?
          <div>
            <div className={style.border}>
              <span style={{color:'#237ae4', cursor:'pointer'}} onClick={()=> backBMS()}>{bmsName}</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span>{batteryData.batteryPackName}</span>
            </div>
          </div>: null
        }
        { (showPage == 'subPage') ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} onClick={()=> backBMS()}>返回BMS</Button> : null }
        { showPage == 'batteryPage' ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} onClick={()=> backBMS()}>返回</Button> : null }
      </div>
      { showPage == 'mainPage' ? <MainPage getshowTab={getFromChild} headerValues={headerValues}></MainPage> : null }
      { showPage == 'batteryPage' ? <BatteryPage batteryData={batteryData}></BatteryPage> : null }
    </div>
  )
}