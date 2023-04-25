import React, { Fragment, useState, useEffect } from 'react'
import style from './style.module.less'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
import { SiteSummaryRuntime, StorageAlarmRuntime, SiteManagerDesigner } from '@api/api.js'
import { message, Form, Select } from 'antd'
import { range } from 'lodash'
import BarChart from './barChart'
import LineChart from './lineChart'
import imgurl from './imgs'
import warningPoint from '@imgs/warningPoint.png'

export default function Index() {
  const [form] = Form.useForm()
  const Item = Form.Item
  const { querySiteInfo,
    queryStorageIncome,
    queryStorageWarning,
    queryTopologyDiagramInfo,
    queryChargeETrends } = SiteSummaryRuntime
  const { FindSiteList } = SiteManagerDesigner

  const dispatch = useDispatch()
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)

  //siteList
  const [siteList, setSiteList] = useState([])
  const querySite = () => {
    FindSiteList(projectId, form.getFieldValue('areaId')).then(res => {
      if (res.success) {
        if (res.data && res.data.length > 0) {
          setSiteList(res.data)
          form.setFieldValue('siteId', res.data[0].id)
          getFromHeader()
        } else {
          setSiteList([])
          message.warning('当前' + areaList[0]?.levelName + '不存在站点!')
          return;
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
    getFromHeader()
  }

  const navigate = useNavigate()
  const [cardData, setCardData] = useState({})//卡片数据
  const [barData, setBarData] = useState({}) //收益统计
  const [lineData, setLineData] = useState({})//充放电趋势
  const [warningData, setWarningData] = useState([])//最新告警
  const [topologyData, setTopologyData] = useState({
    loadDevice: {},
    onGridDevice: {},
    storageDevice:{}
  }) //接线图数据
  useEffect(() => {
    if (areaList.length == 0 || !areaList) {
      message.error('当前项目尚未创建园区!')
    } else {
      form.setFieldValue('areaId', oneLevelDefaultId)
      querySite()
    }
  }, [])
  const changeArea = (val) => {
    areaList.map(item => {
      if(item.id == val){
        dispatch(setCurrentlevel(item))
      }
    })
    form.setFieldValue('siteId', null)
    querySite()
  }
  const getFromHeader = () => {
    querySiteInfo(projectId, form.getFieldValue('areaId'), form.getFieldValue('siteId')).then(res => {
      if (res.success) {
        setCardData(res.data)
      } else {
        message.error(res.errMsg)
      }
    })

    queryStorageIncome(projectId, form.getFieldValue('areaId'), form.getFieldValue('siteId')).then(res => {
      let { success, data } = res
      if (success) {
        if (data) {
          setBarData(data)
        } else {
          setBarData({})
        }
      } else {
        message.error(res.errMsg)
      }
    })

    queryStorageWarning(projectId, form.getFieldValue('areaId'), form.getFieldValue('siteId')).then(res => {
      let { success, data } = res
      if (success) {
        if (data) {
          setWarningData(data)
        } else {
          setWarningData([])
        }
      } else {
        message.error(res.errMsg)
      }
    })

    queryTopologyDiagramInfo(projectId, form.getFieldValue('areaId'), form.getFieldValue('siteId')).then(res => {
      if (res.success) {
        if (res.data) {
          setTopologyData(res.data)
        } else {
          setTopologyData({
            loadDevice: {},
    onGridDevice: {},
    storageDevice:{}
          })
        }
      } else {
        message.error(res.errMsg)
      }
    })


    queryChargeETrends(projectId, form.getFieldValue('areaId'), form.getFieldValue('siteId')).then(res => {
      if (res.success) {
        if (res.data) {
          setLineData(res.data)
        } else {
          setLineData({})
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const CardItem = props => {
    return <div className={style.leftCard} style={{ height: props.height, position:'relative' }} >
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const Tips = props => {
    return <div className={style.tips} style={{ backgroundColor: props.bgcolor, width: props.width || 240 }}>
      <img src={props.imgUrl} className={style.tipImg}></img>
      <div className={style.tipsData} style={{ marginLeft: props.width ? 42 : 22 }}>
        <div className={style.tipTitle}>{props.title}</div>
        <div className={style.tipValue}>{props.value}</div>
      </div>
    </div>
  }
  const RightItem = props => {
    return <div className={style.rightCard} style={{ height: props.height }}>
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const CustomProgress = props => {
    let { dischargeData, chargeData } = props
    let total = parseFloat(dischargeData) + parseFloat(chargeData)
    let dischargeCount = parseFloat(dischargeData) == 0 ? 0 : parseInt(((parseFloat(dischargeData) * 100) / total) / (100 / 65)) + 1
    let chargeCount = parseFloat(chargeData) == 0 ? 0 : parseInt(((parseFloat(chargeData) * 100) / total) / (100 / 65)) + 1
    let chargelist = range(chargeCount)
    let dischargeList = range(dischargeCount)
    const progressStyle = {
      width: 328,
      height: 36,
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      overFlow: 'hidden',
      paddingLeft: 1,
      border: '1px solid #d7d7d7'
    }
    return <div style={progressStyle}>
      {dischargeList.map(item => {
        return <div style={{ width: 4, height: 32, backgroundColor: "#4370ff", marginRight: 1 }} key={item}></div>
      })}
      {chargelist.map(item => {
        return <div style={{ width: 4, height: 32, backgroundColor: "#f93", marginRight: 1 }} key={item}></div>
      })}
    </div>
  }
  const StateCard = props => {
    const customStyle = props.styles ? props.styles : null
    return <div className={style.stateCard} style={{ width: props.width }}>
      <div className={style.stateTitle} style={customStyle}>{props.title}</div>
      <div className={style.stateValue}>{props.value}</div>
    </div>
  }
  const WarningCard = props => {
    return <div className={style.warningItem}>
      <div className={style.leftImg}>
        <img src={warningPoint} className={style.warningPoint}></img>
      </div>
      <div className={style.warningData}>
        <div className={style.warningtop}>
          <span className={style.time}>{props.data.warningTime}</span>
          <span className={style.description}>{props.data.content}</span>
          <span className={style.level} style={{ fontSize: 12, color: '#6b6b6b' }}>{props.data.level}</span>
        </div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.name}</span>
        </div>
      </div>
    </div>
  }
  const toPage = (key, label) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    })
  }

  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline'>
          <Item name='areaId' label={areaName + '选择'} style={{ marginLeft: 16 }}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{ marginLeft: 16, width: '200px' }}
              onChange={changeArea}
            >
              {areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='siteId' label='站点选择' style={{ marginLeft: 16 }}>
            <Select
              placeholder="请选择站点"
              size="middle"
              style={{ marginLeft: 16, width: '200px' }}
              onChange={changeSite}
            >
              {siteList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
        </Form>
      </div>
      <div className={style.content}>
        <div className={style.left}>
          <CardItem title='站点信息' height='236px'>
            <div className={style.information}>
              {
                cardData.image ? <img src={cardData.image} className={style.siteImg}></img> : <img src={imgurl.zhandian} className={style.siteImg}></img>
              }
              <div className={style.siteData}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className={style.siteTitle}>站点容量</span>
                  <span className={style.siteValue}>{cardData?.storageCapacity} &nbsp;kVA</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className={style.siteTitle}>实时充电功率</span>
                  <span className={style.siteValue}> {cardData?.runtimeChargeP}&nbsp;kW</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className={style.siteTitle}>投运时间</span>
                  <span className={style.siteValue}>{cardData?.useDate}</span>
                </div>
              </div>
            </div>
          </CardItem>
          {/* <CardItem title='充放电统计' height='136px'>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'储能总充电量'} value={'500.00 kWh'} styles={{ backgroundColor: '#237ae4', color: '#fff' }}></StateCard>
              <StateCard width={'156px'} title={'储能总放电量'} value={'500.00 kWh'} styles={{ backgroundColor: '#237ae4', color: '#fff' }}></StateCard>
            </div>
          </CardItem> */}
          <CardItem title='最新告警' height='548px'>
            <span className={style.toWarning} onClick={() => toPage('alarmMessage', '告警信息')}>查看详情</span>
            <div className={style.warningDetails}>
              {warningData.map((item, index) => {
                return <Fragment key={index}>
                  <WarningCard data={item} ></WarningCard>
                  {warningData.length > (index + 1) ? <div className={style.division} style={{ margin: '10px 0' }}></div> : null}
                </Fragment>
              })}
            </div>
          </CardItem>
        </div>
        <div className={style.right}>
          <div className={style.top}>
            <Tips imgUrl={imgurl.totalCharge} title={'总充电量 (kWh)'} value={cardData?.chargingCapacity} bgcolor={'#56b653'}></Tips>
            <Tips imgUrl={imgurl.totalDischarge} title={'总放电电量 (kWh)'} value={cardData?.disChargingCapacity} bgcolor={'#4370ff'}></Tips>
            <Tips imgUrl={imgurl.totalChargeCost} title={'总充电金额 (元)'} value={cardData?.chargingAmount} bgcolor={'#fea526'}></Tips>
            <Tips imgUrl={imgurl.totalDischargeCost} title={'总放电金额 (元)'} value={cardData?.disChargingAmount} bgcolor={'#ff6642'}></Tips>
            <Tips imgUrl={imgurl.totalIncome} title={'储能总收益 (元)'} value={cardData?.storageIncome} bgcolor={'#9951fe'} width={'280px'}></Tips>
          </div>
          <div className={style.bottom}>
            <div className={style.topology}>
              <img src={imgurl.zhanwei} className={style.zhanwei}></img>
              {/* 储能总表 */}
              <div className={style.storageMeter}>
                <div className={style.meterData}>
                  <span className={style.dataName}>电压:</span>
                  <span className={style.dataValue}>{topologyData?.storageDevice.v}</span>
                  <span className={style.dataUnit}>(V)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>电流:</span>
                  <span className={style.dataValue}>{topologyData?.storageDevice.i}</span>
                  <span className={style.dataUnit}>(A)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>功率:</span>
                  <span className={style.dataValue}>{topologyData?.storageDevice.p}</span>
                  <span className={style.dataUnit}>(kW)</span>
                </div>
              </div>
              {/*并网总表器*/}
              <div className={style.transformer}>
                <div className={style.meterData}>
                  <span className={style.dataName}>电压:</span>
                  <span className={style.dataValue}>{topologyData?.onGridDevice.v}</span>
                  <span className={style.dataUnit}>(V)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>电流:</span>
                  <span className={style.dataValue}>{topologyData?.onGridDevice.i}</span>
                  <span className={style.dataUnit}>(A)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>功率:</span>
                  <span className={style.dataValue}>{topologyData?.onGridDevice.p}</span>
                  <span className={style.dataUnit}>(kW)</span>
                </div>
              </div>
              {/*负载总表*/}
              <div className={style.batterys}>
                <div className={style.meterData}>
                  <span className={style.dataName}>电压:</span>
                  <span className={style.dataValue}>{topologyData?.loadDevice.v}</span>
                  <span className={style.dataUnit}>(V)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>电流:</span>
                  <span className={style.dataValue}>{topologyData?.loadDevice.i}</span>
                  <span className={style.dataUnit}>(A)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>功率:</span>
                  <span className={style.dataValue}>{topologyData?.loadDevice.p}</span>
                  <span className={style.dataUnit}>(kW)</span>
                </div>
              </div>
              <div className={style.transPlaceholder} onClick={() => toPage('PCSMonitor', 'PCS监控')}></div>
              <div className={style.batteryPlaceholder} onClick={() => toPage('BMSMonitor', 'BMS监控')}></div>
            </div>
            <div className={style.otherDatas}>
              <RightItem title='能耗收益统计' height={'340px'}>
                <BarChart data={barData}></BarChart>
              </RightItem>
              <RightItem title='储能充放电趋势' height={'340px'}>
                <LineChart data={lineData}></LineChart>
              </RightItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
