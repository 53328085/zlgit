import React, { useState, useRef, useEffect, useCallback } from 'react'
 
import { Space, Radio, Select, Progress, Form } from 'antd';
import { useAntdTable } from "ahooks";
import styled from 'styled-components';
import {useLocation, useNavigate, Link} from 'react-router-dom'
import { ExportExcel } from '@com/useButton'
import style from './style.module.less'
import Usetable from '@com/useTable'
import energyImg from '../quota/icon/energyImg.svg'
 
import { useSelector } from 'react-redux'
import { CPagination } from "@com/comstyled";
import { selectProjectId } from '@redux/systemconfig.js'
import { useTranslation } from "react-i18next"
import {energyQuota} from "@api/api"
const Search = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 16px;
  
`
const ProgressBoX = styled.div`
.progressColor{
  .ant-progress-text{
    color: rgba(255, 0, 0, 1);
  }
  
}
`
export default function QuotaDetail() {
  const tableLoadRef = useRef();
  
  const [isCard, setisCard] = useState(true); //卡片模式true或列表模式false
  const projectId = useSelector(selectProjectId)
  const clocation = useLocation()
  const navigate = useNavigate()
  console.log(clocation)
  const {search: query,pathname, state} = clocation
 
 
  const [form] = Form.useForm();
  const { t } = useTranslation("quota")
  
  const columns = [
    {
      title: t("RoomName"),
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center',
    },
    {
      title: t("EnergyConsumptionQuota") + ' (kWh)',
      dataIndex: 'areaQuotaValue',
      key: 'areaQuotaValue',
      align: 'center',
    },
    {
      title: t("UsedEnergyConsumption") + ' (kWh)',
      dataIndex: 'areaConsumptionValue',
      key: 'areaConsumptionValue',
      align: 'center'
    },
    {
      title: t("RemainingEnergyConsumption") + ' (kWh)',
      dataIndex: 'areaRemainValue',
      key: 'areaRemainValue',
      align: 'center'
    },
    {
      title: t("RatioOfRemainingEnergyConsumption"),
      dataIndex: 'areaRemainRate',
      key: 'areaRemainRate',
      align: 'center',
      render: (percent, record) => <Progress
        percent={parseFloat(percent)}
        trailColor='#ebeef5'
        strokeColor={`${record.status == 0 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
        style={{ width: 200 }} />
    },
    {
      title: t("EnergyConsumptionStatus"),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => <div>
        <span style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", backgroundColor: `${status == 0 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}` }}></span>
        <span style={{ marginLeft: 10, color: `${status ==0 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}` }}>{status == 0 ? t("Normal") : t("Alarm")}</span>
      </div>
    },
  ]

  
 
  const [modeltype, setModelType] = useState('card')
 
 
  const [park, setPark] = useState([])
  const [structure, setStructure] = useState([])
 
  const getParklist = async() => {
    try {
     let {success, data, errMsg} = await energyQuota.QueryParkList({projectId, parkAreaId:0})
     if(success && Array.isArray(data) && data?.length >0) {
        setPark([{name: '全部园区', quotaAreaId: 0},...data])
        return Promise.resolve(true)
     }else {
      
       if(data?.length === 0 )  message.warning('没有设置园区')
         setPark([])  
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
     
    }else {
      setStructure([])
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
 const changeTab = (val) => {
  setModelType(val.target.value)
  setisCard(val.target.value == 'card' ? true : false);
  navigate(`${pathname}?type=${val.target.value}`, {state})
  
 
}; 
useEffect(() => {
   const val = new URLSearchParams(query).get('type') 
   setisCard(val=='card')
   setModelType(val)
}, [])
const [total, setTotal] = useState()
const geRoomData = async ({current, pageSize}, formData) => {
  
  try {
    if(Array.isArray(structure) && structure?.length > 0 && Number.isInteger(parseInt(projectId))) {
      let {parkAreaId,quotaAreaId,order} = formData
      let params ={
        pageNum:current,
        pageSize,
        parkAreaId,
        quotaAreaId,
        order,
        projectId,
      }
      let {success, data,total} = await  energyQuota.QueryRoomQuota(params)
      setTotal(Number.isInteger(total) ? total : 0)
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
  refreshDeps: [projectId,structure],
});

const { submit } = search;

const onExport = useCallback(async () => {
  try {
   let {parkAreaId,quotaAreaId,order} = await form.validateFields()
   let params ={
     pageNum:1,
     pageSize: total,
     parkAreaId,
     quotaAreaId,
     order,
     projectId,
   }
   return  energyQuota.QueryRoomQuota(params).then(res => {
    let {success, total, data} = res
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
   })
  
   



  } catch (error) {
    console.log(error)
  }
}, [total])

  const CustView = (
      <Search>
        <Form layout="inline" form={form}>
          <Space>
          <Form.Item name="parkAreaId" initialValue={0}>
            <Select options={park}   style={{ width: 188}} fieldNames={fieldNames} onChange={submit} ></Select>
          </Form.Item>
          <Form.Item name="quotaAreaId" initialValue={0}>
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
          <ExportExcel disabled={isCard} tb={tableLoadRef}  />          
        </Space>
      </Search>

    )
 





 
  const changepage = (current, pageSize) => {
    try {
      let values = form.getFieldsValue();
      run({ current, pageSize }, values)
    } catch (error) {

    }
  }
  
  const toDetailIndicators = () => {
    window.open('/detailIndicators', '_blank')
  }
 
 

  return (
    <div className={style.quotaDetailContent}>
       {CustView}
      {isCard ? (
        <div className={style.cardData}>
          {
            tableProps?.dataSource?.map((item) => (
              <Link to={`/detailIndicators?quotaAreaId=${item.quotaAreaId}&type=1&projectId=${projectId}`} target="_blank" key={item.quotaAreaId}> <div className={style.cardBox} key={item.quotaAreaId} >
                <div className={style.cardTop}>
                  <span>{item.areaName}</span>
                  <span className={`${item.status == 0 ? style.normalStatus : style.LowStatus}`} >{item.status == 0 ? t("NormalEnergyConsumption") : t("InsufficientMargin")}</span>
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
                    </div> </div>
                </div>
              </div></Link>
            ))}
        </div>
      ) : (
        <div className={style.listData}>        
          <Usetable columns={columns} ref={tableLoadRef}  {...tableProps} hbg="#ecf5ff" hbc="#515151" rowKey={columns => columns.id} onExport={onExport} />
        </div>
      )}
     {isCard &&  <CPagination style={{ marginLeft: 'auto', width: 'fit-content' }} size="small" onChange={changepage}   {...tableProps.pagination} showSizeChanger={false} />}
    </div >
  )
}
