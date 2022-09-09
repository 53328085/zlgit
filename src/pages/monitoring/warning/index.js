import React from 'react'
import { Form, DatePicker, Select, Button } from 'antd'
import { Warning } from '@api/api.js'
import { useAntdTable, usePagination } from 'ahooks'
import { SearchOutlined } from '@ant-design/icons';
import electricwarn from '@imgs/electricwarn.png'
import firstwarn from '@imgs/firstwarn.png'
import secondwarn from '@imgs/secondwarn.png'
import thirdwarn from '@imgs/thirdwarn.png'
import Card from './card'
import Titlelayout from '@com/titlelayout'
import UserTable from '@com/useTable'
import styled from 'styled-components'
import Column from './columns'
const Containerdiv = styled.div`
  display:flex
`
export default function Index() {
  const tabs = []
  const [form] = Form.useForm()
  const { Item } = Form
  const { RangePicker } = DatePicker
  const { Option } = Select
  let param = {
    projectId: 1,
    region: 0,
    building: 0,
    floor: 0,
    room: 0,
    alike: ''

  }
  const getTableData = async ({ current, pageSize }, formData) => {
    param = { ...param, pageNum: current, pageSize, ...formData }
    const res = await Warning.FindAlikeAccount(param)
    let { success, data, totalNum } = res
    if (success && Array.isArray(data?.data)) {
      return {
        total: totalNum,
        list: data.data
      }

    } else {
      return {
        total: 0,
        list: []
      }
    }
  }
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 12,
  })


  const propsData = {
    tabs,
    form,
    search
  }
  return (
    <div style={{ flex: 1,display: 'flex',flexDirection: 'column' }}>
      <Form
        form={form}
        layout="inline"
        size='default'
        style={{ height: 48, backgroundColor: '#fff', padding: '8px 12px', width: '100%' }}
      >
        <Item label="园区选择">
          <Select
            placeholder="Select a option and change input text above"
            defaultValue="1"
            style={{ width: 320 }}
          >
            <Option value="1">滨江园区</Option>
            <Option value="2">温州园区</Option>
          </Select>
        </Item>
        <Item label="园区选择">
          <RangePicker style={{ width: 376 }} />
        </Item>
        <Item>
          <Button type="primary" icon={<SearchOutlined />} style={{ width: 96, height: 32 }}>查询</Button>
        </Item>
        <Item style={{ marginRight: 0, marginLeft: 'auto', }}>
          <Button style={{ width: 96, height: 32 }} >导出</Button>
        </Item>
      </Form>
      <Containerdiv >
        <Card title="告警总数" value="2300" imgurl={electricwarn} />
        <Card title="一级告警" value="100" imgurl={firstwarn} />
        <Card title="二级告警" value="200" imgurl={secondwarn} />
        <Card title="三级告警" value="300" imgurl={thirdwarn} />
      </Containerdiv>
      <Titlelayout title="日志查询">
        <UserTable columns={Column} style={{marginTop: 16}}></UserTable>
      </Titlelayout>
    </div>

  )
}
