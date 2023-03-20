import React, {useEffect, useState} from 'react'
import style from './style.module.less'
import { Select, Form, Table } from 'antd'
import {useSelector} from 'react-redux'
import {selectOneLevel} from '@redux/systemconfig.js'
import PowerChart from './powerChart'
import SocChart from './SocChart'

import pcs from './imgs/pcs.png'
import online from './imgs/online.png'
import offline from './imgs/offline.png'
import error from './imgs/error.png'

export default function Index() {
  const areaList = useSelector(selectOneLevel)
  const [form] = Form.useForm()
  const {Item}  = Form
  //PCS list
  const pcsList = [
    {
      id:1,
      name:'PCS#1',
    },{
      id:2,
      name:'PCS#2',
    },{
      id: 3,
      name:'PCS#3',
    },
  ]
  const Card = props => {
    return <div className={style.card}>
      <div className={style.cardtitle}>{props.title}</div>
      <div className={style.unit}>({props.unit})</div>
      <div className={style.values}>{props.values}</div>
    </div>
  }
  const StateItem = props => {
    return <div className={style.stateItem} style={props.styles}>
      <span>{props.name}</span>
      <img src={props.state == 'offline' ? offline : props.state == 'normal' ? online : error} className={style.stateImg}></img>
    </div>
  }
  const powerData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[7321.25, 7158.32, 7214.39, 7019.54, 7236.45, 7200.15, 7148.96, 7285.36, 7148.32, 7014.36, 7048.96, 7245.36, 7189.32 ]
  }
  const socData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[25.3, 26.4, 28.39, 29.54, 32.45, 34.15, 36.96, 40.36, 48.32, 50.36, 45.96, 42.36, 41.5 ]
  }

  const leftValues = {
    exchange: 'offline',
    directCurrent:'offline',
    onGrid:'normal',
    offGrid: 'offline',
    PCSCom:'normal',
    BMSCom:'offline',
    Control:'offline',
    PCSError:'normal',
    PCSWarning:'normal',
    BMSLevelOne:'warning',
    BMSLevelTwo:'normal',
    BMSLevelThree: 'normal'
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

  useEffect(()=>{
    form.setFieldValue('areaId', areaList[0].id)
    form.setFieldValue('PCSId', pcsList[0].id)
  },[])
  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline'>
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
          <Item name='PCSId' label='PCS选择' style={{marginLeft:16}}>
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
            <Card title='总有功功率' unit='kWh' values='50.21'></Card>
            <Card title='视在功率' unit='kVA' values='48.25'></Card>
            <Card title='总无功功率' unit='kVar' values='0.00'></Card>
          </div>
          <div className={style.line}></div>
          <div className={style.dataCard}>
            <Card title='BMS SOC' unit='%' values='21.21'></Card>
            <Card title='BMS 可充电量' unit='kWh' values='148.00'></Card>
            <Card title='BMS 可放电量' unit='kWh' values='52.00'></Card>
          </div>
          <div className={style.line}></div>
          <div className={style.dataCard}>
            <Card title='DCAC 温度' unit='℃' values='31.2'></Card>
            <Card title='DCDC 温度' unit='℃' values='19.2'></Card>
            <Card title='电芯最高/最低温度' unit='℃' values='29.2 / 19.2'></Card>
          </div>
          <div className={style.status}>
            <StateItem name='交流调度' state={leftValues.exchange}></StateItem>
            <StateItem name='直流调度' state={leftValues.directCurrent}></StateItem>
            <StateItem name='并网' state={leftValues.onGrid}></StateItem>
            <StateItem name='离网' state={leftValues.offGrid} styles={{borderRight:'none'}}></StateItem>
            <StateItem name='PCS通讯' state={leftValues.PCSCom}></StateItem>
            <StateItem name='BMS通讯' state={leftValues.BMSCom}></StateItem>
            <StateItem name='远程控制' state={leftValues.Control}></StateItem>
            <StateItem name='PCS系统故障' state={leftValues.PCSError} styles={{borderRight:'none'}}></StateItem>
            <StateItem name='PCS系统告警' state={leftValues.PCSWarning} styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='BMS一级告警' state={leftValues.BMSLevelOne}styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='BMS二级告警' state={leftValues.BMSLevelTwo}styles={{borderBottom:'none'}}></StateItem>
            <StateItem name='BMS三级告警' state={leftValues.BMSLevelThree} styles={{borderRight:'none', borderBottom:'none'}}></StateItem>
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
