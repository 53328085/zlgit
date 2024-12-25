import React, { useState, useEffect } from 'react'
import Pagecont from "@com/pagecontent"
import styled from "styled-components";
import { Space, Select, Divider, message, Button, InputNumber, Input, Form ,Typography} from "antd";
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import { SpareParts,distributionRoom } from '@api/api.js'
import Usetable from '@com/useTable'
import CModal from '@com/useModal'

import { use } from 'i18next';
const {Link} = Typography
const Title = styled.div`
    &&{
     border: 1px solid #d7d7d7;
     padding: 10px 16px;
     border-radius: 4px;
     background-color: #fff;
     height: 48px;
     margin-bottom: 16px;
     .text {
      display: inline-block;
      border-left: 4px solid ${props => props.theme.primaryColor};
      color: #515151;
      padding-left: 16px;
     }
    
      }
   
`
const Content = styled.div` 
  && {
    width: 100%;
    height: 100%;
    padding: 16px;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    background-color: #fff;
 }
`

export default function Index() {
  const projectId = useSelector(selectProjectId)
  const levelone = useSelector(selectOneLevel)
  const allOption = { name: '全部园区', id: 0 };
  // 合并“全部”选项到原始选项列表
  const allOptions = allOption ? [allOption, ...levelone] : levelone;
  const [roomList, setroomList] = useState([])
  const [roomList1, setroomList1] = useState([])
  const [areaId, setareaId] = useState(0)
  const [defalutType, setdefalutType] = useState(0)
  const [defalutroom, setdefalutroom] = useState(0)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [Ctitle, setCtitle] = useState('新增')
  const [apiform] = Form.useForm()

  const onChange = (value) => {
      setareaId(value)
  }
  const onChangeRoom = (value) => {
      setdefalutroom(value)
  }

  const onChangeType = (value) => {
      setdefalutType(value)
  }
  const getRoomList = () => {
    distributionRoom.RoomList(projectId, areaId).then(res => {
      if (res.success && res.data) {
        let allRoom = { name: '全部配电房', id: 0 }
        setroomList([allRoom, ...res.data])
        setroomList1(res.data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const [typeList, settypeList] = useState([
    { id: 1, name: '通用件/标准件' },
    { id: 2, name: '易损件' },
    { id: 3, name: '电气备件' },
    { id: 4, name: '关键备件' },
  ])
  const [typeList1, settypeList1] = useState([
    { id: 0, name: '全部类型' },
    { id: 1, name: '通用件/标准件' },
    { id: 2, name: '易损件' },
    { id: 3, name: '电气备件' },
    { id: 4, name: '关键备件' },
  ])
  const columns = [
    {
      title: '园区',
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center'
    },
    {
      title: '配电房',
      dataIndex: 'roomName',
      key: 'roomName',
      align: 'center'
    },
    {
      title: '备件类型',
      key: 'type',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.type==1?'通用件/标准件':record.type==2?'易损件':record.type==3?'电气备件':'关键备件'}</span>
        </Space>
      ),
    },
    {
      title: '备件名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    }, {
      title: '当前库存量',
      dataIndex: 'currentCount',
      key: 'currentCount',
      align: 'center'
    }, {
      title: '库存最低标准',
      dataIndex: 'minimumCount',
      key: 'minimumCount',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Link onClick={() => setEdit(record)}>编辑</Link>
          <Link type="danger" onClick={() => setDelete(record)}>删除</Link>
        </Space>
      ),
    },
  ]
  const [spareId,setspareId]=useState(0)

  const setDelete = (it) => {
    console.log(it)
    setspareId(it.id)
    setDeleteModal(true)
  }
  const setEdit = (it) => {
    console.log(it)
    setspareId(it.id)
    apiform.setFieldsValue(it)
    setEditModal(true)
    setCtitle('编辑')
    setdefalutType(1)
  }
  const [pageInfo, setpageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [tabledata, setTabledata] = useState([])
  const changePage = (page, pageSize) => {
    console.log(page)
    setpageInfo(page)
  }
  const deleteOk = () => {
    SpareParts.DeleteSpareParts({projectId,sparePartsId:spareId}).then(res=>{
      if(res.success){
        message.success('删除成功')
        handleDelete()
        getData()
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const editOk = async () => {
    const post = await apiform.validateFields()
    console.log(post)
    if(Ctitle=='新增'){
      SpareParts.AddSpareParts(projectId,post).then(res=>{
        if(res.success){
          message.success('新增成功')
          handleEdit()
          apiform.resetFields()
          getData()
        }else{
          message.error(res.errMsg)
        }
      })
    }else{
      let id=spareId
      post.id = id
      console.log(post)
      SpareParts.UpdateSpareParts(projectId,post).then(res=>{
        if(res.success){
          message.success('编辑成功')
          handleEdit()
          apiform.resetFields()
          getData()
        }else{
          message.error(res.errMsg)
        }
      })
    }
  }
  const handleEdit = () => {
    setEditModal(false)
  }
  const openNewC = () => {
    setEditModal(true)
    setCtitle('新增')
  }
const getData=()=>{
  let params={
    projectId,areaId,roomId:defalutroom,type:defalutType,
    pageNum:pageInfo?.current,
    pageSize:pageInfo.pageSize
  }
  SpareParts.QuerySparePartsList(params).then(res=>{
    if(res.success){
      setTabledata(res.data)
      setpageInfo({
        current: res.pageNum,
        pageSize: res.pageSize,
        total: res.total
      })
    }else{
      message.error(res.errMsg)
    }
})
}

  useEffect(() => {
    getRoomList()
  }, [projectId, areaId])
  useEffect(() => {
    getData()
  }, [areaId,defalutroom,defalutType,pageInfo.current])
  return (
    <Pagecont bgcolor="transparent" pd="0" >
      <Title>
        <span className="text">备件管理</span>
      </Title>
      <Content>
        <div style={{ marginBottom: '16px' }}>
          <Select style={{ width: '264px' }} options={allOptions} value={areaId} onChange={onChange}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
          <Divider style={{ margin: '0px 32px', height: '32px' }} type="vertical" />
          <Select style={{ width: '264px' }} options={roomList} value={defalutroom} onChange={onChangeRoom}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
          <Divider style={{ margin: '0px 32px', height: '32px' }} type="vertical" />
          <Select style={{ width: '264px' }} options={typeList1} value={defalutType} onChange={onChangeType}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
          <Button type='primary' style={{ position: 'absolute', right: '16px' }} onClick={openNewC}>新增备件</Button>
        </div>
        <Usetable
          hbg="#f0f9ff"
          hbc="#515151"
          columns={columns}
          dataSource={tabledata}
          pagination={pageInfo}
          onChange={changePage}
        />
        <CModal title="删除" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} mold="cust" type="warn" closable={false}>
          是否确认删除备件？
        </CModal>
        <CModal title={Ctitle} open={editModal} onOk={editOk} onCancel={handleEdit} width={440} mold="cust" type="edit" closable={false}>
          <Form labelCol={{ span: 7 }} labelAlign='left'
            form={apiform}
            style={{
              maxWidth: 400,
            }}
          >
            <Form.Item
              name={'areaId'}
              label="选择园区"
              rules={[
                {
                  required: true, message: '请选择园区',
                },
              ]}
            >
              <Select style={{ width: '264px' }} options={levelone} 
                fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
              </Select>
            </Form.Item>
            <Form.Item
              name={'roomId'}
              label="选择配电房"
              rules={[
                {
                  required: true, message: '请选择配电房',
                },
              ]}
            >
              <Select style={{ width: '264px' }} options={roomList1} 
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
            </Form.Item>
            <Form.Item
              name={'type'}
              label="备件类型"
              rules={[
                {
                  required: true, message: '请选择备件类型'
                },
              ]}
            >
              <Select style={{ width: '264px' }} options={typeList} 
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
            </Form.Item>
            <Form.Item name={'name'} label="备件名称" rules={[
              {
                required: true, message: '请输入备件名称'
              },
            ]}>
              <Input style={{ width: '264px' }} />
            </Form.Item>
            <Form.Item name={'currentCount'} label="当前库存量" rules={[
              {
                type: 'number',min:0,message:'库存量必须大于等于0'
              }, {
                required: true, message: '请输入库存量'
              },
            ]}>
              <InputNumber style={{ width: '264px' }} />
            </Form.Item>
            <Form.Item name={'minimumCount'} label="库存最低标准" rules={[
              {
                type: 'number',min:0,message:'库存最低标准必须大于等于0'
              }, {
                required: true, message: '请输入库存最低标准'
              },
            ]}>
              <InputNumber style={{ width: '264px' }} />
            </Form.Item>
          </Form>
        </CModal>
      </Content>

    </Pagecont>
  )
}
