import React, { useState, useRef} from 'react'
import style from './style.module.less'
import { Input, Button, Space, Modal, Form, message, Typography } from 'antd'
import styled from 'styled-components'
import {nanoid} from '@reduxjs/toolkit'
import UserTable from '@com/useTable'
import {Area} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import {useSelector} from 'react-redux'
import {useAntdTable} from 'ahooks'
import warningImg from '@imgs/warning.png'
import {CustButton} from '@com/useButton'
import {custMsg} from '@com/usehandler'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 65px 1fr;
  row-gap: 16px;
`
const {Link} = Typography
const {Item} = Form
export default function Index({projectId, CModal}) {

  const projectName = useSelector(selectCurProject)?.name;
  const [form] = Form.useForm();
  const [nform] = Form.useForm();
  const [serachform] = Form.useForm();
  const nref = useRef()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('新增园区')
  const [dialogType, setDialogType] = useState('')

  const defaultParams = {
    level: 1,
    parentId: 0,
    name: '',
    remark: '',
    projectId,
    fields:[],
  }

   const [columns, setColumns] = useState([])

  /* const getTableData = ({current, pageSize}, formData) => {  
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    return  QueryOperationManager(params).then(res => {
      let {success, data: {data, total}} = res 
      if (success && Array.isArray(data)) {
        return {
          total,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  } */
  let params = { 
    pageNum: 1,
    pageSize: 15,
    level: 1,
    topAreaId: 0,
    name: '',
    projectId,
  }
  
  const getTableData = ({current, PageSize}, formData) => {
    params = Object.assign({}, params, {PageNum: current, PageSize}, formData)
    return Area.QueryByPage(params).then(res => {
      let {success, data, totalNum} = res;
      let {body, header} = data;
      let cols = []
      for (let k of header) {
        let col = {
          title: k,
          dataIndex: k,
          key: k,
        }
        cols.push(col) 
      }
      let colums = [...cols,  {
        title:'操作',
        key:'action',
        align: 'center',
        render: (_,record) => <Space size={32}>
          <Link underline onClick={()=>editItem(record)}>进线配置</Link>
          <Link underline onClick={()=>editItem(record)}>出线配置</Link>
          <Link underline onClick={()=>editItem(record)}>编辑</Link>
          <Link underline  type="danger" onClick={()=>editItem(record)}>删除</Link>
        </Space>
      }]
      setColumns(colums);
      console.log(colums)
      let formart = body.map((r => {
        let row = {}
          header.forEach((e,i) => {
              row[e] = r[i]
              row.id= nanoid()
          })
        return row;
      }))     
      if (success && data) {
        return {
          total: body.length,
          list: formart
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const {tableProps, search, refresh} = useAntdTable(getTableData, {  
    serachform,
    refreshDeps: [projectId, params.name],
    defaultPageSize: 15,
    onError: (e) => {
      console.log(e)
    },
   
   })
  console.log(tableProps)
 const {submit} = search;

  const addRegion = () =>{
    setIsModalOpen(true);
    setDialogType('add');
    setDialogTitle('新增园区');
    form.setFieldValue('projectName',projectName);
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

  const editItem = (record) => {
    setDialogType('edit');
    setDialogTitle('编辑园区');
    setIsModalOpen(true);
    form.setFieldsValue(record);
  }

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
   const add = () => {
     nref.current.onOpen();
   }
   const addOk = async() => { 
      try {
      let values =  await nform.validateFields()
      let params = {...defaultParams, ...values}
      let {success,} =  Area.Insert(params)
      success && custMsg({content: '新增成功', onClose: () => {
        refresh();
        nref.current.onCancel();
      }})
      !success && custMsg({})
      } catch (error) {
        console.log(error);
      }

   
   }
    return (
      <Mainbox>
        <Form form={serachform} layout="inline" initialValues={{name: ''}}>
            <Form.Item name="name" label="园区查询">
                <Input.Search placeholder='请输入建筑名称' allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
            </Form.Item>
            <Form.Item>
                <CustButton style={{justifyContent: 'center'}} onClick={add}>+新增</CustButton>
            </Form.Item>
        </Form>
        <UserTable columns={columns} {...tableProps} rowKey='id' />
        <Modal width={440} className='dialogModal' footer={null} closable={false} maskClosable={false} open={isModalOpen}>
          <div className={style.modalTitle}>{dialogTitle}</div>
          <Form form={form}   className={style.dialogForm} onFinish={onFinish} requiredMark={false} >
            <Form.Item name='projectName' label='所属项目' 
            rules={[{required: true,message:'请选择区域'}]}>
              <Input size='middle' className='input' disabled></Input>
            </Form.Item>
            <Form.Item name='name' label='园区名称' 
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
              <Button className='submitButton' size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancel}>取消</Button>
              <Button className='submitButton' size="middle" type="primary" htmlType="submit" > 保存</Button>
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
        <CModal width={554} title="新建园区" ref={nref} onOk={addOk}  mold='cust'>
        <Form 
         form={nform}   
         size="middle"  
         labelCol={{flex: '7em'}}
          labelAlign="left" 
          preserve={false}
          validateMessages = {{
              required: "'${name}' 是必选字段"
           }}  
           >
          
             <Item label="园区名称" name="name" rules={[
                  {
                    required: true, 
                  }]}>
                <Input />
             </Item>
             <Item label="备注" name="remark">
                <Input/>
             </Item> 
         </Form>
         </CModal>

      </Mainbox>
    )
  }