import React, { useState } from 'react'
import style from './style.module.less'
import { Input, Button, Space, Modal, Form, message } from 'antd'
import Icon, { PlusOutlined } from '@ant-design/icons';
import UserTable from '@com/useTable'
import {Backstage} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import {useSelector, useStore, useDispatch} from 'react-redux'
import {useAntdTable} from 'ahooks'
import warningImg from '@imgs/warning.png'

export default function Index() {
  const { Search } = Input;
  const [search, setSearch] = useState('');
  const onSearch = (value) => setSearch(value);
  const projectId = useSelector(selectCurProject)?.id;
  const projectName = useSelector(selectCurProject)?.name;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('新增园区')

  let params = {
    pageNum:1,
    pageSize: 15,
    projectId: projectId,
    projectRegionName:search,
  }

  const columns = [
    {
        title:'项目名称',
        dataIndex:'projectName',
    },{
        title:'园区名称',
        dataIndex:'name',
    },{
        title:'负责人',
        dataIndex:'operator',
    },{
        title:'联系方式',
        dataIndex:'phone',
    },{
      title:'备注',
      dataIndex:'remark',
    },{
      title:'操作',
      key:'action',
      render: (_,record) => <Space>
        <span style={{textDecoration:'underline',cursor:'pointer',color:'#237ae4'}}>编辑</span>
        <span style={{textDecoration:'underline',cursor:'pointer',color:'#f00'}} onClick={()=>deleteItem(record)}>删除</span>
      </Space>
    }
  ]

  const getTableData = ({ current, PageSize}) => {
    params = Object.assign({}, params, {PageNum: current, PageSize})
    return Backstage.GetProjectRegions(params).then(res => {
      let {success, data, totalNum} = res;
      console.log(data)
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const {tableProps} = useAntdTable(getTableData,{
    refreshDeps: [projectId,search],
    defaultPageSize:15,
  })

  const addRegion = () =>{
    setIsModalOpen(true);
    setDialogTitle('新增园区');
    form.setFieldValue('ProjectName',projectName);
  }

  const onFinish = (value) => {
   console.log(value);
    form.resetFields();
    setIsModalOpen(false);
}

const cancel = () =>{
  form.resetFields();
  setIsModalOpen(false);
}
  const validateMode = (rule, value, callback) => {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(value)) {
     callback('请输入正确手机号');
    } else {
        callback();
    }
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const cancelDelete = () => {
    setDeleteModal(false);
  }
  const confirmDelete = () => {
    setDeleteModal(false);
    message.success('删除成功！');
  }
  const deleteItem = (record) => {
    setDeleteModal(true);
  }

    return (
      <div className={style.content}>
        <div className={style.contentHeader}>
          <span >园区查询</span>
          <Search
            placeholder="请输入园区名称"
            allowClear
            enterButton="查询"
            size="middle"
            onSearch={onSearch}
            style={{width:533,marginLeft:12}}
          />
          <Button onClick={addRegion} type='primary' size='middle' style={{width:96,marginLeft:'auto',marginRight:0}} icon={<PlusOutlined />}>新增</Button>
        </div>
        <UserTable columns={columns} {...tableProps} rowKey='id' />
        <Modal width={440} className='dialogModal' footer={null} closable={false} maskClosable={false} open={isModalOpen}>
                <div className={style.modalTitle}>{dialogTitle}</div>
                <Form form={form}   className={style.dialogForm} onFinish={onFinish} requiredMark={false} >
                    <Form.Item name='ProjectName' label='所属项目' 
                    rules={[{required: true,message:'请选择区域'}]}>
                        <Input size='middle' className='input' disabled></Input>
                    </Form.Item>
                    <Form.Item name='regionName' label='园区名称' 
                    rules={[{required: true,message:'请输入园区名称'}]}>
                        <Input size='middle' className='input'></Input>
                    </Form.Item>
                    <Form.Item name='leader' label='园区负责人' 
                    rules={[{required: true,message:'请输入园区负责人'}]}>
                        <Input size='middle' className='input'></Input>
                    </Form.Item>
                    <Form.Item name='phone' label='联系方式' 
                    rules={[{validator:validateMode}]}>
                        <Input size='middle' className='input'></Input>
                    </Form.Item>
                    <Form.Item style={{display:'flex',justifyContent:'flex-end'}}>
                        <Button size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancel}>取消</Button>
                        <Button size="middle" type="primary" htmlType="submit" >
                        保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        <Modal className={style.deleteModal} footer={null} closable={false} maskClosable={false} open={deleteModal}>
          <div className={style.deleteTitle}>删除园区</div>
          <div className={style.deleteContent}>
            <img src={warningImg} className={style.deleteImg} alt='danger'></img>
              <span>是否确认删除园区和相关信息？</span>
          </div>
          <div className={style.deleteFooter}>
            <Button size="middle" danger  style={{marginLeft:'auto',marginRight:12}} onClick={cancelDelete}>取消</Button>
            <Button size="middle" type="primary" danger  onClick={confirmDelete}>确认</Button>
          </div>
        </Modal>
      </div>
    )
  }