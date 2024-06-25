import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Space, Radio, Select, Progress, Form } from 'antd';
import { useAntdTable } from "ahooks";
import { ExportExcel } from '@com/useButton'
import style from './style.module.less'
import Usetable from '@com/useTable'
import energyImg from '../quota/icon/energyImg.svg'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { CPagination } from "@com/comstyled";
import { selectProjectId } from '@redux/systemconfig.js'
import { useTranslation } from "react-i18next"
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
  let { setCustview } = useOutletContext()
  const [pageLog, setpageLog] = useState(1)
  let [totalLog, setTotalLog] = useState(0)
  const [form] = Form.useForm();
  const { t } = useTranslation("quota")
  const [quotaWarning,setQuotaWarning]=useState(20);
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
        strokeColor={`${percent > quotaWarning ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
        style={{ width: 200 }} />
    },
    {
      title: t("EnergyConsumptionStatus"),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => <div>
        <span style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", backgroundColor: `${status == 1 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}` }}></span>
        <span style={{ marginLeft: 10, color: `${status == 1 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}` }}>{status == 1 ? t("Normal") : t("Alarm")}</span>
      </div>
    },
  ]

  const quotaDetailed = [
    {
      id: 1,
      address: "正泰物联",
      floor: "",
      house: "105",
      status: 1,
      quota: "2000",
      useQuota: "400",
      residueQuota: "1600",
      percent: 80
    },
    {
      id: 2,
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      status: 2,
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 10
    },
    {
      id: 3,
      address: "正泰物联",
      floor: "1号楼",
      house: "105",
      status: 1,
      quota: "2000",
      useQuota: "400",
      residueQuota: "1600",
      percent: 80
    },
    {
      id: 4,
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      status: 1,
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 80
    },
    {
      id: 5,
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      status: 2,
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 7
    },
    {
      id: 6,
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      status: 1,
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 80
    }]
  const buildOptions = [{ value: 0, label: t('Whole') }, { value: 1, label: '1号楼' }, { value: 2, label: '2号楼' }]

  const showSortOptions = [{ value: 1, label: t('PercentageOrder') }, { value: 2, label:  t('PercentageReverseOrder') }, { value: 3, label:  t('Order') }, { value: 4, label:  t('ReverseOrder') }]
  const [modeltype, setModelType] = useState('card')
  const [buildSelected, setBuildSelected] = useState(0)
  const [showSortSelected, setShowSortSelected] = useState(1)
  const CustView = ({ isCard }) => {
    return (
      <>
        <Form layout="inline">
          <Form.Item name="build">
            <Select options={buildOptions} defaultValue={buildSelected} style={{ width: 188, marginLeft: 16 }} onChange={handleBuildChange}></Select>
          </Form.Item>
          <Form.Item name="percent">
            <Select options={showSortOptions} defaultValue={showSortSelected} style={{ width: 188, marginLeft: 16 }} onChange={handleShowSortChange}></Select>
          </Form.Item>
        </Form>
        {/* <Item  name='areaId' >
        <Select  options={opts}  fieldNames={{label: 'name', value: 'id', options: 'options'}}></Select>
    </Item> */}
        <Space size={16} style={{ marginLeft: "auto" }}>
          <Radio.Group
            onChange={changeTab}
            buttonStyle="solid"
            options={[{ label: t("CardMode"), value: 'card' }, { label: t("ListMode"), value: 'list' }]}
            value={modeltype}
            optionType="button"
          >
          </Radio.Group>
          <ExportExcel disabled={isCard} tb={tableLoadRef} />
        </Space>
      </>

    )
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
  const changeTab = (val) => {
    setModelType(val.target.value)
    setisCard(val.target.value == 'card' ? true : false);
    //  getOverviewData()
  }; //切换卡片列表模式

  const handleBuildChange = (val) => {
    setBuildSelected(val)
  }
  const handleShowSortChange = (val) => {
    setShowSortSelected(val)
  }
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
    setCustview(<CustView isCard={isCard} />);
    return () => {
      setCustview(undefined)
    }
  }, [isCard])
  useEffect(() => {
    // getData();

  }, [, projectId, pageLog, paramsLog.pageSize])

  return (
    <div className={style.quotaDetailContent}>
      {isCard ? (
        <div className={style.cardData}>
          {
            quotaDetailed.map((item, index) => (
              <div className={style.cardBox} key={index} onClick={() => toDetailIndicators()}>
                <div className={style.cardTop}>
                  <span>{item.address}  {item.floor}  {item.house}</span>
                  <span className={`${item.status == 1 ? style.normalStatus : style.LowStatus}`} >{item.status == 1 ? t("NormalEnergyConsumption") : t("InsufficientMargin")}</span>
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
                          className={`${item.percent > quotaWarning ? '' : 'progressColor'}`}
                          trailColor='#ebeef5'
                          strokeColor={`${item.percent > quotaWarning ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
                          style={{ marginLeft: 40, width: 170 }}
                          strokeWidth={15} /></ProgressBoX>
                    </div> </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={style.listData}>
          {/* {...tableProps} */}
          <Usetable columns={columns} ref={tableLoadRef} dataSource={quotaDetailed} hbg="#ecf5ff" hbc="#515151" rowKey={columns => columns.id} />
        </div>
      )}
      <CPagination style={{ marginLeft: 'auto', width: 'fit-content' }} size="small" onChange={changepage}   {...tableProps.pagination} showSizeChanger={false} />
    </div >
  )
}
