import React, { useEffect, useRef, useState,useContext } from 'react'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import { MultImport, DeleteModal ,ErrorMessage } from './modalCom'
import restart from './imgs/restart.png'
import { Form, Row, Col, Select, Input, Divider, Upload, message,Button } from 'antd'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import cutContext from  '@com/content'
const { DeviceManager:
  { AeraQueryAll,
    QueryUsedGateway,
    GatewayAdd,
    QueryByPageGateWay,
    GatewayUpdate,
    GatewayDelete,
    GatewayImport,
    OneLevel,
    StartReboot } } = Monitoring
export default function gateway() {
  const [selectopts, setSelectopts] = useState()
  const [addopts, setAddOpts] = useState()
  const [usecategory, setUsecategory] = useState()
  const [dataSource, setDataSource] = useState()
  const [delId, setDelId] = useState()
  const [gatewaySn, setGatewaySn] = useState('')
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10,
    hideOnSinglePage: false
  })
  const pageRef = useRef(page)
  pageRef.current = page
  const compRef = useRef()
  const modalFormRef = useRef() //新增Ref
  const modalEditRef = useRef() //编辑Ref
  const modalImportRef = useRef() //导入Ref
  const modalReStartRef = useRef() //重启Ref
  const keyParamRef = useRef() //参数下发Ref
  const modalDelRef = useRef() //删除Ref
  const tableLoadRef = useRef()
  const errlistRef =useRef()
  const ErrModalRef = useRef()
  const [editform] = Form.useForm()
  const [addForm] = Form.useForm()
  const content =useContext(cutContext)
  const oneLevel = useSelector(state=>state.system.onelevel)
  const projectId = useSelector(state => state.system.menus.projectId)
  const levelname =useRef()
  const optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  let startsn;
  let flies;
  let tag=false;
  let edittag=false
  const columns = [
    {
      title: oneLevel[0]?.levelName?oneLevel[0].levelName:'园区名称',
      dataIndex: 'areaName'
    },
    {
      title: '安装地址',
      dataIndex: 'address'
    },
    {
      title: '网关编号',
      dataIndex: 'sn'
    },
    {
      title: '网关型号',
      dataIndex: 'category'
    },
    {
      title: '网关名称',
      dataIndex: 'name'
    },
    {
      title: 'IMEI',
      dataIndex: 'imei'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      dataIndex: '8',
      width: 304,
      render: (text, record, index) => {
        return (
          <p style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span style={optcss} onClick={() => { onRestart(record) }}>重启</span>
            <span style={optcss} onClick={() => { onKeyParam(record) }}>参数下发</span>
            <span style={optcss} onClick={() => { onEdit(record) }}>编辑</span>
            <span style={{ ...optcss, color: '#FF0000' }} onClick={() => { onDelete(record) }}>删除</span>
          </p>
        )
      }
    },
  ]
  columns.forEach(it => it.align = 'center')
  //打开参数下发弹窗
  const onKeyParam = (record) => {
    setGatewaySn(record.sn)
    keyParamRef?.current?.onOpen()
  }
  //打开重启网关弹窗
  const onRestart = (record) => {
    console.log(record)
    modalReStartRef?.current?.onOpen()
    startsn = record.sn
  }
  //打开编辑网关窗口
  const onEdit = (record) => {
    modalEditRef?.current?.onOpen()
    console.log(record)
    editform.setFieldsValue({
      ...record,
      area: record.areaName
    })
  }
  //打开新增网关窗口
  const addopen = () => {
    if(!levelname.current){
      message.warning('请先添加区域名称')
      return
    }
    modalFormRef?.current?.onOpen()
    addForm.setFieldsValue({
      area: '',
      address: '',
      remark: '',
      category: '',
      sn: '',
      pwd: '',
      name: '',
      heartInterval: ''
    })
  }
  //打开批量导入窗口
  const multExport = () => {
    modalImportRef?.current?.onOpen()
  }
  //打开删除窗口
  const onDelete = (record) => {
    setDelId(record.id)
    modalDelRef?.current?.onOpen()
  }
  //获取第一级区域名
  const getOneLevel=async()=>{
    const res =  await OneLevel(projectId)
    if(res.success){
      levelname.current =res.data.name
      getAeraQueryAll(res.data.name)
    }else{
     message.error(res.errMsg)
    }
   }
  //获取园区
  const getAeraQueryAll = async (name) => {
    try {
      console.log(content)
      const resp = await AeraQueryAll(projectId)
      if (resp.success && Array.isArray(resp.data)) {
        const data = [{ name, id: 0 }, ...resp.data]
        console.log(data)
        setSelectopts([...data])
        setAddOpts([...resp.data])
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取网关列表
  const getQueryByPageGateWay = async (curpage = 0, pageSize = 0, id = 0, like = '') => {
    setLoading(true)
    let params = {
      projectId,
      pageNum: curpage ? curpage : pageRef.current.current,
      pageSize: pageSize ? pageSize : pageRef.current.pageSize,
      areaId: id ? id : 0,
      alike: like ? like : '',
    }

    const resp = await QueryByPageGateWay(params)
    setLoading(false)
    setPage({
      ...page,
      current: resp.pageNum,
      pageSize: resp.pageSize,
      total: resp.total
    })
    if (resp.success && Array.isArray(resp.data)) {
      setDataSource(() => resp.data)
    } else {
      console.log('setdata[]')
      setDataSource([])
    }
  }
  //获取已使用网关型号
  const getQueryUsedGateway = async () => {
    try {
      const { data, success, errMsg } = await QueryUsedGateway(projectId)
      if (success) {
        const mapdata = data.map((it) => {
          return {
            label: it,
            value: it
          }
        })
        setUsecategory([...mapdata])
      }
    } catch (e) {
      console.log(e)
    }

  }
  //确认新增
  const addOk = () => {
    addForm.validateFields().then(async () => {
      const { area, category, address, sn, pwd, name, heartInterval, remark } = addForm.getFieldsValue()
      let params = {
        id: 0,
        projectId,
        areaId: area,
        address,
        category,
        sn,
        pwd,
        name,
        heartInterval:heartInterval? parseInt(heartInterval):30,
        remark
      }
      const { data, success, errMsg } = await GatewayAdd(params)
      if (success) {
        message.success('新增成功')
        modalFormRef.current.onCancel()
        getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue,)
      } else {
        message.error(errMsg)
      }
    })

  }
  //确认新增应用
  const addSure=()=>{
    addForm.validateFields().then(async () => {
      const { area, category, address, sn, pwd, name, heartInterval, remark } = addForm.getFieldsValue()
      let params = {
        id: 0,
        projectId,
        areaId: area,
        address,
        category,
        sn,
        pwd,
        name,
        heartInterval:heartInterval? parseInt(heartInterval):30,
        remark
      }
      const { data, success, errMsg } = await GatewayAdd(params)
      if (success) {
        message.success('应用成功')
        tag=true; 
      } else {
        message.error(errMsg)
      }
    })
  }
  const cancelOk = () => {
    if(tag){
      getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue)
    }
    modalFormRef.current.onCancel()
  }
  //确认编辑
  const editOk = async () => {
    editform.validateFields().then(async () => {
      const { areaId, category, address, sn, pwd, name, heartInterval, remark, id } = editform.getFieldValue()
      let params = {
        id: id,
        projectId,
        areaId,
        address,
        category,
        sn,
        pwd,
        name,
        heartInterval: parseInt(heartInterval),
        remark
      }
      console.log(params)
      const { data, success, errMsg } = await GatewayUpdate(params)
      if (success) {
        message.success('更新成功')
        modalEditRef.current.onCancel()
        getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue)
      } else {
        message.error(errMsg)
      }
    })
  }
  //确认编辑应用
  const editSure=()=>{
    editform.validateFields().then(async () => {
      const { areaId, category, address, sn, pwd, name, heartInterval, remark, id } = editform.getFieldValue()
      let params = {
        id: id,
        projectId,
        areaId,
        address,
        category,
        sn,
        pwd,
        name,
        heartInterval: parseInt(heartInterval),
        remark
      }
      console.log(params)
      const { data, success, errMsg } = await GatewayUpdate(params)
      if (success) {
        message.success('更新成功')
        edittag=true
      } else {
        message.error(errMsg)
      }
    })
  }
  const editCancel=()=>{
    if(edittag){
      getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue)
    }
    modalEditRef.current.onCancel()
       
  }
  //确认删除
  const delOk = async () => {
    let params = {
      projectId,
      id: delId
    }
    const resp = await GatewayDelete(params)
    if (resp.success) {
      modalDelRef?.current?.onCancel()
      message.success('删除成功!')
      if (page.total % (page.pageSize * (page.current - 1)) === 1) {
        setPage({
          ...page,
          current: page.current - 1
        })
      }
      setTimeout(() => {
        getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue,)
      }, 0)


    } else {
      message.error(resp.errMsg)
    }
  }
  //确认重启
  const startOk = async () => {
    //  const res = await StartReboot(startsn) 
    //  if(res.success){
    //   message.success('重启成功')
    //  }else{
    //   message.error(res.errMsg)
    //  }
  }
 
  //导出
  const exportExecel = () => {
    tableLoadRef.current.download()
  }
  //批量上传
  const onImportOk = async () => {
    const formData = new FormData()
    formData.append("file", flies[0])
    formData.append("projectId", projectId)
    const res = await GatewayImport(formData)
    if(res.success){
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        // getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue,)
        getQueryByPageGateWay(1, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue,)
        setPage({
          ...page,
          current:1
        })
        // pageRef.current.current =1
      } else if(res.data.data && Array.isArray(res.data.data)){
        errlistRef.current.setList([...res.data.data])
        ErrModalRef.current.onOpen()
      }else{
        message.error(res.data.errMsg)
      }
    }else{
      message.error(res.errMsg)
    }
    
  }
  const ComProps = {
    addopen,
    multExport,
    ref: compRef,
    selectopts,
    page,
    setPage,
    exportExecel,
    levelname,
    placeholder:'输入网关编号/安装地址',
    getList: getQueryByPageGateWay,
  }
  let ModalFormProps = {
    modalFormRef,
    width: 746,
    addopts,
    selectopts,
    addForm,
    usecategory,
    onOk: addOk,
    onCancel: cancelOk,
    onSure: addSure,
    levelname
  }
  const uploadprops = {
    maxCount:1,
    beforeUpload(file, fileList) {
      console.log(file, fileList)
      flies = [...fileList]
      return false
    }
  };
  const ImportProps = {
    modalImportRef,
    width: 560,
    link: '/deviceExcel/gateway.xlsx',
    name: '网关设备批量导入',
    uploadprops,
    onOk: onImportOk
  }
  const EditProps = {
    modalEditRef,
    editform,
    width: 772,
    onOk: editOk,
    onSure:editSure,
    onCancel: editCancel,
    levelname
  }

  const ErrModalProps = {
    ErrModalRef,
    ref:errlistRef,
    onOk:()=>{ErrModalRef.current.onCancel()}
  }
  useEffect(() => {
    if(oneLevel?.length>0){
      getOneLevel()
      getQueryByPageGateWay()
      getQueryUsedGateway()
    }   
  }, [])

  return (
    <div>
      <Comp {...ComProps}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={page}
          loading={loading}
          ref={tableLoadRef}
          onChange={(page, pageSize) => {
            setPage(() => ({
              ...page
            }))
            getQueryByPageGateWay(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue)
          }}></Table>
      </Comp>
      <AddModalForm {...ModalFormProps}></AddModalForm>
      <MultImport {...ImportProps}></MultImport>
      <ReStart modalReStartRef={modalReStartRef} startOk={startOk}></ReStart>
      <KeyParam keyParamRef={keyParamRef} gatewaySn={gatewaySn}></KeyParam>
      <DeleteModal DelModalRef={modalDelRef} name="删除网关" content="是否确认删除网关？" onOk={delOk}></DeleteModal>
      <EditModalForm {...EditProps}></EditModalForm>
      <ErrorMessage {...ErrModalProps}></ErrorMessage>
    
    </div>
  )
}

