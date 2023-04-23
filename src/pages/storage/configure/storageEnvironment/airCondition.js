import React, { useRef, useEffect } from 'react'
import style from './style.module.less'
import { Form, Select, Input, Button, Divider, Space, Modal } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
import styled from 'styled-components'
import UseTable from '@com/useTable'
import { SiteManagerDesigner } from '@api/api.js'
import { useReactive } from 'ahooks'
import Custmodl from '@com/useModal'
import warning from '@imgs/warning.png'
import upload from '@imgs/upload.png'

export default function Index(props) {
  const tableRef = useRef()
  const dref = useRef()
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()
  const Item = Form.Item
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

  const state = useReactive({
    siteList: [], //站点列表
    editModal: false, //新增编辑modal
    modalTitle: '新增空调',
    addSiteList:[], //新增modal 站点列表,
    addStorageCabinetList: [],//新增modal 储能柜列表,
    AddcategoryList:[], //空调型号，
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
        setSelectAreaName(item.name)
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
    // if(pagination.current == 1){
    //   getFromHeader()
    // }else{
    //   tableOnchange({current:1})
    // }
  }

  const getFromHeader = () => { }

  const columns = [
    {
      title: areaName + '名称',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center'
    }, {
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    }, {
      title: '传感器型号',
      dataIndex: 'sensorCategory',
      key: 'sensorCategory',
      align: 'center'
    }, {
      title: '传感器编号',
      dataIndex: 'sensorNumber',
      key: 'sensorNumber',
      align: 'center'
    }, {
      title: '传感器名称',
      dataIndex: 'sensorName',
      key: 'sensorName',
      align: 'center'
    }, {
      title: '所属网关',
      dataIndex: 'gateway',
      key: 'gateway',
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
      render: (_, record) => {
        <Space>
          <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={() => setMulti(record)}>编辑</span>
          <span style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }} onClick={() => clickDel(record)}>删除</span>
        </Space>
      }
    },
  ]
  const data = []
  const exportData = () => {
    tableRef.current.download()
  }

  //新增
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
  const changeAddSite = val => {}
  const onApplication = () => {}
  const closeModal =  () => {
    state.editModal = false
  }
  const onAdd = () => {}

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
    state.modalTitle = '编辑空调'
    state.editModal = true
  }

  //删除
  const clickDel = (record) => {
    state.selectId = record.id
    dref.current.onOpen()
  }
  const onDelete = () => {
    // DeleteEquipment(projectId, state.selectId, 2).then(res => {
    //   if(res.success){
    //     message.success('电池堆删除成功!')
    //     if(tableData.length == 1 && pagination.current > 1){
    //       tableOnchange({current: pagination.current - 1})
    //     }else{
    //       getFromHeader()
    //     }
    //   }else{
    //     message.error(res.errMsg)
    //   }
    // })
    // dref.current.onCancel()
  }

  //批量导入

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
          <MainButton type='primary' onClick={() => {state.editModal = true }}>新增</MainButton>
          <MainButton type='primary'>批量导入</MainButton>
          <MainButton type='primary' onClick={() => exportData()}>导出</MainButton>
        </div>
      </div>
      <Divider dashed style={{ borderColor: '#d7d7d7' }}></Divider>
      <UseTable columns={columns} dataSource={data} ref={tableRef} sheetName='储能柜空调.xlsx'></UseTable>
      <Custmodl title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img style={{ marginLeft: 64, marginRight: 32 }} src={warning}></img>
          <span> 是否确认删除空调？ </span>
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
                // disabled={state.addSiteList.length==0? true: false}
                disabled={ addForm.getFieldValue('areaId') ? false : true }
              >
                { state.addSiteList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='cabinetId' label='所属储能柜' rules={[{ required: true, message: '请选择储能柜' }]} >
              <Select
                placeholder="请选择储能柜"
                size="middle"
                style={{ width: '320px' }}
                disabled={addForm.getFieldValue('siteId') ? false : true}
              >
                { state.addStorageCabinetList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='sn' label='空调编号' rules={[{ required: true, message: '请输入空调编号' }]} >
              <Input style={{ width: '320px' }} placeholder='请输入空调编号'></Input>
            </Item>
            <Item name='category' label='空调型号' rules={[{ required: true, message: '请选择空调型号' }]} >
              <Select
                placeholder="请选择空调型号"
                size="middle"
                style={{ width: '320px' }}
              >
                { state.AddcategoryList.map(item => {
                  return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Item>
            <Item name='name' label='空调名称' rules={[{ required: true, message: '请输入空调名称' }]} >
              <Input style={{ width: '320px' }} placeholder='请输入空调名称'></Input>
            </Item>
            <Item name='remark' label='备注' >
              <TextArea style={{ width: '320px' }} rows={4}></TextArea>
            </Item>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
            <Button style={{ width: 96, marginLeft: 'auto', marginRight: 0 }} onClick={() => closeModal()}>取消</Button>
            <Button style={{ width: 96, marginLeft: 16 }} type='primary' onClick={() => onAdd()}>确认</Button>
            {state.modalTitle == '新增空调' ? <Button style={{ width: 96, marginLeft: 16 }} type='primary' onClick={() => onApplication()}>应用</Button> : null}
          </div>
        </div>
      </Modal>
    </div>
  )
}
