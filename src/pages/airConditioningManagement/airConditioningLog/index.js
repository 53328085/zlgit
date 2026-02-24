import React, { useState, useRef, useEffect, useCallback } from 'react'
import Pagecount from '@com/pagecontent'
import { useAntdTable } from 'ahooks'
import CModal from '@com/useModal'
import { CustButtonT, ExportExcel } from "@com/useButton";
import {
  Form,
  Select,
  DatePicker,
  Radio,
  Input,
  message,
  Space,
} from "antd";
import { Cdivider } from "@com/comstyled"
import styled from 'styled-components'
import Titlelayout from "@com/titlelayout";
import Cempty from '@com/useEmpty'
import { useSelector } from "react-redux"
import { selectProjectId } from "@redux/systemconfig"
import {
  Radio_Options,
  AirAutomaticControlTableColumns,
  AirManualControlTableColumns,
  incontrol
} from "./data";

import { usePage, useDetail, useList, useSetReControl } from "./api.js";
import moment from 'moment'
import { Container, Header, TitleBox } from "./style";
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
           line-height: 28px;
           white-space: pre-line;
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
  const [selectedTableRows, setSelectedTableRows] = useState([]); // 存储选中的行数据
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
  }]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 新增状态
  const schemeModalState = useRef(false); // 记录是否是第一次打开
  const [rangerTime, setRangerTime] = useState([moment().subtract(2, 'months'), moment()])

  // 清空选中状态的函数
  const clearSelectedRows = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedTableRows([])
  }, []);

  const airNameChange = () => {

  }

  const handleRadioChange = (e) => {
    setTabId(e.target.value);
    clearSelectedRows(); // 只在切换tab时清空选中状态
  }

  const RecontrolAir = () => {
    if (selectedRowKeys.length === 0) { // 使用状态判断
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
    selectedRowKeys,
    preserveSelectedRowKeys: true, // 关键配置：跨页/查询时保留选中的 rowKey
    onChange: (currentSelectedKeys, currentSelectedRows) => {
      console.log("当前选中Keys:", currentSelectedKeys, "当前选中Rows:", currentSelectedRows);
      setSelectedRowKeys(currentSelectedKeys);
      setSelectedTableRows(currentSelectedRows); // 同步更新选中行数据
    },

    // getCheckboxProps: record => ({
    //   disabled: record.resultDesc === '成功', // Column configuration not to be checked
    // }),
  }

  const getAirData = async ({ current, pageSize }, formDate) => {
    try {
      let params = {
        pageNum: current,
        pageSize,
        projectId,
        type: tabId,
        alike: formDate.alike,
        schemeId: formDate.scheme,
        operater: formDate.operator,
        result: formDate.status,
        dtStart: formDate.operatorTime && formDate.operatorTime[0] ? moment(formDate.operatorTime[0]).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00'),
        dtEnd: formDate.operatorTime && formDate.operatorTime[1] ? moment(formDate.operatorTime[1]).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59'),
      }
      let { data, success, total, errMsg } = await usePage({}, params)
      if (success && Array.isArray(data) && data.length) {
        // 移除这里的清空选中状态逻辑，保持选中状态
        pageTotal.current = total
        return {
          list: data,
          total,
        }
      } else {
        // 移除这里的清空选中状态逻辑，保持选中状态
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
    setSchemeModalId(record.schemeId)
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
    console.log(selectedTableRows)
    try {
      const newArray = selectedTableRows.map(item => ({
        conditionerId: item.conditionerId,
        ioState: item.ioState ? item.ioState : 1,
        workMode: item.workMode ? item.workMode : 1,
        windSpeed: item.windSpeed ? item.windSpeed : 1,
        temperature: item.temperature
      }));
      const { data, success, errMsg } = await useSetReControl({},
        { projectId, conditions: newArray })
      if (success) {
        let values = searchForm.getFieldsValue();
        run({ current: 1, pageSize: 20 }, values)// 重新查询表格
        clearSelectedRows(); // 控制成功后清空选中
        message.success('所选空调控制成功')
      } else {
        message.error(errMsg);
      }
    } catch {
    }
    controlRef.current.onCancel()
  }

  const getSchemeList = async () => {
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
    const formDate = searchForm.getFieldValue()
    let params = {
      pageNum: 1,
      pageSize: pageTotal.current,
      projectId,
      type: tabId,
      alike: formDate.alike,
      schemeId: formDate.scheme,
      operater: formDate.operator,
      result: formDate.status,
      dtStart: formDate.operatorTime && formDate.operatorTime[0] ? moment(formDate.operatorTime[0]).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00'),
      dtEnd: formDate.operatorTime && formDate.operatorTime[1] ? moment(formDate.operatorTime[1]).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59'),
    }
    return usePage({}, params).then((res) => {
      let { success, data, total } = res;
      if (success && Array.isArray(data)) {
        return {
          list: data,
          total,
        };
      } else {
        if (!success) message.warning(errMsg || "接口出错");
        return {
          list: [],
          total: 0,
        };
      }
    });
  }, [pageTotal.current])
  const controlTitle = (
    <TitleBox>
      <span>{tabId == 0 ? '空调自动控制记录' : '空调手动控制记录'}</span>
     {tabId==1 && <CustButtonT text="重新控制" onClick={RecontrolAir}></CustButtonT>} 
    </TitleBox>
  );
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
            onChange={handleRadioChange} // 使用修改后的处理函数
          />
          <Form form={searchForm} layout='inline' colon={false}
            initialValues={{
              alike: '',
              scheme: 0,
              operator: '',
              status: 0,
              operatorTime: rangerTime
            }}
          >
            <Space size={16} style={{ marginLeft: '16px' }}>
              <Item label="关键字" name="alike" >
                <Input style={{ width: "200px" }} placeholder='请输入设备名称/通信地址' allowClear />
              </Item>
              <Item name="operator" hidden>
                <Input type="hidden" />
              </Item>
              {tabId == 0 ?
                <Item label="空调方案" name="scheme" >
                  <Select
                    style={{ width: "160px" }}
                    onChange={airNameChange}
                    options={airSchemeList}
                  />
                </Item> :
                <Item label="操作人" name="operator">
                  <Input style={{ width: "160px" }} placeholder='请输入姓名' allowClear />
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
        </Header>
        <Titlelayout
          layout="flex"
          title={controlTitle}
          dr="column" bordered
        >
          <UserTable ref={tableRef} sheetName={tabId == 0 ? '空调自动控制记录' : '空调手动控制记录'} onExport={onExport} rowKey={(columns) => columns.id} columns={tabId == 0 ? AirAutomaticControlTableColumns({ OpenAirScheme: handleOpenAirScheme }) : AirManualControlTableColumns} {...tableProps}
            rowSelection={{
              type: 'checkbox',
              ...rowSelectionCheckbox,
            }} bordered
            scroll={{ y: 520 }}></UserTable>
        </Titlelayout>
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
                          {e?.weeks?.map?.(time => <div key={time} className="daybox">{getweek.get(time)}</div>)}
                        </div>
                      </div>
                      <div className="titleName">方案内容</div>
                      {e.contentInfo.map?.(info => <div className="schemeName">
                        <div className="schemeTitle">{info.content}</div>
                        <div className="con">{info.description}</div>
                      </div>)}
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
          是否确认{tabId == 0 ? '自动' : '手动'}控制所选空调？
        </CModal>
      </Container>
    </Pagecount >
  )
}