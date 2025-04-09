import React, { useEffect, useState, } from 'react'
import { useSelector } from 'react-redux'
import { selectcurlRommid, selectProjectId, roomName } from "@redux/systemconfig";

import styled from 'styled-components'
import Pagecount from '@com/pagecontent'

import { message, Image, Typography, Collapse } from 'antd'
import { useReactive } from 'ahooks';


import { DistributionRoomRuntime } from '@api/api.js'
import dimg from './icon/3dimg.png'
import imgurl from '@imgs'
import { Cspin } from "@com/comstyled"
import { isObject } from "@com/usehandler"
const { Text } = Typography

const Mainbox = styled.div`
  flex: 1;
  position: relative;
   .cardlocal{
    position: absolute;
    padding: 0 16px;
    top:16px;
    display:flex;
    column-gap: 16px;
    width: 100%;
   }
  .cardList{
    position: absolute;
    right: 32px;
    top: 32px;
    color: #fff;
    border-radius: 4px;
    height: 732px;
   overflow-y: auto;
    .card{
    //  width: max-content;
     column-gap: 4px;
      height: 48px;
      background-color:  rgba(15, 34, 63, 0.8);
      border: 1px solid rgba(0, 153, 204, 1);
      padding: 4px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        padding-left: 12px;
        display: inline-block;
        color: #fff;
      //  width: 130px;
      }
      .imgtip{
        display: flex;
        align-items: center;
      
      }
      .cardval{
        color: #00ff00;
        font-size: 16px;
      }
      &:first-child{
        border-radius: 4px 4px 0 0;
      }
      &:last-child {
        border-radius: 0 0 4px 4px;
      }
    }
    img{
      width: 32px;
    }
    .headtext{
      display: block;
      padding: 0;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 48px;
    }
  }
 `



