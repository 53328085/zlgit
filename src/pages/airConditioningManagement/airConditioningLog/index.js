import React, { useState, useRef, useEffect } from 'react'
import Pagecount from '@com/pagecontent'
import { useAntdTable } from 'ahooks'
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
import BlueColumn from '@com/bluecolumn'
import {
  Radio_Options,
  AirAutomaticControlTableColumns,
  AirManualControlTableColumns,
  AirScheme,
  incontrol
} from "./data";
import moment from 'moment'
import { Container, Header } from "./style";
import UserTable from '@com/useTable'

const { RangePicker } = DatePicker;
export default function Index() {
  const [messageApi, contextHolder] = message.useMessage();
  const tableRef = useRef()
  const tableRefs = useRef([])
  const [searchForm] = Form.useForm()
  const { Item } = Form
  const [tabId, setTabId] = useState("1");
  const dataSource = [
    {
      key: '1',
      name: '101会议室空调',
      address: '202303000121',
      location: '1号楼203',
      operation: '开',
      mode: '制冷',
      temp: 26,
      currentTemp: 26,
      operator: 'Admin',
      status: '成功',
      time: '20250101 00:00:00'
    }, {
      key: '2',
      name: '101会议室空调',
      address: '202303000121',
      location: '1号楼203',
      operation: '开',
      mode: '制冷',
      temp: 26,
      currentTemp: 26,
      operator: 'Admin',
      status: '成功',
      time: '20250101 00:00:00'
    }, {
      key: '3',
      name: '101会议室空调',
      address: '202303000121',
      location: '1号楼203',
      operation: '开',
      mode: '制冷',
      temp: 26,
      currentTemp: 26,
      operator: 'Admin',
      status: '成功',
      time: '20250101 00:00:00'
    },
  ]

  const [rangerTime, setRangerTime] = useState([moment().subtract('day', 7), moment()])
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
      messageApi.open({
        type: 'success',
        content: '成功！',
      })
    }

  }
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelectionCheckbox = {

    tableRefs,
    // selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // setSelectedRowKeys(selectedRowKeys)
      tableRefs.current = selectedRows
    },
  }
  const getAirData = ({ current, pageSize }, form = {}) => {
    let { alike, deviceStyle } = form
    console.log(dataSource, "-----AllMeter")
    return {
      list: dataSource,
      total: dataSource.length,
    }
    // let params = { pageNum: current, pageSize, projectId, areaId, gatewayId: 0, state: 0, category: '', deviceStyle, alike: alike.trim() }
    // return Remote.AllMeter(params).then(res => {
    //     let { success, data, total } = res

    //     if (success && Array.isArray(data) && data.length > 0) {
    //         console.log('suceess')
    //         return {
    //             list: data,
    //             total,
    //         }
    //     } else {
    //         return {
    //             list: [],
    //             total: 0,
    //         }
    //     }
    // }).catch(e => {
    //     console.log(e)
    // })

  }

  const { tableProps } = useAntdTable(getAirData, {
    defaultPageSize: 20,
    refreshDeps: [],
  })
  return (
    <Pagecount pd="0" bgcolor="none">
      {contextHolder}
      <Container>
        <Header>
          <Radio.Group
            block
            options={Radio_Options}
            defaultValue="1"
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
          <Form form={searchForm} layout='inline' initialValues={{
            date: [moment().subtract(7, 'day'), moment()],
          }}>
            <Space size={16}>
              <Item label="空调名称" name="deviceStyle" >

                <Input placeholder='请输入空调名称/通信地址' />
              </Item>
              {tabId == 1 ?
                <Item label="空调方案" name="deviceStyle" >

                  <Select
                    style={{ width: "128px" }}
                    onChange={airNameChange}
                    options={AirScheme}
                    defaultValue={'1'}
                  />
                </Item> :
                <Item label="操作人" name="deviceStyle" >

                  <Input placeholder='请输入姓名'
                    style={{ width: "128px" }} />
                </Item>}
              <Item label="控制状态" name="deviceStyle" >

                <Select
                  style={{ width: "128px" }}
                  onChange={airNameChange}
                  options={incontrol}
                  defaultValue={'1'}
                />
              </Item>
              <Item name="date" style={{ marginRight: '0px' }}>
                <RangePicker separator={<>至</>} size="default" style={{ width: 376 }} format="YYYY-MM-DD" onChange={(e) => {
                  setRangerTime([...e])
                }} />
              </Item>
              <Item>
                <CustButtonT text="search" onClick={getAirTable}></CustButtonT>
              </Item>
              <Item>
                <ExportExcel tb={tableRef} />
              </Item>
            </Space>
          </Form>
          <Cdivider type="h" margin="16px 0px" />
          <div className='control'>
            <BlueColumn bg={{ height: 13, width: 3 }}
              name={tabId == 1 ? '空调自动控制记录' : '空调手动控制记录'}></BlueColumn>
            <CustButtonT text="重新控制" onClick={RecontrolAir}></CustButtonT>
          </div>
          <UserTable rowKey={(columns) => columns.key} style={{ marginTop: '16px' }} columns={tabId == 1 ? AirAutomaticControlTableColumns : AirManualControlTableColumns} {...tableProps}
            rowSelection={{
              type: 'checkbox',
              ...rowSelectionCheckbox,
            }} bordered></UserTable>
        </div>
      </Container>
    </Pagecount >
  )
}

