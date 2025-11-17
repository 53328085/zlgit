import React, { useEffect, useRef, useState, useContext, createContext, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col, Select, Input, Divider, message, Space, Typography } from 'antd'
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
const { Link } = Typography
const {
  DeviceManager: {
    QueryByPageTransformer,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddTransformer,
    UpdateTransformer,
    DeleteTransformer,
    ImportTransformer,
    OneLevel
  }
} = Monitoring

export default function gateway({ deviceStyle }) {
  const { t } = useTranslation(["button"])
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
  const pageRef = useRef(page)
  pageRef.current = page
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  const levelname = useRef("")
  let delid = useRef();
  let flies

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
      title: '变压器型号',
      dataIndex: 'category'
    },
    {
      title: '变压器编号',
      dataIndex: 'sn'
    },

    {
      title: '额定容量(kVA)',
      dataIndex: 'capacity'
    },
    {
      title: '所属网关',
      dataIndex: 'gatewayName',
      render: (text, record, index) => {
        if (Array.isArray(gatewaylist)) {
          const gatewayfilter = gatewaylist.filter(it => it.id === record.gatewayId)
          console.log(gatewayfilter)
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
      export: false,
      render: (text, record) => {
        return (
          <Space size={16}>
            <Link onClick={() => { onEdit(record) }}>{t("button:edit")}</Link>
            <Link type="danger" onClick={() => { onDelete(record) }}>{t("button:delete")}</Link>
          </Space>
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

  //确认编辑保存
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
        capacity,
        ratedI,
        ratedU,
        ratedFrequency,
        ratedPower,
        ratedApparentPower
      } = editform.getFieldValue()
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
        capacity,
        ratedI,
        ratedU,
        ratedFrequency,
        ratedPower,
        ratedApparentPower
      }
      const resp = await UpdateTransformer(params)
      if (resp.success) {
        message.success("更新成功")
        EditModalFormRef?.current?.onCancel()
        getQueryByPageTransformer(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else {
        message.error(resp.errMsg)
      }
    })

  }
  //确认编辑应用
  const editSure = (isclose = false) => {
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
        capacity,
        ratedI,
        ratedU,
        ratedFrequency,
        ratedPower,
        ratedApparentPower,
        commPort,
        commProtocol,
        commAddress
      } = editform.getFieldValue()
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
        capacity: Number(capacity),
        ratedU: Number(ratedU),
        ratedI: Number(ratedI),
        ratedFrequency: Number(ratedFrequency),
        ratedPower: Number(ratedPower),
        ratedApparentPower: Number(ratedApparentPower),
        commPort,
        commProtocol,
        commAddress
      }
      const resp = await UpdateTransformer(params)
      if (resp.success) {
        message.success("更新成功")
        isclose && EditModalFormRef?.current?.onCancel()
        getQueryByPageTransformer(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)

      } else {
        message.error(resp.errMsg)
      }
    })
  }
  const editCancel = () => {
    EditModalFormRef?.current?.onCancel()
  }
  //打开删除窗口
  const onDelete = (record) => {
    DelModalRef?.current?.onOpen()
    delid.current = record.sn
  }
  //确认删除
  const delOk = async () => {
    const { success, errMsg } = await DeleteTransformer({
      projectId,
      sn: encodeURIComponent(delid.current)
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
        getQueryByPageTransformer(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      }, 0)

    } else {
      message.error(errMsg)
    }
    console.log(res)
  }


  //打开新增窗口
  const addopen = () => {
    if (!levelname.current) {
      message.warning('请添加区域')
      return
    }
    addform.setFieldsValue({
      areaId: '',
      alarmPlanId: 0,
      address: '',
      remark: '',
      gatewayId: '',
      category: '',
      sn: '',
      name: '',
      capacity: '',
      ratedU: '',
      ratedI: '',
      ratedFrequency: '',
      ratedPower: '',
      ratedApparentPower: ''
    })
    modalFormRef?.current?.onOpen()

  }
  //确认新增
  const addOk = async () => {
    return addform.validateFields().then(async () => {
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
        capacity: Number(formvalue.capacity),
        ratedU: Number(formvalue.ratedU),
        ratedI: Number(formvalue.ratedI),
        ratedFrequency: Number(formvalue.ratedFrequency),
        ratedPower: Number(formvalue.ratedPower),
        ratedApparentPower: Number(formvalue.ratedApparentPower),
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commAddress: formvalue.commAddress ? formvalue.commAddress : 0,
        commProtocol: 0,
      }
      const res = await AddTransformer(params)
      if (res.success) {
        message.success('新增成功!')
        // modalFormRef?.current?.onCancel()
        // getQueryByPageTransformer()
        getQueryByPageTransformer(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else {
        message.error(res.errMsg)
      }
    }).catch(e => {
      return Promise.reject('出错')
    })


  }
  //新增应用
  const addSure = () => {
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
        capacity: Number(formvalue.capacity),
        ratedU: Number(formvalue.ratedU),
        ratedI: Number(formvalue.ratedI),
        ratedFrequency: Number(formvalue.ratedFrequency),
        ratedPower: Number(formvalue.ratedPower),
        ratedApparentPower: Number(formvalue.ratedApparentPower),
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commAddress: formvalue.commAddress ? formvalue.commAddress : 0,
        commProtocol: 0,
      }
      const res = await AddTransformer(params)
      if (res.success) {
        message.success('新增成功!')
        getQueryByPageTransformer(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)

      } else {
        message.error(res.errMsg)
      }
    })

  }
  const addCancel = () => {
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
        setGatewaylist([])
        // setDevicelist([])
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
  //获取变压器列表
  const getQueryByPageTransformer = async (curpage = 0, pageSize = 0, id, like, customerType) => {
    setLoading(true)
    let params = {
      projectId,
      pageNum: curpage ? curpage : pageRef.current.current,
      pageSize: pageSize ? pageSize : pageRef.current.pageSize,
      areaId: id ? id : 0,
      alike: like ? like : '',
      customerType: customerType ? customerType : 0
    }
    const resp = await QueryByPageTransformer(params)
    setLoading(false)
    setPage({
      ...page,
      current: resp.pageNum,
      pageSize: resp.pageSize,
      total: resp.total
    })
    if (resp.success && Array.isArray(resp.data)) {
      setDataSource([...resp.data])
      //pageObj={...page,total:resp.total}
    } else {
      setDataSource([])
    }
  }
  //导出
  const exportExecel = () => {
    tableLoadRef.current.download()
  }
  const onExport = () => {
    return new Promise(async (resolve, reject) => {
      let params = {
        projectId,
        pageNum: 1,
        pageSize: page.total,
        areaId: compRef.current.selvalue ? compRef.current.selvalue : 0,
        alike: compRef.current.inpvalue,

      }

      const resp = await QueryByPageTransformer(params)
      if (resp.success) {
        resolve({ list: resp.data ? resp.data : [], total: resp.total })
      } else {
        reject(resp.errMsg)
      }
    })
  }
  //批量上传
  const onImportOk = async () => {
    const formData = new FormData()
    formData.append("file", flies[0])
    formData.append("projectId", projectId)
    const res = await ImportTransformer(formData)
    console.log(res)
    if (res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        getQueryByPageCamera(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
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


  useEffect(() => {
    if (oneLevel?.length > 0) {
      getQueryByPageTransformer()
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
    getList: getQueryByPageTransformer,
    tb: tableLoadRef
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746,
    name: '新增变压器',
    addopts,
    gatewaylist,
    devicelist,
    onOk: addOk,
    onSure: addSure,
    onCancel: addCancel,
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
    link: '/deviceExcel/transformer.xlsx',
    name: '变压器导入',
    uploadprops,
    onOk: onImportOk,
  }
  const EditModalFormProps = {
    EditModalFormRef,
    width: 746,
    name: '编辑变压器',
    // onOk: editOk,
    onOk: () => editSure(true), // 保存
    onSure: () => editSure(false), // 应用
    onCancel: editCancel
  }
  const ErrModalProps = {
    ErrModalRef,
    ref: errlistRef,
    onOk: () => { ErrModalRef.current.onCancel() }
  }
  const AddModalComp = useMemo(() => (<MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: addform, deviceStyle, levelname }}>
    <AddModalForm {...ModalFormProps} >
    </AddModalForm>
  </MyContext.Provider>)
    , [addopts, gatewaylist, devicelist, alarmopts])
  const EditModalComp = useMemo(() => {
    return (
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: editform, deviceStyle, levelname }}>
        <EditModalForm {...EditModalFormProps}></EditModalForm>
      </MyContext.Provider>
    )
  }, [addopts, gatewaylist, devicelist, alarmopts])
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} pagination={page} paginationShow={true} dataSource={dataSource} loading={loading} ref={tableLoadRef} onChange={(page, pageSize) => {
          setPage(() => ({
            ...page
          }))
          getQueryByPageTransformer(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
        }} onExport={onExport}></Table>
      </Comp>
      {AddModalComp}
      {/* <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: addform, deviceStyle,levelname }}>
        <AddModalForm {...ModalFormProps} >
        </AddModalForm>
      </MyContext.Provider> */}
      <MultImport {...ImportProps}></MultImport>
      <DeleteModal DelModalRef={DelModalRef} name="删除提示" content="是否确认删除变压器？" onOk={delOk}></DeleteModal>
      {EditModalComp}
      {/* <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: editform, deviceStyle,levelname }}>
        <EditModalForm {...EditModalFormProps}></EditModalForm>
      </MyContext.Provider> */}
      <ErrorMessage {...ErrModalProps}></ErrorMessage>
    </div>
  )
}


