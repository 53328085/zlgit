import React, { useRef, useEffect, useState } from 'react'
import style from './style.module.less'
import { Form, Select, Input, Button, Divider, Space, Modal, message, Upload, Table } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
import styled from 'styled-components'
import UseTable from '@com/useTable'
import { SiteManagerDesigner, StorageContainerDesigner, StorageMonitorDesigner  } from '@api/api.js'
import { useReactive } from 'ahooks'
import Custmodl from '@com/useModal'
import warning from '@imgs/warning.png'
import upload from '@imgs/upload.png'

export default function Index(props) {
  const tableRef = useRef()
  const dref = useRef()
  const errRef = useRef()
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()
  const Item = Form.Item
  const { Dragger } = Upload
  const { Search, TextArea } = Input
  let { projectId, areaList } = props

  const MainButton = styled(Button)`
    margin-left: 16px;
    width: 96px;
  `

  const dispatch = useDispatch()
  const areaName = useSelector(levelDefaultLabel) || '园区'
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)

  const { FindSiteList } = SiteManagerDesigner
  const { FindContainerList } = StorageContainerDesigner
  const { QueryCategoryUsed,
    QueryTHByPage,
    AddTH,
    UpdateTH,
    BatchImportTH,
    Delete } = StorageMonitorDesigner

  const state = useReactive({
    siteList: [], //站点列表
    editModal: false, //新增编辑modal
    modalTitle: '新增传感器',
    addSiteList:[], //新增modal 站点列表,
    containerList: [],//新增modal 储能柜列表,
    AddcategoryList:[], //传感器型号，
    selectId: 0, // 编辑 || 删除的id
  })

  useEffect(() => {
    if (props.areaList.length == 0 || !props.areaList) {
      message.error('当前项目尚未创建园区!')
    } else {
      form.setFieldValue('areaId', oneLevelDefaultId)
      querySite()
    }
  }, [])

  const changeArea = val => {
    areaList.map(item => {
      if (item.id == val) {
        dispatch(setCurrentlevel(item))
      }
    })
    querySite()
  }
  //siteList
  const querySite = () => {
    FindSiteList(props.projectId, form.getFieldValue('areaId')).then(res => {
      if (res.success) {
        if (res.data && res.data.length > 0) {
          state.siteList = res.data
          form.setFieldValue('siteId', res.data[0].id)
          form.setFieldValue('alike', '')
          getFromHeader()
        } else {
          state.siteList = []
          form.setFieldValue('siteId', '')
          form.setFieldValue('alike', '')
          message.warning('当前' + areaName + '不存在站点!')
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }

  const changeSite = val => {
    getFromHeader()
  }

  const onSearch = val => {
    if(pagination.current == 1){
      getFromHeader()
    }else{
      tableOnchange({current:1})
    }
  }

  const getFromHeader = () => {
    let params = {
      ...form.getFieldsValue(true),
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      containerId: 0,
    }
    QueryTHByPage(projectId, params).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          setTableData(res.data)
          setPagination({
            ...pagination,
            total: res.total,
          })
        }else{
          setTableData([])
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }


  const columns = [
    {
      title: areaName + '名称',
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center'
    }, {
      title: '所属站点',
      dataIndex: 'siteName',
      key: 'siteName',
      align: 'center'
    }, {
      title: '所属储能柜',
      dataIndex: 'containerName',
      key: 'containerName',
      align: 'center'
    }, {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      align: 'center'
    }, {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
      align: 'center'
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center'
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '176px',
      render: (_, record) => (
        <Space size="middle">
          <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={() => setMulti(record)}>编辑</span>
          <span style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }} onClick={() => clickDel(record)}>删除</span>
        </Space>
      ),
    },
  ]
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
  useEffect(()=> {
    if(!form.getFieldValue('siteId')) return;
    getFromHeader()
  },[pagination.current])

  const exportData = () => {
    tableRef.current.download()
  }

  //新增
  const addData = () => {
    state.modalTitle = '新增传感器'
    addForm.resetFields()
    state.editModal = true
  }
  const changeAddArea = val => {
    addForm.setFieldValue('siteId', null)
    FindSiteList(props.projectId, addForm.getFieldValue('areaId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addSiteList = res.data
        }else{
          state.addSiteList = []
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const changeAddSite = val => {
    addForm.setFieldValue('containerId', null)
    FindContainerList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.containerList = res.data
        }else{
          state.containerList = []
          message.warning('当前站点不存在储能柜！')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  const onApplication = async () => {
    const values = await addForm.validateFields()
    AddTH(projectId, values).then(res => {
      let {success, data} = res
      if(success){
        message.success('新增传感器成功!')
        if(pagination.current != 1){
          tableOnchange({current: 1})
        }else{
          getFromHeader()
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const closeModal =  () => {
    state.editModal = false
  }
  const onAdd = async () => {
    const values = await addForm.validateFields()
    if(state.modalTitle == '新增传感器'){
      AddTH(projectId, values).then(res => {
        let {success, data} = res
        if(success){
          message.success('新增传感器成功!')
          state.editModal = false
          if(pagination.current != 1){
            tableOnchange({current: 1})
          }else{
            getFromHeader()
          }
        }else{
          message.error(res.errMsg)
        }
      })
    }
    if(state.modalTitle == '编辑传感器'){
      let params = values
      params.id = state.selectId
      UpdateTH(projectId, params).then(res => {
        let {success, data} = res
        if(success){
          message.success('修改传感器成功!')
          state.editModal = false
          getFromHeader()
        }else{
          message.error(res.errMsg)
        }
      })
    }
  }

  //编辑
  const setMulti = item => {
    addForm.setFieldsValue(item)
    state.selectId = item.id
    FindSiteList(projectId, addForm.getFieldValue('areaId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addSiteList = res.data
        }else{
          state.addSiteList = []
          addForm.setFieldValue('siteId', null)
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })

    FindContainerList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.containerList = res.data
        }else{
          state.containerList = []
          message.warning('当前站点不存在储能柜！')
        }
      }else{
        message.error(res.errMsg)
      }
    })

    state.modalTitle = '编辑传感器'
    state.editModal = true
  }

  //删除
  const clickDel = (record) => {
    state.selectId = record.id
    dref.current.onOpen()
  }
  const onDelete = () => {
    Delete(projectId, state.selectId, 1).then(res => {
      if(res.success){
        message.success('传感器删除成功!')
        if(tableData.length == 1 && pagination.current > 1){
          tableOnchange({current: pagination.current - 1})
        }else{
          getFromHeader()
        }
      }else{
        message.error(res.errMsg)
      }
    })
    dref.current.onCancel()
  }

  //批量导入
  const [addModal, setAddModal] = useState(false)
  const handleCancel = () => {
    setAddModal(false)
  }
  const [fileList, setFileList] = useState([]);
  const propData = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    accept: '.xls,.xlsx',
    beforeUpload: (file) => {
      console.log(file)
      setFileList([file]);
      return false;
    },
    fileList,
  };
  const onUpload = () => {
    let formData = new FormData()
    formData.append('projectId', projectId)
    formData.append('file',fileList[0])
    BatchImportTH(formData).then(res => {
      if(res.success){
        let {success, data} = res.data
        if(success){
          message.success('批量导入成功!')
          setAddModal(false)
          getFromHeader()
        }else{
          message.error(res.data.errMsg)
          setErrorData(data);
          setAddModal(false)
          errRef.current.onOpen()
        }
      }else{
        message.error(res.errMsg)
        setAddModal(false)
      }
    })
  }
  const [errorData, setErrorData] = useState();
  const errColumns = [{
    title: '错误行数',
    width: 100,
    dataIndex: 'row',
    key: 'row',
    align: 'center',
  }, {
    title: '错误原因',
    dataIndex: 'cause',
    key: 'cause',
    align: 'center',
  }]
  const onCloseError = () => {
    errRef.current.onCancel();
  }

  //设备类型
  useEffect(()=> {
    QueryCategoryUsed(projectId, 6).then(res => {
      if(res.success){
        if(res.data && res.data.length > 0){
          state.AddcategoryList=res.data
        }else{
          state.AddcategoryList=[]
          message.warning('当前项目不存在传感器类型!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  },[])

  return (
    <div className={style.contents}>
      <div className={style.header}>
        <Form form={form} layout='inline' colon={false}>
          <Item name='areaId' label={areaName + '选择'} style={{ marginLeft: 16 }}>
            <Select
              size="middle"
              style={{ width: '200px' }}
              onChange={changeArea}
            >
              {props.areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <Divider dashed type='vertical' style={{ height: 32 }}></Divider>
          <Item name='siteId' label='站点选择' style={{ marginLeft: 16 }}>
            <Select
              size="middle"
              style={{ width: '264px' }}
              onChange={changeSite}
            >
              {state.siteList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <Divider dashed type='vertical' style={{ height: 32 }}></Divider>
          <Item name='alike' label='编号查询' style={{ marginLeft: 16 }}>
            <Search
              placeholder="输入编号/安装地址"
              allowClear
              style={{ width: '400px' }}
              onSearch={onSearch}
              enterButton="查询"
            />
          </Item>
        </Form>
        <div>
          <MainButton type='primary' onClick={() => addData()}>新增</MainButton>
          <MainButton type='primary' onClick={() => { setAddModal(true) }}>批量导入</MainButton>
          <MainButton type='primary' onClick={() => exportData()}>导出</MainButton>
        </div>
      </div>
      <Divider dashed style={{ borderColor: '#d7d7d7' }}></Divider>
      <UseTable columns={columns} dataSource={tableData} ref={tableRef} rowKey='id' pagination={pagination} onChange={tableOnchange} sheetName='储能柜传感器.xlsx'></UseTable>
      <Custmodl title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img style={{ marginLeft: 64, marginRight: 32 }} src={warning}></img>
          <span> 是否确认删除传感器？ </span>
        </div>
      </Custmodl>
      <Modal className={style.addModal} open={addModal} onOk={onUpload} onCancel={handleCancel} width={600} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确定'} okType={'primary'} >
        <div className={style.addHeader}>批量导入</div>
        <div className={style.addBody}>
          <div style={{ display: "flex", alignItems: "center", position: 'relative' }}>
            <Dragger {...propData} maxCount={1}>
              <div style={{ width: 536, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16 }}>
                <img style={{ width: 84, height: 60, marginTop: 44 }} src={upload}></img>
                <p style={{ marginTop: 24, marginBottom: 24 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', cursor: 'pointer' }}>点击上传</span></p>
              </div>
            </Dragger>
            <a style={{ position: 'absolute', top: 180, left: 233, fontSize: 16, width: 70, textAlign: 'center', color: '#237ae4', textDecoration: 'underline', cursor: 'pointer', zIndex: 1000 }} href='/storageExcel/storageDevice.xlsx' download>下载模板</a>
          </div>
        </div>
      </Modal>
      <Custmodl title='错误原因' ref={errRef} mold="cust" width={600} onOk={() => onCloseError()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Table columns={errColumns} dataSource={errorData} bordered size='middle' rowKey='row' pagination={false} scroll={{ y: 300 }}></Table>
        </div>
      </Custmodl>
      <Modal className={style.addModal} open={state.editModal} width={544} cancelText={'取消'} footer={null} closable={false} maskClosable={false}>
        <div className={style.addHeader}>{state.modalTitle}</div>
        <div className={style.addBody}>
          <Form form={addForm} colon={false} labelCol={{ span: 7 }} labelAlign='left' requiredMark={false}>
            <Item name='areaId' label={areaName + '选择'} rules={[{ required: true, message: '请选择' + areaName }]}>
              <Select
                placeholder="请选择"
                size="middle"
                style={{ width: '320px' }}
                onChange={changeAddArea}
              >
                {props.areaList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='siteId' label='所属站点' rules={[{ required: true, message: '请选择站点' }]} shouldUpdate>
              <Select
                placeholder="请选择站点"
                size="middle"
                style={{ width: '320px' }}
                onChange={changeAddSite}
                disabled={state.addSiteList.length==0? true: false}
              >
                { state.addSiteList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='containerId' label='所属储能柜' rules={[{ required: true, message: '请选择储能柜' }]} >
              <Select
                placeholder="请选择储能柜"
                size="middle"
                style={{ width: '320px' }}
                disabled={state.containerList.length==0? true: false}
              >
                { state.containerList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='sn' label='传感器编号' rules={[{ required: true, message: '请输入传感器编号' }]} >
              <Input style={{ width: '320px' }} placeholder='请输入传感器编号'  disabled ={ state.modalTitle == '新增传感器' ? false : true }></Input>
            </Item>
            <Item name='category' label='传感器型号' rules={[{ required: true, message: '请选择传感器型号' }]} >
              <Select
                placeholder="请选择传感器型号"
                size="middle"
                style={{ width: '320px' }}
              >
                { state.AddcategoryList.map((item, index) => {
                  return <Select.Option key={index} value={item}>{item}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='name' label='传感器名称' rules={[{ required: true, message: '请输入传感器名称' }]} >
              <Input style={{ width: '320px' }} placeholder='请输入传感器名称'></Input>
            </Item>
            <Item name='alarmPlanId' label='告警方案' rules={[{ required: true, message: '请选择告警方案' }]} initialValue={0}>
              <Select
                placeholder="请选择告警方案"
                size="middle"
                style={{ width: '320px' }}
              >
                {props.alarmPlanList.map((item, index) => {
                  return <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='remark' label='备注' >
              <TextArea style={{ width: '320px' }} rows={4}></TextArea>
            </Item>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
            <Button style={{ width: 96, marginLeft: 'auto', marginRight: 0 }} onClick={() => closeModal()}>取消</Button>
            <Button style={{ width: 96, marginLeft: 16 }} type='primary' onClick={() => onAdd()}>确认</Button>
            {state.modalTitle == '新增传感器' ? <Button style={{ width: 96, marginLeft: 16 }} type='primary' onClick={() => onApplication()}>应用</Button> : null}
          </div>
        </div>
      </Modal>
    </div>
  )
}
