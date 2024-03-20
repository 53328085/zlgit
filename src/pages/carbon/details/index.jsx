import React, { useEffect, useState, useRef, useMemo } from 'react'
import Pagecount from '@com/pagecontent'
import { useSelector } from 'react-redux'
import { Pagination, DatePicker, Form, Select, message, Typography, Button, Space } from 'antd';
import Table from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import styled from 'styled-components'
const { Link } = Typography
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
  const tableRef = useRef() //table
  const columns = [
    { title: '序号', dataIndex: 'key', align: "center", width: 96, fixed: 'left', },
    { title: '企业名称', dataIndex: 'enterpriseName', align: "center", fixed: 'left', },
    { title: '组织机构代码', dataIndex: 'code', align: "center", fixed: 'left', },
    { title: '盘查年度', dataIndex: 'year', align: "center", fixed: 'left', },
    { title: '填报时间', dataIndex: 'wtiteTime', align: "center", width: 160, fixed: 'left', },
    { title: '最新一次填报时间', dataIndex: 'wtiteLatestTime', align: "center", width: 160, fixed: 'left', },
    { title: '监测计划最新版本', dataIndex: 'version', align: "center", width: 160, fixed: 'left', },
    { title: '填报人', dataIndex: 'user', align: "center", width: 96, fixed: 'left', },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          {/* onClick={() => deleteRecord(record)} */}
          <Link underline >编辑</Link>
          <Link underline>生成报告</Link>
          <Link type="danger" underline>删除</Link>
        </Space>
      ),
    },
  ];
  const dataSource = [
    {
      key: '1',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"
    },
    {
      key: '2',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"
    },
    {
      key: '3',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"

    },
    {
      key: '4',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"
    },
    {
      key: '5',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"

    },
    {
      key: '6',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"
    },
    {
      key: '7',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"

    },
    {
      key: '8',
      enterpriseName: '正泰物联技术',
      code: "440411234567",
      year: '2023',
      wtiteTime: '2023-07-01 14:52:25',
      wtiteLatestTime: '2023-07-01 14:52:25',
      version: 'V2023-2.6',
      user: "Admin"
    },
  ];
  const onExport = () => {

  }
  return (
    <div style={{ flex: 1, display: "flex", justifyContent: 'center', alignContent: 'center' }}>
      <Pagecount bgcolor="#eeeff3" pd={0}>

        <Tablediv>
          <div className='title'>
            <BlueColumn>碳排放数据表</BlueColumn>
            <Button type='primary' style={{ position: 'absolute', right: 16 }}>+碳排放监测计划填报</Button>
            {/* <ExportExcel /> */}
          </div>
          {/* onExport={onExport} */}
          <Table columns={columns} rowKey={(columns) => columns.key} dataSource={dataSource} className='tableclass'
            pagination={{
              pageSize: 5,
            }}
          ></Table>
        </Tablediv>
      </Pagecount>
    </div>
  )
}