//新增form表单组件
export const FormComp = (props) => {
  const { TextArea } = Input
  const { addopts, gatewaylist, devicelist, alarmopts, form, levelname } = useContext(MyContext)
  const [area, setArea] = useState([])
  const [coms, setComs] = useState(0)
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
      form.setFieldsValue({ areaId: arr[0].id, commPort: undefined, commProtocol: 0 })
    } else {
      setArea([])
      form.setFieldsValue({ areaId: '' })
    }
  }
  const validatorfunc = (_, value) => {
    console.log(value, !Number(value))
    if (!Number(value)) {
      return Promise.reject(new Error("请输入正确的额定容量"))
    } else {
      if (Number(value) <= 0) {
        return Promise.reject(new Error("请输入正确的额定容量"))
      } else {
        return Promise.resolve()
      }
    }
  }
  return (
    <Form
      labelAlign="left"
      form={form}
      colon={false}
      labelCol={{
        span: 9
      }}
    // validateTrigger="onFinish"
    >
      <Row className={style.customItem}>
        <Col flex={1}>
          <Form.Item label={levelname.current} name="areaId" rules={rules}>
          <Select
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
            {/* {
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
            } */}
          </Form.Item>
          <Form.Item label="安装地址" name="address" rules={rules}>
            <Input autoComplete='off' />
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
          <Form.Item label="备注" name="remark">
            <TextArea />
          </Form.Item>
        </Col>
        <Col>
          <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
        </Col>
        <Col flex={1}>
          <Form.Item label="变压器型号" name="category" rules={rules}>
            <Select
              showSearch
              options={devicelist}
            ></Select>
          </Form.Item>
          <Form.Item label="变压器编号" name="sn" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="变压器名称" name="name" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="所属网关" name="gatewayId" rules={rules}>
            <Select
              showSearch
              filterOption={(val, opts) => {
                if (opts.sn?.includes(val)) {
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
          <Form.Item label="额定容量" name="capacity" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(KVA)</span>} />
          </Form.Item>
          <Form.Item label="额定电压" name="ratedU" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(V)</span>} />
          </Form.Item>
          <Form.Item label="额定电流" name="ratedI" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(A)</span>} />
          </Form.Item>
          <Form.Item label="额定频率" name="ratedFrequency" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(Hz)</span>} />
          </Form.Item>
          <Form.Item label="额定功率" name="ratedPower" rules={[{ required: true, message: '请输入额定功率' }]}>
            <Input suffix={<span>(kW)</span>} />
          </Form.Item>
          <Form.Item label="额定视在功率" name="ratedApparentPower" rules={[{ required: true, message: '请输入额定视在功率' }]}>
            <Input suffix={<span>(kVA)</span>} />
          </Form.Item>
          {
            form.getFieldsValue().gatewayId ? (
              <>
                <Form.Item label="通讯端口" name="commPort" rules={rules}>
                  <Select
                    placeholder='请选择通讯端口'
                    options={options}
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
    <Modal mold='cust' ref={modalFormRef} {...other} title={other.name} custft={true} onOk={other.onOk}>

      <FormComp >
      </FormComp>
    </Modal>
  )

}