//新增网关组件
let AddModalForm = ({ modalFormRef, addopts, addForm, usecategory, levelname,...other }) => {
  const rules ={ required: true,}
  return (
    <Modal mold='cust' ref={modalFormRef} {...other} footer={[
      <Button onClick={other.onCancel}>取消</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onOk}>保存</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onSure}>应用</Button>,
  ]}>
      <BlueColumn name="新增网关" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form
        form={addForm}
        labelCol={{
          span: 6
        }}
        labelAlign='left'
        
      >
        <Row className={style.customItem}>
          <Col flex={1}>
            <Form.Item label={levelname.current} name="area" rules={[rules]}>
              <Select
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
                options={addopts}

              ></Select>
            </Form.Item>
            <Form.Item label="安装地址" name="address" rules={[rules]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="备注信息" name="remark">
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
          </Col>
          <Col flex={1}>
            <Form.Item label="网关型号" name="category" rules={[rules]}>
              <Select
                options={usecategory}
              ></Select>
            </Form.Item>
            <Form.Item label="网关编号" name="sn" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="网关密码" name="pwd" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="网关名称" name="name" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="心跳周期" name="heartInterval" rules={[{pattern:  /^[1-9]+[0-9]*$/,message:'心跳周期需为正整数'}]}>
              <Count></Count>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  )

}

