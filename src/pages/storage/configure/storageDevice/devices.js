import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Input, Select, Space, message, Divider, Upload, Modal, Table } from 'antd'
import style from './style.module.less'
import Usetable from '@com/useTable'
import UseTransfer from '@com/useTransfer'
import Custmodl from '@com/useModal'
import warning from '@imgs/warning.png'
import upload from '@imgs/upload.png'

export default function Index(props) {
  const [form] = Form.useForm()
  const [multiForm] = Form.useForm()
  const Item = Form.Item
  const { Search } = Input
  const dref = useRef()
  const { Dragger } = Upload
  const errRef = useRef()
  const editRef = useRef()

  const changeSite = val => { }
  const onSearch = val => { }
  const columns = [
    {
      title: '园区名称',
      dataIndex: 'siteName',
      key: 'siteName',
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
      dataIndex: 'deviceNumber',
      key: 'deviceNumber',
      align: 'center',
      width: '160px'
    }, {
      title: '电表型号',
      dataIndex: 'deviceCategory',
      key: 'deviceCategory',
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
      dataIndex: 'gateway',
      key: 'gateway',
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
          <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={() => setMulti(record)}>倍率</span>
          <span style={{ textDecoration: 'underline', color: '#f00', cursor: 'pointer' }} onClick={() => clickDel(record)}>删除</span>
        </Space>
      ),
    },
  ]

  const tableRef = useRef()
  const [tableData, setTableData] = useState([
    {
      id: 1,
      siteName: '正泰物联杭州园区',
      address: '1号楼储能',
      deviceNumber: '220210000001',
      deviceCategory: 'DDSU666-A',
      gateway: '20210113323'
    }
  ])
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
    mainTitle: '',
    subTitle: '储能电表',
    unknownTitle: '未选中的设备'
  }

  //穿梭框
  const [transTag, setTransTag] = useState('')
  const settingClick = () => {
    setTransTag('open');
  }

  const mainTable = []
  const [subTable, setSubTable] = useState([])
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
      dataIndex: 'name',
      key: 'name'
    }, {
      align: 'center',
      title: '安装地址',
      dataIndex: 'address',
      key: 'address'
    }
  ]

  const getSaveValue = params => {
    let group = []
    if (params.subData.length > 0) {
      params.subData.map(item => {
        group.push(item.id)
      })
    }
  }

  const getCloseValue = params => {
    setTransTag(params)
  }

  //删除
  const clickDel = () => {
    dref.current.onOpen()
  }
  const onDelete = () => {
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
    // formData.append('projectId', projectId)
    // formData.append('type',type)
    // formData.append('file',fileList[0])
    // insertEnergyClassifys(formData).then(res => {
    //     if(res.success){
    //         let {success, data} = res.data
    //         if(success){
    //             messageApi.open({
    //                 type:'success',
    //                 content:'批量导入成功!'
    //             })
    //             setAddModal(false)
    //         }else{
    //             messageApi.open({
    //                 type:'error',
    //                 content: res.data.errMsg
    //             })
    //             setErrorData(data);
    //             setAddModal(false)
    //             errRef.current.onOpen()
    //         }
    //     }else{
    //         messageApi.open({
    //             type:"error",
    //             content:res.errMsg
    //         })
    //         setAddModal(false)
    //     }
    // })
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

  useEffect(() => {
    if (props.siteList.length == 0) {
      message.error('当前项目没有站点!')
      return;
    } else {
      form.setFieldValue('siteId', props.siteList[0].id)
    }
  }, [])
  return (
    <div className={style.mainContainer}>
      {transTag == 'open' ? <div className={style.mask}></div> : null}
      <div className={style.header}>
        <Form form={form} layout='inline' colon={false}>
          <Item name='siteId' label=''>
            <Select
              placeholder="请选择站点"
              size="middle"
              style={{ width: '264px' }}
              onChange={changeSite}
            >
              {props.siteList.map(item => {
                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              })}
            </Select>
          </Item>
          <div className={style.line}></div>
          <Item name='searchInput' label='设备查询'>
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
      <Usetable ref={tableRef} columns={columns} dataSource={tableData} rowKey='id' pagination={pagination} onChange={tableOnchange} sheetName='电表.xlsx' />
      <div className={`${style.transferPage} ${transTag == 'open' ? style.startAnimation : transTag == 'close' ? style.endAnimation : ''}`} >
        <UseTransfer transferTitle={transferTitle} saveValue={getSaveValue} columns={transferColumns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
      </div>
      <Custmodl title='删除能耗分类' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()}>
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
            <a style={{ position: 'absolute', top: 180, left: 233, fontSize: 16, width: 70, textAlign: 'center', color: '#237ae4', textDecoration: 'underline', cursor: 'pointer', zIndex: 1000 }} href='/energyTemplate.xlsx' download>下载模板</a>
          </div>
        </div>
      </Modal>
      <Custmodl title='错误原因' ref={errRef} mold="cust" width={600} onOk={() => onCloseError()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Table columns={errColumns} dataSource={errorData} bordered size='middle' rowKey='row' pagination={false} scroll={{ y: 300 }}></Table>
        </div>
      </Custmodl>
      <Custmodl title='设置倍率' ref={editRef} mold="cust" width={512} onOk={() => saveEdit()}>
        <div style={{ display: "flex", alignItems: "center"}}>
          <Form form={multiForm} colon={false} labelCol={{span:5}} labelAlign='left'>
            <Item name='deviceType' label='设备类型'>
              <Input style={{width:320}} disabled></Input>
            </Item>
            <Item name='deviceCategory' label='设备型号'>
              <Input style={{width:320}} disabled></Input>
            </Item>
            <Item name='deviceNumber' label='设备编号'>
              <Input style={{width:320}} disabled></Input>
            </Item>
            <Item name='deviceName' label='设备名称'>
              <Input style={{width:320}} disabled></Input>
            </Item>
            <Item name='multi' label='倍率'>
              <Input style={{width:320}}></Input>
            </Item>
            <div style={{marginLeft: 84, color:'#f00',fontSize: 12}}>
              <span>倍率=PT*CT!</span><br/>
              <span>修改倍率会影响结算金额，请保持平台设置和现场环境一致!</span>
            </div>
          </Form>
          
        </div>
      </Custmodl>
    </div>
  )
}
