import React, { useEffect, useRef, useState, useContext, createContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Form, Space, Typography, message } from 'antd'
import Comp from './comp'
import Table from '@com/useTable'
import { MultImport, ErrorMessage } from './modalCom'
import { Monitoring } from '@api/api.js'
import { DeleteModal } from './modalCom'
import { AddModalForm, MyContext, EditModalForm, SetModalForm } from './formcomp copy'
import { publishState } from '@redux/systemconfig'
const { Link } = Typography
const {
  DeviceManager: {
    QueryByPageWater,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddWater,
    UpdateWater,
    DeleteWater,
    ImportWater,
    OneLevel,
    QueryDeviceIncreaseParams,
    InsertOrUpdateDeviceParam
  }
} = Monitoring

export default function gateway({ deviceStyle }) {
  const [cancelStatus, setCancelStatus] = useState(false);
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
  const pageRef = useRef(page)
  pageRef.current = page
  const [dataSource, setDataSource] = useState([])
  const dataSource376 = useRef([])
  const oneLevel = useSelector(state => state.system.onelevel)
  const projectId = useSelector(state => state.system.menus.projectId)
  const compRef = useRef()
  const modalFormRef = useRef()
  const modalImportRef = useRef()
  const SetmodalFormRef = useRef()
  const DelModalRef = useRef()
  const EditModalFormRef = useRef()
  const ErrModalRef = useRef()
  const errlistRef = useRef()
  const tableLoadRef = useRef()

  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  const [setform] = Form.useForm()
  const paramsSetId = useRef()
  const levelname = useRef("")
  let delid = useRef();
  let flies;
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
      title: '水表编号',
      dataIndex: 'sn'
    },
    {
      title: '水表型号',
      dataIndex: 'category'
    },
    {
      title: '水表名称',
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
      title: '用能类型',
      dataIndex: 'customerType',
      render: (text) => {
        return (
          <>
            {text === 1 ? <span>客户用能</span> : <span>公共用能</span>}
          </>
        )
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
    setCancelStatus(false)
    editform.setFieldsValue({ ...record })
  }

  //确认编辑
  const editOk = async (type) => {
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
        factor,
        writePwdLevel,
        writePwd,
        controlPwdLevel,
        controlPwd } = editform.getFieldValue()
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
        commProtocol: commProtocol ? commProtocol : 0,
        commAddress,
        factor,
        writePwdLevel,
        writePwd,
        controlPwdLevel,
        controlPwd
      }
      const resp = await UpdateWater(params)
      if (resp.success) {
        if (type == 'submit') {
          message.success("更新成功")
          EditModalFormRef?.current?.onCancel()
        } else if (type == 'next') {
          openSetModal(editform.getFieldsValue())
          getQueryByPageWater376()
        } else {
          message.success("更新成功")
        }
        getQueryByPageWater(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
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
        commProtocol: commProtocol ? commProtocol : 0,
        commAddress,
        factor
      }
      const resp = await UpdateWater(params)
      if (resp.success) {
        message.success("更新成功")
        getQueryByPageWater(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else {
        message.error(resp.errMsg)
      }
    })
  }
  const editCancel = () => {
    EditModalFormRef?.current?.onCancel()
  }
  const setCancel = () => {
    SetmodalFormRef?.current?.onCancel()
  }
  const setOk = async () => {
    let form = Object.keys(addform.getFieldsValue()).length === 0 ? editform.getFieldsValue() : addform.getFieldsValue()
    const deviceItem = dataSource376.current.find(item => item.sn === form.sn);
    const deviceId = deviceItem ? deviceItem.id : null;
    const gatewayItem = gatewaylist.find(item => item.id === form.gatewayId);
    const gatewaySn = gatewayItem ? gatewayItem.sn : null;
    const newData = { ...setform.getFieldsValue(), DeviceId: deviceId, ...(paramsSetId.current ? { Id: paramsSetId.current } : {}) }
    const res = await InsertOrUpdateDeviceParam(projectId, gatewaySn, newData)
    if (res.success) {
      message.success('参数设置成功')
      addform.resetFields()
      modalFormRef?.current?.onCancel()
      EditModalFormRef?.current?.onCancel()
      SetmodalFormRef?.current?.onCancel()
    } else {
      message.error(res.errMsg)
    }

  }
  //打开删除窗口
  const onDelete = (record) => {
    DelModalRef?.current?.onOpen()
    delid.current = record.sn
  }
  //确认删除
  const delOk = async () => {
    const { success, errMsg } = await DeleteWater({
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
        getQueryByPageWater(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      }, 0)

    } else {
      message.error(errMsg)
    }
    console.log(res)
  }


  //打开新增窗口
  const addopen = () => {
    setCancelStatus(true)
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
      customerType: '',
      commPort: '',
      commProtocol: 0,
      commAddress: 0,
      factor: 1
    })
    modalFormRef?.current?.onOpen()

  }
  const openSetModal = async (form) => {
    if (!levelname.current) {
      message.warning('请先添加区域名称')
      return
    }
    setform?.setFieldsValue({
      bautRate: 3, //通讯速率，
      controlPwd: "000000", //密码
      controlPwdLevel: 2, //控制密级（1或2）
      stopBites: 0,//停止位
      dataBites: 0,//数据位
      decimalDigits: 1, //电能示值的小数位个数
      DeviceId: 823, //设备标识
      Id: 11, //设备标识
      integerDigits: 2, //电能示值的整数位个数
      largeCategory: 5, //大类号
      password: "000000000000", //通信密码，可为空
      collectSn: "000000000000", //采集器通信地址
      pn: "1", //所属测量点号，范围0-2040
      protocolType: 30,
      rateCount: 4, //费率数（1-12）
      smallCategory: 0, //小类号
      parityBites: ''//校验方式
    })
    SetmodalFormRef?.current?.onOpen()

    let params = {
      projectId,
      gatewayId: form.gatewayId,
      port: form.commPort,
      alike: form.sn,
    }
    const res = await QueryDeviceIncreaseParams(params)
    if (res.success) {
      setform?.setFieldsValue(res.data[0])
      paramsSetId.current = res.data.length != 0 ? res.data[0].id : null
    } else {
      message.error(res.errMsg)
    }
  }
  //确认新增
  const addOk = async (type) => {
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
        customerType: formvalue.customerType,
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commProtocol: formvalue.commProtocol ? formvalue.commProtocol : 0,
        // factor: 1,
        writePwdLevel: formvalue.writePwdLevel,
        writePwd: formvalue.writePwd,
        controlPwdLevel: formvalue.controlPwdLevel,
        controlPwd: formvalue.controlPwd
      }
      const res = await AddWater(params)
      if (res.success) {
        getQueryByPageWater(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
        if (type == 'submit') {
          message.success('新增成功!')
          modalFormRef?.current?.onCancel()
          addform.resetFields()
        } else if (type == 'next') {
          openSetModal(addform.getFieldsValue())
          getQueryByPageWater376()
        } else {
          message.success('新增成功!')
        }
      } else {
        message.error(res.errMsg)
      }
    }).catch(() => {
      return Promise.reject('出错')
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
        customerType: formvalue.customerType,
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commProtocol: 0,
        commAddress: 0,
        factor: 1,
        writePwdLevel: formvalue.writePwdLevel,
        writePwd: formvalue.writePwd,
        controlPwdLevel: formvalue.controlPwdLevel,
        controlPwd: formvalue.controlPwd
      }
      const res = await AddWater(params)
      if (res.success) {
        message.success('新增成功!')
        getQueryByPageWater(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
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
  //获取水表列表
  const getQueryByPageWater = async (curpage = 0, pageSize = 0, id, like, customerType) => {
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
    const resp = await QueryByPageWater(params)
    setLoading(false)
    setPage({
      ...page,
      current: resp.pageNum,
      pageSize: resp.pageSize,
      total: resp.total
    })
    if (resp.success && Array.isArray(resp.data)) {
      setDataSource([...resp.data.reverse()])

    } else {
      setDataSource([])
    }
  }
  //获取水表列表
  const getQueryByPageWater376 = async () => {
    let params = {
      projectId,
      pageNum: 1,
      pageSize: page.total + 1,
      areaId: compRef.current.selvalue ? compRef.current.selvalue : 0,
      alike: compRef.current.inpvalue,
      customerType: compRef.current.energyVal ? compRef.current.energyVal : 0
    }
    const resp = await QueryByPageWater(params)
    if (resp.success && Array.isArray(resp.data)) {
      dataSource376.current = resp.data.reverse()
    } else {
      dataSource376.current = []
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
        customerType: compRef.current.energyVal ? compRef.current.energyVal : 0
      }

      const resp = await QueryByPageWater(params)
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
    const res = await ImportWater(formData)
    if (res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        getQueryByPageWater(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
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
      getOneLevel()
      getQueryByPageWater()
      getQueryUsedDeviceCategory()
      getQueryPlanList()
      getQueryListGateWay()
    }

  }, [])
  //传入props对象
  const ComProps = {
    addopen,
    isenergy: true,
    multExport,
    ref: compRef,
    selectopts,
    setPage,
    page,
    exportExecel,
    getList: getQueryByPageWater,
    tb: tableLoadRef
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746,
    name: '新增水表',
    addopts,
    gatewaylist,
    devicelist,
    onOk: addOk,
    onSure: addSure,
    onCancel: addCancel,
  }

  const AddFormComp = useMemo(() => {
    return <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: addform, deviceStyle, levelname }}>
      <AddModalForm {...ModalFormProps} addform={addform} >
      </AddModalForm>
    </MyContext.Provider>
  }, [addopts, gatewaylist, devicelist])


  const uploadprops = {
    maxCount: 1,
    beforeUpload(file, fileList) {
      flies = [...fileList]
      return false
    }
  };
  const ImportProps = {
    modalImportRef,
    width: 560,
    link: '/deviceExcel/water.xlsx',
    name: '水表导入',
    uploadprops,
    onOk: onImportOk
  }
  const EditModalFormProps = {
    EditModalFormRef,
    width: 746,
    name: '编辑水表',
    onOk: editOk,
    onSure: editSure,
    onCancel: editCancel,
  }
  //设备参数
  const SetModalFormProps = {
    SetmodalFormRef,
    width: 746,
    name: '设备参数',
    onOk: setOk,
    onCancel: setCancel,
  }
  const ErrModalProps = {
    ErrModalRef,
    ref: errlistRef,
    onOk: () => { ErrModalRef.current.onCancel() }
  }
  const EditFormComp = useMemo(() => {
    return (
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: editform, deviceStyle, levelname }}>
        <EditModalForm {...EditModalFormProps} editform={editform}></EditModalForm>
      </MyContext.Provider>
    )
  }, [addopts, gatewaylist, devicelist, alarmopts])
  const SetFormComp = useMemo(() => {
    return (
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: setform, deviceStyle, levelname }}>
        <SetModalForm {...SetModalFormProps} setform={setform} cancelStatus={cancelStatus} >
        </SetModalForm>
      </MyContext.Provider>
    )
  }, [addopts, gatewaylist, devicelist, alarmopts, cancelStatus])
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} pagination={page} paginationShow={true} dataSource={dataSource} loading={loading} ref={tableLoadRef} onChange={(page, pageSize) => {
          setPage(() => ({
            ...page
          }))
          getQueryByPageWater(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
        }} onExport={onExport}></Table>
      </Comp>
      {
        AddFormComp
      }
      <MultImport {...ImportProps}></MultImport>
      <DeleteModal DelModalRef={DelModalRef} name="删除提示" content="是否确认删除水表？" onOk={delOk}></DeleteModal>
      {/* <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: editform, deviceStyle,levelname }}>
        <EditModalForm {...EditModalFormProps}></EditModalForm>
      </MyContext.Provider> */}
      {
        EditFormComp
      }
      {
        SetFormComp
      }
      <ErrorMessage {...ErrModalProps}></ErrorMessage>
    </div>
  )
}

