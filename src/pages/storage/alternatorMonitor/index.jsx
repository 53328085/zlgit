import React, {useEffect, useState} from 'react'
import style from './style.module.less'
import { Select, Form, Table, message } from 'antd'
import {useSelector} from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import PowerChart from './powerChart'
import SocChart from './SocChart'
import {PCSMonitorRuntime } from '@api/api.js'
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
  const [form] = Form.useForm()
  const {Item}  = Form
  //PCS list
  const [pcsList, setPcsList] = useState([])
  const getPCSList = () => {
    return queryPCSList (projectId, form.getFieldValue('areaId')).then(res => {
      if(res.success){
        if(res.data){
          setPcsList(res.data)
          form.setFieldValue('PCSId', res.data[0].id)
          getContent()
        }else{
          setPcsList([])
          message.warning('当前'+ areaList[0]?.levelName + '不存在PCS!')
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
    state = state == 0 ? 'offline' : state == 1 ? 'normal' : 'error'
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
  const pileClomns = [
    {
      title:'电堆',
      dataIndex:'name',
      key:'name',
      align:'center'
    },{
      title:'工作状态',
      dataIndex:'state',
      key:'state',
      align:'center'
    },{
      title:'SOC (kVA)',
      dataIndex:'soc',
      key:'soc',
      align:'center'
    },{
      title:'总电压(V)',
      dataIndex:'totalVoltage',
      key:'totalVlotage',
      align:'center'
    },{
      title:'总电流 (A)',
      dataIndex:'totalCurrent',
      key:'totalCurrent',
      align:'center'
    },{
      title:'最高电压 (V)',
      dataIndex:'maxVoltage',
      key:'maxVoltage',
      align:'center'
    },{
      title:'最低电压 (V)',
      dataIndex:'minVoltage',
      key:'minVoltage',
      align:'center'
    },
  ]
  const pileData = [
    {
      id:1,
      name:'1#',
      state:'充电',
      soc: 0,
      totalVoltage: 0,
      totalCurrent: 1,
      maxVoltage: 224.22,
      minVoltage: 214.78
    },
    {
      id:2,
      name:'2#',
      state:'充电',
      soc: 0,
      totalVoltage: 0,
      totalCurrent: 1,
      maxVoltage: 224.22,
      minVoltage: 214.78
    },
    {
      id:3,
      name:'3#',
      state:'充电',
      soc: 0,
      totalVoltage: 0,
      totalCurrent: 1,
      maxVoltage: 224.22,
      minVoltage: 214.78
    },
  ]

  const changeArea = val => {
    queryPCS()
  }
  const changePCS = val => {
    getContent()
  }
  useEffect(()=>{
    if(areaList.length == 0|| !areaList){
      message.error('当前项目尚未创建园区!')
    }else{
      form.setFieldValue('areaId', areaList[0].id)
      queryPCS()
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
            <span className={style.pcsName}>2125522_PCS1</span>
          </div>
          <div className={style.pcsImgs}>
            <span className={style.imgTitle}>储能交流器</span>
            <img className={style.pcsImg} src={pcs}></img>
          </div>
          <div className={style.dataCard}>
            <Card title='总有功功率' unit='kWh' values={leftValues?.p || '0.00'}></Card>
            <Card title='视在功率' unit='kVA' values={leftValues?.ps || '0.00'}></Card>
            <Card title='总无功功率' unit='kVar' values={leftValues?.q || '0.00'}></Card>
          </div>
          <div className={style.line}></div>
          <div className={style.dataCard}>
            <Card title='BMS SOC' unit='%' values={leftValues?.soc || '0.00'}></Card>
            <Card title='BMS 可充电量' unit='kWh' values={leftValues?.chargeCapacity || '0.00'}></Card>
            <Card title='BMS 可放电量' unit='kWh' values={leftValues?.disChargeCapacity || '0.00'}></Card>
          </div>
          <div className={style.line}></div>
          <div className={style.dataCard}>
            <Card title='DCAC 温度' unit='℃' values={leftValues?.dcacTemp || '0.00'}></Card>
            <Card title='DCDC 温度' unit='℃' values={leftValues?.dcdcTemp || '0.00'}></Card>
            <Card title='电芯最高/最低温度' unit='℃' values={(leftValues?.electricCoreMaxTemp || '0.00') + ' / ' +(leftValues?.electricCoreMinTemp || '0.00')}></Card>
          </div>
          <div className={style.status}>
            <StateItem name='交流调度' state={leftValues.acDispatching}></StateItem>
            <StateItem name='直流调度' state={leftValues.dcDispatching}></StateItem>
            <StateItem name='并网' state={leftValues.gridConnection}></StateItem>
            <StateItem name='离网' state={leftValues.offGrid} styles={{borderRight:'none'}}></StateItem>
            <StateItem name='PCS通讯' state={leftValues.pcsCommunication}></StateItem>
            <StateItem name='BMS通讯' state={leftValues.bmsCommunication}></StateItem>
            <StateItem name='远程控制' state={leftValues.remoteControl}></StateItem>
            <StateItem name='PCS系统故障' state={leftValues.pcsHitch} styles={{borderRight:'none'}}></StateItem>
            <StateItem name='PCS系统告警' state={leftValues.pcsAlarm} styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='BMS一级告警' state={leftValues.bmsAlarmLevel1}styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='BMS二级告警' state={leftValues.bmsAlarmLevel2}styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='BMS三级告警' state={leftValues.bmsAlarmLevel3} styles={{borderRight:'none', borderBottom:'none'}}></StateItem>
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
          <div className={style.tableList}>
            <Table size='small' bordered dataSource={pileData} columns={pileClomns} rowKey='id' pagination={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
