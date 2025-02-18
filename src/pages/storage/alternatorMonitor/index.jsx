import React, {Fragment, useEffect, useState} from 'react'
import style from './style.module.less'
import { Select, Form, Table, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel,themeColor } from '@redux/systemconfig.js'
import PowerChart from './powerChart'
import SocChart from './SocChart'
import {PCSMonitorRuntime, SiteManagerDesigner, StorageContainerDesigner } from '@api/api.js'
import { useReactive, useRequest } from 'ahooks'
import { useNavigate, useOutletContext} from 'react-router-dom'
import pcs from './imgs/pcs.png'
import online from './imgs/online.png'
import offline from './imgs/offline.png'
import error from './imgs/error.png'
import Pagecount from "@com/pagecontent";
import Ichart  from '@com/useEcharts/Ichart'; 
import Titlelayout from "@com/titlelayout"; 
import styled from 'styled-components'
 
import Usetable from '@com/useTable'
const Mainbox = styled.div`
 && {
   .leftlayout {
      border-radius: 8px;
      background-color: ${props => props.theme.primaryderived ||rgb(0, 0, 51)};
      padding: 20px;
      .leftTitle {
        position: relative;
        border-left:none;
        padding-left: 11px;
        &::before {
          position: absolute;
          left:0px;
          content: "";
          width: 3px;
          height: 13px;
          background-color: ${({theme}) =>  theme.primaryColor };
        }
      }
   }
   .rightlayout {
     flex:1;
     display: grid;
     grid-template-columns: 1fr;
     grid-template-rows: 320px 320px 1fr ;
     row-gap: 16px;
   }
 }
`
export default function Index() {
  let {exparams} = useOutletContext() 
  let {areaId,  projectId,  pcsId} = exparams
  let {value: pcs_id, label} = pcsId || {}
  const {errorColor,successColor,warningColor} = useSelector(themeColor)
  const { 
    queryPCSInfo,
    queryPCSWarningInfo, 
    queryPowerTrends, 
    querySocTrends, 
    queryAcTable } = PCSMonitorRuntime

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
    state = state === '0' ? 'normal' : state === '1' ? 'error' : 'offline'
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
    queryPCSInfo(projectId, areaId, pcs_id).then(res => {
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
    queryPCSWarningInfo(projectId, pcs_id).then(res => {
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
    queryPowerTrends(projectId, areaId, pcs_id).then(res => {
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
    querySocTrends(projectId, areaId, pcs_id).then(res => {
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
    queryAcTable(projectId, areaId, pcs_id).then(res=> {
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
  useEffect(() => {
     if(!pcs_id) return;
     if(Number.isInteger(areaId) && Number.isInteger(projectId)) {
       getContent()
     }

  }, [areaId, projectId, pcs_id])
  const socOption = {
    type:2,
    color:[warningColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '0',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick:{
        alignWithLabel:true
      },
      data: Array.isArray(socData.x) ? socData.x : []
    },
    yAxis: {
      type: 'value',
      // min: 24
      scale: true, //自适应
    },
    series: [
      {
        name: "SOC(%)",
        data:  Array.isArray(socData.y) ? socData.y : [],
        type: 'line',
        symbol:'none', 
        smooth: true,
        areaStyle: {}
      }
    ]
  }
  const poweroption = {
    type:2,
    color:[successColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '0',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data:   Array.isArray(powerData.x) ? powerData.x : [],
      boundaryGap: true,
      axisTick:{
        alignWithLabel:true
      },
    },
    yAxis: {
      type: 'value',
      scale: true, //自适应
      // min: function(value){
      //   return (value / 1000) * 1000
      // }
    },
    series: [
      {
        name: "实时总功率(kwh)",
        data: Array.isArray(powerData.y) ? powerData.y : [],
        type: 'line',
        symbol:'none', 
        smooth: true,
        areaStyle: {}
      }
    ]
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

 


  const rightStyle={
    borderRight: 'none'
  }
  const bottomStyle = {
    borderBottom:'none'
  }

  return (
    <Pagecount bgcolor='transparent' pd="0">
      
      <Mainbox className={style.pcsContent}>
        <div className={style.left + " leftlayout"} key="left">
          <div className={style.title + " leftTitle"}>
            <span>储能交流器</span>
           {label && <span className={style.pcsName}>{label}</span>} 
          </div>
          <div className={style.firstValue} key="leftup">
            <div className={style.stateList}>
              <div className={style.stateItem}>
                <img src={online} className={style.circle}></img>
                <span style={{color:successColor}}>无故障</span>
              </div>
              <div className={style.stateItem}>
              <img src={error} className={style.circle}></img>
                <span style={{color:errorColor}}>告警</span>
              </div>
              <div className={style.stateItem}>
              <img src={offline} className={style.circle}></img>
                <span style={{color:'#595959'}}>未知</span>
              </div>
            </div>
            <div className={style.pcsImgs}>
              <span className={style.imgTitle}>储能交流器</span>
              <img className={style.pcsImg} src={pcs}></img>
            </div>
            <div className={style.pcsStatus}>
              <span>{state.gridState}</span>
              <span>{state.chargeState + ' . . .'}</span>
            </div>
          </div>
          <div className={style.dataCard} key="leftdown">
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
          <div className={style.status} key="status">
            {
              state.warningInfo.map((item, index) => {
                return <StateItem key={index} name={item.name} state={item.value} styles={((index + 1) % 4) == 0 ? rightStyle : null}></StateItem>
              })
            }
          </div>
        </div>
        <div className="rightlayout" key="right">
          <Titlelayout  title="总功率" layout="flex" key="up">
             <div style={{display: "flex", flex:1}}>
              <Ichart {...poweroption} />
          {/*    <PowerChart lineData={powerData} Unit='实时总功率(kwh)' color={successColor}></PowerChart> */}
             </div>
          </Titlelayout>
          <Titlelayout title="SOC" key="down">
             <Ichart {...socOption} />
         {/*    <SocChart lineData={socData} Unit='SOC(%)' color={warningColor}></SocChart> */}
          </Titlelayout>
         
          <Usetable   dataSource={state.ACData} columns={AcClomns} rowKey='name' pagination={false} hbg="#036" />
          
        </div>
      </Mainbox>
    </Pagecount>
  )
}
