import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
 
import { Image, Form, Space, Button, Input, Select, DatePicker,   Divider, message } from 'antd'
import { useAntdTable, useSetState } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import { selectcurlRommid, selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import {selectUser} from "@redux/user"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {WorkTicketRuntime} from '@api/api'
import { ExportExcel, CustButton } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
 

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
   
  const addref = useRef()
  const [type, setType] = useState(0)
  const [datas, setDatas] = useState([])
  const onAdd =(t) => {
    setType(t)
    addref.current.onOpen()
  }
  const onChange = (e) => {
    setType(e)
    getWorkTickets(e)
  }
  const getWorkTickets = async(type=0) => {
     try {
      let params = {
        projectId,
        areaId,
        switchHouseId: roomId,
        type,
      }
      let {success, data} = await WorkTicketRuntime.GetWorkTickets(params)
      if(success && Array.isArray(data)) {
          setDatas(data)
      }else {
        setDatas([])
      }
     } catch (error) {
       console.log(error)
     }
  } 

  useEffect(() => {
       if([projectId, areaId, roomId].every(e => Number.isInteger(parseInt(e))))  {
        getWorkTickets()
       }
   
  }, [projectId, areaId, roomId ])
  const addprops ={
     type,
     areaId,
     projectId,
     switchHouseId:roomId,
     userId,
     getWorkTickets,
  }
  const columns = [
    {
      title: '工作票类型',
      dataIndex: 'workTicketType',
      key: 'workTicketType',
      align: 'center'
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center'
    },
    {
      title: ' 变电所',
      dataIndex: 'substation',
      key: 'substation',
      align: 'center'
    },
    {
      title: '编号',
      dataIndex: 'no',
      key: 'no',
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
      dataIndex: 'creator',
      key: 'creator',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center'
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      align: 'center'
    },
    {
      title: '审核时间',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'stateStr',
      key: 'stateStr',
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
            <Select style={{width: '200px'}} options={options} value={type} onChange={onChange}></Select>
        </Space>
        <Space>
          <CustButton wh="auto" ghost onClick={() =>onAdd(1)}>新增第一种工作票</CustButton>
          <CustButton wh="auto" ghost onClick={() =>onAdd(2)}>新增第二种工作票</CustButton>
        </Space>
      </div>
       <Usetable columns={columns}  dataSource={datas} hbg="#d3e4fa"  hbc="#515151"  pd="8px 4px" /> 
       <Addticket ref={addref} {...addprops} />
        </Mainbox>
    </Pagecount>
  )
}
