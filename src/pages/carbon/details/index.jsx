import React, { useEffect, useState, useRef, useMemo } from 'react'
import Pagecount from '@com/pagecontent'
import { useSelector } from 'react-redux'
import { Radio, DatePicker, Form, Select, message, Button } from 'antd';
import Table from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import styled from 'styled-components'
import { ExportExcel } from '@com/useButton'
const Tablediv = styled.div`
border: 1px solid #d7d7d7;
border-radius: 4px;
padding: 16px;
background-color: #fff;
width: 1678px;
flex: 1;
position: relative;
.title{
  display: flex;
  justify-content: space-between;
}
.tableclass{
  margin-top: 16px;
  thead  .ant-table-cell{
    background-color: ${props => props.theme.primaryColor} ;
    color: #fff;
  }
}
`
export default function Index() {
  const [form] = Form.useForm()
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  const changeArea = () => {

  }

  const [datetype, setDateType] = useState(1)
  const dateColumns = useMemo(() => {
    let len = 30;
    let unit = '日'
    let arr = []
    if (datetype == 1) {
      const date = new Date()
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);
      len = date.getDate();
      unit = '日'
    } else if (datetype == 2) {
      len = 12;
      unit = '月'
    } else {
      message.error('日期类型错误')
      return
    }


    for (let i = 0; i < len; i++) {
      arr.push({
        title: (i + 1) + unit,
        dataIndex: i + 1,
        align: 'center',
        width: 100,
      })


    }
    return arr
  }, [datetype])
  const changeDate = (e) => {
    setDateType(e.target.value)
  }
  const columns = [
    // { title: '排放类型', dataIndex: 'name', align: "center", width:96, fixed: 'left', },
    // { title: '排放活动', dataIndex: 'name', align: "center", width:160, fixed: 'left', },
    // { title: '排放源', dataIndex: 'name', align: "center", width:96, fixed: 'left', },
    // { title: '单位名称', dataIndex: 'name', align: "center", width:96, fixed: 'left', },
    // { title: '年度碳排放量(tCO₂)', dataIndex: 'name', align: "center",width:160 , fixed: 'left', },
    // ...dateColumns
    { title: '序号', dataIndex: 'index', align: "center", width: 96, fixed: 'left', },
    { title: '企业名称', dataIndex: 'name', align: "center", width: 160, fixed: 'left', },
    { title: '组织机构代码', dataIndex: 'name', align: "center", width: 96, fixed: 'left', },
    { title: '盘查年度', dataIndex: 'name', align: "center", width: 96, fixed: 'left', },
    { title: '填报时间', dataIndex: 'name', align: "center", width: 160, fixed: 'left', },
    { title: '最新一次填报时间', dataIndex: 'name', align: "center", width: 160, fixed: 'left', },
    { title: '监测计划最新版本', dataIndex: 'name', align: "center", width: 160, fixed: 'left', },
    { title: '填报人', dataIndex: 'name', align: "center", width: 96, fixed: 'left', },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          {/* onClick={() => deleteRecord(record)} */}
          <Link underline >编辑</Link>
          <Link underline>生成报告</Link>
          <Link type="danger" underline>删除</Link>
        </Space>
      ),
    },
  ]
  const onExport = () => {

  }
  return (
    <div style={{ flex: 1, display: "flex", justifyContent: 'center', alignContent: 'center' }}>
      <Pagecount bgcolor="#eeeff3" pd={0}>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout='inline'
            initialValues={{
              report: 1
            }}
          >
            <Form.Item label={oneLevel[0]?.levelName} style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length > 0 ? 0 : null}></Select>
            </Form.Item>
            <Form.Item style={{ marginLeft: 350 }} name="report">
              <Radio.Group onChange={changeDate}>
                <Radio value={1}>月报表</Radio>
                <Radio value={2}>年报表</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="时间选择" name="date">
              <DatePicker picker={datetype === 1 ? 'month' : 'year'}></DatePicker>
            </Form.Item>
            <Button type='primary' style={{position: 'absolute',right:16  }}>+碳排放监测计划填报</Button>
          </Form>
        </div>
        <Tablediv>
          <div className='title'>
            <BlueColumn>碳排放数据表</BlueColumn>
            <ExportExcel />
          </div>
          <Table columns={columns} onExport={onExport} className='tableclass' scroll={{ x: 'max-content' }}></Table>
        </Tablediv>
      </Pagecount>
    </div>
  )
}
