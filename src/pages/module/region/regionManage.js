import React, { useState, useRef} from 'react'
import style from './style.module.less'
import { Input, Button, Space, Modal, Form, message, Typography } from 'antd'
import styled from 'styled-components' 
import UserTable from '@com/useTable'
import {Area} from '@api/api.js'
import {WarningFilled} from '@ant-design/icons'
import {useAntdTable} from 'ahooks'
import warningImg from '@imgs/warning.png'
import {CustButton} from '@com/useButton'
import {custMsg} from '@com/usehandler'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 65px 1fr;
  row-gap: 16px;
`
const {Link, Text} = Typography
const {Item} = Form
export default function Index({projectId, CModal}) {

 
  const [form] = Form.useForm();
  const [nform] = Form.useForm();
  
  const nref = useRef()
  const dref = useRef()
  const [Record, setRecord] = useState({})
  const [isAdd, setIsAdd] = useState(true)
  const title = isAdd ? '新增园区' : '编辑园区';
 
  const defaultParams = {
    level: 1,
    parentId: 0,
    name: '',
    remark: '',
    projectId,
    fields:[],
  }

   const [columns, setColumns] = useState([])
  let params = { 
    pageNum: 1,
    pageSize: 15,
    level: 1,
    topAreaId: 0,
    name: '',
    projectId,
  }
  const del = (record) => {
    setRecord({...Record, ...record});
    dref.current.onOpen();
  }
  const delOk = async () => {
    let {areaId} = Record
    let {success, errMsg} = await Area.DeleteArea({projectId, areaId})
    success && message.success({
      content: '删除成功',
      onClose: () => {
        dref.current.onCancel();
        refresh();
      }
    })
    !success && custMsg({success, content: errMsg || '数据出错'})
  }
  const getTableData = ({current, PageSize}, formData) => {    
    params = Object.assign({}, params, {PageNum: current, PageSize}, formData)
    return Area.QueryByPage(params).then(res => {
      let {success, data} = res;
      let {body=[], header=[], idGroup=[]} = data || {};
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
          <Link underline onClick={()=>editItem(record)}>配置</Link>         
          <Link underline onClick={()=>edit(record)}>编辑</Link>
          <Link underline  type="danger" onClick={()=>del(record)}>删除</Link>
        </Space>
      }]
      setColumns(colums);
     
      let formart = body.map(((r, i) => {
         let row = {
          areaId: idGroup[i]
         }
          header.forEach((e,i) => {
              row[e] = r[i]
             // row.id= nanoid()
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
    }).catch(e => {
      console.log(e)
    })
  }

  const {tableProps, search, refresh} = useAntdTable(getTableData, {  
    form,
    refreshDeps: [projectId],
    defaultPageSize: 15,
    onError: (e) => {
      console.log(e)
    },
   
   })
 
 const {submit} = search;


  const [deleteModal, setDeleteModal] = useState(false);
  const cancelDelete = () => {
    setDeleteModal(false);
  }
  const confirmDelete = () => {
    setDeleteModal(false);
    message.success('删除成功！');
  }
  
  const add = () => {
    setIsAdd(true)
     nref.current.onOpen();
   }
  const onOk = async() => { 
      try {
      let values =  await nform.validateFields()
      let methods = isAdd ? 'Insert' : 'UpdateArea' 
      let params = isAdd ? {...defaultParams, ...values} : {...defaultParams, ...values, id: Record.areaId }

      let {success, errMsg} = await Area[methods](params)
      success && message.success({
        content:  isAdd ? '新增成功' : '编辑成功',
        onClose: () => {
          nref.current.onCancel();
          refresh();
        }
      })
      !success && custMsg({success, content: errMsg || '数据出错'})
      } catch (error) {
        console.log(error);
      }

   
   }
   const edit = (record) => { 
    setIsAdd(false)
    setRecord({...Record, ...record})
    nform.setFieldsValue({
      name: record['名称'],
      remark: record['备注']
    })
    nref.current.onOpen()
   }
  return (
      <Mainbox>
        <Form form={form} layout="inline" initialValues={{name: ''}}>
            <Form.Item name="name" label="园区查询">
                <Input.Search placeholder='请输入建筑名称' allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
            </Form.Item>
            <Form.Item>
                <CustButton style={{justifyContent: 'center'}} onClick={add}>+新增</CustButton>
            </Form.Item>
        </Form>
        <UserTable columns={columns} {...tableProps} rowKey='areaId' />
       {/*  <Modal width={440} className='dialogModal' footer={null} closable={false} maskClosable={false} open={isModalOpen}>
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
        </Modal> */}
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
        <CModal width={554} title={title} ref={nref} onOk={onOk}  mold='cust'>
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
              <Item label="备注" name="remark" rules={[
                    {
                      required: true, 
                    }]}>
                  <Input/>
              </Item> 
          </Form>
         </CModal>
         <CModal width={554} title="删除园区" ref={dref} onOk={delOk} type="warn" mold='cust'>
              <p><WarningFilled />是否确认删除 <Text type="danger">{Record['名称']}</Text>和相关信息?</p>
         </CModal>
      </Mainbox>
    )
  }