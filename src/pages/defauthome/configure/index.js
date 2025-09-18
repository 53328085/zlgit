import React, { useEffect, useState, useRef } from 'react'
import style from './style.module.less';
import styled from 'styled-components';
import configIcon from './configIcon.png'
import { Drawer, Input, message, Modal, Empty, Divider } from 'antd';
import _, { result } from 'lodash'
import { useSelector } from 'react-redux'
import { selectProjectId,themeColor,adaptation } from '@redux/systemconfig.js'
import { UISummary } from '@api/api.js'
 
import CompanyMessage from '../../../components/defaultHome/companyMessage'
import TodayWarning from '../../../components/defaultHome/todayWarning'
import OrderDetail from '../../../components/defaultHome/orderDetail'
import WarningMessage from '../../../components/defaultHome/warningMessage'
import ElectricValue from '../../../components/defaultHome/electric'
import WaterValue from '../../../components/defaultHome/water'
import GasValue from '../../../components/defaultHome/gas'
import CarbonValue from '../../../components/defaultHome/carbon'
import EnergyTrend from '../../../components/defaultHome/energyTrend'
// import EnergyCost from '@com/defaultHome/energyCost'  
import EnergyProportion from '@com/defaultHome/energyProportion'
import RealLoad from '../../../components/defaultHome/load'
import WarningSpread from '../../../components/defaultHome/spread'
import ElectricAnalysis from '../../../components/defaultHome/electricAnalysis'
import TotalCharge from '@com/defaultHome/totalCharge'
import TotalDischarge from '@com/defaultHome/totalDischarge'
import ChargeCost from '@com/defaultHome/chargeCost'
import DischargeCost from '@com/defaultHome/disChargeCost'
import TotalIncome from '@com/defaultHome/totalIncome'
import MonthIncome from '@com/defaultHome/monthIncome'
import DayIncome from '@com/defaultHome/dayIncome'
import StorageStatistics from '@com/defaultHome/storageStatistics'
import StorageTrend from '@com/defaultHome/storageTrend'
import SocData from '@com/defaultHome/socData'
import GatewayMessage from '@com/defaultHome/gatewayMessage'
import DeviceMessage from '@com/defaultHome/deviceMessage'
import ChooperMessage from '@com/defaultHome/chooperMessage'
import EnergyRanking from '@com/defaultHome/energyRank'
 
import Sensor from '@com/defaultHome/sensorMessage' //传感器信息
 
import Transformer from '@com/defaultHome/transformerMessage' //变压器信息
 
import Gxcwmg from '@com/defaultHome/gxcwMessage' //光纤测温信息
import Cdcwmg from '@com/defaultHome/cdcwMessage' //光纤测温信息
 
 
import TodayElectricity from "@com/defaultHome/todayElectricity" // TodayElectricity 今日用电量
 
import TransformerTotal from "@com/defaultHome/transformerTotal" // TransformerTotal 变压器总负荷
 
import TransformerNum from "@com/defaultHome/transformerNum" // TransformerNum 变压器数量
 
import Inspection from "@com/defaultHome/inspection" // Inspection 本月巡检
import RoomNum from '@com/defaultHome/roomNum' // 变配电站数量（个）
import RoomCapacity from '@com/defaultHome/roomCapacity' // 总额度容量
import Roomload from '@com/defaultHome/roomload' // 实时负荷
import Loadlate from "@com/defaultHome/loadlate" // 负荷率
import {useTranslation} from "react-i18next"
import Context from "@com/content"
// TodayElectricity 今日用电量  TransformerTotal 变压器总负荷 TransformerNum 变压器数量  Inspection 本月巡检
 
 
import RGL, { WidthProvider } from 'react-grid-layout'
const ReactGridLayout = WidthProvider(RGL);
import { MenuUnfoldOutlined } from '@ant-design/icons';
import './style.css';
import './index.css';
 
