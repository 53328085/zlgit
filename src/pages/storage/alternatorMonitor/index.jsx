import React, {Fragment, useEffect, useState} from 'react'
import style from './style.module.less'
import { Select, Form, Table, message } from 'antd'
import {useSelector} from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import PowerChart from './powerChart'
import SocChart from './SocChart'
import {PCSMonitorRuntime, SiteManagerDesigner } from '@api/api.js'
import { useReactive, useRequest } from 'ahooks'

import pcs from './imgs/pcs.png'
import online from './imgs/online.png'
import offline from './imgs/offline.png'
import error from './imgs/error.png'

export default function Index() {
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'
  const { queryPCSList, 
    queryPCSInfo,
    queryPCSWarningInfo, 
    queryPowerTrends, 
    querySocTrends, 
    queryAcTable } = PCSMonitorRuntime
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
          queryPCS()
        }else{
          setSiteList([])
          setPcsList([])
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
          return;
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
    form.setFieldValue('PCSId', null)
    queryPCS()
  }

  //PCS list
  const [pcsList, setPcsList] = useState([])
  const [selectPcs, setSelectPcs] = useState('')
  const getPCSList = () => {
    return queryPCSList (projectId, form.getFieldValue('areaId'),form.getFieldValue('siteId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          setPcsList(res.data)
          setSelectPcs(res.data[0].name)
          form.setFieldValue('PCSId', res.data[0].id)
          getContent()
        }else{
          setPcsList([])
          message.warning('当前站点不存在PCS!')
          return;
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const {run: queryPCS} = useRequest(getPCSList, {manual: true})

  //页面组件
  const Card = props => {
    return <div className={style.card}>
      <div className={style.cardtitle}>{props.title}</div>
      <div className={style.unit}>({props.unit})</div>
      <div className={style.values}>{props.values}</div>
    </div>
  }
  const StateItem = props => {
    let { state } = props
    state = state === 0 ? 'normal' : state === 1 ? 'error' : 'offline'
    return <div className={style.stateItem} style={props.styles}>
      <span>{props.name}</span>
      <img src={state == 'offline' ? offline : state == 'normal' ? online : error} className={style.stateImg}></img>
    </div>
  }

  //页面参数
  const [leftValues, setLeftValues] = useState([])
  const [powerData, setPowerData] = useState({})
  const [socData, setSocData] = useState({})
  const state = useReactive({
    gridState:'',
    chargeState:'',
    warningInfo:[],
    ACData:[]
  })
  const getContent = () => {
    //左侧数据
    queryPCSInfo(projectId, form.getFieldValue('areaId'), form.getFieldValue('PCSId')).then(res => {
      if(res.success){
        if(res.data ){
          state.gridState = res.data[0]?.name || ''
          state.chargeState = res.data[1]?.name || ''
          let arr = []
          res.data.map((item, index) => {
            if(index > 1){
              arr.push(item)
            }
          })
          setLeftValues(arr)
        }else{
          state.gridState = []
          state.chargeState = []
          setLeftValues([])
        }
      }else{
        message.error(res.errMsg)
      }
    })
    queryPCSWarningInfo(projectId, form.getFieldValue('PCSId')).then(res => {
      if(res.success){
        if(res.data){
          state.warningInfo = res.data
        }else{
          state.warningInfo = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //实时功率
    queryPowerTrends(projectId, form.getFieldValue('areaId'), form.getFieldValue('PCSId')).then(res => {
      if(res.success){
        if(res.data){
          let x= [];
          let y = [];
          res.data.map((item, index) => {
            x.push(item.x)
            y.push(item.y)
          })
          setPowerData({
            x,
            y
          })
        }else{
          setPowerData({x:[], y:[]})
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //soc
    querySocTrends(projectId, form.getFieldValue('areaId'), form.getFieldValue('PCSId')).then(res => {
      if(res.success){
        if(res.data){
          let x= [];
          let y = [];
          res.data.map((item, index) => {
            x.push(item.x)
            y.push(item.y)
          })
          setSocData({
            x,
            y
          })
        }else{
          setSocData({x:[], y:[]})
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //ac Table
    queryAcTable(projectId, form.getFieldValue('areaId'), form.getFieldValue('PCSId')).then(res=> {
      if(res.success){
        if(res.data && res.data.length > 0){
          res.data[0].name = 'A'
          res.data[1].name = 'B'
          res.data[2].name = 'C'
          state.ACData = res.data
        }else{
          state.ACData = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  const AcClomns = [
    {
      title:'AC',
      dataIndex:'name',
      key:'name',
      align:'center'
    },{
      title:'电压 (V)',
      dataIndex:'v',
      key:'v',
      align:'center'
    },{
      title:'电流 (A)',
      dataIndex:'i',
      key:'i',
      align:'center'
    },{
      title:'有功功率(kW)',
      dataIndex:'p',
      key:'p',
      align:'center'
    },{
      title:'视在功率 (kVA)',
      dataIndex:'ps',
      key:'ps',
      align:'center'
    },{
      title:'无功功率 (kVar)',
      dataIndex:'q',
      key:'q',
      align:'center'
    },{
      title:'功率因数',
      dataIndex:'pf',
      key:'pf',
      align:'center'
    },
  ]

  const changeArea = val => {
    form.setFieldValue('siteId', null)
    form.setFieldValue('PCSId', null)
    querySite()
  }
  const changePCS = val => {
    pcsList.map(item=> {
      if(item.id == val){
        setSelectPcs(item.name)
      }
    })
    getContent()
  }
  useEffect(()=>{
    if(areaList.length == 0|| !areaList){
      message.error('当前项目尚未创建园区!')
    }else{
      form.setFieldValue('areaId', areaList[0].id)
      querySite()
    }
  },[])

  const rightStyle={
    borderRight: 'none'
  }
  const bottomStyle = {
    borderBottom:'none'
  }

  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline'>
          <Item name='areaId' label={ areaName + '选择'} style={{marginLeft:16}}>
            <Select
              placeholder="请选择"
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
          <Item name='siteId' label='' style={{marginLeft:16}}>
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
          <Item name='PCSId' label='PCS选择' style={{marginLeft:16}}>
            <Select
              placeholder="请选择PCS"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
              onChange={changePCS}
            >
              {pcsList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
        </Form>
      </div>
      <div className={style.pcsContent}>
        <div className={style.left}>
          <div className={style.title}>
            <span>储能交流器</span>
            <span className={style.pcsName}>{selectPcs}</span>
          </div>
          <div className={style.firstValue}>
            <div className={style.stateList}>
              <div className={style.stateItem}>
                <img src={online} className={style.circle}></img>
                <span style={{color:'#0f0'}}>无故障</span>
              </div>
              <div className={style.stateItem}>
              <img src={error} className={style.circle}></img>
                <span style={{color:'#f00'}}>告警</span>
              </div>
            </div>
            <div className={style.pcsImgs}>
              <span className={style.imgTitle}>储能交流器</span>
              <img className={style.pcsImg} src={pcs}></img>
            </div>
            <div className={style.pcsStatus}>
              <span>{state.gridState}</span>
              <span>{state.chargeState}</span>
            </div>
          </div>
          <div className={style.dataCard}>
            {
              leftValues.map((item, index) => {
                return <Fragment key={index}>
                  <Card  title={item.name} unit={item.unit} values={item.value}></Card>
                  {((index + 1) % 3 == 0 && (index + 1) < leftValues.length ) ? <div className={style.line}></div> : null}
                </Fragment>
              })
            }
          </div>
          {/* ((index == state.warningInfo.length - 4) || (index == state.warningInfo.length - 3) || (index == state.warningInfo.length - 2) || (index == state.warningInfo.length - 1)) ? bottomStyle : null */}
          <div className={style.status}>
            {
              state.warningInfo.map((item, index) => {
                return <StateItem key={index} name={item.name} state={item.value} styles={((index + 1) % 4) == 0 ? rightStyle : null}></StateItem>
              })
            }
          </div>
        </div>
        <div className={style.right}>
          <div className={style.chartCard}>
            <div className={style.chartTitle}>总功率</div>
            <PowerChart lineData={powerData} Unit='实时总功率(kwh)' color={'#1ba41b'}></PowerChart>
          </div>
          <div className={style.chartCard}>
            <div className={style.chartTitle}>SOC</div>
            <SocChart lineData={socData} Unit='SOC(%)' color={'#ff6701'}></SocChart>
          </div>
          <div className={style.tableList}>
            <Table size='small' bordered dataSource={state.ACData} columns={AcClomns} rowKey='name' pagination={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
