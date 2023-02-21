import React, { useRef, useState } from 'react'
import { Select, Button, Table, Space, Form, Input, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 
import { AreaSetting } from '@api/api.js'
import { useRequest } from "ahooks";
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { result } from 'lodash';

export default function Index() {
  const { QueryAllArea } = AreaSetting
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
      title: '配电房容量',
      dataIndex: 'capacity',
      key: 'capacity',
      align:'center',
    },
    {
      title: '申报需量',
      dataIndex: 'demand',
      key: 'demand',
      align:'center',
    },
    {
      title: '电压等级',
      dataIndex: 'level',
      key: 'level',
      align:'center',
    },
    {
      title: '变压器数量',
      dataIndex: 'number',
      key: 'number',
      align:'center',
    },
    {
      title: '负责人/联系方式',
      dataIndex: 'commander',
      key: 'commander',
      align:'center',
    },
    {
      title: '备注',
      dataIndex: 'tag',
      key: 'tag',
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

  const data = [
    {
      id: 1,
      name:'正泰低压配电房1',
      address:'1号楼B2',
      capacity:'8000 kVA',
      demand:'7500kW',
      level:'10/0.4 kV',
      number: 3,
      commander:'ad / 13555558888',
      tag:''
    },{
      id: 2,
      name:'正泰低压配电房2',
      address:'2号楼B2',
      capacity:'8000 kVA',
      demand:'7500kW',
      level:'10/0.4 kV',
      number: 2,
      commander:'ak / 13544448888',
      tag:''
    }
  ]

  const getAreaData = () =>{
    return QueryAllArea (projectId, 1).then(res=> {
      let {success, data} = res
      if(success && typeof(data) == 'Array'){
        console.log(data)
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
      setAddModal(false)
    }catch(errorInfo){}
  }
  const handleCancel = () => {
    setAddModal(false)
  }
  const edit = (record) => {
    console.log(record)
    setModalTitle('编辑配电房')
    setAddModal(true)
    form.setFieldsValue(record)
  }

  const [deleteModal, setDeleteModal] = useState(false)
  const deleteOk = () => {
    setDeleteModal(false)
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const deleteRecord = (record) => {
    setDeleteModal(true)
  }

  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <span className={style.headerTitle}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          defaultValue="1"
          style={{width: '200px'}}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
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
      <Table style={{marginTop:'16px'}} columns={columns} dataSource={data} rowKey='id'></Table>
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
            <Item label='电压等级(V)' name='level' rules={[{required:true, message:'请输入电压等级(V)'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label='变压器台数(台)' name='number' rules={[{required:true, message:'请输入变压器数量'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label='备注' name='tag'>
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
