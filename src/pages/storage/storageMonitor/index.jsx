import React, {useState, useEffect} from "react";
import style from './style.module.less'
import { Select, Form, Button } from 'antd'
import {useSelector} from 'react-redux'
import {selectOneLevel} from '@redux/systemconfig.js'
import MainPage from './mainPage'
import SubPage from './subPage'
import BatteryPage from './batteryPage'

export default function Index() {
  const areaList = useSelector(selectOneLevel)
  const [form] = Form.useForm()
  const {Item}  = Form
  //PCS list
  const pcsList = [
    {
      id:1,
      name:'电池簇_1',
    },{
      id:2,
      name:'电池簇_2',
    },{
      id: 3,
      name:'电池簇_3',
    },
  ]
  //storage list
  const storageList = [
    {
      id:1,
      name:'储能室#1',
    },{
      id:2,
      name:'储能室#2',
    },{
      id: 3,
      name:'储能室#3',
    },
  ]
  //电池列表
  const batteryList = [
    {
      id:1,
      name:'电池簇1_1',
    },{
      id:2,
      name:'电池簇1_2',
    },{
      id: 3,
      name:'电池簇1_3',
    },
  ] 
  const [showPage, setShowPage] = useState('mainPage')
  const getFromChild = val => {
    setShowPage(val)
  }

  const backBMS = () => {
    setShowPage('mainPage')
  }
  const goback = () => {
    setShowPage('subPage')
  }
  useEffect(()=>{
    form.setFieldValue('areaId', areaList[0].id)
    form.setFieldValue('PCSId', pcsList[0].id)
    form.setFieldValue('storageId', storageList[0].id)
    form.setFieldValue('batteryId', batteryList[0].id)
  },[])
  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline'>
          { showPage == 'mainPage' ? <>
          <Item name='areaId' label={ areaList[0]?.levelName + '选择' || '园区选择'} style={{marginLeft:16}}>
            <Select
              placeholder="请选择园区"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
            >
              {areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='PCSId' label='电池簇选择' style={{marginLeft:16}}>
            <Select
              placeholder="请选择PCS"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
            >
              {pcsList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          </> : null}
          { showPage == 'subPage' ? 
          <>
          <Item name='storageId' label='储能室选择' style={{marginLeft:16}}>
            <Select
              placeholder="请选择储能室"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
            >
              {storageList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          </>: null }
          { showPage == 'batteryPage' ? 
          <>
          <Item name='batteryId' label='电池簇选择' style={{marginLeft:16}}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
            >
              {batteryList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          </>: null }
        </Form>
        { (showPage == 'subPage' ||showPage == 'batteryPage') ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} onClick={()=> backBMS()}>返回BMS</Button> : null }
        { showPage == 'batteryPage' ? 
        <Button size="middle" style={{ marginRight: 16, width: 96}} onClick={()=> goback()}>返回</Button> : null }
      </div>
      { showPage == 'mainPage' ? <MainPage getshowTab={getFromChild}></MainPage> : null }
      { showPage == 'subPage' ? <SubPage getshowTab={getFromChild}></SubPage> : null }
      { showPage == 'batteryPage' ? <BatteryPage getshowTab={getFromChild}></BatteryPage> : null }
    </div>
  )
}