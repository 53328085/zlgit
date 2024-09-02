import React, {useRef, useState} from 'react'
import styled from 'styled-components'
 
import { Image, Form, Space, Button, Input, Select, DatePicker,   Divider, message } from 'antd'
import { useAntdTable, useSetState } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import { selectcurlRommid, selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import {selectUser} from "@redux/user"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { OperationLogRuntime, distributionRoom, DistributionRoomRuntime } from '@api/api'
import { ExportExcel, CustButton } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation,Link  } from 'react-router-dom'
import {Serach, Cdivider, Borderleft} from "@com/comstyled"

import Pagecount from "@com/pagecontent";
import Addticket from './addticket'
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .custTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px dotted #d7d7d7;
  }
`
const options = [
  {label: '全部工作票', value: 0},
  {label: '第一种工作票', value: 1},
  {label: '第二种工作票', value: 2}
]
 
export default function Index() {
  const areaId = useSelector(selectOneLevelDefaultId)
  const projectId = useSelector(selectProjectId)
  const roomId = useSelector(selectcurlRommid)
  const {userId} = useSelector(selectUser)
  console.log(userId)
  const addref = useRef()
  const [type, setType] = useState(1)
  const onAdd =(t) => {
    setType(t)
    addref.current.onOpen()
  }
  const addprops ={
     type,
     areaId,
     projectId,
     switchHouseId:roomId,
     userId,
  }
  const columns = [
    {
      title: '工作票类型',
      dataIndex: 'alarmTime',
      key: 'alarmTime',
      align: 'center'
    },
    {
      title: '单位',
      dataIndex: 'level',
      key: 'level',
      align: 'center'
    },
    {
      title: ' 变电所',
      dataIndex: 'alarmEvent',
      key: 'alarmEvent',
      align: 'center'
    },
    {
      title: '编号',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '任务内容',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    },
    {
      title: '创建人',
      dataIndex: 'sn',
      key: 'sn',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'category',
      key: 'category',
      align: 'center'
    },
    {
      title: '审核人',
      dataIndex: 'category1',
      key: 'category1',
      align: 'center'
    },
    {
      title: '审核时间',
      dataIndex: 'category2',
      key: 'category2',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center'
    },
    {
      title: '流程操作',
      dataIndex: 'op',
      key: 'op',
      align: 'center'
    },
  ]
  return (
    <Pagecount>
      <Mainbox>
      <div className='custTitle'>
        <Space>
            <span>任务状态</span>
            <Select style={{width: '200px'}} options={options}></Select>
        </Space>
        <Space>
          <CustButton wh="auto" ghost onClick={() =>onAdd(1)}>新增第一种工作票</CustButton>
          <CustButton wh="auto" ghost onClick={() =>onAdd(2)}>新增第二种工作票</CustButton>
        </Space>
      </div>
       <Usetable columns={columns}  dataSource={[]}  /> 
       <Addticket ref={addref} {...addprops} />
        </Mainbox>
    </Pagecount>
  )
}
