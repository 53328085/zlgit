import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, message, InputNumber, Select, Switch, Alert} from 'antd'
import {CheckCircleFilled } from '@ant-design/icons'
import {useAntdTable} from 'ahooks'
import {useSelector} from 'react-redux'
import {StorageContainerDesigner, SiteManagerDesigner} from '@api/api'
 
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/useButton'
import UseTabel from '@com/useTable'
import imgurl from '@imgs'
import {levelDefaultLabel,selectProjectId, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel} from '@redux/systemconfig.js'
const {Text, Link, Title} = Typography
const {Item} = Form
const Mainbox = styled.div`
    && {
       flex: 1;
       color:#515151;
       padding-top: 16px;
       display: flex;
        height: 100%;  
       }
`

const Containner = ({projectId, form, areaId}) => {
  
  const levelone = useSelector(selectOneLevel)
  const levelLabel = useSelector(levelDefaultLabel) 
  const [options, setOptions] = useState([])
  const [id, setId] = useState(areaId)  
  const getopti = async() => {
    try {
     let {success, data} = await  SiteManagerDesigner.FindSiteList(projectId, id)
     if(success&& Array.isArray(data) && data.length > 0) {
       setOptions([...data])     
      
     }else {
      setOptions([])     
     }
    } catch (error) {
      console.log(error)
    }
   
  }
  const onChange = (e) => {
     form.setFieldsValue({siteId: null})
     setId(e)
  }
 useEffect(() => {
  if(id) {
    getopti()
  }
 }, [id])
  return <Form form={form} labelCol={{span: 6}}  wrapperCol={{ span: 18 }} labelAlign='left' validateMessages={{required: '${label}数据是必须的',}} preserve={false}>
           <Item label={'所属'+levelLabel} name='areaId' rules={[{ required: true }]}>
            <Select   onChange={onChange} options={levelone} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
            </Select>
          </Item>
          <Item label="所属站点" name="siteId" rules={[{ required: true }]} >
             <Select options={options} fieldNames={{label: 'name', value: 'id'}}></Select>  
          </Item>
          <Item label="储能柜编号" name="no" rules={[{ required: true }]} >
              <Input />
          </Item>
          <Item label="储能柜名称" name="name" rules={[{ required: true }]} >
              <Input />
          </Item>
          <Item label="安装地址" name="address" rules={[{ required: true }]} >
              <Input />
          </Item>
          <Item label="备注信息" name="remark"  >
              <Input />
          </Item>
          <Item label="" name="id" style={{display: 'none'}} >
              <Input />
          </Item>
         </Form>


}
export default function Index({projectId, siteId, areaId, CModal}) {
const nref = useRef()
const dref = useRef()


const levelLabel = useSelector(levelDefaultLabel)
const [form] = Form.useForm();
const [AreaId, setAreaId] = useState(areaId)
const [type, setType] = useState(0)

const title = ['新增储能柜', '编辑储能柜'][type]
const edit = (record) => {
  setType(1)
  setAreaId(record.areaId)
  form.setFieldsValue({
    ...record
  })
  nref.current.onOpen()
}
const idref = useRef()


const columns = [
  {
      title: levelLabel,
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center',
       
  },
  {
    title: '所属站点',
    dataIndex: 'siteName',
    key: 'siteName',
    align: 'center',
     
},
{
  title: '储能柜编号',
  dataIndex: 'no',
  key: 'no',
  align: 'center',
   
},
{
  title: '储能柜名称',
  dataIndex: 'name',
  key: 'name',
  align: 'center',
},
{
  title: '安装地址',
  dataIndex: 'address',
  key: 'address',
  align: 'center',
},
{
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
  align: 'center',
},
{
  title: '操作',
  dataIndex: '',
  key: '',
  align: 'center',
  render: (text, record) =>  (<Space size={32}><Link underline onClick={() => edit(record)}>编辑</Link><Link  type="danger" underline onClick={() =>del(record)}>删除</Link></Space>)
  
},

 ]


 const getData = ({current, pageSize}) => { // areaId, sisteId 参数暂时设置为0 ，后续需求改变后再加
    let params = {projectId, areaId: 0, siteId:0, pageNum: current, pageSize }
    return StorageContainerDesigner.GetContainers(params).then(res => {
      let {success, data, total} = res
         if(success && Array.isArray(data) && data.length > 0) {
            return {
              list: data,
              total
            }
         }else {
          return {
            list: [],
            total: 0
          }
         }

    }).catch(e => {
      console.log(e)
    })
 }

  
 const {tableProps, refresh} = useAntdTable(getData, {
    defaultPageSize: 14,
    refreshDeps: [projectId], 
    onError: (e) => {
        console.log(e)
    }
 })


 



const added = () => {
  setType(0)
  nref.current.onOpen()
}
const onOk = async () => { // 新增，编辑 保存
  try {
    let values = await form.validateFields().then(res => res).catch(e => undefined)
    if(!values) return
    let handler = ['AddContainer', 'UpdateContainer'][type]
    let params = type == 0 ? {...values, id: 0} : values
    console.log(handler)
    let {success,errMsg } = await StorageContainerDesigner[handler](projectId, params)
    if(success) {
       nref.current.onCancel()
       refresh()
       let msg = ['新增成功', '编辑成功'][type];
       message.success({content: msg,duration: 0.3})
    }else {
      message.error({content: errMsg || '数据出错',duration: 0.3})
    }
  } catch (error) {
    console.log('error')
    console.log(error)
  }
  
}
const del = (record) => {
  idref.current = record.id
  dref.current.onOpen()
}
const delOk = async () => {
  if(!idref.current) return
  let {success, errMsg} = await StorageContainerDesigner.DeleteContainer(projectId, idref.current)
  if(success) {
    dref.current.onCancel()
    refresh()
    message.success({content: '删除成功', duration: 0.3})
  }else {
    message.error({content: errMsg || '数据出错', duration: 0.3})
  }
}
const onClose = () => {
  dref.current.onCancel();
  
 }
  return (
    <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between"}}><span>储能柜管理</span><CustButton onClick={added}>新增</CustButton></div>}>
          <Mainbox>
             <UseTabel columns={columns} {...tableProps}></UseTabel>          
            </Mainbox>
           
            <CModal width={640} title={title} ref={nref}   mold='cust' onOk={onOk}  >
            <Containner projectId={projectId} form={form} areaId={AreaId}/>         
            </CModal>           
          <CModal width={592} title="操作提示" ref={dref}   mold='cust' type="warn" onOk={delOk}>
          <Space style={{marginLeft: '32px'}} size={32} align='center'><Image src={imgurl.warning} preview={false}/> <span style={{fontSize: '16px'}}>是否确认删除站点?</span></Space>
         
          </CModal>  
    </Titlelayout>
  )
}