//计数器组件
let Count = ({ value, onChange }) => {
  console.log(value)
  const [number, setNumber] = useState(value ? value : 30)
  
  const reduce = () => {
    number > 0 && setNumber(number - 1)
    onChange(number - 1)
  }

  const add = () => {
    setNumber(number + 1)
    onChange(number + 1)
  }
  const inpBlur = (e) => {


  }
  return (
    <div className={style.countNum}>
      <div onClick={reduce} className={style.opts} style={{ borderRight: 'none' }}>-</div>
      <Input className={style.numbers} defaultValue={number} onBlur={inpBlur} value={number} onChange={(e) => { setNumber(e.target.value); onChange(e.target.value) }} />
      <div onClick={add} className={style.opts} style={{ borderLeft: 'none' }}>+</div>
      <span style={{ paddingLeft: 16 }}>(秒)</span>
    </div>
  )
}
//重启网关组件
let ReStart = ({ modalReStartRef, startOk }) => {
  return (
    <Modal mold='cust' ref={modalReStartRef} onOk={startOk}>
      <BlueColumn name="重启提示" styled={{ padding: '24px 0px', color: '#237ae4' }}></BlueColumn>
      <div style={{ margin: '16px 32px 0' }}>
        <img src={restart}></img>
        <span style={{ paddingLeft: 32, fontSize: 16 }}>确认要重启网关？</span>
      </div>

    </Modal>
  )
}
//参数下发组件
const KeyParam = ({ keyParamRef, gatewaySn }) => {
  return (
    <Modal mold='cust' ref={keyParamRef}>
      <BlueColumn name="网关参数下发" styled={{ padding: '24px 0px', color: '#237ae4' }}></BlueColumn>
      <div style={{ margin: '16px 32px 0', display: 'flex', alignItems: 'center' }}>
        <div><img src={restart}></img></div>
        <div style={{ paddingLeft: 32, fontSize: 16 }}>
          <p>网关编号:{gatewaySn}</p>
          <p>是否对本网关参数下发?</p>
        </div>
      </div>
    </Modal>
  )
}
//编辑网关
const EditModalForm = ({ modalEditRef, editform,levelname, ...other }) => {
  const rules ={ required: true,}
  return (
    <Modal mold='cust' ref={modalEditRef} {...other} footer={[
      <Button onClick={other.onCancel}>取消</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onOk}>保存</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onSure}>应用</Button>,
  ]}>
      <BlueColumn name="编辑网关" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Form
        form={editform}
        labelCol={{
          span: 6
        }}
        labelAlign='left'
      >
        <Row className={style.customItem}>
          <Col flex={1}>
            <Form.Item label={levelname.current} name="area" rules={[rules]}>
              <Select
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
                disabled
              ></Select>
            </Form.Item>
            <Form.Item label="安装地址" name="address" rules={[rules]} >
              <Input />
            </Form.Item>
            <Form.Item label="备注信息" name="remark" >
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
          </Col>
          <Col flex={1}>
            <Form.Item label="网关型号" name="category" rules={[rules]}>
              <Select
                disabled
              ></Select>
            </Form.Item>
            <Form.Item label="网关编号" name="sn" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="网关密码" name="pwd" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="网关名称" name="name" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="心跳周期" name="heartInterval" rules={[{pattern: /^[1-9]+[0-9]*$/,message:'心跳周期需为正整数'}]}>
              <Count></Count>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