//编辑设备
export const EditModalForm = ({ EditModalFormRef, ...other }) => {
  return (
    <Modal mold='cust' ref={EditModalFormRef} title={other.name} {...other} onOk={other.onOk}>

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
      form.setFieldsValue({ areaId: arr[0].id, commPort: '', commAddress: '', commProtocol: 0 })
    } else {
      setArea([])
      form.setFieldsValue({ commAddress: 0, commPort: 0, commProtocol: 0 })
    }
  }
  const validatorfunc = (_, value) => {
    console.log(value, !Number(value))
    if (!Number(value)) {
      return Promise.reject(new Error("请输入正确的额定容量"))
    } else {
      if (Number(value) <= 0) {
        return Promise.reject(new Error("请输入正确的额定容量"))
      } else {
        return Promise.resolve()
      }
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
        span: 9
      }}
    >
      <Row className={style.customItem}>
        <Col flex={1}>
          <Form.Item label={levelname.current} name="areaId" rules={rules}>
          <Select
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
            {/* {
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
            } */}
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
          <Form.Item label="变压器型号" name="category" rules={rules}>
            <Select
              disabled
              showSearch
              options={devicelist}
            ></Select>
          </Form.Item>
          <Form.Item label="变压器编号" name="sn" rules={rules}>
            <Input disabled  />
          </Form.Item>
          <Form.Item label="变压器名称" name="name" rules={rules}>
            <Input />
          </Form.Item>
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
          <Form.Item label="额定容量" name="capacity" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(KVA)</span>} />
          </Form.Item>
          <Form.Item label="额定电压" name="ratedU" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(V)</span>} />
          </Form.Item>
          <Form.Item label="额定电流" name="ratedI" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(A)</span>} />
          </Form.Item>
          <Form.Item label="额定频率" name="ratedFrequency" rules={[{ validator: validatorfunc }]}>
            <Input suffix={<span>(Hz)</span>} />
          </Form.Item>
          <Form.Item label="额定功率" name="ratedPower" rules={[{ required: true, message: '请输入额定功率' }]}>
            <Input suffix={<span>(kW)</span>} />
          </Form.Item>
          <Form.Item label="额定视在功率" name="ratedApparentPower" rules={[{ required: true, message: '请输入额定视在功率' }]}>
            <Input suffix={<span>(kVA)</span>} />
          </Form.Item>
          {
            form.getFieldsValue().gatewayId ? (
              <>
                <Form.Item label="通讯端口" name="commPort" rules={rules}>
                  <Select
                    placeholder='请选择通讯端口'
                    options={options}
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
