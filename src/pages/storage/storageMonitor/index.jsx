import React, {useState, useEffect} from "react";
import style from './style.module.less'
import { useRequest } from "ahooks";
import { Select, Form, Button, message } from 'antd'
import {useSelector} from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import MainPage from './mainPage'
import BatteryPage from './batteryPage'
import {StorageMonitorRuntime, SiteManagerDesigner, PCSMonitorRuntime} from '@api/api.js'

export default function Index() {
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'
  const { QueryBatteryStackList } = StorageMonitorRuntime
  const { FindSiteList } = SiteManagerDesigner
  const { queryPCSList } = PCSMonitorRuntime
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
          queryPCS()
        }else{
          setSiteList([])
          setBmsList([])
          form.setFieldValue('siteId', '')
          form.setFieldValue('stackId', '')
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
    form.setFieldValue('pcsId', null)
    form.setFieldValue('stackId', null)
    queryPCS()
  }

  //PCS list
  const [pcsList, setPcsList] = useState([])
  const [selectPcs, setSelectPcs] = useState('')
  const getPCSList = () => {
    return queryPCSList (projectId, form.getFieldValue('areaId'), form.getFieldValue('siteId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          setPcsList(res.data)
          setSelectPcs(res.data[0].name)
          form.setFieldValue('pcsId', res.data[0].id)
          runQuery()
        }else{
          setPcsList([])
          form.setFieldValue('PCSId', null)
          message.warning('当前站点不存在PCS!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const {run: queryPCS} = useRequest(getPCSList, {manual: true})

  const changePcs = val => {
    form.setFieldValue('stackId', null)
    runQuery()
  }

  //BS list
  const  [bmsList, setBmsList] = useState([])
  const [headerValues, setHeaderValues] = useState()
  const [bmsName, setBmsName] = useState('')
  const getbmsList = () => {
    return QueryBatteryStackList(projectId, form.getFieldValue('areaId'), form.getFieldValue('siteId'), form.getFieldValue('pcsId')).then(res=>{
      if(res.success){
        if(res.data && res.data.length > 0){
          setBmsList(res.data)
          form.setFieldValue('stackId', res.data[0].id)
          setBmsName(res.data[0].name)
          setHeaderValues({
            bmsName: res.data[0].name,
            ...form.getFieldsValue(true)
          })
        }else{
          setBmsList([])
          message.warning('当前PCS不存在电池堆!')
          return;
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const {run: runQuery } = useRequest(getbmsList, {manual: true})

  const changeArea = val => {
    form.setFieldValue('siteId', null)
    form.setFieldValue('pcsId', null)
    form.setFieldValue('stackId', null)
    querySite()
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
    let { pageName, batteryClusterId, batteryPackName , clusterList, count} = val
    setShowPage(pageName)
    setBatteryData({
      batteryClusterId,
      batteryPackName,
      projectId,
      clusterList,
      count,
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
      querySite()
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
          <div className={style.line}></div>
          <Item name='pcsId' label='PCS选择' style={{marginLeft:16}}>
            <Select
              placeholder="请选择PCS"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
              onChange={changePcs}
            >
              {pcsList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='stackId' label='电池堆选择' style={{marginLeft:16}}>
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
              <span style={{color:'#237ae4', cursor:'pointer'}} onClick={()=> backBMS()}>电池堆</span>
              <span className={style.breadcrumb}> { '>' }</span>
              <span>电池簇</span>
            </div>
          </div>: null
        }
        { (showPage == 'subPage') ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} onClick={()=> backBMS()}>返回BMS</Button> : null }
        { showPage == 'batteryPage' ? 
        <Button size="middle" style={{ marginLeft: 'auto', marginRight: 16, width: 96}} type="primary" onClick={()=> backBMS()}>返回</Button> : null }
      </div>
      { showPage == 'mainPage' ? <MainPage getshowTab={getFromChild} headerValues={headerValues}></MainPage> : null }
      { showPage == 'batteryPage' ? <BatteryPage batteryData={batteryData}></BatteryPage> : null }
    </div>
  )
}