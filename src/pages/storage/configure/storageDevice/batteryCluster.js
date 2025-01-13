import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Input, Select, Space, message, Divider, Upload, Modal, Table } from 'antd'
import style from './style.module.less'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
import Usetable from '@com/useTable'
import Custmodl from '@com/useModal'
 
import upload from '@imgs/upload.png'
import { SiteManagerDesigner, StorageEquipmentDesigner, StorageContainerDesigner, StorageMonitorRuntime } from '@api/api.js'
import { useReactive } from 'ahooks'
import {CustButtonT, CustLink} from "@com/useButton"
import {Serach,Cdivider} from "@com/comstyled"
export default function Index(props) {
  const {laptop} = props
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()
  const Item = Form.Item
  const {  TextArea } = Input
  const dref = useRef()
  const { Dragger } = Upload
  const errRef = useRef()

  const { FindSiteList } = SiteManagerDesigner
  const { FindContainerList } = StorageContainerDesigner
  const { QueryBatteryStackList } = StorageMonitorRuntime
  const { QueryBatteryClusterByPage,
    AddBatteryCluster,
    UpdateBatteryCluster,
    DeleteEquipment,
    BatchImportBatteryCluster,
    QueryCategoryUsed } = StorageEquipmentDesigner

    const dispatch = useDispatch()
    const projectId = useSelector(selectProjectId)
    const areaList = useSelector(selectOneLevel)
    const areaName = useSelector(levelDefaultLabel) || '园区'
    const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)
  
  const [selectAreaName, setSelectAreaName] = useState(areaList[0].name)
  useEffect(()=>{
    if(areaList.length == 0|| !areaList){
      message.error('当前项目尚未创建园区!')
    }else{
      form.setFieldValue('areaId', oneLevelDefaultId)
      querySite()
    }
  },[])
  const changeArea = val => {
    areaList.map(item => {
      if(item.id == val){
        dispatch(setCurrentlevel(item))
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
    let params = {
      projectId,
      ...form.getFieldsValue(true),
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }
    QueryBatteryClusterByPage(params).then(res => {
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
      title: '所属' + areaName,
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center',
    }, {
      title: '所属站点',
      dataIndex: 'siteName',
      key: 'siteName',
      align: 'center',
    }, {
      title: '所属储能柜',
      dataIndex: 'containerName',
      key: 'containerName',
      align: 'center',
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    }, {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      align: 'center',
  //    width: '160px'
    }, {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
  //    width: '160px'
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: laptop ? '120px' : '176px',
      render: (_, record) => (
        <Space size={laptop ? "small" : "middle"}>
          <CustLink onClick={() => setMulti(record)} text="edit" />
          <CustLink type="danger"  onClick={() => clickDel(record)} text="delete" /> 
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
    DeleteEquipment(projectId, selectId, 3).then(res => {
      if(res.success){
        message.success('电池簇删除成功!')
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
    BatchImportBatteryCluster(formData).then(res => {
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
    QueryCategoryUsed(projectId, 3).then(res => {
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
  const [modalTitle, setModalTitle] = useState('新增电池簇')
  const addedit=useRef()
  const addData = () => {
    setModalTitle('新增电池簇')
    addForm.resetFields()
    setAddSiteList([])
    state.addContainerList = []
    state.addStackList = []
    //setEditModal(true)
    addedit.current.onOpen()
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
    addContainerList: [],
    addStackList:[]
  })
  const changeAddSite = val => {
    addForm.setFieldValue('containerId', null)
    addForm.setFieldValue('batteryStackId', null)
    FindContainerList(projectId, addForm.getFieldValue('areaId'), val).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addContainerList = res.data
        }else{
          state.addContainerList = []
          message.warning('当前站点不存在储能柜')
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  const changeAddContainer = val => {
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

  const closeModal = () =>{
    setEditModal(false)
  }

  const onApplication = async () => {
    const values = await addForm.validateFields()
    AddBatteryCluster(projectId, values).then(res => {
      let {success, data} = res
      if(success){
        message.success('新增电池簇成功!')
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

  const onAdd = async () => {
    const values = await addForm.validateFields()
    if(modalTitle == '新增电池簇'){
      AddBatteryCluster(projectId, values).then(res => {
        let {success, data} = res
        if(success){
          message.success('新增电池簇成功!')
        //  setEditModal(false)
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
    if(modalTitle == '编辑电池簇'){
      let params = values
      params.id = selectId
      UpdateBatteryCluster(projectId, params).then(res => {
        let {success, data} = res
        if(success){
          message.success('修改电池簇成功!')
        addedit.current.onCancel()
         // setEditModal(false)
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
    FindContainerList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId')).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addContainerList = res.data
        }else{
          state.addContainerList = []
        }
      }else{
        message.error(res.errMsg)
      }
    })
    QueryBatteryStackList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId'), addForm.getFieldValue('containerId')).then(res => {
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
    setModalTitle('编辑电池簇')
    addedit.current.onOpen();
   // setEditModal(true)
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.header}>
        <Form form={form} layout='inline' colon={false}>
        <Space size={laptop ? 16 : 64} split={laptop? null : <Cdivider />}>
          <Item name='areaId' label={ areaName + '选择'} >
            <Select
              placeholder="请选择"
              size="middle"
              style={{ width: laptop ? "100px" : '200px' }}
              onChange={changeArea}
            >
              {areaList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
         
          <Item name='siteId' label=''>
            <Select
              placeholder="请选择站点"
              size="middle"
              style={{width: laptop ? "160px" : '264px' }}
              onChange={changeSite}
            >
              {siteList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          
          <Item name='alike' label='设备查询'>
            <Serach             
              placeholder='请输入设备名称/设备编号/安装地址'
              style={{ width: laptop ? 200 : 400}}
              onSearch={onSearch}></Serach>
          </Item>
          </Space>
        </Form>
        <Space>
        <CustButtonT text="new" src="new" onClick={() => addData()} />
          <CustButtonT text="batchImport" src="export" wh="auto" onClick={() => setAddModal(true)} />
          <CustButtonT  text="export"  src="export" onClick={() => exportData()} />  
        </Space>
      </div>
      <Divider />
      <Usetable ref={tableRef} columns={columns} dataSource={tableData} rowKey='sn' pagination={pagination} onChange={tableOnchange} sheetName='电池簇.xlsx' />
      <Custmodl title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>
        是否确认删除该电池簇？
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
            <a style={{ position: 'absolute', top: 180, left: 233, fontSize: 16, width: 70, textAlign: 'center', color: '#237ae4', textDecoration: 'underline', cursor: 'pointer', zIndex: 1000 }} href='/storageExcel/StorageBatteryClusters.xlsx' download>下载模板</a>
          </div>
        </div>
      </Modal>
      <Custmodl title='错误原因' ref={errRef} mold="cust" width={600} onOk={() => onCloseError()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Table columns={errColumns} dataSource={errorData} bordered size='middle' rowKey='row' pagination={false} scroll={{ y: 300 }}></Table>
        </div>
      </Custmodl>
      <Custmodl title={modalTitle} ref={addedit} className={style.addModal} custft={modalTitle == '新增电池簇'} onOk={onAdd} mold="cust" width={782} >
        
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
                <Item name='containerId' label='所属储能柜' rules={[{ required: true, message: '请选择储能柜' }]} >
                  <Select
                    placeholder="请选择储能柜"
                    size="middle"
                    style={{ width: '200px' }}
                    onChange={changeAddContainer}
                    disabled={state.addContainerList.length==0? true: false}
                  >
                    {state.addContainerList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item name='batteryStackId' label='所属电池堆' rules={[{required: true, message:'请选择电池堆'}]} shouldUpdate>
                  <Select
                    placeholder="请选择电池堆"
                    size="middle"
                    style={{width: '200px'}}
                    disabled={!addForm.getFieldValue('containerId')? true: false}
                  >
                    {state.addStackList.map(item => {
                      return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                  </Select>
                </Item>
                <Item  name='alarmPlanId' label='告警方案' rules={[{required: true, message:'选择告警方案'}]} initialValue={0}>
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
                
                {/* <Item  name='address' label='安装地址' rules={[{required: true, message:'请输入安装地址'}]}>
                  <Input style={{width: 200}} placeholder='请输入安装地址'></Input>
                </Item> */}
                <Item  name='remark' label='备注'>
                  <TextArea style={{width: '200px', maxWidth: 200}} rows={4}></TextArea>
                </Item>
              </div>
              <div style={{marginLeft: 32, width:340}} >
              <Item  name='sn' label='电池簇编号' labelCol={{span:10}} rules={[{required: true, message:'请输入电池簇编号'}]}>
                  <Input style={{width: 200}} placeholder='请输入电池簇编号' disabled={modalTitle=='新增电池簇'? false: true}></Input>
                </Item>
                <Item  name='category' label='电池簇型号' labelCol={{span:10}} rules={[{required: true, message:'请选择电池簇型号'}]}>
                  <Select
                  placeholder="请选择电池簇型号"
                  size="middle"
                  style={{width: '200px'}}
                >
                  {categoryList.map((item, index) => {
                    return <Select.Option key={index} value={item}>{item}</Select.Option>
                  })}
                </Select>
                </Item>
                <Item  name='name' label='电池簇名称' labelCol={{span:10}} rules={[{required: true, message:'请输入电池簇名称'}]}>
                  <Input style={{width: 200}} placeholder='请输入电池簇名称' ></Input>
                </Item>
                <Item  name='ratedCapacity' label='电芯容量 (Ah)' labelCol={{span:10}} rules={[{required: true, message:'请输入电芯容量'}]}>
                  <Input style={{width: 200}} placeholder='请输入电芯容量'></Input>
                </Item>
                <Item  name='ratedEnergy' label='标称电量 (kWh)' labelCol={{span:10}} rules={[{required: true, message:'请输入标称电量'}]}>
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
          {/* <div style={{display:'flex', justifyContent:'flex-end',marginTop:32}}>
            <Button style={{width: 96, marginLeft:'auto', marginRight: 0}} onClick={()=>closeModal()}>取消</Button>
            <Button style={{width: 96, marginLeft: 16}} type='primary' onClick={()=>onAdd()}>确认</Button>
            { modalTitle == '新增电池簇' ?<Button style={{width: 96, marginLeft: 16}} type='primary' onClick={()=>onApplication()}>应用</Button> : null }
          </div> */}
        </div>
      </Custmodl>
    </div>
  )
}
