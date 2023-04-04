import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import { useSelector } from 'react-redux'
import { Form, Row, Col, Select, Input, Divider, message, Button } from 'antd'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { MultImport, ErrorMessage } from './modalCom'
import { Monitoring } from '@api/api.js'
import { DeleteModal } from './modalCom'
import { MyContext } from './formcomp'
import style from './style.module.less'
import { publishState } from '@redux/systemconfig'
const {
  DeviceManager: {
    QueryByPageSensor,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddSensor,
    UpdateSensor,
    DeleteSensor,
    ImportSensor,
    OneLevel
  }
} = Monitoring

export default function gateway({ deviceStyle }) {
  const publish = useSelector(publishState)
  const [selectopts, setSelectopts] = useState([])
  const [gatewaylist, setGatewaylist] = useState()
  const [devicelist, setDevicelist] = useState()
  const [addopts, setAddOpts] = useState()
  const [alarmopts, setAlarmopts] = useState()
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10,
    hideOnSinglePage: false
  })
  const pageRef = useRef(page)
  pageRef.current = page
  const [dataSource, setDataSource] = useState([])
  const oneLevel = useSelector(state => state.system.onelevel)
  const projectId = useSelector(state => state.system.menus.projectId)
  const compRef = useRef()
  const modalFormRef = useRef()
  const modalImportRef = useRef()
  const DelModalRef = useRef()
  const EditModalFormRef = useRef()
  const ErrModalRef = useRef()
  const errlistRef = useRef()
  const tableLoadRef = useRef()
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  const levelname = useRef("")
  let delid;
  let flies;
  let tag = false;
  let edittag = false
  const optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  let columns = [
    {
      title: oneLevel[0]?.levelName ? oneLevel[0].levelName : '园区名称',
      dataIndex: 'areaName'
    },
    {
      title: '安装地址',
      dataIndex: 'address'
    },
    {
      title: '传感器型号',
      dataIndex: 'category'
    },
    {
      title: '传感器编号',
      dataIndex: 'sn'
    },

    {
      title: '传感器名称',
      dataIndex: 'name'
    },
    {
      title: '所属网关',
      dataIndex: 'gatewayName',
      render: (text, record, index) => {
        if (Array.isArray(gatewaylist)) {
          const gatewayfilter = gatewaylist.filter(it => it.id === record.gatewayId)
          return (
            <span>{gatewayfilter[0]['id'] === 0 ? '/' : gatewayfilter[0].sn}</span>
          )
        }

      }
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      dataIndex: 'options',
      width: 136,
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
  if (publish) {
    columns.pop()
  }
  //打开编辑窗口
  const onEdit = (record) => {
    console.log(record)
    EditModalFormRef?.current?.onOpen()
    editform.setFieldsValue({ ...record })
  }

  //确认编辑
  const editOk = async () => {
    editform.validateFields().then(async () => {
      const {
        id,
        areaId,
        alarmPlanId,
        address,
        remark,
        gatewayId,
        category,
        sn,
        name,
        customerType,
        commPort,
        commProtocol,
        commAddress,
        factor } = editform.getFieldValue()
      let params = {
        id,
        projectId,
        areaId,
        alarmPlanId,
        address,
        remark,
        gatewayId,
        category,
        sn,
        name,
        customerType,
        commPort,
        commProtocol,
        commAddress,
        factor
      }
      const resp = await UpdateSensor(params)
      if (resp.success) {
        message.success("更新成功")
        EditModalFormRef?.current?.onCancel()
        getQueryByPageSensor(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else {
        message.error(resp.errMsg)
      }
    })

  }
  //确认编辑应用
  const editSure = async () => {
    editform.validateFields().then(async () => {
      const {
        id,
        areaId,
        alarmPlanId,
        address,
        remark,
        gatewayId,
        category,
        sn,
        name,
        customerType,
        commPort,
        commProtocol,
        commAddress,
        factor } = editform.getFieldValue()
      let params = {
        id,
        projectId,
        areaId,
        alarmPlanId,
        address,
        remark,
        gatewayId,
        category,
        sn,
        name,
        customerType,
        commPort,
        commProtocol,
        commAddress,
        factor
      }
      const resp = await UpdateSensor(params)
      if (resp.success) {
        message.success("更新成功")
        edittag = true

      } else {
        message.error(resp.errMsg)
      }
    })
  }
  const editCancel = () => {
    if (edittag) {

      getQueryByPageSensor(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
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
    const { success, errMsg } = await DeleteSensor({
      projectId,
      id: delid
    })
    if (success) {
      message.success('删除成功')
      if (page.total % (page.pageSize * (page.current - 1)) === 1) {
        setPage({
          ...page,
          current: page.current - 1
        })
      }
      DelModalRef?.current?.onCancel()
      setTimeout(() => {
        getQueryByPageSensor(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      }, 0)

    } else {
      message.error(errMsg)
    }

  }


  //打开新增窗口
  const addopen = () => {
    if (!levelname.current) {
      message.warning('请添加区域')
      return
    }
    addform.setFieldsValue({
      areaId: '',
      alarmPlanId: '',
      address: '',
      remark: '',
      gatewayId: '',
      category: '',
      sn: '',
      name: '',
      customerType: 0,
      commPort: '',
      commProtocol: 0,
      commAddress: '',
      factor: 0
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
        alarmPlanId: formvalue.alarmPlanId,
        address: formvalue.address,
        remark: formvalue.remark,
        gatewayId: formvalue.gatewayId,
        category: formvalue.category,
        sn: formvalue.sn,
        name: formvalue.name,
        customerType: 0,
        commPort: formvalue.commPort,
        commProtocol: 0,
        commAddress: formvalue.commAddress,
        factor: 1
      }
      const res = await AddSensor(params)
      if (res.success) {
        message.success('新增成功!')
        modalFormRef?.current?.onCancel()
        getQueryByPageSensor(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else {
        message.error(res.errMsg)
      }
    })



  }
  //确认新增应用
  const addSure = async () => {
    addform.validateFields().then(async () => {
      const formvalue = addform.getFieldsValue()
      let params = {
        id: 0,
        projectId,
        areaId: formvalue.areaId,
        alarmPlanId: formvalue.alarmPlanId,
        address: formvalue.address,
        remark: formvalue.remark,
        gatewayId: formvalue.gatewayId,
        category: formvalue.category,
        sn: formvalue.sn,
        name: formvalue.name,
        customerType: 0,
        commPort: formvalue.commPort,
        commProtocol: 0,
        commAddress: formvalue.commAddress,
        factor: 1
      }
      const res = await AddSensor(params)
      if (res.success) {
        message.success('新增成功!')
        tag = true


      } else {
        message.error(res.errMsg)
      }
    })
  }
  const addCancel = () => {
    if (tag) {
      getQueryByPageSensor(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
    }
    modalFormRef?.current?.onCancel()
  }
  //打开批量导入窗口
  const multExport = () => {
    modalImportRef?.current?.onOpen()
  }
  //获取第一级区域名
  const getOneLevel = async () => {
    const res = await OneLevel(projectId)
    if (res.success && res.data) {
      levelname.current = res.data.name
      getAeraQueryAll(res.data.name)

    } else {
      message.error(res.errMsg)
    }
  }
  //获取园区
  const getAeraQueryAll = async (name) => {
    try {
      const resp = await AeraQueryAll(projectId)
      if (resp.success && Array.isArray(resp.data)) {
        const data = [{ name, id: 0 }, ...resp.data]
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
      setAlarmopts([{ name: '不启用告警方案', id: 0 }, ...res.data])
    } else {
      setAlarmopts([{ name: '不启用告警方案', id: 0 }])
    }
  }
  //获取传感器列表
  const getQueryByPageSensor = async (curpage = 0, pageSize = 0, id, like, customerType) => {
    setLoading(true)
    let params = {
      projectId,
      // pageNum: page.current,
      // pageSize: page.pageSize,
      pageNum: curpage ? curpage : pageRef.current.current,
      pageSize: pageSize ? pageSize : pageRef.current.pageSize,
      areaId: id ? id : 0,
      alike: like ? like : '',
      customerType: customerType ? customerType : 0
    }
    const resp = await QueryByPageSensor(params)
    setLoading(false)
    setPage({
      ...page,
      current: resp.pageNum,
      pageSize: resp.pageSize,
      total: resp.total
    })
    if (resp.success && Array.isArray(resp.data)) {
      setDataSource([...resp.data.reverse()])

      console.log(page)
    } else {
      setDataSource([])
    }
  }
  //批量上传
  const onImportOk = async () => {
    const formData = new FormData()
    formData.append("file", flies[0])
    formData.append("projectId", projectId)
    const res = await ImportSensor(formData)
    if (res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        getQueryByPageSensor(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else if (res.data.data && Array.isArray(res.data.data)) {
        errlistRef.current.setList([...res.data.data])
        ErrModalRef.current.onOpen()
      } else {
        message.error(res.data.errMsg)
      }
    } else {
      message.error(res.errMsg)
    }
  }
  //导出
  const exportExecel = () => {
    tableLoadRef.current.download()
  }

  useEffect(() => {
    if (oneLevel.length > 0) {
      getQueryByPageSensor()
      getOneLevel()
      getQueryUsedDeviceCategory()
      getQueryPlanList()
      getQueryListGateWay()
    }
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
    getList: getQueryByPageSensor
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746,
    name: '新增传感器',
    addopts,
    gatewaylist,
    devicelist,
    onOk: addOk,
    onSure: addSure,
    onCancel: addCancel
  }
  const uploadprops = {
    maxCount: 1,
    beforeUpload(file, fileList) {
      console.log(file, fileList)
      flies = [...fileList]
      return false
    }
  };
  const ImportProps = {
    modalImportRef,
    width: 560,
    link: '/deviceExcel/sensor.xlsx',
    name: '传感器导入',
    uploadprops,
    onOk: onImportOk
  }
  const EditModalFormProps = {
    EditModalFormRef,
    width: 746,
    name: '编辑传感器',
    onOk: editOk,
    onSure: editSure,
    onCancel: editCancel
  }
  const ErrModalProps = {
    ErrModalRef,
    ref: errlistRef,
    onOk: () => { ErrModalRef.current.onCancel() }
  }

  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} pagination={page} dataSource={dataSource} loading={loading} ref={tableLoadRef} onChange={(page, pageSize) => {
          setPage(() => ({
            ...page
          }))
          getQueryByPageSensor(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
        }}></Table>
      </Comp>
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: addform, deviceStyle, levelname }}>
        <AddModalForm {...ModalFormProps} >
        </AddModalForm>
      </MyContext.Provider>
      <MultImport {...ImportProps}></MultImport>
      <DeleteModal DelModalRef={DelModalRef} name="删除提示" content="是否确认删除传感器？" onOk={delOk}></DeleteModal>
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: editform, deviceStyle, levelname }}>
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
  const [area, setArea] = useState([])
  const [coms, setComs] = useState()
  const rules = [{
    required: true
  }]
  let options = []
  for (let i = 1; i <= coms; i++) {
    options.push({
      label: `COM${i}`,
      value: i
    })
  }
  const changeGateway = (v, option) => {
    console.log(v, option)
    if (v) {
      const arr = addopts?.filter(it => (it.id === option.areaId))
      setArea([...arr])
      setComs(option.com)
      form.setFieldsValue({ areaId: arr[0].id, commPort: null, commProtocol: 0 })
    } else {
      setArea([])
    }
  }
  return (
    <Form
      labelAlign="left"
      form={form}
      colon={false}
      labelCol={{
        span: 7
      }}
    >
      <Row className={style.customItem}>
        <Col flex={1}>
          <Form.Item label={levelname.current} name="areaId" rules={rules}>
            {
              area.length > 0 ? <Select
                showSearch
                filterOption={(val, opts) => {
                  if (opts.name.includes(val)) {
                    return true
                  } else {
                    return false
                  }
                }}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                options={area}
                disabled
              ></Select> : <Select
                showSearch
                filterOption={(val, opts) => {
                  if (opts.name.includes(val)) {
                    return true
                  } else {
                    return false
                  }
                }}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                options={addopts}
              ></Select>
            }
          </Form.Item>
          <Form.Item label="安装地址" name="address" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="告警方案" name="alarmPlanId" rules={rules}>
            <Select
              options={alarmopts}
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
            ></Select>
          </Form.Item>
          <Form.Item label="备注" name="remark" >
            <TextArea />
          </Form.Item>
        </Col>
        <Col>
          <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
        </Col>
        <Col flex={1}>
          <Form.Item label="所属网关" name="gatewayId" rules={rules}>
            <Select
             showSearch
             filterOption={(val, opts) => {
               if (opts.sn.includes(val)) {
                 return true
               } else {
                 return false
               }
             }}
              fieldNames={{
                label: 'sn',
                value: 'id',
              }}
              onChange={changeGateway}
              options={gatewaylist}
            ></Select>
          </Form.Item>
          <Form.Item label="传感器型号" name="category" rules={rules}>
            <Select
              showSearch
              options={devicelist}
            ></Select>
          </Form.Item>
          <Form.Item label="传感器编号" name="sn" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="传感器名称" name="name" rules={rules}>
            <Input />
          </Form.Item>
          {
            form.getFieldsValue().gatewayId ? (
              <>
                <Form.Item label="通讯端口" name="commPort" rules={rules}>
                  <Select
                    options={options}
                    placeholder='请选择通讯端口'
                  ></Select>
                </Form.Item>
                <Form.Item label="通讯地址" name="commAddress" rules={[{ required: true }, {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve()
                    } else {
                      if (Number(value) < 255 && Number(value) > 0) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(new Error("通讯地址范围(0-255)"))
                      }
                    }
                  }
                }]}>
                  <Input placeholder='通讯地址范围(0-255)' />
                  {/* 默认1-255 */}
                </Form.Item>
              </>
            ) : null
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
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onSure}>应用</Button>,
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
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onSure}>应用</Button>,
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
  const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle, levelname } = useContext(MyContext)
  const [area, setArea] = useState([])
  const [coms, setComs] = useState(0)
  const [isdisable, setIsdisable] = useState(false)
  const rules = [{
    required: true
  }]
  let options = []
  for (let i = 1; i <= coms; i++) {
    options.push({
      label: `COM${i}`,
      value: i
    })
  }
  const changeGateway = (v, option) => {
    console.log(v, option)
    setIsdisable(false)
    if (v) {
      const arr = addopts?.filter(it => (it.id === option.areaId))
      setArea([...arr])
      setComs(option.com)
      form.setFieldsValue({ areaId: arr[0].id, commPort: null, commAddress: '', commProtocol: 0 })
    } else {
      setArea([])
      form.setFieldsValue({ commAddress: 0, commPort: 0, commProtocol: 0 })
    }
  }
  useEffect(() => {
    if (form?.getFieldsValue().gatewayId !== 0) {
      setIsdisable(true)
    }
    const comsnum = gatewaylist.filter(it => it.id === form?.getFieldsValue().gatewayId)
    comsnum[0] && setComs(comsnum[0].com)
    console.log(form?.getFieldsValue())
  }, [])
  return (
    <Form
      labelAlign="left"
      form={form}
      colon={false}
      labelCol={{
        span: 7
      }}
    >
      <Row className={style.customItem}>
        <Col flex={1}>
          <Form.Item label={levelname.current} name="areaId" rules={rules}>
            {
              (area.length || isdisable) > 0 ? <Select
                showSearch
                filterOption={(val, opts) => {
                  if (opts.name.includes(val)) {
                    return true
                  } else {
                    return false
                  }
                }}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                options={area}
                disabled
              ></Select> : <Select
                showSearch
                filterOption={(val, opts) => {
                  if (opts.name.includes(val)) {
                    return true
                  } else {
                    return false
                  }
                }}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                options={addopts}
                disabled
              ></Select>
            }
          </Form.Item>
          <Form.Item label="安装地址" name="address" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="告警方案" name="alarmPlanId" rules={rules}>
            <Select
              options={alarmopts}
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
            ></Select>
          </Form.Item>
          <Form.Item label="备注" name="remark" >
            <TextArea />
          </Form.Item>
        </Col>
        <Col>
          <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
        </Col>
        <Col flex={1}>
          <Form.Item label="所属网关" name="gatewayId" rules={rules}>
            <Select
              showSearch
              filterOption={(val, opts) => {
                if (opts.sn.includes(val)) {
                  return true
                } else {
                  return false
                }
              }}
              fieldNames={{
                label: 'sn',
                value: 'id',
              }}
              onChange={changeGateway}
              options={gatewaylist}
            ></Select>
          </Form.Item>
          <Form.Item label="传感器型号" name="category" rules={rules}>
            <Select
              showSearch
              options={devicelist}
            ></Select>
          </Form.Item>
          <Form.Item label="传感器编号" name="sn" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="传感器名称" name="name" rules={rules}>
            <Input />
          </Form.Item>
          {
            form.getFieldsValue().gatewayId ? (
              <>
                <Form.Item label="通讯端口" name="commPort" rules={rules}>
                  <Select
                    options={options}
                    placeholder='请选择通讯端口'
                  ></Select>
                </Form.Item>
                <Form.Item label="通讯地址" name="commAddress" rules={[{ required: true }, {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve()
                    } else {
                      if (Number(value) < 255 && Number(value) > 0) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(new Error("通讯地址范围(0-255)"))
                      }
                    }
                  }
                }]}>
                  <Input placeholder='通讯地址范围(0-255)' />
                  {/* 默认1-255 */}
                </Form.Item>
              </>
            ) : null
          }
        </Col>
      </Row>
    </Form>
  )
}