import company from './itemImgs/company.png'
import device from './itemImgs/device.png'
import safe from './itemImgs/safe.png'
import weather from './itemImgs/weather.png'
import water from './itemImgs/water.png'
import electric from './itemImgs/electric.png'
import gas from './itemImgs/gas.png'
import coal from './itemImgs/coal.png'
import load from './itemImgs/load.png'
import monitor from './itemImgs/monitor.png'
import carbon from './itemImgs/carbon.png'
import warning from './itemImgs/warning.png'
import warningMessage from './itemImgs/warningMessage.png'
import todayOrder from './itemImgs/todayOrder.png'
import spread from './itemImgs/spread.png'
import distribution from './itemImgs/distribution.png'
import transformer from './itemImgs/transformer.png';
import humiture from './itemImgs/humiture.png'
import energyCost from './itemImgs/energyCost.png'
import energyTrend from './itemImgs/energyTrend.png'
 
import energyRank from './itemImgs/energyRank.png'
import charge from './itemImgs/charge.png'
import discharge from './itemImgs/discharge.png'
import cost from './itemImgs/cost.png'
import dischargeCost from './itemImgs/dischargeCost.png'
import income from './itemImgs/income.png'
import storageStatistics from './itemImgs/storageStatistics.png'
import storageTrend from './itemImgs/storageTrend.svg';
import soc from './itemImgs/soc.svg';
import firstwarn from '../../../assets/image/warning.png'
import finished from '@imgs/finished.png'
import gatewayConfig from '@imgs/gateway_config.png'
import deviceConfig from '@imgs/device_config.png'
import chooperConfig from '@imgs/chooper_config.png'
import energyPercent from '@imgs/energyProportion.png'
import inspection from './itemImgs/inspection.svg' // 本月工单
import loadratev from './itemImgs/loadlate.svg'
import roomnumv from './itemImgs/roomnum.svg'
import capacityv from './itemImgs/capacity.svg'
import roomloadv from './itemImgs/roomload.svg'
import transformerTota from './itemImgs/transformerTotal.svg' // 变压器总负荷
 
