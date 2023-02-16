import React, {useEffect, useState, useRef} from 'react'
import style from './style.module.less';
import configIcon from './configIcon.png'
import { Drawer, Input, message, Modal } from 'antd';
import _, { result } from 'lodash'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
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
import RealLoad from '../../../components/defaultHome/load'
import WarningSpread from '../../../components/defaultHome/spread'
import ElectricAnalysis from '../../../components/defaultHome/electricAnalysis'

import RGL, { WidthProvider } from 'react-grid-layout'
const ReactGridLayout = WidthProvider(RGL);
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
import costTrend from './itemImgs/costTrend.png'
import energyRank from './itemImgs/energyRank.png'
import firstwarn from '../../../assets/image/warning.png'
import finished from '@imgs/finished.png'
import { useRequest } from 'ahooks';
export default function Index() {
  const [resetModal, setResetModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false);
  const projectId = useSelector(selectProjectId)
  const { InsertUISummary, QueryUISummary } = UISummary

  const [activeName, setactiveName] = useState(null);
  const SelectTab = (props) =>{
    return <div className={style.selectTab} style={{backgroundColor: props.tabName == activeName? '#237ae4' :'#003366'  }}  onClick={() => changeTab(props.tabName)}>
      <img className={style.configIcon} src={configIcon}></img>
      {props.tabName.length< 5 ? <div className={style.configName}>{props.tabName}</div> : <div className={style.specialConfigName}>{props.tabName}</div> }
    </div>
  }
  const changeTab = (value) =>{
    // if(value == activeName) {
    //   return;
    // }
    setactiveName(value);
    if(value == '基础信息'){
      setbasicOpen(!basicOpen);
      setmonitorOpen(false)
      setOrderOpen(false)
      setDisOpen(false)
      setEnergyOpen(false)
    }
    if(value == '运行监控'){
      setbasicOpen(false);
      setmonitorOpen(!monitorOpen);
      setOrderOpen(false)
      setDisOpen(false)
      setEnergyOpen(false)
    }
    if(value == '运维工单'){
      setbasicOpen(false);
      setmonitorOpen(false);
      setOrderOpen(!orderOpen)
      setDisOpen(false)
      setEnergyOpen(false)
    }
    if(value == '配电房信息'){
      setbasicOpen(false);
      setmonitorOpen(false);
      setOrderOpen(false)
      setDisOpen(!disOpen)
      setEnergyOpen(false)
    }
    if(value == '能耗统计'){
      setbasicOpen(false);
      setmonitorOpen(false);
      setOrderOpen(false)
      setDisOpen(false)
      setEnergyOpen(!energyOpen)
    }
  }

  const [basicOpen, setbasicOpen] = useState(false);
  const [monitorOpen, setmonitorOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [disOpen, setDisOpen] = useState(false);
  const [energyOpen, setEnergyOpen] = useState(false);

  const [layoutItem, setlayoutItem] = useState([])
  const [newCounter, setNewCounter] = useState(0)
  const [classOfName, setclassOfName] = useState('')
  const [layoutValue, setlayoutValue] = useState([])
  const onClose = () => {
    setbasicOpen(false);
    setmonitorOpen(false);
    setOrderOpen(false);
    setDisOpen(false)
    setEnergyOpen(false)
  }

  const AddItem = (props) => {
    return <div className={style.dragItem} draggable={true} unselectable="on" onDragStart={e => setclassOfName(props.itemName)}>
      <img className={style.itemImg} src={props.imgUrl}></img>
      <span className={style.itemName}>{props.itemName}</span>
    </div>
  }

  //RGL布局
  const [defaultProps, setDefaultProps]  = useState({
    className:'layout',
    rowHeight: 200,
    cols: 8,
    margin: [16, 16]
  })

  // useEffect(()=>{
  //   JSON.parse(sessionStorage.getItem('layoutItem')) ? setlayoutItem(JSON.parse(sessionStorage.getItem('layoutItem'))) : null
  // },[])

  const getLayoutData = () => {
    return QueryUISummary(projectId).then(res => {
      let {success, data } = res
      if (success && data) {
        return {
          list: data
        }
      }else {
        return {
          list: []
        }
      }
    })
  }

  const {queryData} = useRequest(getLayoutData, {
    onSuccess:(result, params) => {
      console.log(result)
      sessionStorage.setItem('layoutItem', JSON.stringify(result.list))
      setlayoutItem(result.list)
    }
  });

  const InsertLayoutData = () => {
    return InsertUISummary(projectId, layoutItem).then(res => {
      let {success } = res
      if (success ) {
        return {
          list: true
        }
      }else {
        return {
          list: false
        }
      }
    })
  }

  const { run } = useRequest(InsertLayoutData,{
    manual: true,
    onSuccess:(result, params) => {
      showConfirmModal()
    } 
  })

  const createElement = el => {
    const removeStyle = {
      position: "absolute",
      right: "5px",
      top: 0,
      zIndex:1000,
      cursor: "pointer"
    }
    const i = el.i;
    return (
      <div key = {i} data-grid={el}>
        <span className="remove" style={removeStyle} onClick={ () => onRemoveItem(i)}> X </span>
        { i.indexOf('公司信息') != -1 ? <CompanyMessage></CompanyMessage> : null  }
        { i.indexOf('今日告警') != -1 ? <TodayWarning></TodayWarning> : null  }
        { i.indexOf('今日工单') != -1 ? <OrderDetail></OrderDetail> : null  }
        { i.indexOf('告警信息') != -1 ? <WarningMessage></WarningMessage> : null  }
        { i.indexOf('用电量') != -1 ? <ElectricValue></ElectricValue> : null }
        { i.indexOf('用水量') != -1 ? <WaterValue></WaterValue> : null }
        { i.indexOf('用燃气量') != -1 ? <GasValue></GasValue> : null }
        { i.indexOf('碳排放量') != -1 ? <CarbonValue></CarbonValue> : null }
        { i.indexOf('能耗趋势') != -1 ? <EnergyTrend></EnergyTrend> : null }
        { i.indexOf('实时负荷率') != -1 ? <RealLoad></RealLoad> : null }
        { i.indexOf('告警分布') != -1 ? <WarningSpread></WarningSpread> : null }
        { i.indexOf('分时电量分析') != -1 ? <ElectricAnalysis></ElectricAnalysis> : null }
      </div>
    )
  }
  const onRemoveItem = (i) => {
    setlayoutItem(_.reject(layoutItem, { i: i }));
  }

  const onAddlayout = (xValue, yValue) => {
    let newlayout ;
    let time = new Date()
    if(classOfName == '能耗趋势' || classOfName == '实时负荷率' || classOfName == '告警分布' || classOfName == '分时电量分析'){
      newlayout = layoutItem.concat({
        i: classOfName + '_' + Date.now(),
        x:xValue,
        y:yValue,
        w:2,
        h:2,
        'description': classOfName
      })
    }else{
      newlayout = layoutItem.concat({
        i: classOfName + '_' + Date.now(),
        x:xValue,
        y:yValue,
        w:2,
        h:1,
        'description': classOfName
      })
    }
    
    setlayoutItem (newlayout)
    setNewCounter(newCounter + 1);
  }

  const onDrop = (layouts, layoutValue, _event) =>{
    onAddlayout(layoutValue.x, layoutValue.y)
  }

  const onLayoutChange = (layout) => {
    if(layout.length == 0) return;
    if(layout[layout.length - 1].i == '__dropping-elem__') return;
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

  return (
    <div className={style.mainContent} style={{backgroundColor:'#eee'}}>
      <ReactGridLayout layout={layoutItem} onLayoutChange={onLayoutChange} {...defaultProps} isDroppable={true} onDrop = {onDrop} >
        {_.map( layoutItem, el =>createElement(el) )} 
      </ReactGridLayout>
      <div className={style.selectMenu}>
        <SelectTab tabName={'基础信息'}></SelectTab>
        <SelectTab tabName={'运行监控'}></SelectTab>
        <SelectTab tabName={'运维工单'}></SelectTab>
        <SelectTab tabName={'配电房信息'}></SelectTab>
        <SelectTab tabName={'能耗统计'}></SelectTab>
      </div>
      <div className={style.reset} onClick={() => showResetModal()}>重置</div>
      <div className={style.confirm} onClick={run}>保存</div>

      <Modal className={style.resetModal} open={resetModal} onOk={resetOk} onCancel={handleCancel} width={512} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'重置'} okType={'primary'} okButtonProps={{danger:true}}>
        <div className={style.resetHeader}>重置提示</div>
        <div className={style.resetBody}>
          <img className={style.warnIcon} src={firstwarn}></img>
          <span>是否确认要重置当前页面布局？</span>
        </div>
      </Modal>

      <Modal className={style.confirmModal} open={confirmModal} onOk={confirmOk} onCancel={handleCancel} width={512} centered={true} closable={false} maskClosable={false} okText={'关闭'} okType={'primary'} cancelButtonProps={{ style: { display: 'none' } }}>
        <div className={style.confirmHeader}>保存界面</div>
        <div className={style.confirmBody}>
          <img className={style.warnIcon} src={finished}></img>
          <span >当前界面布局保存成功！</span>
        </div>
      </Modal>

      <Drawer placement='right' onClose={onClose} open={basicOpen} mask={false}>
        <div className={style.searchInput}>
          <Input placeholder="模块名称" style={{width: 177, backgroundColor:'#000', color:'#fff'}}  size='middle'/>
          <span className={style.searchButton} onClick={() => sessionStorage.setItem('layoutItem',JSON.stringify(layoutItem))}>查询</span>
        </div>
        <div className={style.addModule}>
          <AddItem imgUrl={company} itemName={'公司信息'}></AddItem>
          <AddItem imgUrl={device} itemName={'设备信息'}></AddItem>
          <AddItem imgUrl={safe} itemName={'安全运行天数'}></AddItem>
          <AddItem imgUrl={weather} itemName={'天气信息'}></AddItem>
        </div>
      </Drawer>
      <Drawer placement='right' onClose={onClose} open={monitorOpen} mask={false}>
        <div className={style.searchInput}>
          <Input placeholder="模块名称" style={{width: 177, backgroundColor:'#000', color:'#fff'}}  size='middle'/>
          <span className={style.searchButton}>查询</span>
        </div>
        <div className={style.addModule}>
          <AddItem imgUrl={electric} itemName={'用电量'}></AddItem>
          <AddItem imgUrl={water} itemName={'用水量'}></AddItem>
          <AddItem imgUrl={gas} itemName={'用燃气量'}></AddItem>
          <AddItem imgUrl={coal} itemName={'用煤量'}></AddItem>
          <AddItem imgUrl={load} itemName={'实时负荷率'}></AddItem>
          <AddItem imgUrl={monitor} itemName={'实时监控'}></AddItem>
          <AddItem imgUrl={carbon} itemName={'碳排放量'}></AddItem>
        </div>
      </Drawer>

      <Drawer placement='right' onClose={onClose} open={orderOpen} mask={false}>
        <div className={style.searchInput}>
          <Input placeholder="模块名称" style={{width: 177, backgroundColor:'#000', color:'#fff'}}  size='middle'/>
          <span className={style.searchButton}>查询</span>
        </div>
        <div className={style.addModule}>
          <AddItem imgUrl={warning} itemName={'今日告警'}></AddItem>
          <AddItem imgUrl={warningMessage} itemName={'告警信息'}></AddItem>
          <AddItem imgUrl={todayOrder} itemName={'今日工单'}></AddItem>
          <AddItem imgUrl={spread} itemName={'告警分布'}></AddItem>
        </div>
      </Drawer>

      <Drawer placement='right' onClose={onClose} open={disOpen} mask={false}>
        <div className={style.searchInput}>
          <Input placeholder="模块名称" style={{width: 177, backgroundColor:'#000', color:'#fff'}}  size='middle'/>
          <span className={style.searchButton}>查询</span>
        </div>
        <div className={style.addModule}>
          <AddItem imgUrl={distribution} itemName={'配电房监测'}></AddItem>
          <AddItem imgUrl={transformer} itemName={'变压器监控'}></AddItem>
          <AddItem imgUrl={humiture} itemName={'温湿度监控'}></AddItem>
        </div>
      </Drawer>

      <Drawer placement='right' onClose={onClose} open={energyOpen} mask={false}>
        <div className={style.searchInput}>
          <Input placeholder="模块名称" style={{width: 177, backgroundColor:'#000', color:'#fff'}}  size='middle'/>
          <span className={style.searchButton}>查询</span>
        </div>
        <div className={style.addModule}>
          <AddItem imgUrl={energyCost} itemName={'能耗费用'}></AddItem>
          <AddItem imgUrl={energyTrend} itemName={'能耗趋势'}></AddItem>
          <AddItem imgUrl={costTrend} itemName={'能耗费用趋势'}></AddItem>
          <AddItem imgUrl={energyRank} itemName={'能耗排名'}></AddItem>
        </div>
      </Drawer>
    </div>
  )
}