const keys1 = ["电压等级", "变压器台数", "负载率", "额定容量", "监测设备"]
const keys2 = ["当日用电", "昨日同期", "环比", "最大用电功率", "最大用电时间", "平均功率"]
const keys3 = ["电压", "电流", "功率", "谐波", "功率因数"]
const keys4 = ["控母电压", "控母电流", "充电电压", "电池温度", "合母电压"]
const keys5 = ["温度1", "湿度1", "温度2", "湿度2", "噪音", "水浸", "烟感", "明火", "门禁"]
export default function Index() {

  const projectId = useSelector(selectProjectId)

  const roomId = useSelector(selectcurlRommid)
  const rname = useSelector(roomName)

  const state = useReactive({
    dcScreen: [],
    environmentVo: {},
    imgBg: '',
    roomDevice: {},
    roomStatus: {},
    transformer: []
  })

  const init = {
    door: [],
    fire: [],
    ht: [], // 温湿度
    sF6: [], // 有害气体
    water: [], // 水浸
    //  humidness:"",
    noise: [],
    smoke: [],
    // temperature:"",
    water: []
  }
  const [imgBg, setImgBg] = useState()
  const [envlist, setEnvList] = useState(init)
  const { door, fire, ht, noise, sF6, smoke, water } = isObject(envlist) ? envlist : {}
  const [spinning, setSpinging] = useState(true)
  const getEnvironment = async (roomId) => {
    try {
      setSpinging(true)
      setEnvList(init)
      const res = await DistributionRoomRuntime.GetEnvironment(projectId, roomId)
      if (res.success) {
        setEnvList(res.data)
        setImgBg(res?.data?.imgBg)

      } else {
        setImgBg(null)
        setEnvList(init)
        message.error(res.errMsg)
      }
    } catch (error) {
      setEnvList(init)
      console.log(error)
    } finally {
      setSpinging(false)
    }

  }
  const OverviewInfo = async (roomId) => {
    try {
      const res = await DistributionRoomRuntime.OverviewInfo({ projectId, roomId })
      if (res.success) {
        if (isObject(res.data)) {

          state.dcScreen = res.data.dcScreen
          state.environmentVo = res.data.environmentVo
          state.imgBg = res.data.imgBg
          state.roomDevice = res.data.roomDevice
          state.roomStatus = res.data.roomStatus
          state.transformer = res.data.transformer
        }
      } else {
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }

  }
  const Custcard = ({ src, value, name }) => {
    return (
      <div className='card'>
        <div className='imgtip'>
          <img src={src} alt="" />
          <Text ellipsis={{ tooltip: name }}>{name}</Text>
        </div>
        <div className='cardval'>{value}</div>
      </div>
    )
  }
  useEffect(() => {
    if (Number.isInteger(roomId)) {
      getEnvironment(roomId)
      OverviewInfo(roomId)
    } else {
      setSpinging(false)
    }

  }, [roomId, rname])
  return (

    <Pagecount bgcolor="#eeeff3" pd="0px" custserach="true">
      <Cspin spinning={spinning} tip="图片下载中……">
        <Mainbox >
          <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <div style={{position: "relative"}}>
            <img src={imgBg || dimg}  alt='' />
            <div className='cardlocal'>

<HoverDiv>
  配电房概述
  <div className="list" >
    <div className="line">
      <span>电压等级</span>
      <span>{state.roomDevice.level || '-'}</span>
    </div>
    <div className="line">
      <span>变压器台数</span>
      <span>{state.roomDevice.transformerCnt || '-'}</span>
    </div>
    <div className="line">
      <span>负载率</span>
      <span>{state.roomDevice.loadRate || '-'}</span>
    </div>
    <div className="line">
      <span>额定容量</span>
      <span>{state.roomDevice.capacity || '-'}</span>
    </div>
    <div className="line">
      <span>最大需量</span>
      <span>{state.roomDevice.demand || '-'}</span>
    </div>
    <div className="line">
      <span>监测设备</span>
      <span>{state.roomDevice.deviceCnt || '-'}</span>
    </div>
  </div>
</HoverDiv>
<HoverDiv>
  运行状态
  <div className="list" >
    <div className="line">
      <span>当日用电</span>
      <span>{state.roomStatus.curE || '-'}</span>
    </div>
    <div className="line">
      <span>昨日同期</span>
      <span>{state.roomStatus.lastE || '-'}</span>
    </div>
    <div className="line">
      <span>环比</span>
      <span>{state.roomStatus.eRate || '-'}</span>
    </div>
    <div className="line">
      <span>最大用电功率</span>
      <span>{state.roomStatus.maxP || '-'}</span>
    </div>
    <div className="line">
      <span>最大用电时间</span>
      <span>{state.roomStatus.maxPTime || '-'}</span>
    </div>
    <div className="line">
      <span>平均功率</span>
      <span>{state.roomStatus.avgP || '-'}</span>
    </div>
  </div>
</HoverDiv>
<HoverDiv>
  变压器监控
  <div className="list" >
    <Collapse accordion expandIconPosition="end" ghost>
      {
        state.transformer?.map((item, index) => {
          return (
            <Collapse.Panel header={item.name} key={index}>
              <div className="line">
                <span>A相电压</span>
                <span>{item.ua || '-'}</span>
              </div>
              <div className="line">
                <span>B相电压</span>
                <span>{item.ub || '-'}</span>
              </div>
              <div className="line">
                <span>C相电压</span>
                <span>{item.uc || '-'}</span>
              </div>
              <div className="line">
                <span>A相电流</span>
                <span>{item.ia || '-'}</span>
              </div>
              <div className="line">
                <span>B相电流</span>
                <span>{item.ib || '-'}</span>
              </div>
              <div className="line">
                <span>C相电流</span>
                <span>{item.ic || '-'}</span>
              </div>
              <div className="line">
                <span>有功功率</span>
                <span>{item.totW || '-'}</span>
              </div>
              <div className="line">
                <span>无功功率</span>
                <span>{item.totVar || '-'}</span>
              </div>
              <div className="line">
                <span>实在功率</span>
                <span>{item.totVA || '-'}</span>
              </div>
              <div className="line">
                <span>额定容量</span>
                <span>{item.capacity || '-'}</span>
              </div>
              <div className="line">
                <span>负荷率</span>
                <span>{item.loadRate || '-'}</span>
              </div>
              <div className="line">
                <span>功率因数</span>
                <span>{item.totPF || '-'}</span>
              </div>
            </Collapse.Panel>
          )
        })
      }
    </Collapse>
  </div>
</HoverDiv>
<HoverDiv>
  直流屏监控
  <div className="list" >
    <Collapse accordion expandIconPosition="end" ghost>
      {
        state.dcScreen?.map((item, index) => {
          return (
            <Collapse.Panel header={item.name} key={index}>
              <div className="line">
                <span>控母电压</span>
                <span>{item.motherU || '-'}</span>
              </div>
              <div className="line">
                <span>控母电流</span>
                <span>{item.motherI || '-'}</span>
              </div>
              <div className="line">
                <span>充电电压</span>
                <span>{item.chargeU || '-'}</span>
              </div>
              <div className="line">
                <span>电池温度</span>
                <span>{item.temp || '-'}</span>
              </div>
              <div className="line">
                <span>合母电压</span>
                <span>{item.bondingU || '-'}</span>
              </div>

            </Collapse.Panel>
          )
        })
      }
    </Collapse>
  </div>
</HoverDiv>
<HoverDiv>
  环境监控
  <div className="list" >
    {
      (Array.isArray(state.environmentVo.ht) && state.environmentVo?.ht.length > 0) ?
        state.environmentVo?.ht.map(h => (
          <div className="line">
            <span>温度</span>
            <span>{h.tValue}</span>
          </div>

        ))
        : <div className="line">
          <span>温度</span>
          <span>{'-'}</span>
        </div>
    }
    {
      (Array.isArray(state.environmentVo.ht) && state.environmentVo?.ht.length > 0) ?
        state.environmentVo?.ht.map(h => (
          <div className="line">
            <span>湿度</span>
            <span>{h.hValue}</span>
          </div>
        ))
        :
        <div className="line">
          <span>湿度</span>
          <span>{'-'}</span>
        </div>

    }
    {
      (Array.isArray(state.environmentVo.noise) && state.environmentVo.noise?.length > 0) ?
        state.environmentVo.noise?.map(n => (
          <div className="line">
            <span>噪音</span>
            <span>{n.value}</span>
          </div>
        ))
        : <div className="line">
          <span>噪音</span>
          <span>{'-'}</span>
        </div>
    }
    {
      (Array.isArray(state.environmentVo.water) && state.environmentVo.water?.length > 0) ?
        state.environmentVo.water?.map(w => (
          <div className="line">
            <span>水浸</span>
            <span>{w.value}</span>
          </div>
        ))
        : <div className="line">
          <span>水浸</span>
          <span>{'-'}</span>
        </div>
    }

    {/* <div className="line">
      <span>烟感</span>
      <span>{state.environmentVo.smoke || '-'}</span>
    </div> */}
    {
      (Array.isArray(state.environmentVo.smoke) && state.environmentVo.smoke?.length > 0) ?
        state.environmentVo.smoke?.map(n => (
          <div className="line">
            <span>烟感</span>
            <span>{n.value}</span>
          </div>
        ))
        : <div className="line">
          <span>烟感</span>
          <span>{'-'}</span>
        </div>
    }
    {/* <div className="line">
      <span>明火</span>
      <span>{state.environmentVo.fire || '-'}</span>
    </div> */}
    {
      (Array.isArray(state.environmentVo.smoke) && state.environmentVo.smoke?.length > 0) ?
        state.environmentVo.smoke?.map(n => (
          <div className="line">
            <span>烟感</span>
            <span>{n.value}</span>
          </div>
        ))
        : <div className="line">
          <span>烟感</span>
          <span>{'-'}</span>
        </div>
    }
    {/* <div className="line">
      <span>门禁</span>
      <span>{state.environmentVo.door || '-'}</span>
    </div> */}
    {
      (Array.isArray(state.environmentVo.door) && state.environmentVo.door?.length > 0) ?
        state.environmentVo.door?.map(n => (
          <div className="line">
            <span>门禁</span>
            <span>{n.value}</span>
          </div>
        ))
        : <div className="line">
          <span>门禁</span>
          <span>{'-'}</span>
        </div>
    }
  </div>
</HoverDiv>
            </div>
            </div>
          </div>
        
        </Mainbox>
      </Cspin>
    </Pagecount>

  )
}

const HoverDiv = styled.div`
//  width:257px;
  flex: 0 1 257px;
  height:43px;
  background: ${props => props.theme.primaryderived || '#1b3b64'};
  color: ${props => props.theme.bgcolorfont};
 // margin-right:16px;
  text-align:center;
  line-height:43px;
  position:relative;
  .list{
    transform:scale(1,0);
    position:absolute;
    top:43px;
    width:100%;
    background-color:${props => props.theme.dislistbg || '#334461'};
    font-size:14px;
    transition:.3s;
    transform-origin:center top;
    .ant-collapse-header{
      background-color: ${props => props.theme.dislistbg || '#334461'};
      border-bottom:1px solid rgba(255,255,255,0.8);
     // color: ${props => props.theme.islight ? props.theme.lightcolor : "#ffffff"}; // 
     color:${props => props.theme.disfieldname || '#ffffff'};
    }
    .ant-collapse-content-box{
        padding: 0!important;
        background-color: transparent;
      }
    .line{
      border-bottom:1px solid rgba(255,255,255,0.8);
      display:flex;
      justify-content:space-between;
      padding:8px;
      height:43px;
      align-items:center;
      span:nth-of-type(1){
        color:${props => props.theme.disfieldname || '#ffffff'};
      }
      span:nth-of-type(2){
        color:${props => props.theme.disfieldvalue || '#00ff00'};
      }
    }
    .line:hover{
    background:${props => props.theme.disitemhover || '#6633ff'};
  }
  }
  &:hover{
   // background:rgb(102,51,255);
    cursor:pointer;
    
  }
  &:hover>.list{
    transform:scale(1,1);
    }
 
`