import { useRequest } from 'ahooks';
import Cmodal from "@com/useModal"
import {Serach} from "@com/comstyled"
const CDrawer = styled(Drawer)`
  && {
    font-size: 14px;
    .ant-drawer-content-wrapper{
        top: 80px!important;
        width: 284px!important;
        height: calc(100% - 80px);
    //    height: 848px!important;
        // position: relative;
        margin-left: 48px;
        background: transparent;
        overflow: auto;
    }
    .ant-drawer-header{
        display: none;
    }
    .ant-drawer-content{
        background: transparent;
    }
    .ant-drawer-wrapper-body{
        background: transparent;
    }
    .ant-drawer-body{
 
        background-color: rgba(0, 0, 0, 0.6);
        padding: 16px!important;
    }
  }
 
`
export default function Index() {
  const {t} = useTranslation(["button","overview", "comm"])
  const { Search } = Input
  const {laptop} = useSelector(adaptation)
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    })
  }
  const [resetModal, setResetModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false);
  const projectId = useSelector(selectProjectId)
  const {previewrbgcolor} =useSelector(themeColor)
 
  const { InsertUISummary, QueryUISummary } = UISummary
 
  const [activeName, setactiveName] = useState(null);
  const SelectTab = (props) => {
    return <div className={style.selectTab} style={{ backgroundColor: props.tabName == activeName ? '#237ae4' : '#003366' }} onClick={() => changeTab(props.tabName)}>
      <img className={style.configIcon} src={configIcon} ></img>
      {props.tabName.length < 5 ? <div className={style.configName}>{props.tabName}</div> : <div className={style.specialConfigName}>{props.tabName}</div>}
    </div>
  }
  const [dragList, setDragList] = useState([])
  const [dragListCopy, setDragListCopy] = useState([])
  const basicItems = [
    { img: company, itemName: "公司信息", draggable: true },
    { img: device, itemName: '设备信息', draggable: false },
    { img: safe, itemName: '安全运行天数', draggable: false },
    { img: weather, itemName: '天气信息', draggable: false },
  ]
  // 运行监控
  const monitorItems = [
    { img: electric, itemName: '用电量', draggable: true },
    { img: water, itemName: '用水量', draggable: true },
   /*  { img: gas, itemName: '用燃气量', draggable: true },
    { img: coal, itemName: '用煤量', draggable: false },
    { img: load, itemName: '实时负荷率', draggable: true },
    { img: monitor, itemName: '实时监控', draggable: false },
    { img: carbon, itemName: '碳排放量', draggable: true }, */
    { img: gatewayConfig, itemName: '网关信息', draggable: true },
    { img: deviceConfig, itemName: '电表信息', draggable: true },
    { img: chooperConfig, itemName: '断路器信息', draggable: true },
 
    { img: carbon, itemName: '传感器信息', draggable: true },
  /*   { img: gatewayConfig, itemName: '触点测温信息', draggable: true },
    { img: deviceConfig, itemName: '变压器信息', draggable: true },
    { img: chooperConfig, itemName: '光纤测温信息', draggable: true }, */
  ]
  // 运维工单
  const orderItems = [
    { img: warning, itemName: '今日告警', draggable: true },
    { img: warningMessage, itemName: '告警信息', draggable: true },
    { img: todayOrder, itemName: '本月工单', draggable: true },
    { img: spread, itemName: '告警分布', draggable: false },
    { img: inspection, itemName: '本月巡检', draggable: false },
  ]
 
  // 配电房信息
 
  const disItems = [
    { img: distribution, itemName: '配电房监测', draggable: false },  // 变压器数量
  /*   { img: transformer, itemName: '变压器监控', draggable: false },
    { img: humiture, itemName: '温湿度监控', draggable: false },   */
    { img: transformerTota, itemName: '变压器总负荷', draggable: false },// transformerTota
    { img: gatewayConfig, itemName: '触点测温', draggable: true },    
    { img: chooperConfig, itemName: '光纤测温', draggable: true }, 
    { img: roomnumv, itemName: '变配电站数量', draggable: true }, 
    { img: capacityv, itemName: '总额度容量', draggable: true }, 
    { img: roomloadv, itemName: '实时负荷', draggable: true }, 
    { img: loadratev, itemName: '负荷率', draggable: true }, 
  ]
 
  // 能耗统计
 
  const energyItems = [
    { img: energyCost, itemName: '今日用电量', draggable: true }, // 今日用电量
    { img: energyTrend, itemName: '月度能耗', draggable: true },  
    { img: energyPercent, itemName: '分类能耗', draggable: true },
 /*   { img: energyCost, itemName: '能耗费用', draggable: false }, */   
    { img: energyRank, itemName: '能耗排名', draggable: true },
   ,
    
  ]
  const storageItems = [
    { img: charge, itemName: '总充电量', draggable: true },
    { img: discharge, itemName: '总放电量', draggable: true },
    { img: cost, itemName: '总充电金额', draggable: true },
    { img: dischargeCost, itemName: '总放电金额', draggable: true },
    { img: income, itemName: '储能总收益', draggable: true },
    { img: income, itemName: '储能月收益', draggable: true },
    { img: income, itemName: '储能日收益', draggable: true },
    { img: storageStatistics, itemName: '储能收益统计', draggable: true },
    { img: storageTrend, itemName: '充放电量趋势', draggable: true },
    { img: soc, itemName: '站点soc', draggable: true },
  ]
  const changeTab = (value) => {
    if (value == activeName) {
      return;
    }
    setactiveName(value);
    setbasicOpen(true);
    if (value == '基础信息') {
      setDragList(basicItems)
      setDragListCopy(basicItems)
    }
    if (value == '运行监控') {
      setDragList(monitorItems)
      setDragListCopy(monitorItems)
    }
    if (value == '运维工单') {
      setDragList(orderItems)
      setDragListCopy(orderItems)
    }
    if (value == '配电房信息') {
      setDragList(disItems)
      setDragListCopy(disItems)
    }
    if (value == '能耗统计') {
      setDragList(energyItems)
      setDragListCopy(energyItems)
    }
    if (value == '储能管理') {
      setDragList(storageItems)
      setDragListCopy(storageItems)
    }
  }
 
  const [basicOpen, setbasicOpen] = useState(false);
 
  const [layoutItem, setlayoutItem] = useState([])
  const [newCounter, setNewCounter] = useState(0)
  const [classOfName, setclassOfName] = useState('')
  const [layoutValue, setlayoutValue] = useState([])
  const onClose = () => {
    setbasicOpen(false);
    setactiveName('');
  }
 
  const AddItem = (props) => {
    //props.dragTag
    return (
      <div className={style.dragItem} draggable={true} unselectable="on" onDrag={e => setclassOfName(props.itemName)}>
        <img className={style.itemImg} src={props.imgUrl} style={{ width: 52, height: 52 }}></img>
        <span className={style.itemName}>{props.itemName}</span>
      </div>
    )
  }
 
  //RGL布局
  const [defaultProps, setDefaultProps] = useState({
    className: 'layout',
    rowHeight: 200,
    cols: 8,
    margin: [16, 16]
  })
 
  // useEffect(()=>{
  //   JSON.parse(sessionStorage.getItem('layoutItem')) ? setlayoutItem(JSON.parse(sessionStorage.getItem('layoutItem'))) : null
  // },[])
 
  const getLayoutData = () => {
    return QueryUISummary(projectId).then(res => {
      let { success, data } = res
      if (success && data) {
        return {
          list: data
        }
      } else {
        return {
          list: []
        }
      }
    })
  }
 
  const { queryData } = useRequest(getLayoutData, {
    onSuccess: (result, params) => {
      sessionStorage.setItem('layoutItem', JSON.stringify(result.list))
      setlayoutItem(result.list)
    }
  });
 
  const InsertLayoutData = () => {
    return InsertUISummary(projectId, layoutItem).then(res => {
      let { success } = res
      if (success) {
        return {
          list: true
        }
      } else {
        return {
          list: false
        }
      }
    })
  }
 
  const { run } = useRequest(InsertLayoutData, {
    manual: true,
    onSuccess: (result, params) => {
      showConfirmModal()
    }
  })
 
  const createElement = el => {
    const removeStyle = {
      position: "absolute",
      right: "5px",
      top: 0,
      zIndex: 1000,
      cursor: "pointer",
      outline: "10px solid transparent"
    }
    const i = el.i;
    const end = i.indexOf('_');
    
    return (
      <div key={i} data-grid={el}>
        <span className="remove" style={removeStyle} onClick={() => onRemoveItem(i)}> X </span>
        {i.substring(0, end)=='公司信息'? <CompanyMessage></CompanyMessage> : null}
        {i.substring(0, end)=='今日告警'? <TodayWarning></TodayWarning> : null}
        {i.substring(0, end) =='本月工单' ? <OrderDetail></OrderDetail> : null}
        {i.substring(0, end)=='告警信息' ? <WarningMessage></WarningMessage> : null}
        {i.substring(0, end) =='用电量' ? <ElectricValue></ElectricValue> : null}
        {i.substring(0, end)=='用水量' ? <WaterValue></WaterValue> : null}
        {i.substring(0, end)=='用燃气量' ? <GasValue></GasValue> : null}
        {i.substring(0, end)=='碳排放量' ? <CarbonValue></CarbonValue> : null}
        {i.substring(0, end)=='网关信息' ? <GatewayMessage></GatewayMessage> : null}
        {i.indexOf('电表信息') != -1 ? <DeviceMessage></DeviceMessage> : null}
        {i.indexOf('断路器信息') != -1 ? <ChooperMessage></ChooperMessage> : null}
 
        {i.indexOf('传感器信息') != -1 ? <Sensor></Sensor> : null} 
        {i.indexOf('变压器信息') != -1 ? <Transformer></Transformer> : null} 
        {i.indexOf('触点测温') != -1 ? <Cdcwmg></Cdcwmg> : null} 
        {i.indexOf('光纤测温') != -1 ? <Gxcwmg></Gxcwmg> : null} 
 
        {i.substring(0, end)=='今日用电量' ? <TodayElectricity></TodayElectricity> : null} 
 
        {i.indexOf('变压器总负荷') != -1 ? <TransformerTotal></TransformerTotal> : null} 
 
        {i.indexOf('配电房监测') != -1 ? <TransformerNum></TransformerNum> : null} 
 
        {i.substring(0, end)=='本月巡检' ? <Inspection></Inspection> : null} 
 
        {i.indexOf('月度能耗') != -1 ? <EnergyTrend></EnergyTrend> : null}     
        {i.indexOf('实时负荷率') != -1 ? <RealLoad></RealLoad> : null}
        {i.indexOf('告警分布') != -1 ? <WarningSpread></WarningSpread> : null}
        {i.indexOf('分时电量分析') != -1 ? <ElectricAnalysis></ElectricAnalysis> : null}
        {i.indexOf('总充电量') != -1 ? <TotalCharge></TotalCharge> : null}
        {i.indexOf('总放电量') != -1 ? <TotalDischarge></TotalDischarge> : null}
        {i.indexOf('总充电金额') != -1 ? <ChargeCost></ChargeCost> : null}
        {i.indexOf('总放电金额') != -1 ? <DischargeCost></DischargeCost> : null}
        {i.indexOf('储能总收益') != -1 ? <TotalIncome></TotalIncome> : null}
        {i.indexOf('储能月收益') != -1 ? <MonthIncome></MonthIncome> : null}
        {i.indexOf('储能日收益') != -1 ? <DayIncome></DayIncome> : null}
        {i.indexOf('储能收益统计') != -1 ? <StorageStatistics></StorageStatistics> : null}
        {i.indexOf('充放电量趋势') != -1 ? <StorageTrend></StorageTrend> : null}
        {i.indexOf('站点soc') != -1 ? <SocData></SocData> : null}
        {i.indexOf('能耗排名') != -1 ? <EnergyRanking></EnergyRanking> : null}
        {i.indexOf('分类能耗') != -1 ? <EnergyProportion></EnergyProportion> : null}
        {i.indexOf('变配电站数量') != -1 ? <RoomNum></RoomNum> : null}
        {i.indexOf('总额度容量')!= -1 ? <RoomCapacity type={'runtTime'}  /> : null}
        {i.substring(0, end)==('实时负荷')? <Roomload type={'runtTime'}  /> : null}
        {i.substring(0, end)==('负荷率') ? <Loadlate type={'runtTime'}   /> : null} 
      </div>
    )
  }
  const onRemoveItem = (i) => {
    setlayoutItem(_.reject(layoutItem, { i: i }));
  }
 
 // TodayElectricity 今日用电量  TransformerTotal 变压器总负荷 TransformerNum 配电房监测  Inspection 本月巡检
 let layouts =[
  '告警分布','本月巡检','配电房监测','变压器总负荷',
  '今日用电量','月度能耗','公司信息','今日告警','本月工单', '告警信息','能耗排名','分类能耗',
  '用电量','用水量','用燃气量','碳排放量','网关信息',
  '电表信息','变配电站数量','总额度容量','实时负荷','负荷率','断路器信息','传感器信息','变压器信息','触点测温','光纤测温'
]
  const onAddlayout = (xValue, yValue) => {
    let newlayout;
    let time = new Date()
    if (classOfName == '实时负荷率' || classOfName == '分时电量分析' ||
      classOfName == '充放电量趋势' || classOfName == '站点soc') {
      newlayout = layoutItem.concat({
        i: classOfName + '_' + Date.now(),
        x: xValue,
        y: yValue,
        w: 2,
        h: 2,
        'description': classOfName
      })
      setlayoutItem(newlayout)
      setNewCounter(newCounter + 1);
    } else if(layouts.includes(classOfName)) /* (classOfName == '告警分布' || classOfName == '本月巡检' || classOfName == '配电房监测' || classOfName == '变压器总负荷' 
      || classOfName == '今日用电量' || classOfName == '月度能耗' || classOfName == '公司信息' || classOfName == '今日告警' || classOfName == '本月工单' || classOfName == '告警信息' || classOfName == '能耗排名' || classOfName == '分类能耗' ||
      classOfName == '用电量' || classOfName == '用水量' || classOfName == '用燃气量' || classOfName == '碳排放量' || 
      classOfName == '网关信息' || classOfName == '电表信息' ||  classOfName == '变配电站数量' || classOfName == '断路器信息' || classOfName == '传感器信息' || classOfName == '变压器信息' || classOfName == '触点测温' || classOfName == '光纤测温') */ {
      newlayout = layoutItem.concat({
        i: classOfName + '_' + Date.now(),
        x: xValue,
        y: yValue,
        w: 2,
        h: 1,
        'description': classOfName
      })
      setlayoutItem(newlayout)
      setNewCounter(newCounter + 1);
    } else if (classOfName == '总充电量' || classOfName == '总放电量' || classOfName == '总充电金额' || classOfName == '总放电金额' ||
      classOfName == '储能总收益' || classOfName == '储能日收益' || classOfName == '储能月收益') {
      newlayout = layoutItem.concat({
        i: classOfName + '_' + Date.now(),
        x: xValue,
        y: yValue,
        w: 1,
        h: 1,
        'description': classOfName
      })
      setlayoutItem(newlayout)
      setNewCounter(newCounter + 1);
    } else if (classOfName == '储能收益统计') {
      newlayout = layoutItem.concat({
        i: classOfName + '_' + Date.now(),
        x: xValue,
        y: yValue,
        w: 4,
        h: 2,
        'description': classOfName
      })
      setlayoutItem(newlayout)
      setNewCounter(newCounter + 1);
    } else {
      message.warning('当前模块尚未配置，请等待后续版本更新!')
      return;
    }
 
 
  }
 
  const onDrop = (layouts, layoutValue, _event) => {
    onAddlayout(layoutValue.x, layoutValue.y)
  }
 
  const onLayoutChange = (layout) => {
    if (layout.length == 0) return;
    if (layout[layout.length - 1].i == '__dropping-elem__') return;
    setlayoutItem(layout)
  }
 
  const showResetModal = () => {
    setResetModal(true);
  }
 
  const showConfirmModal = () => {
    // sessionStorage.setItem('layoutItem', JSON.stringify(layoutItem))
    setConfirmModal(true);
  }
 
  const resetOk = () => {
    setlayoutItem(JSON.parse(sessionStorage.getItem('layoutItem')))
    setResetModal(false)
  }
 
  const confirmOk = () => {
    setConfirmModal(false)
  }
 
  const handleCancel = () => {
    setResetModal(false)
    setConfirmModal(false)
  }
  const onSearch = val => {
    if (val == '') {
      setDragList(dragListCopy)
    } else {
      let arr = []
      dragListCopy.map(item => {
        if (item.itemName.indexOf(val) != -1) {
          arr.push(item)
        }
      })
      setDragList(arr)
    }
  }
 
  return (
    <div className={style.mainContent} style={{ backgroundColor: '#eee' }}>
      <Context.Provider value={{laptop}}>
      {contextHolder}
      <ReactGridLayout layout={layoutItem} onLayoutChange={onLayoutChange} {...defaultProps}   onDrop={onDrop} style={{backgroundColor: previewrbgcolor || '#135abd'}} >
        {_.map(layoutItem, el => createElement(el))}
      </ReactGridLayout>
      <div className={style.selectMenu}>
        <SelectTab tabName={'基础信息'}></SelectTab>
        <SelectTab tabName={'运行监控'}></SelectTab>
        <SelectTab tabName={'运维工单'}></SelectTab>
        <SelectTab tabName={'配电房信息'}></SelectTab>
        <SelectTab tabName={'能耗统计'}></SelectTab>
        <SelectTab tabName={'储能管理'}></SelectTab>
      </div>
      <div className={style.reset} onClick={() => showResetModal()}>{t("button:reset")}</div>
      <div className={style.confirm} onClick={run}>{t("button:save")}</div>
 
      <Cmodal title={t("comm:Resetprompt")} mold="cust" type="warn" open={resetModal} onOk={resetOk} onCancel={handleCancel} width={512}  closable={false}  okText={t("button:reset")} >        
           {t("overview:resetlayout")}
      </Cmodal>
 
      <Cmodal title={t("overview:Saveinterface")} mold="cust" open={confirmModal} onOk={confirmOk} onCancel={handleCancel} width={512}  closable={false}  okText={t("comm:Close")}   cancelButtonProps={{ style: { display: 'none' } }}>
        
        <div className={style.confirmBody}>
          <img className={style.warnIcon} src={finished}></img>
          <span >{t("overview:layoutsuccessfully")}</span>
        </div>
      </Cmodal>
 
      <CDrawer placement='left' onClose={onClose} open={basicOpen} mask={false} destroyOnClose={true} >
        <div className={style.searchInput}>
          <Serach
            placeholder={t("overview:Modulename")}
            style={{ width: 240, backgroundColor: '#000', color: '#fff' }}
            onSearch={onSearch}
          />
        </div>
        <div className={style.addModule}>
          {dragList.map((item, index) => {
            return <AddItem imgUrl={item.img} itemName={item.itemName} dragTag={item.draggable} key={index}></AddItem>
          })}
          {dragList.length == 0 ? <Empty style={{ marginTop: 200, marginLeft: 32, color: "#fff" }}></Empty> : null}
        </div>
        <div className={style.closeDrawer}>
          <MenuUnfoldOutlined onClick={onClose} />
        </div>
      </CDrawer>
      </Context.Provider>
    </div>
  )
}