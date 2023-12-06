import React, { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks';
import { Select, Button, Table, Space, Modal, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { selectProjectId, selectOneLevel, publishState, levelDefaultLabel, selectOneLevelDefaultId } from '@redux/systemconfig.js'
import { distributionRoom } from '@api/api.js'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import warning from '@imgs/warning.png'
import Usetable from '@com/useTable'
import CustModal from '@com/useModal'

export default function Index() {
  const isPublish = useSelector(publishState)
  const projectId = useSelector(selectProjectId);
  const levelName = useSelector(levelDefaultLabel) || '园区'
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)

  const [form] = Form.useForm()
  const Item = Form.Item

  const dref = useRef()
  //园区选择
  const areaList = useSelector(selectOneLevel)
  const changeArea = (values) => {
    form.setFieldValue('roomId', null)
    getRoomData()
  }
  //配电房下拉框
  const { queryPageRoom, queryPageChart, deleteChart } = distributionRoom
  const [roomList, setRoomList] = useState([])
  const getRoomData = () => {
    queryPageRoom(projectId, form.getFieldValue('areaId'), 0, 0).then(res => {
      if (res.success) {
        setRoomList(res.data)
        form.setFieldValue('roomId', null)
        if (res.data.length == 0) {
          message.open({
            type: 'warning',
            content: "当前" + levelName + "没有配电房"
          })
          setTableData([])
          setPagination({
            current: 1,
            pageSize: 15,
            total: 0
          })
        } else {
          form.setFieldValue('roomId', res.data[0].id)
          getTableData()
        }
      } else {
        message.open({
          type: 'error',
          content: res.errMsg
        })
      }
    })
  }
  useEffect(() => {
    if (areaList.length == 0 || !areaList) {
      message.error('当前项目尚未配置园区!')
      return;
    } else {
      form.setFieldValue('areaId', oneLevelDefaultId)
      getRoomData()
    }
  }, [])
  const ChangeRoom = values => {
    getTableData()
  }

  const columns = isPublish ? [
    {
      align: 'center',
      title: '配电系统图名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 680,
      align: 'center',
    },
  ] : [
    {
      align: 'center',
      title: '配电系统图名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: 680,
    },
    isPublish ? null : {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 280,
      render: (_, record) => (
        <Space size="middle">
          <span className={style.editText} onClick={() => edit(record)}>编辑</span>
          <span className={style.deleteText} onClick={() => deleteRecord(record)}>删除</span>
        </Space>
      ),
    },
  ];

  const tableRef = useRef()
  const [tableData, setTableData] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  const tableOnchange = (e) => {
    let { current } = e
    setPagination({
      ...pagination,
      current,
    })
  }
  useEffect(() => {
    console.log(form.getFieldsValue())
    roomList.length&&getTableData()
  }, [pagination.current,roomList.length])

  const getTableData = () => {
    queryPageChart(projectId, form.getFieldValue('roomId'), pagination.current, pagination.pageSize).then(res => {
      if(res.success){
       
          setTableData(res.data)
          setPagination({
            ...pagination,
            total: res.total,
          })
        
      }else{
        message.error(res.errMsg)
      }
    })
  }

  const showAdd = (roomId, type) => {
    window.open(`/topology?projectId=${projectId}&areaId=${form.getFieldValue('areaId')}&roomId=${roomId}&type=${type}`, '_blank')
    // navigate(`/topology?id=${key}&type=${label}`, {
    //   state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    // })
  }

  const edit = (record) => {
    let { id } = record
    let type = 'edit'
    window.open(`/topology?projectId=${projectId}&areaId=${form.getFieldValue('areaId')}&id=${id}&type=${type}`, '_blank')
  }

  const [deleteId, setDeleteId] = useState(null)
  const deleteRecord = (record) => {
    setDeleteId(record.id)
    dref.current.onOpen()
  }

  const onDelete = () => {
    deleteChart(projectId, deleteId).then(res => {
      if(res.success){
        message.success('配电图删除成功!')
        dref.current.onCancel()
        if (tableData.length == 1 && pagination.current > 1) {
          tableOnchange({ current: pagination.current - 1 })
        } else {
          getTableData()
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  return (
    <div>
      <div className={style.header}>
        <Form form={form} layout='inline'>
          <Item name='areaId' label={levelName + '选择'} style={{ marginLeft: 16 }}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{ marginLeft: 16, width: '200px' }}
              onChange={changeArea}
            >
              {areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.division}></div>
          <Item name='roomId' label='' style={{ marginLeft: 16 }}>
            <Select
              placeholder="请选择配电房"
              size="middle"
              style={{ width: '200px' }}
              onChange={ChangeRoom}
            >
              {roomList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
        </Form>
      </div>
      <div className={style.mainContent}>
        <div className={style.contentTitle}>配电系统图</div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        {isPublish ? null : <Button type="primary" icon={<PlusOutlined />} onClick={() => showAdd(form.getFieldValue('areaId'), form.getFieldValue('roomId'), 'add')}>新增</Button>}
        <Usetable style={{marginTop: 16}} ref={tableRef} columns={columns} dataSource={tableData} rowKey='id' pagination={pagination} onChange={tableOnchange} />
        <CustModal title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>        
          是否确认删除配电系统图？ 
      </CustModal>
      </div>
    </div>
  )
}
