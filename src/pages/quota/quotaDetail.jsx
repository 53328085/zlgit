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
  const columns = [
    {
      title: '房间名称',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      render: (text, record) => (
        <span>{record.address != '' ? record.address : '/'}-{record.floor != '' ? record.floor : '/'}-{record.house != '' ? record.house : '/'}</span>
      ),
    },
    {
      title: '能耗定额 (kWh)',
      dataIndex: 'quota',
      key: 'quota',
      align: 'center',
    },
    {
      title: '已用能耗 (kWh)',
      dataIndex: 'useQuota',
      key: 'useQuota',
      align: 'center'
    },
    {
      title: '剩余能耗 (kWh)',
      dataIndex: 'residueQuota',
      key: 'residueQuota',
      align: 'center'
    },
    {
      title: '能耗剩余量比例',
      dataIndex: 'percent',
      key: 'percent',
      align: 'center',
      render: (percent) => <Progress
        percent={percent}
        trailColor='#ebeef5'
        strokeColor={`${percent > 20 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
        style={{ width: 200 }} />
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => <div>
        <span style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", backgroundColor: `${status == 1 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}` }}></span>
        <span style={{ marginLeft: 10, color: `${status == 1 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}` }}>{status == 1 ? '正常' : '告警'}</span>
      </div>
    },
  ]

  const quotaDetailed = [
    {
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
      address: "正泰物联",
      floor: "2号楼",
      house: "102",
      status: 1,
      quota: "2000",
      useQuota: "600",
      residueQuota: "1400",
      percent: 80
    }]
    const opts=[{name:'全部',id:1},{name:'1号楼',id:2},{name:'2号楼',id:3}]
    const tbref =useRef()
    const CustView =()=> (
      <>
      <Form layout="inline">
        <Form.Item name="build">
        <Select  options={opts} defaultValue={1} fieldNames={{label: 'name', value: 'id'}} style={{width: 188,marginLeft: 16}}></Select>
        </Form.Item>
        <Form.Item name="percent">
        <Select  options={opts} defaultValue={1} fieldNames={{label: 'name', value: 'id'}} style={{width: 188,marginLeft: 16}}></Select>
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
    setCustview(<CustView/>);
    return () => {
      setCustview(undefined)
    }
  }, [])
  useEffect(() => {
    // getData();

  }, [, projectId, pageLog, paramsLog.pageSize])
  return (
    <div className={style.quotaDetailContent}>
      <Space size={16} style={{ marginLeft: "auto", marginTop: -100 }}>
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

        {/* <ExportExcel disabled={isCard} tb={tableLoadRef} /> */}
      </Space>
      {isCard ? (
        <div className={style.cardData}>
          {
            quotaDetailed.map((item, index) => (
              <div className={style.cardBox} key={index} onClick={() => toDetailIndicators()}>
                <div className={style.cardTop}>
                  <span>{item.address}  {item.floor}  {item.house}</span>
                  <span className={`${item.status == 1 ? style.normalStatus : style.LowStatus}`} >{item.status == 1 ? '能耗正常' : '余量不足'}</span>
                </div>
                <div className={style.cardCenter}>
                  <img src={energyImg} className={style.energyImg} />
                  <div className={style.cardCInfo}>
                    <div className={style.name}>
                      <span>定额 (kWh)</span>
                      <span>已用 (kWh)</span>
                      <span>剩余 (kWh)</span>
                    </div>
                    <div className={style.num}>
                      <span>{item.quota}</span>
                      <span>{item.useQuota}</span>
                      <span>{item.residueQuota}</span>
                    </div>
                    <div className={style.percent}>
                      <span>能耗剩余量</span>
                      <ProgressBoX>
                        <Progress
                          percent={item.percent}
                          className={`${item.percent > 20 ? '' : 'progressColor'}`}
                          trailColor='#ebeef5'
                          strokeColor={`${item.percent > 20 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
                          style={{ marginLeft: 10, width: 300 }}
                          strokeWidth={15} /></ProgressBoX>
                    </div> </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={style.listData}>
          {/* {...tableProps} */}
          <Usetable columns={columns} ref={tableLoadRef} dataSource={quotaDetailed} hbg="#ecf5ff" hbc="#515151" rowKey={columns => columns.title} />
        </div>
      )}
      <CPagination style={{ marginLeft: 'auto', width: 'fit-content' }} size="small" onChange={changepage}   {...tableProps.pagination} showSizeChanger={false} />
    </div >
  )
}
