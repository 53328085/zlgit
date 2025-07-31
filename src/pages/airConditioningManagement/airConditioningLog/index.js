import React, { useState, useRef, useEffect, useCallback } from 'react'
import Pagecount from '@com/pagecontent'
import { useAntdTable } from 'ahooks'
import CModal from '@com/useModal'
import { CustButtonT, ExportExcel, ChartList } from "@com/useButton";
import {
  Form,
  Select,
  DatePicker,
  Radio,
  Input,
  message,
  Divider,
  Button,
  ConfigProvider,
  Space,
} from "antd";
import { Cspin, Cdivider } from "@com/comstyled"
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import Cempty from '@com/useEmpty'
import { useSelector } from "react-redux"
import { selectProjectId } from "@redux/systemconfig"
import {
  Radio_Options,
  AirAutomaticControlTableColumns,
  AirManualControlTableColumns,
  incontrol
} from "./data";

import { usePage, useDetail, useList, useSetControl } from "./api.js";
import moment from 'moment'
import { Container, Header } from "./style";
import UserTable from '@com/useTable'

const { RangePicker } = DatePicker;
const ModalBoX = styled.div`
.titleTip{
      font-weight: bold;
      margin-bottom: 16px;
}
.control{
.desc {
      overflow-y: scroll;
      height: 300px;
      border-radius: 5px;
       display: flex;
       flex-direction: column;
       flex:1;
       margin-bottom: 16px;
       .item {
         .title {
           display: flex;
           align-items: center;
           height: 34px;
           background-color: rgba(236, 245, 255, 1);
           color:#515151;
           padding-left: 8px;
         }
           .titleName{
           color:var(--ant-primary-color);
           margin:6px 0px;
           padding-left: 8px;
          
           }
           .time{
           padding:15px 8px;
           border-radius: 3px;
           background-color: rgba(247, 251, 254, 0.752941176470588);
           border: none;
           .day{
           display: flex;
           .daybox{
           width: 46px;
           height: 22px;
           border-radius: 4px;
           border:1px solid rgba(81, 81, 81, 1);
           text-align: center;
           margin-right: 10px;
           }
           }
           }
           .schemeName{
           display: flex;
           lign-items: center;
           margin-bottom: 10px;
           .schemeTitle{
           font-weight: bold;
           padding-left: 8px;
           width: 100px;
           }
            .con{
           margin-left: 8px;
           height: 28px;
           line-height: 28px;

           }
           }
       }
     } 
   
}
    .desc{
     overflow-y: scroll;
      height: 300px;
       display: flex;
       flex-direction: column;
       flex:1;
       .schemeName{
       margin-bottom: 10px;
       .title{
           font-weight: bold;
       }
       
    }
    }
`
export default function Index(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const projectId = useSelector(selectProjectId)
  const tableRef = useRef()
  const tableRefs = useRef([])
  const selectedRowKeys = useRef([])
  const schemeRef = useRef()
  const controlRef = useRef();
  const pageTotal = useRef()
  const [searchForm] = Form.useForm()
  const { Item } = Form
  const [tabId, setTabId] = useState(0);
  const [schemeModalItem, setSchemeModalItem] = useState("");
  const [schemeModalId, setSchemeModalId] = useState();
  const [airSchemeList, setAirSchemeList] = useState([{
    value: 0,
    label: "全部",
  }]); 0
  const schemeModalState = useRef(false); // 记录是否是第一次打开
  const dataSource = [
    {
      key: '1',
      name: '101会议室空调',
      csn: '202303000121',
      address: '1号楼203',
      ioName: '开',
      workModeName: '制冷',
      windSpeedName: '自动',
      temperature: 26,
      ambientTemp: 26,
      sourceName: '方案1',
      resultDesc: '成功',
      time: '20250101 00:00:00',
      app: '泰极付'
    }, {
      key: '2',
      name: '101会议室空调',
      csn: '202303000121',
      address: '1号楼203',
      ioName: '开',
      workModeName: '制冷',
      windSpeedName: '自动',
      temperature: 26,
      ambientTemp: 26,
      sourceName: '方案2',
      resultDesc: '成功',
      time: '20250101 00:00:00',
      app: '正泰电务'
    }, {
      key: '3',
      name: '101会议室空调',
      csn: '202303000121',
      address: '1号楼203',
      ioName: '开',
      workModeName: '制冷',
      windSpeedName: '中速',
      temperature: 26,
      ambientTemp: 26,
      sourceName: '方案3',
      resultDesc: '失败',
      time: '20250101 00:00:00',
      app: '泰极电务'
    },
  ]
  const dataSource2 = [
    {
      key: 1,
      name: '101会议室空调',
      csn: '202303000121',
      address: '1号楼203',
      ioName: '开',
      workModeName: '制冷',
      windSpeedName: '高速',
      temperature: 26,
      ambientTemp: 26,
      sourceName: '方案1',
      resultDesc: '成功',
      time: '20250101 00:00:00'
    }, {
      key: 2,
      name: '101会议室空调',
      csn: '202303000121',
      address: '1号楼203',
      ioName: '开',
      workModeName: '制冷',
      windSpeedName: '自动',
      temperature: 26,
      ambientTemp: 26,
      sourceName: '方案2',
      resultDesc: '成功',
      time: '20250101 00:00:00'
    }, {
      key: 3,
      name: '101会议室空调',
      csn: '202303000121',
      address: '1号楼203',
      ioName: '开',
      workModeName: '制冷',
      windSpeedName: '自动',
      temperature: 26,
      ambientTemp: 26,
      sourceName: '方案3',
      resultDesc: '失败',
      time: '20250101 00:00:00'
    }, , {
      key: 4,
      name: '101会议室空调',
      csn: '202303000121',
      address: '1号楼203',
      ioName: '关',
      workModeName: '制冷',
      windSpeedName: 'dis3',
      temperature: 27,
      ambientTemp: 26,
      sourceName: '方案4',
      resultDesc: '失败',
      time: '20250101 00:00:00'
    },
  ]
  const [rangerTime, setRangerTime] = useState([moment().subtract(2, 'months'), moment()])
  const airNameChange = () => {

  }
  const getAirTable = () => {

  }
  const RecontrolAir = () => {
    console.log(tableRefs.current)
    if (tableRefs.current.length == 0) {
      messageApi.open({
        type: 'warning',
        content: '请至少选择一条记录！',
      })
      return;
    } else {
      controlRef.current.onOpen()
    }

  }
  const rowSelectionCheckbox = {
    tableRefs,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      tableRefs.current = selectedRows
      selectedRowKeys.current = selectedRowKeys
    },
    getCheckboxProps: record => ({
      disabled: record.resultDesc === '成功', // Column configuration not to be checked
    }),
  }
  const getAirData = async ({ current, pageSize }, formDate) => {

    console.log(moment(formDate.operatorTime[0]).format('YYYY-MM-DD 00:00:00'))
    // formDate.operatorTime && formDate.operatorTime[0] ? moment(formDate.operatorTime[0]).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00')
    console.log(dataSource, "-----AllMeter", formDate)
    pageTotal.current = dataSource.length
    // if (tabId == 0) {
    //   return {
    //     list: dataSource,
    //     total: dataSource.length,
    //   }
    // } else if (tabId == 1) {
    //   return {
    //     list: dataSource2,
    //     total: dataSource2.length,
    //   }
    // }
    try {
      let params = {
        pageNum: current,
        pageSize, projectId,
        type: tabId,
        name: formDate.name,
        schemeId: formDate.scheme,
        operater: formDate.operator,
        ioState: formDate.status,
        dtSatrt: formDate.operatorTime && formDate.operatorTime[0] ? moment(formDate.operatorTime[0]).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00'),
        dtEnd: formDate.operatorTime && formDate.operatorTime[1] ? moment(formDate.operatorTime[1]).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00'),
      }
      let { data, success, total, errMsg } = await usePage({}, params)
      if (success && Array.isArray(data) && data.length) {

        pageTotal.current = total
        return {
          list: data,
          total,
        }

      } else {
        pageTotal.current = 0;
        return {
          list: [],
          total: 0,
        }
      }
    } catch (error) {
      pageTotal.current = 0;
    }
  }
  const handleOpenAirScheme = (record) => {
    console.log("打开空调方案", record);
    // 这里添加实际业务逻辑
    schemeModalState.current = true
    setSchemeModalItem(record)
    setSchemeModalId(3)
    schemeRef.current.onOpen()
  };
  const [controlInfos, setControlInfos] = useState([])
  const [savingInfo, setSavingInfo] = useState([])
  const week = [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 0 },
  ]
  const getweek = new Map();
  week.forEach(w => {
    getweek.set(w.value, `${w.label}`)
  })
  const getSchemeData = async () => {
    try {
      let { data, success, total } = await useDetail({}, { projectId, schemeId: schemeModalId, pageNum: 1, pageSize: 10 })
      if (success && Array.isArray(data) && data.length) {
        setControlInfos(Array.isArray(data[0].controlInfos) ? data[0].controlInfos : [])
        setSavingInfo(Array.isArray(data[0].savingInfo) ? data[0].savingInfo : [])

      } else {
        setControlInfos([])
        setSavingInfo([])
      }
    } catch (error) {

    }
  }
  const handleClose = () => {
    schemeRef.current.onCancel()
    schemeModalState.current = false
  };

  const onOkControl = async () => {
    // try {
    //   let params = {
    //     projectId,
    //     ioState: controlParams.ioState ? controlParams.ioState : 1,
    //     workMode: controlParams.workMode ? controlParams.workMode : 1,
    //     windSpeed: controlParams.windSpeed ? controlParams.windSpeed : 0,
    //     temperature: controlParams.temperature ? controlParams.temperature : 24,
    //     csn:  selectedRowKeys.current
    //   }
    //   let { data, success, errMsg } = await useSetControl({}, params)
    //   if (success) {
    //     message.success('所选空调控制成功')
    //     handleSearchClick()
    //   } else {
    //     message.error(errMsg);
    //   }
    // } catch {


    // }

    messageApi.open({
      type: 'success',
      content: '成功！',
    })
    controlRef.current.onCancel()
  }
  const getSchemeList = async () => {
    console.log(useList, useDetail)
    try {
      let alike = ''
      let { success, data, errMsg } = await useList({
        projectId,
        alike,
      });
      if (success && Array.isArray(data) && data.length) {
        let list = []
        data.map((item) => {
          list.push({
            value: item.id,
            label: item.name,
          })
        })
        setAirSchemeList([{
          value: 0,
          label: "全部",
        }, ...list])
      } else {
        setAirSchemeList([])
        if (!success) {
          return Promise.reject(errMsg)
        } else {
          setAirSchemeList([])
        }

      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const { tableProps, refresh, run, search } = useAntdTable(getAirData, {
    form: searchForm,
    defaultPageSize: 20,
    refreshDeps: [tabId],
  })
  const { submit } = search
  const onExport = useCallback(() => {
    return getAirData({ current: 1, pageSize: pageTotal.current })
  }, [])
  useEffect(() => {
    getSchemeList();
  }, [])
  useEffect(() => {
    if (!schemeModalState.current) return;
    getSchemeData()
  }, [schemeModalState.current, schemeModalId])
  return (
    <Pagecount pd="0" bgcolor="none">
      {contextHolder}
      <Container>
        <Header>
          <Radio.Group
            block
            options={Radio_Options}
            defaultValue={0}
            optionType="button"
            buttonStyle="solid"
            size="large"
            onChange={(e) => {
              setTabId(e.target.value);
              tableRefs.current = []
            }}
          />
        </Header>
        <div className='content'>
          <Form form={searchForm} layout='inline' colon={false}
            initialValues={{
              name: '',
              scheme: 0,
              operator: '',
              status: 0,
              operatorTime: rangerTime
            }}
          >
            <Space size={16}>
              <Item label="空调名称" name="name" >
                <Input style={{ width: "260px" }} placeholder='请输入空调名称/通信地址' />
              </Item>
              <Item name="operator" hidden>
                <Input type="hidden" />
              </Item>
              {tabId == 0 ?
                <Item label="空调方案" name="scheme" >
                  <Select
                    style={{ width: "148px" }}
                    onChange={airNameChange}
                    options={airSchemeList}
                  />
                </Item> :
                <Item label="操作人" name="operator">
                  <Input style={{ width: "128px" }} placeholder='请输入姓名' />
                </Item>}
              <Item label="控制状态" name="status" >
                <Select
                  style={{ width: "128px" }}
                  onChange={airNameChange}
                  options={incontrol}
                />
              </Item>
              <Item label="操作时间" name="operatorTime" style={{ marginRight: '0px' }}>
                <RangePicker separator={<>至</>} size="default" style={{ width: 376 }} format="YYYY-MM-DD" onChange={(e) => {
                  setRangerTime([e[0], e[1]])
                }} />
              </Item>
              <Item>
                <CustButtonT text="search" onClick={submit}></CustButtonT>
              </Item>
              <Item>
                <ExportExcel tb={tableRef} />
              </Item>
            </Space>
          </Form>
          <Cdivider type="h" />
          <div className='control'>
            <BlueColumn bg={{ height: 13, width: 3 }}
              name={tabId == 0 ? '空调自动控制记录' : '空调手动控制记录'}></BlueColumn>
            <CustButtonT text="重新控制" onClick={RecontrolAir}></CustButtonT>
          </div>
          <UserTable ref={tableRef} sheetName={tabId == 0 ? '空调自动控制记录' : '空调手动控制记录'} onExport={onExport} rowKey={(columns) => columns.key} columns={tabId == 0 ? AirAutomaticControlTableColumns({ OpenAirScheme: handleOpenAirScheme }) : AirManualControlTableColumns} {...tableProps}
            rowSelection={{
              type: 'checkbox',
              ...rowSelectionCheckbox,
            }} bordered></UserTable>
        </div>
        <CModal
          title={(
            <div>{schemeModalItem.sourceName}</div>
          )}
          className="modal"
          mold="cust"
          width={820}
          ref={schemeRef}
          closable={true}
          onCancel={handleClose}
          bodyStyle={{ paddingLeft: 52 }}
          footer={[]}
          destroyOnClose={false}
        >
          <ModalBoX>
            <div className='titleTip'>— 控制方案 —</div>
            <div className='control'>
              {controlInfos.length != 0 ?
                <div className="desc">
                  {
                    controlInfos?.map?.(e => <div className="item">
                      <div className="title">{e.name}</div>
                      <div className="titleName">时间区间</div>
                      <div className="time">
                        <div>{e.desc}</div>
                        <div className="day">
                          {e.weeks.map?.(time => <div key={time} className="daybox">{getweek.get(time)}</div>)}
                        </div>
                      </div>
                      <div className="titleName">方案内容</div>
                      {e.contentInfo.map?.(info => <div className="schemeName"><div className="schemeTitle">{info.content}</div>{info.description}</div>)}
                    </div>)
                  }
                </div> : <div style={{ height: '300px', display: 'flex' }}><Cempty tip='暂无数据' /></div>}
            </div>
            <Cdivider type="h" margin="16px 0px" />
            <div className='titleTip'>— 节能方案 —</div>
            {savingInfo.length != 0 ?
              <div className="desc">
                {savingInfo.map?.(e => <div className="schemeName"><div className="title">{e.content}</div>{e.description}</div>)}
              </div>
              : <div style={{ height: '300px', display: 'flex' }}><Cempty tip='暂无数据' /></div>}
          </ModalBoX>
        </CModal>
        <CModal title={tabId == 0 ? '自动控制空调' : '手动控制空调'} ref={controlRef} width={512} warnimg={true} mold="cust" type="question" onOk={onOkControl} >
          是否确认重新{tabId == 0 ? '自动' : '手动'}控制所选空调？
        </CModal>
      </Container>
    </Pagecount >
  )
}

