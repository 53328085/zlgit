import React, { useEffect, useRef, useState } from 'react'
import { Select, Button, Table, Space, Form, Input, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import styled from 'styled-components';
 
import { AreaSetting, distributionRoom } from '@api/api.js'
import { useRequest } from "ahooks";
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevel, publishState, levelDefaultLabel} from '@redux/systemconfig.js'
import Custmodal from '@com/useModal'
import Cupload from "@com/useUpload.js" 
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
  const isPublish = useSelector(publishState)
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
          <span className={style.editText} onClick={() => edit(record)}>编辑</span>
          <span className={style.deleteText} onClick={() => deleteRecord(record)}>删除</span>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState([])
  const areaList = useSelector(selectOneLevel)
  const levelName = useSelector(levelDefaultLabel) || '园区'
  const [defaultArea, setDefaultArea] = useState(areaList[0]?.id || undefined)
  const [areaId,setAreaId] = useState(areaList[0]?.id || undefined)

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
      let params = {
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
        addRoom(params).then(res => {
          if(res.success){
            messageApi.open({
              type:'success',
              content:'配电房新增成功！',
            })
            form.resetFields()
            queryRoom()
          }else{
            messageApi.open({
              type:'error',
              content:res.errMsg || '新增失败,请重试！',
            })
          }
          setLoading(false)
        }).catch(e => {
          setLoading(false)
        })
      }else if(modalTitle == '编辑配电房'){
        params.id = editId
        setLoading(true)
        updateRoom(params).then(res => {
          if(res.success){
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
          setLoading(false)
        }).catch(e => {
          setLoading(false)
        })
      }
      // form.resetFields()
       //  setAddModal(false)
    }catch(errorInfo){
      console.log(errorInfo)
    }
  }
  const handleCancel = () => {
    console.log(111)
    setAddModal(false)
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
    if(areaList.length == 0 || !areaList){
      message.error('当前项目尚未配置园区!')
      return;
    }else{
      if(areaId == 0 || !areaId){
        return
      }else{
        queryRoom()
      }
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
  const checkLog = (_, value) => {   
    if (!!value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('配电房图片必须上传'));
   
 }
  return (
 <Spin tip="图片数据加载中 ……" spinning={spinning}>
    <div>
      {contextHolder}
      <div className={style.header}>
        <span className={style.headerTitle}>{levelName}选择</span>
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
        { isPublish ? null :<Button type="primary" icon={<PlusOutlined />} onClick={()=>showAdd()}>新增</Button> }
      <Table style={{marginTop:'16px'}} columns={columns} dataSource={dataSource} rowKey='id' bordered pagination={paginationProps} size='large'></Table>
      <Custmodal  title={modalTitle}  custft={modalTitle =="新增配电房"}  loading={loading} onOk={addOk} width={592} mold="cust" ref={ref}>
        
        <div className={style.addBody}>
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
      <Custmodal title="删除提示" mold="cust" type="warn" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} cancelText={'取消'} centered={true} closable={false}   okText={'确认'}>
        
       
          是否确认删除配电房？ 
         
      </Custmodal>
      </div>
    </div>
    </Spin>
  )
}
