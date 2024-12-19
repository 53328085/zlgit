import React, { useState, useRef, useEffect, useCallback } from 'react'
 
import { Space, Radio, Select, Progress, Pagination, Form } from 'antd';
import { useAntdTable } from "ahooks";
import styled from 'styled-components';
import { useTranslation } from "react-i18next"
import { ExportExcel } from '@com/useButton'
import {useLocation, useNavigate, Link} from 'react-router-dom'
import style from './style.module.less'
 
import energyImg from '../quota/icon/energyImg.svg'
import alarmIcon from '../quota/icon/alarmIcon.png'
import alarmSelectedIcon from '../quota/icon/alarmSelectedIcon.svg'

 
import { useSelector } from 'react-redux'
import { CPagination } from "@com/comstyled";
import { CaretRightOutlined } from '@ant-design/icons';
import { selectProjectId,themeColor } from '@redux/systemconfig.js'


import {energyQuota} from '@api/api'
import { isObject } from '@com/usehandler';
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr;
  flex: 1;
  row-gap: 16px;
`
const ProgressBoX = styled.div`
.progressColor{
  .ant-progress-text{
    color: rgba(255, 0, 0, 1);
  }
  
}
`
const Search = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 16px;
  
`
export default function QuotaAlarms() {
  const {pathname,state} = useLocation()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState(0)
  
  const projectId = useSelector(selectProjectId)
  const {errorColor} =useSelector(themeColor)
   
   
  const [form] = Form.useForm();
  const { t } = useTranslation("quota")
 

  
 
  const [modeltype, setModelType] = useState('card')
  const [park, setPark] = useState([])
  const [structure, setStructure] = useState([])
  const [alarmAllData, setAlarmAllData] = useState([])
  
  const QueryStructureWarn =async () => { // 告警建筑
    let {parkAreaId,structureAreaId} = await form.validateFields()
    try {
      let params ={
        parkAreaId,
        structureAreaId,
        projectId
      }
     let {success, data} = await energyQuota.QueryStructureWarn(params)
     if(success &&  isObject(data)) {
       let {quotaAreaWarnVos, parkWarnNum} = data
       if(Array.isArray(quotaAreaWarnVos) && quotaAreaWarnVos?.length >0) {
        setAlarmAllData([{
          "quotaAreaId": 0,
          "name": "全部告警",
          "warnNum": parkWarnNum
        }, ...quotaAreaWarnVos])
       }else {
        setAlarmAllData([])
       }
      
     }else {
       setAlarmAllData([])
     }
    } catch (error) {
      
    }
    
  }
 const onValuesChange =() => { 
  QueryStructureWarn()
 }
  const getParklist = async() => {
    try {
     let {success, data, errMsg} = await energyQuota.QueryParkList({projectId, parkAreaId:0})
     if(success && Array.isArray(data) && data?.length >0) {
        setPark([{name: '全部园区', quotaAreaId: 0},...data])
        return Promise.resolve(true)
     }else {
      
       if(data?.length === 0 )  message.warning('没有设置园区')
         setPark([])  
       setStructure([])
       setAlarmAllData([])
        return Promise.reject('没有数据')
         
     }
    } catch (error) {
     
    }
  }
const getStructure = async() => {
    try {
      let params ={
        parkAreaId:0,
        structureAreaId:0,
        projectId
      }
    let {success, data} = await  energyQuota.QueryStructureList(params)
    if(success && Array.isArray(data)&& data?.length >0) {
      setStructure([{quotaAreaId:0,name: '全部建筑'}, ...data])
      QueryStructureWarn()
    }else {
      setStructure([])
      setAlarmAllData([])
      if(data?.length === 0 )return message.warning('没有设置建筑')
     
    }
    } catch (error) {
      
    }
}



 useEffect(() => {
  if(Number.isInteger(parseInt(projectId))) {
    try {
      getParklist().then(getStructure)
     
    } catch (error) {
      
    }
    
  }

 }, [projectId])
 const options = [
  {label: '按剩余量百分比顺序', value: 1},
  {label: '按剩余量百分比倒序', value: 2},
  {label: '按剩余量顺序', value: 3},
  {label: '按剩余量倒序', value: 4},
 ]
 const fieldNames ={
  label: 'name',
  value: 'quotaAreaId'
 }
 
 const geRoomData = async ({current, pageSize}, formData) => {
   
   try {
     if(Array.isArray(alarmAllData) && alarmAllData?.length > 0 && Number.isInteger(parseInt(projectId))) {
       let {parkAreaId,order} = formData
       let params ={
         pageNum:current,
         pageSize,
         parkAreaId,
         structureAreaId:activeTab,
         order,
         projectId,
       }
       let {success, data,total} = await  energyQuota.QueryRoomQuota(params)
       
       if(success && Array.isArray(data) && data?.length >0 ) {
         return {
           list: data,
           total
         }
       }else {
          return {
           list: [],
           total: 0
          }
       }
     }
  
   } catch (error) {
     console.log(error)
   }
  
 }
 const { tableProps, search, run } = useAntdTable(geRoomData, { 
   form,
   defaultPageSize: 12,
   refreshDeps: [projectId,alarmAllData, activeTab],
 });
 
 const { submit } = search;
 
 
const changeTab = (val) => {
  let value = val.target.value
  setModelType(value)
  if(value=="list") {
    navigate(`/index/runtimeQuota/runtimeQuotaDetailed?type=list`, {state: {title: '定额详细', nested: 'runtimeQuotaDetailed', primary: 'runtimeQuota'}})
  }
 
}; 
  const CustView = (
    <Search>
      <Form layout="inline" form={form} onValuesChange={onValuesChange}>
        <Space>
        <Form.Item name="parkAreaId" initialValue={0}>
          <Select options={park}   style={{ width: 188}} fieldNames={fieldNames} onChange={submit} ></Select>
        </Form.Item>
        <Form.Item name="structureAreaId" initialValue={0}>
          <Select options={structure} style={{ width: 188}} fieldNames={fieldNames} onChange={submit}></Select>
        </Form.Item>
        <Form.Item name="order" initialValue={1}>
          <Select options={options} style={{ width: 188}} onChange={submit} ></Select>
        </Form.Item>
        </Space>
      </Form>
 
      <Space size={16} style={{ marginLeft: "auto" }}>
        <Radio.Group
          onChange={changeTab}
          buttonStyle="solid"
          options={[{ label: t("CardMode"), value: 'card' }, { label: t("ListMode"), value: 'list' }]}
          value={modeltype}
          optionType="button"
        >
        </Radio.Group>
              
      </Space>
    </Search>

  )
  const changeAlarm = values => {
    if (activeTab == values.quotaAreaId) return;
    setActiveTab(values.quotaAreaId)
  }
 



  const changepage = (current, pageSize) => {
    try {
      let values = form.getFieldsValue();
      run({ current, pageSize }, values)
    } catch (error) {

    }
  }
 
  const toDetailIndicators = (quotaAreaId) => {
   
    window.open(`/detailIndicators?quotaAreaId=${quotaAreaId}&type=1&projectId=${projectId}`, '_blank')
  }
 
 
  return (
    <Mainbox>
      {CustView}
    <div className={style.quotaAlarmsContent}>
      <div className={style.AlarmsContent}>
        <div className={style.AlarmsContentLeft}>
          {alarmAllData.map((item, index) => (
            <div className={style.Alarmsitem} onClick={() => changeAlarm(item)} style={{ color: activeTab == item.quotaAreaId ? '#fff' : '', background: activeTab == item.quotaAreaId ? errorColor : '', border: activeTab == item.quotaAreaId? 'none' : '' }}>
              <div className={style.Alarmsadress}>
                {activeTab == item.quotaAreaId ? <img src={alarmSelectedIcon} className={style.alarmIcon} /> :
                  <img src={alarmIcon} className={style.alarmIcon} />}
                {item.quotaAreaId == 0 ? t("AllAlarms") : item.name}
              </div>
              <div className={style.Alarmsnum}>
                {t("QuotaAlarm")} <span className={style.num}>{item.warnNum}</span>
                <CaretRightOutlined className={style.rightIcon} style={{ color: activeTab == item.quotaAreaId ? '#fff' : '#ccc' }} />
              </div>

            </div>
          ))}
        </div>
        <div className={style.AlarmsContentRight}>
          
            <div className={style.cardData}>
              {
                tableProps?.dataSource?.map((item, index) => (
                <Link to={`/detailIndicators?quotaAreaId=${item.quotaAreaId}&type=1&projectId=${projectId}`} target="_blank" key={item.quotaAreaId}>  <div className={style.cardBox}   >
                    <div className={style.cardTop}>
                      <span>{item.areaName}</span>
                      <span className={style.LowStatus} >{t("InsufficientMargin")}</span>
                    </div>
                    <div className={style.cardCenter}>
                      <img src={energyImg} className={style.energyImg} />
                      <div className={style.cardCInfo}>
                        <div className={style.name}>
                          <span>{t("Quota")} (kWh)</span>
                          <span>{t("Used")} (kWh)</span>
                          <span>{t("Surplus")} (kWh)</span>
                        </div>
                        <div className={style.num}>
                          <span>{item.areaQuotaValue}</span>
                          <span>{item.areaConsumptionValue}</span>
                          <span>{item.areaRemainValue}</span>
                        </div>
                        <div className={style.percent}>
                      <div style={{flex:'1 0 auto'}}>{t("RemainingEnergyConsumption")}</div>
                        <Progress
                          percent={parseFloat(item.areaRemainRate)}
                          className={`${item.status ==0 ? '' : 'progressColor'}`}
                          trailColor='#ebeef5'
                          strokeColor={`${item.status ==0 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
                         
                          strokeWidth={15} />
                    </div></div>
                    </div>
                  </div></Link>
                ))}
            </div>
         
          <CPagination style={{ marginLeft: 'auto', width: 'fit-content' }} size="small" onChange={changepage}   {...tableProps.pagination} showSizeChanger={false} />
        </div>
      </div>
    </div>
    </Mainbox>
  )
}
