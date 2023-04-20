import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Input, Select, Space, message, Divider, Upload, Modal, Table } from 'antd'
import style from './style.module.less'
import {useSelector} from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import Usetable from '@com/useTable'
import Custmodl from '@com/useModal'
import warning from '@imgs/warning.png'
import upload from '@imgs/upload.png'
import { SiteManagerDesigner, StorageEquipmentDesigner, PCSMonitorRuntime, StorageMonitorRuntime } from '@api/api.js'
import { useReactive } from 'ahooks'

export default function Index(props) {
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()
  const Item = Form.Item
  const { Search, TextArea } = Input
  const dref = useRef()
  const { Dragger } = Upload
  const errRef = useRef()

  const { FindSiteList } = SiteManagerDesigner
  const { queryPCSList } = PCSMonitorRuntime
  const { QueryBatteryStackList } = StorageMonitorRuntime
  const { QueryBatteryPackByPage,
    AddBatteryPack,
    UpdateBatteryPack,
    DeleteEquipment,
    BatchImportBatteryPack,
    QueryCategoryUsed,
    QueryClusterList } = StorageEquipmentDesigner

  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'
  
  const [selectAreaName, setSelectAreaName] = useState(areaList[0].name)
  useEffect(()=>{
    if(areaList.length == 0|| !areaList){
      message.error('当前项目尚未创建园区!')
    }else{
      form.setFieldValue('areaId', areaList[0].id)
      querySite()
    }
  },[])
  const changeArea = val => {
    areaList.map(item => {
      if(item.id == val){
        setSelectAreaName(item.name)
      }
    })
    querySite()
  }

  //siteList
  const [siteList, setSiteList] = useState([])
  const querySite = () => {
    FindSiteList(projectId, form.getFieldValue('areaId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          setSiteList(res.data)
          form.setFieldValue('siteId', res.data[0].id)
          form.setFieldValue('alike', '')
          getFromHeader()
        }else{
          setSiteList([])
          form.setFieldValue('siteId', '')
          form.setFieldValue('alike', '')
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
    getFromHeader()
  }

  const getFromHeader = () => {
    let params = form.getFieldsValue(true)
    QueryBatteryPackByPage(projectId, params.areaId, params.siteId, params.alike, pagination.current, pagination.pageSize).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          let arr = [...res.data]
          arr.map(item => {
            item.areaName = selectAreaName
          })
          setTableData(arr)
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

  const onSearch = val => { 
    if(pagination.current == 1){
      getFromHeader()
    }else{
      tableOnchange({current:1})
    }
  }
  const columns = [
    {
      title: areaName + '名称',
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center',
      width: '240px'
    }, {
      title: '站点名称',
      dataIndex: 'siteName',
      key: 'siteName',
      align: 'center',
      width: '200px'
    }, {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      align: 'center',
      width: '160px'
    }, {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: '160px'
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
  useEffect(()=> {
    if(!form.getFieldValue('siteId')) return;
    getFromHeader()
  },[pagination.current])

  const exportData = () => {
    tableRef.current.download()
  };


  //删除
  const [selectId, setSelectId] = useState(0)
  const clickDel = (record) => {
    setSelectId(record.id)
    dref.current.onOpen()
  }
  const onDelete = () => {
    DeleteEquipment(projectId, selectId, 4).then(res => {
      if(res.success){
        message.success('电池组删除成功!')
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
    BatchImportBatteryPack(formData).then(res => {
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

  //新增
  const [categoryList, setCategoryList] = useState([])
  useEffect(()=> {
    QueryCategoryUsed(projectId, 4).then(res => {
      if(res.success){
        if(res.data && res.data.length > 0){
          setCategoryList(res.data)
        }else{
          setCategoryList([])
        }
      }else{
        message.error(res.errMsg)
      }
    })
  },[])
  const [editModal, setEditModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增电池组')
  const addData = () => {
    setModalTitle('新增电池组')
    addForm.resetFields()
    setEditModal(true)
  }
  const [addSiteList, setAddSiteList] = useState([])
  const changeAddArea = val => {
    addForm.setFieldValue('siteId', null)
    addForm.setFieldValue('pcsId', null)
    addForm.setFieldValue('batteryStackId', null)
    FindSiteList(projectId, addForm.getFieldValue('areaId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          setAddSiteList(res.data)
        }else{
          setAddSiteList([])
          addForm.setFieldValue('siteId', '')
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const state = useReactive({
    addPcsList:[],
    addStackList:[],
    addClusterList:[]
  })
  const changeAddSite = val => {
    addForm.setFieldValue('pcsId', null)
    addForm.setFieldValue('batteryStackId', null)
    queryPCSList(projectId, addForm.getFieldValue('areaId'), val).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addPcsList = res.data
        }else{
          state.addPcsList = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  const changeAddPcs = val => {
    addForm.setFieldValue('batteryStackId', null)
    QueryBatteryStackList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId'), val).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addStackList = res.data
        }else{
          state.addStackList = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  const changeAddBatteryStack = val => {
    QueryClusterList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId'), val).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addClusterList = res.data
        }else{
          state.addClusterList = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  const closeModal = () =>{
    setEditModal(false)
  }
  const onAdd = async () => {
    const values = await addForm.validateFields()
    if(modalTitle == '新增电池组'){
      AddBatteryPack(projectId, values).then(res => {
        let {success, data} = res
        if(success){
          message.success('新增电池组成功!')
          setEditModal(false)
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
    if(modalTitle == '编辑电池组'){
      let params = values
      params.id = selectId
      UpdateBatteryPack(projectId, params).then(res => {
        let {success, data} = res
        if(success){
          message.success('修改电池组成功!')
          setEditModal(false)
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
    setSelectId(item.id)
    FindSiteList(projectId, addForm.getFieldValue('areaId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          setAddSiteList(res.data)
        }else{
          setAddSiteList([])
          addForm.setFieldValue('siteId', '')
          message.warning('当前'+ areaList[0]?.levelName + '不存在站点!')
        }
      }else{
        message.error(res.errMsg)
      }
    })
    queryPCSList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addPcsList = res.data
        }else{
          state.addPcsList = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
    QueryBatteryStackList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId'), addForm.getFieldValue('pcsId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addStackList = res.data
        }else{
          state.addStackList = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
    QueryClusterList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId'), addForm.getFieldValue('batteryStackId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addClusterList = res.data
        }else{
          state.addClusterList = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
    setModalTitle('编辑电池组')
    setEditModal(true)
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.header}>
        <Form form={form} layout='inline' colon={false}>
          <Item name='areaId' label={ areaName + '选择'} style={{marginLeft:16}}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{marginLeft: 16, width: '200px'}}
              onChange={changeArea}
            >
              {areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='siteId' label=''>
            <Select
              placeholder="请选择站点"
              size="middle"
              style={{ width: '264px' }}
              onChange={changeSite}
            >
              {siteList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='alike' label='设备查询'>
            <Search
              enterButton="查询"
              style={{ width: 400 }}
              onSearch={onSearch}></Search>
          </Item>
        </Form>
        <Space>
          <Button type='primary' style={{ width: 96 }}  onClick={() => addData()}>新增</Button>
          <Button type='primary' style={{ width: 96 }} onClick={() => { setAddModal(true) }}>批量导入</Button>
          <Button type='primary' style={{ width: 96 }} onClick={() => exportData()}>导出</Button>
        </Space>
      </div>
      <Divider />
      <Usetable ref={tableRef} columns={columns} dataSource={tableData} rowKey='sn' pagination={pagination} onChange={tableOnchange} sheetName='电池组.xlsx' />
      <Custmodl title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img style={{ marginLeft: 64, marginRight: 32 }} src={warning}></img>
          <span> 是否确认删除该电池组？ </span>
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
            <a style={{ position: 'absolute', top: 180, left: 233, fontSize: 16, width: 70, textAlign: 'center', color: '#237ae4', textDecoration: 'underline', cursor: 'pointer', zIndex: 1000 }} href='/storageExcel/电池包.xlsx' download>下载模板</a>
          </div>
        </div>
      </Modal>
      <Custmodl title='错误原因' ref={errRef} mold="cust" width={600} onOk={() => onCloseError()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Table columns={errColumns} dataSource={errorData} bordered size='middle' rowKey='row' pagination={false} scroll={{ y: 300 }}></Table>
        </div>
      </Custmodl>
      <Modal className={style.addModal} open={editModal}  width={782} cancelText={'取消'} footer={null} closable={false} maskClosable={false}>
        <div className={style.addHeader}>{modalTitle}</div>
        <div className={style.addBody}>
          <Form form={addForm} colon={false} labelCol={{span:7}} labelAlign='left' requiredMark={false }>
            <div style={{display:'flex'}}>
              <div style={{borderRight: '1px dashed #d7d7d7', width: 350,}}>
                <Item name='areaId' label={ areaName + '选择'} rules={[{required: true, message:'请选择'+ areaName}]}>
                  <Select
                    placeholder="请选择"
                    size="middle"
                    style={{width: '200px'}}
                    onChange={changeAddArea}
                    
                  >
                    {areaList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item name='siteId' label='所属站点' rules={[{required: true, message:'请选择站点'}]} >
                  <Select
                    placeholder="请选择站点"
                    size="middle"
                    style={{width: '200px'}}
                    onChange={changeAddSite}
                    disabled={!addForm.getFieldValue('areaId') ? true: false}
                  >
                    {addSiteList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item name='pcsId' label='所属PCS' rules={[{required: true, message:'请选择PCS'}]} >
                  <Select
                    placeholder="请选择PCS"
                    size="middle"
                    style={{width: '200px'}}
                    onChange={changeAddPcs}
                    disabled={!addForm.getFieldValue('siteId')? true: false}
                  >
                    {state.addPcsList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item name='batteryStackId' label='所属电池堆' rules={[{required: true, message:'请选择电池堆'}]} shouldUpdate>
                  <Select
                    placeholder="请选择电池堆"
                    size="middle"
                    style={{width: '200px'}}
                    onChange={changeAddBatteryStack}
                    disabled={!addForm.getFieldValue('pcsId')? true: false}
                  >
                    {state.addStackList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item name='batteryClusterId' label='所属电池簇' rules={[{required: true, message:'请选择电池簇'}]} shouldUpdate>
                  <Select
                    placeholder="请选择电池簇"
                    size="middle"
                    style={{width: '200px'}}
                    onChange={changeAddBatteryStack}
                    disabled={!addForm.getFieldValue('batteryStackId')? true: false}
                  >
                    {state.addClusterList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item  name='alarmPlanId' label='告警方案' rules={[{required: true, message:'选择告警方案'}]}>
                  <Select
                    placeholder="选择告警方案"
                    size="middle"
                    style={{width: '200px'}}
                  >
                    {props.alarmPlanList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item  name='remark' label='备注'>
                  <TextArea style={{width: '200px', maxWidth: 200}} rows={4}></TextArea>
                </Item>
              </div>
              <div style={{marginLeft: 32, width:340}} >
                <Item  name='sn' label='电池组编号' labelCol={{span:10}} rules={[{required: true, message:'请输入电池组编号'}]}>
                  <Input style={{width: 200}} placeholder='请输入电池组编号' disabled={modalTitle=='新增电池组'? false: true}></Input>
                </Item>
                <Item  name='category' label='电池组型号' labelCol={{span:10}} rules={[{required: true, message:'请选择电池组型号'}]}>
                  <Select
                  placeholder="请选择电池组型号"
                  size="middle"
                  style={{width: '200px'}}
                >
                  {categoryList.map((item, index) => {
                    return <Select.Option key={index} value={item}>{item}</Select.Option>
                  })}
                </Select>
                </Item>
                <Item  name='name' label='电池组名称' labelCol={{span:10}} rules={[{required: true, message:'请输入电池组名称'}]}>
                  <Input style={{width: 200}} placeholder='请输入电池组名称' ></Input>
                </Item>
                <Item  name='cellCapacity' label='电芯容量 (Ah)' labelCol={{span:10}} rules={[{required: true, message:'请输入电芯容量'}]}>
                  <Input style={{width: 200}} placeholder='请输入电芯容量'></Input>
                </Item>
                <Item  name='nominalBatteryCapacity' label='标称电量 (kWh)' labelCol={{span:10}} rules={[{required: true, message:'请输入标称电量'}]}>
                  <Input style={{width: 200}} placeholder='请输入标称电量'></Input>
                </Item>
                <Item  name='nominalV' label='标称电压 (V)' labelCol={{span:10}} rules={[{required: true, message:'请输入标称电压'}]}>
                  <Input style={{width: 200}} placeholder='请输入标称电压'></Input>
                </Item>
                <Item  name='composingMode' label='成组方式' labelCol={{span:10}} rules={[{required: true, message:'请输入成组方式'}]}>
                  <Input style={{width: 200}} placeholder='请输入成组方式'></Input>
                </Item>
              </div>
            </div>
          </Form>
          <div style={{display:'flex', justifyContent:'flex-end',marginTop:32}}>
            <Button style={{width: 96, marginLeft:'auto', marginRight: 0}} onClick={()=>closeModal()}>取消</Button>
            <Button style={{width: 96, marginLeft: 16}} type='primary' onClick={()=>onAdd()}>确认</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
