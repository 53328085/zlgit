import React, { useEffect, useRef, useState } from 'react'
import { Select, Button, Table, Space, Form, Input, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 
import { AreaSetting, distributionRoom } from '@api/api.js'
import { useRequest } from "ahooks";
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'

export default function Index() {
  const { QueryAllArea } = AreaSetting
  const { queryPageRoom, addRoom, updateRoom, deleteRoom } = distributionRoom
  const [messageApi, contextHolder] = message.useMessage();
  const projectId = useSelector(selectProjectId);
  const columns = [
    {
      align:'center',
      title: '配电房名称',
      dataIndex: 'name',
      key: 'name',
    },
    { 
      align:'center',
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '配电房容量(kVA)',
      dataIndex: 'capacity',
      key: 'capacity',
      align:'center',
    },
    {
      title: '申报需量(kW)',
      dataIndex: 'demand',
      key: 'demand',
      align:'center',
    },
    {
      title: '电压等级(kV)',
      dataIndex: 'level',
      key: 'level',
      align:'center',
    },
    {
      title: '变压器数量',
      dataIndex: 'cnt',
      key: 'cnt',
      align:'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align:'center',
    },
    {
      title: '操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span className={style.editText} onClick={() => edit(record)}>编辑</span>
          <span className={style.deleteText} onClick={() => deleteRecord(record)}>删除</span>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState([])
  const [areaList, setAreaList] = useState([])
  const [defaultArea, setDefaultArea] = useState()
  const [areaId,setAreaId] = useState(0)
  const getAreaData = () =>{
    return QueryAllArea (projectId, 1).then(res=> {
      let {success, data} = res
      if(success && data){
        setAreaList(data)
        setDefaultArea(data[0].id)
        setAreaId(data[0].id)
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }

  const { data:AreaData } = useRequest(getAreaData,{
    onSuccess:(result,params) => {}
  })

  const handleChange = (values) => {
    setPageNum(1)
    setAreaId(values)
  }

  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const getRoomData = () => {
    return queryPageRoom( projectId, areaId, pageNum, pageSize).then(res => {
      if(res.success){
        setDataSource(res.data)
        setTotal(res.total)
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }

  const { run : queryRoom } = useRequest(getRoomData,{
    manual: true,
  })

  const { TextArea } = Input;
  const [addModal, setAddModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [form] = Form.useForm()
  const Item = Form.Item
  const showAdd = () => {
    setModalTitle('新增配电房')
    setAddModal(true)
    form.resetFields();
  }
  const addOk = async () => {
    try {
      const values = await form.validateFields();
      let params = {
        projectId: projectId,
        areaId: areaId,
        name: values.name,
        address: values.address,
        capacity: parseFloat(values.capacity),
        demand: parseFloat(values.demand),
        level: values.level,
        remark: values.remark
      }
      if(modalTitle == '新增配电房'){
        addRoom(params).then(res => {
          if(res.success){
            messageApi.open({
              type:'success',
              content:'配电房新增成功！',
            })
            queryRoom()
          }else{
            messageApi.open({
              type:'error',
              content:res.errMsg || '新增失败,请重试！',
            })
          }
        })
      }else if(modalTitle == '编辑配电房'){
        params.id = editId
        updateRoom(params).then(res => {
          if(res.success){
            messageApi.open({
              type:'success',
              content:'配电房编辑成功！',
            })
            queryRoom()
          }else{
            messageApi.open({
              type:'error',
              content:res.errMsg || '配电房编辑失败,请重试！',
            })
          }
        })
      }
      // form.resetFields()
      setAddModal(false)
    }catch(errorInfo){}
  }
  const handleCancel = () => {
    setAddModal(false)
  }
  const [editId, setEditId] = useState()
  const edit = (record) => {
    setEditId(record.id)
    setModalTitle('编辑配电房')
    setAddModal(true)
    form.setFieldsValue(record)
  }

  const [deleteModal, setDeleteModal] = useState(false)
  const deleteOk = () => {
    deleteRoom(projectId, deleteId).then(res=>{
      if(res.success){
        messageApi.open({
          type:'success',
          content:'配电房删除成功！',
        })
        if(dataSource.length == 1 && pageNum > 1){
          setPageNum(pageNum - 1)
        }else{
          queryRoom()
        }
        // queryRoom()
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg || '删除失败,请重试！',
        })
      }
    })
    setDeleteModal(false)
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const [deleteId, setDeleteId] = useState()
  const deleteRecord = (record) => {
    setDeleteId(record.id)
    setDeleteModal(true)
  }
  // 只有当 areaId, pageNum 改变后才会重新创建订阅
  useEffect(()=>{
    if(areaId == 0){
      return
    }else{
      queryRoom()
    }
  },[areaId, pageNum])

  //分页
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    // showTotal: () => (
    //   <span>总共{total}项</span>
    // ),
    total, // 总条数
    onChange: page => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
  }
  const handlePageChange = (page) => {
    setPageNum(page)
  }

  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <span className={style.headerTitle}>{areaList[0]?.levelName || '园区'}选择</span>
        <Select
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          style={{width: '200px'}}
          onChange={handleChange}
        >
          {areaList.map(item => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
      </div>
      <div className={style.mainContent}>
        <div className={style.contentTitle}>配电房</div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={()=>showAdd()}>
        新增
      </Button>
      <Table style={{marginTop:'16px'}} columns={columns} dataSource={dataSource} rowKey='id' bordered pagination={paginationProps} size='large'></Table>
      <Modal className={style.addModal} open={addModal} onOk={addOk} onCancel={handleCancel} width={592} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'保存'} okType={'primary'} >
        <div className={style.addHeader}>{ modalTitle }</div>
        <div className={style.addBody}>
          <Form name='addform' labelCol={{span:5}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off'>
            <Item label='配电房名称' name='name' rules={[{required:true, message:'请输入配电房名称'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label='配电房地址' name='address' rules={[{required:true, message:'请输入配电房地址'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label='配电房容量(kVA)' name='capacity' rules={[{required:true, message:'请输入配电房容量'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label='申报需量(kW)' name='demand' rules={[{required:true, message:'请输入申报需量'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label='电压等级(kV)' name='level' rules={[{required:true, message:'请输入电压等级(V)'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label='备注' name='remark'>
              <TextArea rows={4} style={{width:'400px'}}></TextArea>
            </Item>
          </Form>
        </div>
      </Modal>
      <Modal className={style.deleteModal} open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} okButtonProps={{danger:true}}>
        <div className={style.deleteHeader}>删除提示</div>
        <div className={style.deleteBody}>
          <img className={style.warnIcon} src={firstwarn}></img>
          <span>是否确认删除配电房？</span>
        </div>
      </Modal>
      </div>
    </div>
  )
}
