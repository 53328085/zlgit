import React, {useState, useEffect} from "react";
import style from './style.module.less'
import { useRequest } from "ahooks";
import { Select, Form, Button, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
import ContainerPage from './containerPage'
import MainPage from './mainPage'
import BatteryPage from './batteryPage'
import BatteryPackPage from './batteryPackPage'
import {StorageMonitorRuntime, SiteManagerDesigner, PCSMonitorRuntime} from '@api/api.js'
 
import Pagecount from "@com/pagecontent";
 
import Titlelayout from "@com/titlelayout";
export default function Index() {
  const dispatch = useDispatch()
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)
  const { FindSiteList } = SiteManagerDesigner
  const [form] = Form.useForm()
  const {Item}  = Form

  //siteList
  const [siteList, setSiteList] = useState([])
  const querySite = () => {
    FindSiteList(projectId, form.getFieldValue('areaId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          setSiteList(res.data)
          form.setFieldValue('siteId', res.data[0].id)
          setHeaderValues({
            projectId,
            name: res.data[0].name,
            ...form.getFieldsValue(true)
          })
        }else{
          setSiteList([])
          form.setFieldValue('siteId', null)
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
    siteList.map(item => {
      if(item.id == val){
        setHeaderValues(
          {
            projectId,
            name: item.name,
            ...form.getFieldsValue(true)
          }
        )
      }
    })
  }

  const [headerValues, setHeaderValues] = useState()


  const changeArea = (val) => {
    areaList.map(item => {
      if(item.id == val){
        dispatch(setCurrentlevel(item))
      }
    })
    form.setFieldValue('siteId', null)
    querySite()
  }

  const [showPage, setShowPage] = useState('containerPage')
  const [batteryData, setBatteryData] = useState({})
  const getFromChild = val => {
    let { pageName, batteryCluster} = val
    setShowPage(pageName)
    setBatteryData({
      batteryCluster,
      projectId,
      areaId:form.getFieldValue('areaId'), 
    })
  }

  const [selectValues, setSelectValues] = useState({})
  const getFromContainer = val => {
    setShowPage(val.pageName)
    setSelectValues({
      areaId:form.getFieldValue('areaId'),
      bmsName: val.batteryStack.name,
      stackId: val.batteryStack.id,
    })
  }

  const [batteryPackData, setBatteryPackData] = useState({})
  const getFromCluster = val => {
    let { pageName, batteryItem} = val
    setShowPage(pageName)
    setBatteryPackData({
      batteryItem,
      projectId,
      areaId:form.getFieldValue('areaId'), 
    })
  }

  const backContainer = () => {
    setShowPage('containerPage')
  }
  const backBMS = () => {
    setShowPage('mainPage')
  }
  const backBatteryCluster = () => {
    setShowPage('batteryPage')
  }

  useEffect(()=>{
    if(areaList.length == 0|| !areaList){
      message.error('当前项目尚未创建园区!')
    }else{
      form.setFieldValue('areaId', oneLevelDefaultId)
      querySite()
    }
  },[])
  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline'>
          { showPage == 'containerPage' ? <>
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
          <Item name='siteId' label='站点选择' style={{marginLeft:16}}>
            <Select
              placeholder="请选择站点"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
              onChange={changeSite}
            >
              {siteList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          </> : null}
        </Form>
        {
          showPage == 'mainPage' ?
          <div>
            <div className={style.border}>
              <span style={style.pot} onClick={()=> backContainer()}>储能柜</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span>电池堆</span>
            </div>
          </div>: null
        }
        {
          showPage == 'batteryPage' ?
          <div>
            <div className={style.border}>
              <span style={style.pot} onClick={()=> backContainer()}>储能柜</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span style={style.pot} onClick={()=> backBMS()}>电池堆</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span>电池簇</span>
            </div>
          </div>: null
        }
        {
          showPage == 'batteryPackPage' ?
          <div>
            <div className={style.border}>
              <span style={style.pot} onClick={()=> backContainer()}>储能柜</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span style={style.pot} onClick={()=> backBMS()}>电池堆</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span style={style.pot} onClick={()=> backBatteryCluster()}>电池簇</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span>电池组</span>
            </div>
          </div>: null
        }
        { (showPage == 'mainPage') ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} type="primary" onClick={()=> backContainer()}>返回</Button> : null }
        { (showPage == 'batteryPackPage') ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} type="primary" onClick={()=> backBatteryCluster()}>返回</Button> : null }
        { showPage == 'batteryPage' ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} type="primary" onClick={()=> backBMS()}>返回</Button> : null }
      </div>
      { showPage == 'mainPage' ? <MainPage getshowTab={getFromChild} headerValues={selectValues}></MainPage> : null }
      { showPage == 'batteryPage' ? <BatteryPage batteryData={batteryData} getshowPack={getFromCluster}></BatteryPage> : null }
      { showPage == 'batteryPackPage' ? <BatteryPackPage batteryPackData={batteryPackData}></BatteryPackPage> : null }
      { showPage == 'containerPage' ? <ContainerPage getshowTab={getFromContainer} headerValues={headerValues}></ContainerPage> : null }
    </div>
  )
}