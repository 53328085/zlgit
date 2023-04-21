import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Input, Select, Space, message, Divider, Upload, Modal, Table } from 'antd'
import style from './style.module.less'
import { useSelector } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel } from '@redux/systemconfig.js'
import Usetable from '@com/useTable'
import UseTransfer from './transfer'
import Custmodl from '@com/useModal'
import warning from '@imgs/warning.png'
import upload from '@imgs/upload.png'
import { SiteManagerDesigner, StorageEquipmentDesigner } from '@api/api.js'
import { useReactive } from 'ahooks'

export default function Index(props) {
  const [form] = Form.useForm()
  const [multiForm] = Form.useForm()
  const Item = Form.Item
  const { Search } = Input
  const dref = useRef()
  const { Dragger } = Upload
  const errRef = useRef()
  const editRef = useRef()

  const { FindSiteList } = SiteManagerDesigner
  const { QueryConfigInfo,
    GetDeviceInfo,
    Config,
    Delete,
    BatchConfig } = StorageEquipmentDesigner

  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const areaName = useSelector(levelDefaultLabel) || '园区'

  const [selectAreaName, setSelectAreaName] = useState(areaList[0].name)
  useEffect(() => {
    if (areaList.length == 0 || !areaList) {
      message.error('当前项目尚未创建园区!')
    } else {
      form.setFieldValue('areaId', areaList[0].id)
      querySite()
    }
  }, [])
  const changeArea = val => {
    areaList.map(item => {
      if (item.id == val) {
        setSelectAreaName(item.name)
      }
    })
    querySite()
  }

  //siteList
  const [siteList, setSiteList] = useState([])
  const querySite = () => {
    FindSiteList(projectId, form.getFieldValue('areaId')).then(res => {
      if (res.success) {
        if (res.data && res.data.length > 0) {
          setSiteList(res.data)
          form.setFieldValue('siteId', res.data[0].id)
          form.setFieldValue('alike', '')
          getFromHeader()
        } else {
          setSiteList([])
          form.setFieldValue('siteId', '')
          form.setFieldValue('alike', '')
          message.warning('当前' + areaList[0]?.levelName + '不存在站点!')
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const changeSite = val => {
    getFromHeader()
  }

  const getFromHeader = () => {
    let params = form.getFieldsValue(true)
    QueryConfigInfo(projectId, params.areaId, params.siteId, params.alike).then(res => {
      if (res.success) {
        if (res.data && res.data.length > 0) {
          let arr = [...res.data]
          arr.map(item => {
            item.areaName = selectAreaName
          })
          setTableData(arr)
        } else {
          setTableData([])
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }

  const onSearch = val => {
    getFromHeader()
  }
  const columns = [
    {
      title: areaName + '名称',
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center',
      width: '240px'
    }, {
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      width: '336px'
    }, {
      title: '电表编号',
      dataIndex: 'sn',
      key: 'sn',
      align: 'center',
      width: '160px'
    }, {
      title: '电表型号',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      width: '160px'
    }, {
      title: '电表名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      align: 'center',
      width: '160px'
    }, {
      title: '所属网关',
      dataIndex: 'gatewaySn',
      key: 'gatewaySn',
      align: 'center',
      width: '172px'
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
      width: '176px',
      render: (_, record) => (
        <Space size="middle">
          {/* <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={() => setMulti(record)}>倍率</span> */}
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

  const exportData = () => {
    tableRef.current.download()
  };

  const transferTitle = {
    mainTitle: '储能总表',
    loadTitle: '负载总表',
    gridTitle: '并网总表',
    unknownTitle: '未选中的设备'
  }

  //穿梭框
  const [transTag, setTransTag] = useState('')
  const settingClick = () => {
    GetDeviceInfo(projectId, form.getFieldValue('siteId'), '').then(res => {
      if (res.success) {
        if (res.data) {
          // setSubTable(res.data.configed)
          setUnknownTable(res.data.noConfiged)
        } else {
          // setSubTable([])
          setUnknownTable([])
        }
      } else {
        message.error(res.errMsg)
      }
    })
    tableData.map(item => {
      
      if(item.type == 1){
        state.mainTable = [item]
      }
      if(item.type == 2){
        state.loadTable = [item]
      }
      if(item.type == 3){
        state.gridTable = [item]
      }
    })
    setTransTag('open');
  }

  const state = useReactive({
    mainTable: [],
    loadTable: [],
    gridTable: [],
  })
  const [unknownTable, setUnknownTable] = useState([])
  const transferColumns = [
    {
      align: 'center',
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn'
    }, {
      align: 'center',
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName'
    }, {
      align: 'center',
      title: '安装地址',
      dataIndex: 'address',
      key: 'address'
    }
  ]

  const getSaveValue = params => {
    let group = []
    if (params.mainData.length > 0) {
      group.push({
        sn: params.mainData[0].sn,
        type:1
      })
    }
    if (params.loadData.length > 0) {
      group.push({
        sn: params.loadData[0].sn,
        type:2
      })
    }
    if (params.gridData.length > 0) {
      group.push({
        sn: params.gridData[0].sn,
        type:3
      })
    }
    Config(projectId, form.getFieldValue('siteId'), group).then(res => {
      if (res.success) {
        message.success('新增设备成功!')
        setTransTag('close')
        getFromHeader()
      } else {
        message.error(res.errMsg)
      }
    })
  }

  const getCloseValue = params => {
    setTransTag(params)
  }

  //删除
  const [selectSn, setSelectSn] = useState(0)
  const clickDel = (record) => {
    setSelectSn(record.sn)
    dref.current.onOpen()
  }
  const onDelete = () => {
    Delete(projectId, selectSn).then(res => {
      if (res.success) {
        message.success('电表删除成功!')
        getFromHeader()
      } else {
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
    formData.append('file', fileList[0])
    BatchConfig(formData).then(res => {
      if (res.success) {
        let { success, data } = res.data
        if (success) {
          message.success('批量导入成功!')
          setAddModal(false)
          getFromHeader()
        } else {
          message.error(res.data.errMsg)
          setErrorData(data);
          setAddModal(false)
          errRef.current.onOpen()
        }
      } else {
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

  //设置倍率
  const setMulti = item => {
    editRef.current.onOpen()
  }
  const saveEdit = () => {
    editRef.current.onCancel()
  }

  return (
    <div className={style.mainContainer}>
      {transTag == 'open' ? <div className={style.mask}></div> : null}
      <div className={style.header}>
        <Form form={form} layout='inline' colon={false}>
          <Item name='areaId' label={areaName + '选择'} style={{ marginLeft: 16 }}>
            <Select
              placeholder="请选择"
              size="middle"
              style={{ marginLeft: 16, width: '200px' }}
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
          <Button type='primary' style={{ width: 96 }} onClick={() => settingClick()}>新增</Button>
          <Button type='primary' style={{ width: 96 }} onClick={() => { setAddModal(true) }}>批量导入</Button>
          <Button type='primary' style={{ width: 96 }} onClick={() => exportData()}>导出</Button>
        </Space>
      </div>
      <Divider />
      <Usetable ref={tableRef} scroll={tableData.length > 15 ? { y: 720 } : null} columns={columns} dataSource={tableData} rowKey='sn' pagination={false} onChange={tableOnchange} sheetName='电表.xlsx' />
      <div className={`${style.transferPage} ${transTag == 'open' ? style.startAnimation : transTag == 'close' ? style.endAnimation : ''}`} >
        <UseTransfer
          transferTitle={transferTitle}
          saveValue={getSaveValue}
          columns={transferColumns}
          mainTable={state.mainTable}
          loadTable={state.loadTable}
          gridTable={state.gridTable}
          unknownTable={unknownTable}
          closeValue={getCloseValue}></UseTransfer>
      </div>
      <Custmodl title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img style={{ marginLeft: 64, marginRight: 32 }} src={warning}></img>
          <span> 是否确认删除电表？ </span>
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
            <a style={{ position: 'absolute', top: 180, left: 233, fontSize: 16, width: 70, textAlign: 'center', color: '#237ae4', textDecoration: 'underline', cursor: 'pointer', zIndex: 1000 }} href='/storageExcel/储能电表.xlsx' download>下载模板</a>
          </div>
        </div>
      </Modal>
      <Custmodl title='错误原因' ref={errRef} mold="cust" width={600} onOk={() => onCloseError()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Table columns={errColumns} dataSource={errorData} bordered size='middle' rowKey='row' pagination={false} scroll={{ y: 300 }}></Table>
        </div>
      </Custmodl>
      <Custmodl title='设置倍率' ref={editRef} mold="cust" width={512} onOk={() => saveEdit()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form form={multiForm} colon={false} labelCol={{ span: 5 }} labelAlign='left'>
            <Item name='deviceType' label='设备类型'>
              <Input style={{ width: 320 }} disabled></Input>
            </Item>
            <Item name='deviceCategory' label='设备型号'>
              <Input style={{ width: 320 }} disabled></Input>
            </Item>
            <Item name='deviceNumber' label='设备编号'>
              <Input style={{ width: 320 }} disabled></Input>
            </Item>
            <Item name='deviceName' label='设备名称'>
              <Input style={{ width: 320 }} disabled></Input>
            </Item>
            <Item name='multi' label='倍率'>
              <Input style={{ width: 320 }}></Input>
            </Item>
            <div style={{ marginLeft: 84, color: '#f00', fontSize: 12 }}>
              <span>倍率=PT*CT!</span><br />
              <span>修改倍率会影响结算金额，请保持平台设置和现场环境一致!</span>
            </div>
          </Form>

        </div>
      </Custmodl>
    </div>
  )
}
