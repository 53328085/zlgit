import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Space, Radio, Select, Progress, Pagination, Form } from 'antd';
import { useAntdTable } from "ahooks";
import { ExportExcel } from '@com/useButton'
import style from './style.module.less'
import Usetable from '@com/useTable'
import energyImg from '../quota/icon/energyImg.svg'
import alarmIcon from '../quota/icon/alarmIcon.png'
import alarmSelectedIcon from '../quota/icon/alarmSelectedIcon.svg'

import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { CPagination } from "@com/comstyled";
import { CaretRightOutlined } from '@ant-design/icons';
import { selectProjectId } from '@redux/systemconfig.js'

import { useTranslation } from "react-i18next"

const ProgressBoX = styled.div`
.progressColor{
  .ant-progress-text{
    color: rgba(255, 0, 0, 1);
  }
  
}
`

export default function QuotaAlarms() {
  const tableLoadRef = useRef();
  const [activeTab, setActiveTab] = useState(0)
  const [isCard, setisCard] = useState(true); //卡片模式true或列表模式false
  const projectId = useSelector(selectProjectId)
  let { setCustview } = useOutletContext()
  // console.log(setCustview, '-----props');
  const [pageLog, setpageLog] = useState(1)
  let [totalLog, setTotalLog] = useState(0)
  const [form] = Form.useForm();
  const { t } = useTranslation("quota")
  const columns = [
    {
      title: t("RoomName"),
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      render: (text, record) => (
        <span>{record.address != '' ? record.address : '/'}-{record.floor != '' ? record.floor : '/'}-{record.house != '' ? record.house : '/'}</span>
      ),
    },
    {
      title: t("EnergyConsumptionQuota") + ' (kWh)',
      dataIndex: 'quota',
      key: 'quota',
      align: 'center',
    },
    {
      title: t("UsedEnergyConsumption") + ' (kWh)',
      dataIndex: 'useQuota',
      key: 'useQuota',
      align: 'center'
    },
    {
      title: t("RemainingEnergyConsumption") + ' (kWh)',
      dataIndex: 'residueQuota',
      key: 'residueQuota',
      align: 'center'
    },
    {
      title: t("RatioOfRemainingEnergyConsumption"),
      dataIndex: 'percent',
      key: 'percent',
      align: 'center',
      render: (percent) => <Progress
        percent={percent}
        trailColor='#ebeef5'
        strokeColor={`${percent > 20 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
        style={{ width: 200 }} />
    },
  ]

  const quotaDetailed = [
    {
      address: "正泰物联",
      floor: "",
      house: "105",
      quota: "2000",
      useQuota: "400",
      residueQuota: "1600",
      percent: 20
    },
    {
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 10
    },
    {
      address: "正泰物联",
      floor: "1号楼",
      house: "105",
      quota: "2000",
      useQuota: "400",
      residueQuota: "1600",
      percent: 10
    },
    {
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 8
    },
    {
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 17
    },
    {
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 0.9
    }]
  const alarmAllData = [
    {
      id: 0,
      address: "全部告警",
      num: 15
    }, {
      id: 1,
      address: "1号楼",
      num: 2
    }, {
      id: 2,
      address: "2号楼",
      num: 5
    }, {
      id: 3,
      address: "3号楼",
      num: 7
    }, {
      id: 4,
      address: "4号楼",
      num: 1
    },
  ]
  const opts = [{ name: '全部', id: 1 }, { name: '1号楼', id: 2 }, { name: '2号楼', id: 3 }]
  const tbref = useRef()
  const CustView = () => (
    <>
      <Form layout="inline">
        <Form.Item name="build">
          <Select options={opts} defaultValue={1} fieldNames={{ label: 'name', value: 'id' }} style={{ width: 188, marginLeft: 16 }}></Select>
        </Form.Item>
        <Form.Item name="percent">
          <Select options={opts} defaultValue={1} fieldNames={{ label: 'name', value: 'id' }} style={{ width: 188, marginLeft: 16 }}></Select>
        </Form.Item>
      </Form>
      {/* <Item  name='areaId' >
        <Select  options={opts}  fieldNames={{label: 'name', value: 'id', options: 'options'}}></Select>
    </Item> */}
      <Space size={16} style={{ marginLeft: "auto" }}>
        <Radio.Group
          onChange={changeTab}
          defaultValue="card"
          buttonStyle="solid"
        >
          <Radio.Button
            style={{ width: "96px", marginLeft: 16, textAlign: "center" }}
            value="card"
          >
            卡片模式
          </Radio.Button>
          <Radio.Button
            style={{ width: "96px", textAlign: "center" }}
            value="list"
          >
            列表模式
          </Radio.Button>
        </Radio.Group>
        <ExportExcel disabled={isCard} tb={tbref} />
      </Space>
    </>

  )
  const changeAlarm = values => {
    if (activeTab == values.id) return;
    setActiveTab(values.id)
  }
  let paramsLog = {
    projectId: projectId,
    pageNum: pageLog,
    pageSize: 3,
  }
  const getOverviewData = ({ current, pageSize }, formData) => {
  }

  const { tableProps, search: hanlder, run } = useAntdTable(getOverviewData, {
    form,
    defaultPageSize: 3,
    refreshDeps: [projectId],
  });

  const { submit } = hanlder;
  const onChangePageLog = (page, pageSize) => {
    setpageLog(page)
  }
  const changeTab = (val) => {
    setisCard(val.target.value == "card" ? true : false);

    //  getOverviewData()
  }; //切换卡片列表模式
  const changepage = (current, pageSize) => {
    try {
      let values = form.getFieldsValue();
      run({ current, pageSize }, values)
    } catch (error) {

    }
  }
  const onExport = useCallback(() => {

  }, [totalLog])
  const toDetailIndicators = () => {
    window.open('/detailIndicators', '_blank')
  }
  useEffect(() => {
    setCustview(<CustView />);
    // return () => {
    //   setCustview(undefined)
    // }
  }, [])
  useEffect(() => {
  }, [, projectId, pageLog, paramsLog.pageSize])
  return (
    <div className={style.quotaAlarmsContent}>
      <div className={style.AlarmsContent}>
        <div className={style.AlarmsContentLeft}>
          {alarmAllData.map((item, index) => (
            <div className={style.Alarmsitem} onClick={() => changeAlarm(item)} style={{ color: activeTab == item.id ? '#fff' : '', background: activeTab == item.id ? '#ff3333' : '', border: activeTab == item.id ? 'none' : '' }}>
              <div className={style.Alarmsadress}>
                {activeTab == item.id ? <img src={alarmSelectedIcon} className={style.alarmIcon} /> :
                  <img src={alarmIcon} className={style.alarmIcon} />}
                {item.id == 0 ? t("AllAlarms") : item.address}
              </div>
              <div className={style.Alarmsnum}>
                {t("QuotaAlarm")} <span className={style.num}>{item.num}</span>
                <CaretRightOutlined className={style.rightIcon} style={{ color: activeTab == item.id ? '#fff' : '#ccc' }} />
              </div>

            </div>
          ))}
        </div>
        <div className={style.AlarmsContentRight}>
          {isCard ? (
            <div className={style.cardData}>
              {
                quotaDetailed.map((item, index) => (
                  <div className={style.cardBox} key={index} onClick={() => toDetailIndicators()}>
                    <div className={style.cardTop}>
                      <span>{item.address}  {item.floor}  {item.house}</span>
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
                          <span>{item.quota}</span>
                          <span>{item.useQuota}</span>
                          <span>{item.residueQuota}</span>
                        </div>
                        <div className={style.percent}>
                          <span>{t("RemainingEnergyConsumption")}</span>
                          <ProgressBoX>
                            <Progress
                              percent={item.percent}
                              className={`${item.percent > 20 ? '' : 'progressColor'}`}
                              trailColor='#ebeef5'
                              strokeColor={`${item.percent > 20 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
                              style={{ marginLeft: 10, width: 170 }}
                              strokeWidth={15} /></ProgressBoX>
                        </div> </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className={style.listData}>
              <Usetable columns={columns} ref={tableLoadRef} dataSource={quotaDetailed} hbg="#ecf5ff" hbc="#515151" rowKey={columns => columns.title} />
            </div>
          )}
          <CPagination style={{ marginLeft: 'auto', width: 'fit-content' }} size="small" onChange={changepage}   {...tableProps.pagination} showSizeChanger={false} />
        </div>
      </div>
    </div>
  )
}
