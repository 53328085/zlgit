import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Input, Select, Space, message, Divider, Upload, Modal, Table } from 'antd'
import style from '../style.module.less'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
import Usetable from '@com/useTable'
import Custmodl from '@com/useModal'
import styled from 'styled-components'
import upload from '@imgs/upload.png'
import { SiteManagerDesigner, StorageEquipmentDesigner, PCSMonitorRuntime, StorageContainerDesigner } from '@api/api.js'
import { useReactive } from 'ahooks'
import {CustButtonT, CustLink} from "@com/useButton"
import {Serach,Cdivider} from "@com/comstyled"
const Mainbox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  .header{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`
export default function Index(props) {
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()
  const {laptop} = props
  const Item = Form.Item
  const { Search, TextArea } = Input
  const dref = useRef()
  const { Dragger } = Upload
  const errRef = useRef()

  const { FindSiteList } = SiteManagerDesigner
  const { queryPCSList } = PCSMonitorRuntime
  const { FindContainerList } = StorageContainerDesigner
  const { QueryBatteryStackByPage,
    AddBatteryStack,
    UpdateBatteryStack,
    BatchImportBatteryStack,
    DeleteEquipment,
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
    QueryBatteryStackByPage(params).then(res => {
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
      title: 'PCS',
      dataIndex: 'pcsName',
      key: 'pcsName',
      align: 'center',
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    }, {
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    }, {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      align: 'center',
   //   width: '160px'
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
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: laptop ? '120px' : '176px',
      render: (_, record) => (
        <Space size={laptop ? "small" : "middle"}>
          <CustLink text="edit" onClick={() => setMulti(record)} />
          <CustLink type="danger" onClick={() => clickDel(record)} />
        </Space>
      ),
    },
  ]

  const tableRef = useRef()
  const addedit=useRef()
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
    DeleteEquipment(projectId, selectId, 2).then(res => {
      if(res.success){
        message.success('电池堆删除成功!')
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
    BatchImportBatteryStack(formData).then(res => {
      if(res.success){
        let {success, data} = res.data
        if(success){
          message.success('批量导入成功!')
          addedit.current.onCancel()
         // setAddModal(false)
          getFromHeader()
        }else{
          message.error(res.data.errMsg)
          setErrorData(data);
          addedit.current.onCancel()
          //setAddModal(false)
          errRef.current.onOpen()
        }
      }else{
        message.error(res.errMsg || "数据出错")
        addedit.current.onCancel()
        //setAddModal(false)
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
    QueryCategoryUsed(projectId, 2).then(res => {
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
  const [modalTitle, setModalTitle] = useState('新增电池堆')
  const addData = () => {
    setModalTitle('新增电池堆')
    addForm.resetFields()
    setAddSiteList([])
    state.addContainerList = []
    state.addPcsList = []
    addedit.current.onOpen()
   // setEditModal(true)
  }
  const [addSiteList, setAddSiteList] = useState([])
  const changeAddArea = val => {
    addForm.setFieldValue('siteId', null)
    addForm.setFieldValue('containerId', null)
    addForm.setFieldValue('pcsId', null)
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
    addContainerList:[],
    addPcsList:[]
  })
  const changeAddSite = val => {
    addForm.setFieldValue('containerId', null)
    addForm.setFieldValue('pcsId', null)
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
    addForm.setFieldValue('pcsId', null)
    queryPCSList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId'), val).then(res => {
      if(res.success){
        if(res.data && res.data.length> 0){
          state.addPcsList = res.data
        }else{
          state.addPcsList = []
          message.warning('当前储能柜不存在PCS')
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
    AddBatteryStack(projectId, values).then(res => {
      let {success, data} = res
      if(success){
        message.success('新增电池堆成功!')
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
    if(modalTitle == '新增电池堆'){
      AddBatteryStack(projectId, values).then(res => {
        let {success, data} = res
        if(success){
          message.success('新增电池堆成功!')
         // addedit.current.onCancel()
         // setEditModal(false)
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
    if(modalTitle == '编辑电池堆'){
      let params = values
      params.id = selectId
      UpdateBatteryStack(projectId, params).then(res => {
        let {success, data} = res
        if(success){
          message.success('修改电池堆成功!')
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
          message.warning('当前站点不存在储能柜')
        }
      }else{
        message.error(res.errMsg)
      }
    })
    queryPCSList(projectId, addForm.getFieldValue('areaId'), addForm.getFieldValue('siteId'), addForm.getFieldValue('containerId')).then(res => {
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
    setModalTitle('编辑电池堆')
   //setEditModal(true)
   addedit.current.onOpen()
  }

  return (
    <Mainbox>
      <div className="header">
        <Form form={form} layout='inline' colon={false}>
        <Space size={16}>
          <Item name='areaId' label={ areaName + '选择'}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{width: laptop ? "100px" : '200px' }}
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
              style={{ width:  laptop ? "160px" : '264px'  }}
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
              style={{ width: laptop ? 200 : 400 }}
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
      <Usetable ref={tableRef} columns={columns} dataSource={tableData} rowKey='sn' pagination={pagination} onChange={tableOnchange} sheetName='电池堆.xlsx' />
      <Custmodl title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>
         是否确认删除该电池堆？
      </Custmodl>
      <Custmodl className={style.addModal} title="批量导入" open={addModal} onOk={onUpload}  width={600} >

        <div className={style.addBody}>
          <div style={{ display: "flex", alignItems: "center", position: 'relative' }}>
            <Dragger {...propData} maxCount={1}>
              <div style={{ width: 536, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16 }}>
                <img style={{ width: 84, height: 60, marginTop: 44 }} src={upload}></img>
                <p style={{ marginTop: 24, marginBottom: 24 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', cursor: 'pointer' }}>点击上传</span></p>
              </div>
            </Dragger>
            <a style={{ position: 'absolute', top: 180, left: 233, fontSize: 16, width: 70, textAlign: 'center', color: '#237ae4', textDecoration: 'underline', cursor: 'pointer', zIndex: 1000 }} href='/storageExcel/StorageBatteryStacks.xlsx' download>下载模板</a>
          </div>
        </div>
      </Custmodl>
      <Custmodl title='错误原因' ref={errRef} mold="cust" width={600} onOk={() => onCloseError()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Table columns={errColumns} dataSource={errorData} bordered size='middle' rowKey='row' pagination={false} scroll={{ y: 300 }}></Table>
        </div>
      </Custmodl>
      <Custmodl mold="cust" ref={addedit}  title={modalTitle} custft={modalTitle == '新增电池堆'} className={style.addModal} onOk={onAdd} width={782} >
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
                    disabled={addSiteList.length==0? true: false}
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
                <Item name='pcsId' label='所属PCS' rules={[{required: true, message:'请选择PCS'}]} >
                  <Select
                    placeholder="请选择PCS"
                    size="middle"
                    style={{width: '200px'}}
                    disabled={state.addPcsList.length==0? true: false}
                  >
                    {state.addPcsList.map(item => {
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

                <Item  name='address' label='安装地址' rules={[{required: true, message:'请输入安装地址'}]}>
                  <Input style={{width: 200}} placeholder='请输入安装地址'></Input>
                </Item>
                <Item  name='remark' label='备注'>
                  <TextArea style={{width: '200px', maxWidth: 200}} rows={4}></TextArea>
                </Item>
              </div>
              <div style={{marginLeft: 32, width:340}} >
                <Item  name='sn' label='电池堆编号' labelCol={{span:10}} rules={[{required: true, message:'请输入电池堆编号'}]}>
                  <Input style={{width: 200}} placeholder='请输入电池堆编号' disabled={modalTitle=='新增电池堆'? false: true}></Input>
                </Item>
                <Item  name='category' label='电池堆型号' labelCol={{span:10}} rules={[{required: true, message:'请选择电池堆型号'}]}>
                  <Select
                  placeholder="请选择电池堆型号"
                  size="middle"
                  style={{width: '200px'}}
                >
                  {categoryList.map((item, index) => {
                    return <Select.Option key={index} value={item}>{item}</Select.Option>
                  })}
                </Select>
                </Item>
                <Item  name='name' label='电池堆名称' labelCol={{span:10}} rules={[{required: true, message:'请输入电池堆名称'}]}>
                  <Input style={{width: 200}} placeholder='请输入电池堆名称' ></Input>
                </Item>
                <Item  name='ratedCapacity' label='额定容量 (Ah)' labelCol={{span:10}} rules={[{required: true, message:'请输入额定容量'}]}>
                  <Input style={{width: 200}} placeholder='请输入额定容量'></Input>
                </Item>
                <Item  name='ratedEnergy' label='额定能量 (kWh)' labelCol={{span:10}} rules={[{required: true, message:'请输入额定能量'}]}>
                  <Input style={{width: 200}} placeholder='请输入额定能量'></Input>
                </Item>
                <Item  name='ratedP' label='额定功率 (kW)' labelCol={{span:10}} rules={[{required: true, message:'请输入额定功率'}]}>
                  <Input style={{width: 200}} placeholder='请输入额定功率'></Input>
                </Item>
                <Item  name='ratedV' label='额定电压 (V)' labelCol={{span:10}} rules={[{required: true, message:'请输入额定电压'}]}>
                  <Input style={{width: 200}} placeholder='请输入额定电压'></Input>
                </Item>
                <Item  name='maxDischargeI' label='最大放电电流 (A)' labelCol={{span:10}} rules={[{required: true, message:'请输入最大放电电流'}]}>
                  <Input style={{width: 200}} placeholder='请输入最大放电电流'></Input>
                </Item>
                <Item  name='maxChargeI' label='最大充电电流 (A)' labelCol={{span:10}} rules={[{required: true, message:'请输入最大充电电流'}]}>
                  <Input style={{width: 200}} placeholder='请输入最大充电电流'></Input>
                </Item>
                <Item  name='batteryClusterNum' label='电池簇数量' labelCol={{span:10}} rules={[{required: true, message:'请输入电池簇数量'}]}>
                  <Input style={{width: 200}} placeholder='请输入电池簇数量'></Input>
                </Item>
              </div>
            </div>
          </Form>
         {/*  <div style={{display:'flex', justifyContent:'flex-end',marginTop:32}}>
            <Button style={{width: 96, marginLeft:'auto', marginRight: 0}} onClick={()=>closeModal()}>取消</Button>
            <Button style={{width: 96, marginLeft: 16}} type='primary' onClick={()=>onAdd()}>确认</Button>
            { modalTitle == '新增电池堆' ?<Button style={{width: 96, marginLeft: 16}} type='primary' onClick={()=>onApplication()}>应用</Button> : null }
          </div> */}
        </div>
      </Custmodl>
    </Mainbox>
  )
}
