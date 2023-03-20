import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import { useSelector } from 'react-redux'
import { Form, Row, Col, Select, Input, Divider, message,Button } from 'antd'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { MultImport,ErrorMessage } from './modalCom'
import { Monitoring } from '@api/api.js'
import { DeleteModal } from './modalCom'
import { MyContext } from './formcomp'
import style from './style.module.less'


const {
  DeviceManager: {
    QueryByPageCamera,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddCamera,
    UpdateCamera,
    DeleteCamera,
    ImportCamera,
    OneLevel
  }
} = Monitoring

export default function gateway({ deviceStyle }) {
  const [selectopts, setSelectopts] = useState([])
  const [gatewaylist, setGatewaylist] = useState()
  const [devicelist, setDevicelist] = useState()
  const [addopts, setAddOpts] = useState()
  const [alarmopts, setAlarmopts] = useState()
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10,
    hideOnSinglePage:false
  })
  const pageRef= useRef(page)
  pageRef.current=page
  const [dataSource, setDataSource] = useState([])
  const projectId = useSelector(state => state.system.menus.projectId)
  const compRef = useRef()
  const modalFormRef = useRef()
  const modalImportRef = useRef()
  const DelModalRef = useRef()
  const EditModalFormRef = useRef()
  const ErrModalRef = useRef()
  const errlistRef =useRef()
  const tableLoadRef = useRef()
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  const levelname =useRef("")
  let delid;
  let flies;
  let tag=false;
  let edittag=false
  const optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  const columns = [
    {
      title: '园区名称',
      dataIndex: 'areaName'
    },
    {
      title: '安装地址',
      dataIndex: 'address'
    },
    {
      title: '监控类型',
      dataIndex: 'accessMode',
      render: (text) => {
        return (
          <span>{text === 1 ? '云监控' : '本地监控'}</span>
        )
      }
    },
    {
      title: '监控设备SN',
      dataIndex: 'sn'
    },
    {
      title: '监控型号',
      dataIndex: 'category',
    },
    {
      title: '监控名称',
      dataIndex: 'name'
    },
    {
      title: '监控设备IP',
      dataIndex: 'serverAddress'
    },
    {
      title: '通道号',
      dataIndex: 'channel'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      dataIndex: 'options',
      render: (text, record) => {
        return (
          <p style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span style={optcss} onClick={() => { onEdit(record) }}>编辑</span>
            <span style={{ ...optcss, color: '#FF0000' }} onClick={() => { onDelete(record) }}>删除</span>
          </p>
        )
      }
    },
  ]
  for (let val of columns) {
    val.align = 'center'
  }
  //打开编辑窗口
  const onEdit = (record) => {
    EditModalFormRef?.current?.onOpen()
    editform.setFieldsValue({ ...record, port: record.port ? record.port : '' })
  }

  //确认编辑
  const editOk = async () => {
    editform.validateFields().then(async () => {
      let { id, areaId, address, remark, gatewayId, category, sn,
        name,
        accessMode,
        channel,
        serverAddress,
        port,
        ip,
        account,
        pwd,
      } = editform.getFieldValue()
      if (accessMode === 1) {
        serverAddress = ''
        port = 0
        ip = ''
        account = ''
        pwd = ''
      }
      let params = {
        id,
        projectId,
        areaId,
        address,
        remark,
        gatewayId,
        category,
        sn,
        name,
        manufacturer: 0,
        accessMode,
        channel,
        serverAddress,
        port,
        ip,
        account,
        pwd,
      }
      const resp = await UpdateCamera(params)
      if (resp.success) {
        message.success("更新成功")
        EditModalFormRef?.current?.onCancel()
        getQueryByPageCamera(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      } else {
        message.error(resp.errMsg)
      }
    })

  }
  const editSure=()=>{
    editform.validateFields().then(async () => {
      let { id, areaId, address, remark, gatewayId, category, sn,
        name,
        accessMode,
        channel,
        serverAddress,
        port,
        ip,
        account,
        pwd,
      } = editform.getFieldValue()
      if (accessMode === 1) {
        serverAddress = ''
        port = 0
        ip = ''
        account = ''
        pwd = ''
      }
      let params = {
        id,
        projectId,
        areaId,
        address,
        remark,
        gatewayId,
        category,
        sn,
        name,
        manufacturer: 0,
        accessMode,
        channel,
        serverAddress,
        port,
        ip,
        account,
        pwd,
      }
      const resp = await UpdateCamera(params)
      if (resp.success) {
        message.success("更新成功")
        edittag=true
        
       
      } else {
        message.error(resp.errMsg)
      }
    })
  }
  const  editCancel=()=>{
    if(edittag){
      getQueryByPageCamera(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
    }
    EditModalFormRef?.current?.onCancel()
  }
  //打开删除窗口
  const onDelete = (record) => {
    DelModalRef?.current?.onOpen()
    delid = record.id
  }
  //确认删除
  const delOk = async () => {

    const { success, errMsg } = await DeleteCamera({
      projectId,
      id: delid
    })
    if (success) {
      message.success('删除成功')
      if(page.total%(page.pageSize*(page.current-1 ))===1){
        setPage({
          ...page,
          current:page.current-1
        })
      }
      DelModalRef?.current?.onCancel()
      setTimeout(()=>{
        getQueryByPageCamera(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      },0)
      
 
    } else {
      message.error(errMsg)
    }
  }


  //打开新增窗口
  const addopen = () => {
    if(!levelname.current){
      message.warning('请添加区域')
      return 
    }
    addform.setFieldsValue({
      areaId: '',
      address: '',
      remark: '',
      gatewayId: '',
      category: '',
      sn: '',
      name: '',
      manufacturer: 0,
      serverAddress: '',
      port: '',
      ip: '',
      account: '',
      pwd: '',
      address: '',
      channel: '',
      accessMode: "",
    })
    modalFormRef?.current?.onOpen()

  }
  //确认新增
  const addOk = async () => {
    addform.validateFields().then(async () => {
      const formvalue = addform.getFieldsValue()
      let params = {
        id: 0,
        projectId,
        areaId: formvalue.areaId,
        address: formvalue.address,
        remark: formvalue.remark,
        gatewayId: formvalue.gatewayId,
        category: formvalue.category,
        sn: formvalue.sn,
        name: formvalue.name,
        manufacturer: 0,
        accessMode: formvalue.accessMode,
        serverAddress: formvalue.serverAddress ? formvalue.serverAddress : "",
        port: formvalue.port ? formvalue.port : 0,
        ip: formvalue.ip ? formvalue.ip : "",
        account: formvalue.account ? formvalue.account : "",
        pwd: formvalue.pwd ? formvalue.pwd : "",
        address: formvalue.address ? formvalue.address : "",
        channel: formvalue.channel
      }
      const res = await AddCamera(params)
      if (res.success) {
        message.success('新增成功!')
        modalFormRef?.current?.onCancel()
        getQueryByPageCamera(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      } else {
        message.error(res.errMsg)
      }
    })



  }
  const addSure=async ()=>{
    addform.validateFields().then(async () => {
      const formvalue = addform.getFieldsValue()
      let params = {
        id: 0,
        projectId,
        areaId: formvalue.areaId,
        address: formvalue.address,
        remark: formvalue.remark,
        gatewayId: formvalue.gatewayId,
        category: formvalue.category,
        sn: formvalue.sn,
        name: formvalue.name,
        manufacturer: 0,
        accessMode: formvalue.accessMode,
        serverAddress: formvalue.serverAddress ? formvalue.serverAddress : "",
        port: formvalue.port ? formvalue.port : 0,
        ip: formvalue.ip ? formvalue.ip : "",
        account: formvalue.account ? formvalue.account : "",
        pwd: formvalue.pwd ? formvalue.pwd : "",
        address: formvalue.address ? formvalue.address : "",
        channel: formvalue.channel
      }
      const res = await AddCamera(params)
      if (res.success) {
        message.success('新增成功!')
        tag=true
       
       
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const addCancel=()=>{
    if(tag){
      getQueryByPageCamera(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
    }
    modalFormRef?.current?.onCancel()
  }
  //打开批量导入窗口
  const multExport = () => {
    modalImportRef?.current?.onOpen()
  }
   //获取第一级区域名
   const getOneLevel=async()=>{
    const res =  await OneLevel(projectId)
    if(res.success &&res.data){
      levelname.current=res.data.name
      getAeraQueryAll(res.data.name)
    }else{
     message.error(res.errMsg)
    }
   }
  //获取园区
  const getAeraQueryAll = async (name) => {
    try {
      const resp = await AeraQueryAll(projectId)
      if (resp.success && Array.isArray(resp.data)) {
        const data = [{ name: name, id: 0 }, ...resp.data]
        setSelectopts(() => [...data])
        setAddOpts(() => [...resp.data])
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取已使用的电表列表
  const getQueryUsedDeviceCategory = async () => {
    try {
      const resp = await QueryUsedDeviceCategory({
        projectId,
        deviceStyle
      })
      if (resp.success && Array.isArray(resp.data)) {
        let arr = resp.data.map(it => ({ label: it, value: it }))
        setDevicelist(() => ([...arr]))
      } else {
        setDevicelist([])
      }
    } catch (e) { console.log(e) }
  }
  //获取网关
  const getQueryListGateWay = async () => {
    try {
      const resp = await QueryListGateWay(projectId)
      if (resp.success && Array.isArray(resp.data)) {
        const arr = resp.data.map(it => ({ ...it }))
        setGatewaylist(() => ([{ sn: '(无)直连设备', id: 0 }, ...arr]));
      } else {
        setDevicelist([])
      }
    } catch (e) { console.log(e) }

  }
  //获取告警计划
  const getQueryPlanList = async () => {
    const res = await QueryPlanList(projectId)
    console.log(res)

    if (res.success && Array.isArray(res.data)) {
      setAlarmopts([{ label: '不启用告警方案', value: 0 }, ...res.data])
    } else {
      setAlarmopts([{ label: '不启用告警方案', value: 0 }])
    }
  }
  //获取视频监控列表
  const getQueryByPageCamera = async (curpage=0,pageSize=0,id, like, customerType) => {
    setLoading(true)
    let params = {
      projectId,
      pageNum: curpage?curpage:pageRef.current.current,
      pageSize:pageSize?pageSize:pageRef.current.pageSize,
      areaId: id ? id: 0,
      alike: like ? like : '',
      customerType: customerType ? customerType : 0
    }
    const resp = await QueryByPageCamera(params)
    setPage(() => ({
      ...page,
      current:resp.pageNum,
      pageSize: resp.pageSize,
      total: resp.total
    }))
    setLoading(false)
    if (resp.success && Array.isArray(resp.data)) {
      setDataSource([...resp.data])
      
    } else {
      setDataSource([])
    }
  }
  //分页跳转
  const changePage=(page, pageSize) => {
      setPage(()=>({
        ...page
      }))
      getQueryByPageCamera(page.current,page.pageSize,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
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
    const res = await ImportCamera(formData)
    if(res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        getQueryByPageCamera(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      }else if(res.data.data && Array.isArray(res.data.data)){
        errlistRef.current.setList([...res.data.data])
        ErrModalRef.current.onOpen()
      } else{
        message.error(res.data.errMsg)
      }
    }else{
      message.error(res.errMsg)
    }
  }


  useEffect(() => {
    // getAeraQueryAll()
    getOneLevel()
    getQueryUsedDeviceCategory()
    getQueryPlanList()
    getQueryListGateWay()
    getQueryByPageCamera()
  }, [])

  //传入props对象
  const ComProps = {
    addopen,
    isenergy: false,
    multExport,
    ref: compRef,
    selectopts,
    setPage,
    page,
    exportExecel,
    getList: getQueryByPageCamera
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746,
    name: '新增视频监控',
    addopts,
    gatewaylist,
    devicelist,
    onOk: addOk,
    onSure:addSure,
    onCancel:addCancel,
   
  }
  const uploadprops = {
    maxCount: 1,
    beforeUpload(file,fileList){
      console.log(file,fileList)
      flies=[...fileList]
      return false
    }
  };
  const ImportProps = {
    modalImportRef,
    width: 560,
    link:'/deviceExcel/camera.xlsx',
    name:'视频监控设备导入',
    uploadprops,
    onOk:onImportOk
  }
  const EditModalFormProps = {
    EditModalFormRef,
    width: 746,
    name: '编辑视频监控',
    onOk: editOk,
    onSure:editSure,
    onCancel: editCancel
  }
  const ErrModalProps = {
    ErrModalRef,
    ref:errlistRef,
    onOk:()=>{ErrModalRef.current.onCancel()}
  }

  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns}  dataSource={dataSource} pagination={page} loading={loading} onChange={changePage } ref={tableLoadRef}></Table>
      </Comp>
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: addform, deviceStyle, levelname }}>
        <AddModalForm {...ModalFormProps} >
        </AddModalForm>
      </MyContext.Provider>
      <MultImport {...ImportProps}></MultImport>
      <DeleteModal DelModalRef={DelModalRef} name="删除提示" content="是否确认删除视频监控？" onOk={delOk}></DeleteModal>
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: editform, deviceStyle,levelname }}>
        <EditModalForm {...EditModalFormProps}></EditModalForm>
      </MyContext.Provider>
      <ErrorMessage {...ErrModalProps}></ErrorMessage>
    </div>
  )
}


//新增form表单组件
export const FormComp = (props) => {
  const { TextArea } = Input
  const { addopts, gatewaylist, devicelist, alarmopts, form, levelname } = useContext(MyContext)
  const [camera, setCamera] = useState(2)
  const rules = [{
    required: true
  }]
  console.log(583,levelname)
  const channelList = Array(1, 2, 3, 4, 5, 6, 7, 8).map((item, index) => ({ label: index + 1, value: index + 1 }))
  const pattern = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/;

  const changeCameraType = (v, option) => {
    setCamera(v)
  }
  return (
    <Form
      labelAlign="left"
      form={form}
      colon={false}
      labelCol={{
        span: 8
      }}
      validateTrigger="onFinish"
    >
      <Row className={style.customItem}>
        <Col flex={1} style={{ minHeight: 536 }}>
          <Form.Item label={levelname.current} name="areaId" rules={rules} >
            <Select
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
              options={addopts}
            ></Select>
          </Form.Item>
          <Form.Item label="安装地址" name="address" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="remark" >
            <TextArea />
          </Form.Item>
        </Col>
        <Col>
          <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
        </Col>
        <Col flex={1}>
          <Form.Item label="设备型号" name="category" rules={rules}>
            <Select
              options={devicelist}
            ></Select>
          </Form.Item>
          <Form.Item label="监控类型" name="accessMode" rules={rules}>
            <Select
              onChange={changeCameraType}
              options={[
                {
                  label: '云监控',
                  value: 1
                },
                {
                  label: '本地监控',
                  value: 2
                }
              ]}
            ></Select>
          </Form.Item>
          <Form.Item label="设备编号" name="sn" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="设备名称" name="name" rules={rules}>
            <Input />
          </Form.Item>
          {
            camera === 2 ? <>
              <Form.Item label="流媒体服务器" name="serverAddress" rules={[{ required: true }, { pattern: pattern, message: '请输入正确的IP地址' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="端口号" name="port" rules={[{ required: true }, {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve()
                  } else {
                    if (Number(value) && value >= 1 && value < 65535) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject(new Error('请输入正确的端口号(1~65535)'))
                    }
                  }
                }
              }]}>
                <Input />
              </Form.Item>
              <Form.Item label="设备IP地址" name="ip" rules={[{ required: true }, { pattern: pattern, message: '请输入正确的IP地址' }]}>
                <Input />
              </Form.Item>
            </> : null
          }

          <Form.Item label="通道号" name="channel" rules={rules}>
            <Select options={channelList}></Select>
          </Form.Item>
          {
            camera === 2 ? <>
              <Form.Item label="用户名" name="account" rules={rules}>
                <Input />
              </Form.Item>
              <Form.Item label="密码" name="pwd" rules={rules}>
                <Input />
              </Form.Item>
            </> : null
          }

        </Col>
      </Row>
    </Form>
  )
}
//新增设备
export let AddModalForm = ({ modalFormRef, ...other }) => {
  return (
    <Modal mold='cust' ref={modalFormRef} {...other} footer={[
      <Button onClick={other.onCancel}>取消</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onOk}>保存</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onSure}>应用</Button>,
  ]}>
      <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
      <FormComp >
      </FormComp>
    </Modal>
  )

}




//编辑设备
export const EditModalForm = ({ EditModalFormRef, ...other }) => {
  return (
    <Modal mold='cust' ref={EditModalFormRef} {...other} footer={[
      <Button onClick={other.onCancel}>取消</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onOk}>保存</Button>,
      <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onSure}>应用</Button>,
  ]}>
      <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
      <EditFormComp >
      </EditFormComp>
    </Modal>
  )

}

//编辑form表单组件
export const EditFormComp = (props) => {
  const { TextArea } = Input
  const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle,levelname } = useContext(MyContext)
  const [camera, setCamera] = useState(2)
  const rules = [{
    required: true
  }]
  const channelList = Array(1, 2, 3, 4, 5, 6, 7, 8).map((item, index) => ({ label: index + 1, value: index + 1 }))
  const pattern = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/;
  const changeCameraType = (v, option) => {
    setCamera(v)
  }
  useEffect(() => {
    setCamera(form.getFieldValue("accessMode"))
  }, [])
  return (
    <Form
      labelAlign="left"
      form={form}
      colon={false}
      labelCol={{
        span: form.getFieldValue("accessMode") === 2 ? 8 : 7
      }}
      validateTrigger="onFinish"
    >
      <Row className={style.customItem} style={{ minHeight: 536 }}>
        <Col flex={1}>
          <Form.Item label={levelname.current} name="areaId" rules={rules}>
            <Select
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
              options={addopts}
            ></Select>

          </Form.Item>
          <Form.Item label="安装地址" name="address" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="remark" rules={rules}>
            <TextArea />
          </Form.Item>
        </Col>
        <Col>
          <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
        </Col>
        <Col flex={1}>
          <Form.Item label="设备型号" name="category" rules={rules}>
            <Select
              options={devicelist}
            ></Select>
          </Form.Item>
          <Form.Item label="监控类型" name="accessMode" rules={rules}>
            <Select
              onChange={changeCameraType}
              options={[
                {
                  label: '云监控',
                  value: 1
                },
                {
                  label: '本地监控',
                  value: 2
                }
              ]}
            ></Select>
          </Form.Item>
          <Form.Item label="设备编号" name="sn" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="设备名称" name="name" rules={rules}>
            <Input />
          </Form.Item>
          {
            camera === 2 ? <>
              <Form.Item label="流媒体服务器" name="serverAddress" rules={[{ required: true }, { pattern: pattern, message: '请输入正确的IP地址' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="端口号" name="port" rules={[{ required: true }, {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve()
                  } else {
                    if (Number(value) && value >= 1 && value < 65535) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject(new Error('请输入正确的端口号(1~65535)'))
                    }
                  }
                }
              }]}>
                <Input />
              </Form.Item>
              <Form.Item label="设备IP地址" name="ip" rules={[{ required: true }, { pattern: pattern, message: '请输入正确的IP地址' }]}>
                <Input />
              </Form.Item>
            </> : null
          }

          <Form.Item label="通道号" name="channel" rules={rules}>
            <Select options={channelList}></Select>
          </Form.Item>
          {
            camera === 2 ? <>
              <Form.Item label="用户名" name="account" rules={rules}>
                <Input />
              </Form.Item>
              <Form.Item label="密码" name="pwd" rules={rules}>
                <Input />
              </Form.Item>
            </> : null
          }
        </Col>
      </Row>
    </Form>
  )
}



















