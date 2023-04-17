import React, {useEffect, useState} from 'react'
import style from './style.module.less'
import { Select, Form, Table, message } from 'antd'
import {useSelector} from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import PowerChart from './powerChart'
import SocChart from './SocChart'
import {PCSMonitorRuntime, SiteManagerDesigner } from '@api/api.js'
import { useRequest } from 'ahooks'

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
    queryPowerTrends, 
    querySocTrends, 
    queryAcTable, 
    queryPileTable } = PCSMonitorRuntime
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
          form.setFieldValue('siteId', '')
          form.setFieldValue('PCSId', '')
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
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
          form.setFieldValue('PCSId', '')
          message.warning('当前站点不存在PCS!')
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
    state = state == 0 ? 'normal' : state == 1 ? 'error' : ''
    return <div className={style.stateItem} style={props.styles}>
      <span>{props.name}</span>
      <img src={state == 'offline' ? offline : state == 'normal' ? online : error} className={style.stateImg}></img>
    </div>
  }

  //页面参数
  const [leftValues, setLeftValues] = useState({})
  const [powerData, setPowerData] = useState({})
  const [socData, setSocData] = useState({})
  const getContent = () => {
    //左侧数据
    queryPCSInfo(projectId, form.getFieldValue('areaId'), form.getFieldValue('PCSId')).then(res => {
      if(res.success){
        if(res.data){
          setLeftValues(res.data)
        }else{
          setLeftValues({})
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
    queryAcTable(projectId, form.getFieldValue('areaId'), form.getFieldValue('PCSId')).then(res=> {})
    //pile Table
    queryPileTable(projectId, form.getFieldValue('areaId'), form.getFieldValue('PCSId')).then(res=> {})
  }

  const AcClomns = [
    {
      title:'AC',
      dataIndex:'name',
      key:'name',
      align:'center'
    },{
      title:'电压 (V)',
      dataIndex:'voltage',
      key:'voltage',
      align:'center'
    },{
      title:'电流 (A)',
      dataIndex:'current',
      key:'current',
      align:'center'
    },{
      title:'有功功率(kW)',
      dataIndex:'activePower',
      key:'activePower',
      align:'center'
    },{
      title:'视在功率 (kVA)',
      dataIndex:'apparentPower',
      key:'apparentPower',
      align:'center'
    },{
      title:'无功功率 (kVar)',
      dataIndex:'reactivePower',
      key:'reactivePower',
      align:'center'
    },{
      title:'功率因数',
      dataIndex:'powerFactor',
      key:'powerFactor',
      align:'center'
    },
  ]
  const ACData = [
    {
      id:1,
      name:'A',
      activePower:0,
      apparentPower: 0,
      reactivePower: 0,
      powerFactor: 1,
      voltage: 224.22,
      current: 0
    },
    { 
      id: 2,
      name:'B',
      activePower:0,
      apparentPower: 0,
      reactivePower: 0,
      powerFactor: 1,
      voltage: 224.14,
      current: 0
    },
    {
      id:3,
      name:'A',
      activePower:0,
      apparentPower: 0,
      reactivePower: 0,
      powerFactor: 1,
      voltage: 224.84,
      current: 0
    },
  ]

  const changeArea = val => {
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
              <span>{leftValues?.offOnGrid == 0 ?'离网状态' : leftValues?.offOnGrid == 1 ?'并网状态' : ''}</span>
              <span>{leftValues?.dcStatus == 1? 'DC 充电中...': leftValues?.dcStatus == 2?'DC 放电中...' :''}</span>
            </div>
          </div>
          <div className={style.dataCard}>
            <Card title='直流电流' unit='A' values={leftValues?.dci || '0.00'}></Card>
            <Card title='直流电压' unit='V' values={leftValues?.dcv || '0.00'}></Card>
            <Card title='直流功率' unit='kW' values={leftValues?.dcp || '0.00'}></Card>
          </div>
          <div className={style.line}></div>
          <div className={style.dataCard}>
            <Card title='SOC' unit='%' values={leftValues?.soc || '0.00'}></Card>
            <Card title='SOH' unit='kWh' values={leftValues?.soh || '0.00'}></Card>
            <Card title='总功率因数' unit='/' values={leftValues?.pf || '0.00'}></Card>
          </div>
          <div className={style.line}></div>
          <div className={style.dataCard}>
            <Card title='总有功率功率' unit='kW' values={leftValues?.p || '0.00'}></Card>
            <Card title='总视在功率' unit='kVA' values={leftValues?.ps || '0.00'}></Card>
            <Card title='总无功功率' unit='kVar' values={leftValues?.q || '0.00'}></Card>
          </div>
          <div className={style.status}>
            <StateItem name='逆变器故障' state={leftValues?.invHitch}></StateItem>
            <StateItem name='逆变器不同步' state={leftValues?.invOutSync}></StateItem>
            <StateItem name='过温' state={leftValues?.overTemperature}></StateItem>
            <StateItem name='输出过载' state={leftValues?.overLoad} styles={{borderRight:'none'}}></StateItem>
            <StateItem name='输出电压异常' state={leftValues?.outputVUnusual}></StateItem>
            <StateItem name='直流母线过压' state={leftValues?.dcBusOverV}></StateItem>
            <StateItem name='SDP程序错误' state={leftValues?.sdpProgramError}></StateItem>
            <StateItem name='EOD' state={leftValues?.eod} styles={{borderRight:'none'}}></StateItem>
            <StateItem name='载波同步异常' state={leftValues?.cwSyncException } styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='工频同步异常' state={leftValues?.ffSyncException }styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='SCR故障' state={leftValues?.scrHitch }styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='输出过载超时' state={leftValues?.outputOverLoadTimeout } styles={{borderRight:'none', borderBottom:'none'}}></StateItem>
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
            <Table size='small' bordered dataSource={ACData} columns={AcClomns} rowKey='id' pagination={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
