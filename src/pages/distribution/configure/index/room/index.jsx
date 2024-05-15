import React, { useEffect, useRef, useState } from 'react'
import { Button, Space, Form, Input, message, Spin, Divider, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons' 
import {useOutletContext} from 'react-router-dom'
import styled from 'styled-components';
import UseTable from '@com/useTable'
import { distributionRoom } from '@api/api.js'
import { useAntdTable } from "ahooks";
import {useSelector} from 'react-redux'
import {selectProjectId,   publishState, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout'
import Custmodal from '@com/useModal'
import Cupload from "@com/useUpload.js" 
import Pagecont from "@com/pagecontent"
import {Cspin} from "@com/comstyled"
const {Link} = Typography
const Info = styled.span`
  font-size: 12px;
  color: rgba(0,0,0,0.85);
`
const Imgbox = styled.div`
    width: 300px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
 
`
export default function Index() {
  const {setShowroom} = useOutletContext()
  const isPublish = useSelector(publishState)
  const areaId = useSelector(selectOneLevelDefaultId)
  const { queryPageRoom, addRoom, updateRoom, deleteRoom, GetRoomImage } = distributionRoom
  const [messageApi, contextHolder] = message.useMessage();
  const projectId = useSelector(selectProjectId);
  const columns = isPublish ? [
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
    }
  ] : 
  [
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
          <Link type="primary" underline onClick={() => edit(record)}>编辑</Link>
          <Link type="danger" underline  onClick={() => deleteRecord(record)}>删除</Link>
        </Space>
      ),
    },
  ];

  const getRoomData = ({current, pageSize}) => {
    if(!areaId) {
      return new Promise((resolve) => {
        resolve({
          list: [],
          total: 0
        })
      })
    }
    return queryPageRoom( projectId, areaId, current, pageSize).then(res => {
      if(!projectId || !areaId) {
        return new Promise((resolve) => {
          resolve({
            list: [],
            total: 0
          })
        })
      }
      if(res.success){
        if(Array.isArray(res.data) && res?.data?.length > 0) {
          return {
            list: res.data,
            total: res.total
          }
        }else {
          return {
            list: [],
            total: 0
          }
        }
    
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }

  const {tableProps, refresh:queryRoom} = useAntdTable(getRoomData,{
     defaultPageSize: 14,
     refreshDeps: [areaId]
  })
  
  const { TextArea } = Input;
  const [addModal, setAddModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [form] = Form.useForm()
  const Item = Form.Item
  const showAdd = () => {
    if(areaId == 0 || !areaId){
      message.warning('请先选择园区!')
      return;
    }
    setModalTitle('新增配电房')
    ref.current.onOpen()
   //  setAddModal(true)
    // form.resetFields();
  }
  const ref = useRef()
  const [loading, setLoading] = useState(false)
  const addOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values)
      let post = {
        projectId: projectId,
        areaId: areaId,
        name: values.name,
        address: values.address,
        capacity: parseFloat(values.capacity),
        demand: parseFloat(values.demand),
        level: values.level,
        remark: values.remark,
        imgBg: values.imgBg,
      }
      if(modalTitle == '新增配电房'){
        setLoading(true)
        try {
          let {success} = await addRoom(post)
          setLoading(false)
          if(success) {
            messageApi.open({
              type:'success',
              content:'配电房新增成功！',
            })   
          
            queryRoom()
          }else {
            messageApi.open({
              type:'error',
              content:res.errMsg || '新增失败,请重试！',
            })
          }
        } catch (error) {
          setLoading(false)
        }
         
        }else if(modalTitle == '编辑配电房'){       
          try {
            setLoading(true)
            params.id = editId
            let {success} = updateRoom(params)
            setLoading(false)
            if(success){
              messageApi.open({
                type:'success',
                content:'配电房编辑成功！',
              })
              ref.current.onCancel();
              queryRoom()
            }else{
              messageApi.open({
                type:'error',
                content:res.errMsg || '配电房编辑失败,请重试！',
              })
            }
           
          } catch (error) {
            setLoading(false)
          }        
      }
      // form.resetFields()
       //  setAddModal(false)
    }catch(errorInfo){
      console.log(errorInfo)
    }
  }
 
  const [spinning, setSpinning] = useState(false)
  const [editId, setEditId] = useState()
  const edit = async (record) => {
    try {
      setEditId(record.id)
      let imgKey = record.imgBgKey
      if(imgKey?.trim()) {
       setSpinning(true)
       let {success, data} = await   GetRoomImage({projectId, imgKey})
       if(success && data) {
        form.setFieldsValue({...record, imgBg: data})
       } 
       setSpinning(false)
      }else {
        form.setFieldsValue(record)
      }
      ref.current.onOpen()
      setModalTitle('编辑配电房')
    } catch (error) {
      
    }
   
  }

  const delref = useRef()
  const deleteOk = async () => {
    try {
      let {success} = await deleteRoom(projectId, deleteId)
      if(success) {
        messageApi.open({
          type:'success',
          content:'配电房删除成功！',
        })

      }else {
        messageApi.open({
          type:'error',
          content:res.errMsg || '删除失败,请重试！',
        })
      }
      delref.current.onCancel()
      queryRoom()
    } catch (error) {
       console.log(error)
    }
   
  }
  const handleDelete = () => {
     delref.current.onCancel()
  }
  const [deleteId, setDeleteId] = useState()
  const deleteRecord = (record) => {
    delref.current.onOpen()
    setDeleteId(record.id)
    
  }
 
  const checkLog = (_, value) => {   
    if (!!value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('配电房图片必须上传'));
   
 }
 useEffect(() => {
  setShowroom(false)
 }, [])
  return (
 <Cspin tip="图片数据加载中 ……" spinning={spinning}>
    <Pagecont showserach={false} custserach pd="0px" >
      {contextHolder}
      <Titlelayout title="配电房"   layout="flex" dr="column">
         <Divider style={{margin: "16px 0"}} />
        { isPublish ? null :<Button type="primary" style={{width: 96}}    icon={<PlusOutlined />} onClick={()=>showAdd()}>新增</Button> }
      <UseTable style={{marginTop:'16px'}} columns={columns}   rowKey='id'  {...tableProps}></UseTable>
      <Custmodal  title={modalTitle}  custft={modalTitle =="新增配电房"}  loading={loading} onOk={addOk} width={592} mold="cust" ref={ref} key="edit">
        
        <div>
          <Form  labelCol={{span:5}} form={form} labelAlign={'left'} requiredMark={false}   preserve={false}>
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
            <Item label='电压等级(kV)' name='level' rules={[{required:true, message:'请输入电压等级(kV)'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            <Item label="配电房图片" >
            <Imgbox>
            <Item noStyle name="imgBg" rules={[
              {
                validator: checkLog,
              },
            ]}>
              <Cupload wpx={1676} hpx={796} swpx={200} shpx={116} maximum={500} style={{padding: '16px'}}   /> 
            </Item>
            <Info>（图片大小为: 1676*796 png 格式,不超过500KB）</Info>
           </Imgbox>
           
           </Item>
            <Item label='备注' name='remark'>
              <TextArea rows={4} style={{width:'400px'}}></TextArea>
            </Item>
          </Form>
        </div>
      </Custmodal>
      <Custmodal title="删除提示" mold="cust" type="warn"  ref={delref} onOk={deleteOk} onCancel={handleDelete} width={512} cancelText={'取消'} centered={true} closable={false}   okText={'确认'} key="del">
        
       
          是否确认删除配电房？ 
         
      </Custmodal>
     
      </Titlelayout>
    </Pagecont>
    </Cspin>
  )
}
