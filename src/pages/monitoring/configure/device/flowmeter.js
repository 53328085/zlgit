import React, { useEffect, useRef, useState, useContext, createContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Form, Space, Typography, message } from 'antd'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { MultImport, ErrorMessage } from './modalCom'
import { Monitoring } from '@api/api.js'
import { DeleteModal } from './modalCom'
import { AddModalForm, MyContext, EditModalForm, AreaOption } from './elecomp'
import cutContext from '@com/content'
import { publishState } from '@redux/systemconfig'
const { Link } = Typography
const {
  DeviceManager: {
    QueryByPageFlow,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddFlow,
    UpdateFlow,
    DeleteFlow,
    ImportFlow,
    OneLevel
  }
} = Monitoring

export default function gateway({ deviceStyle }) {
  const { t } = useTranslation(["button"])
  const publish = useSelector(publishState)
  const [selectopts, setSelectopts] = useState([])
  const [gatewaylist, setGatewaylist] = useState()
  const gatewayRef = useRef()
  gatewayRef.current = gatewaylist
  const [devicelist, setDevicelist] = useState()
  const deviceRef = useRef()
  deviceRef.current = devicelist
  const [addopts, setAddOpts] = useState()
  const addoptsRef = useRef()
  addoptsRef.current = addopts
  const [alarmopts, setAlarmopts] = useState()
  const alarmoptsRef = useRef()
  alarmoptsRef.current = alarmopts
  const [transitionName, setTransition] = useState(undefined)
  const [maskTransitionName, setMaskTransitionName] = useState(undefined)
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
  const areaModaref = useRef()
  const editareaRef = useRef()
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  const [channelName1, setChannelName1] = useState('通道1')
  const [channelName2, setChannelName2] = useState('通道2')
  const [channelName3, setChannelName3] = useState('通道3')
  const [channelName4, setChannelName4] = useState('通道4')
  const [index, setIndex] = useState(1)
  const path1Gruop = useRef([])
  const path2Gruop = useRef([])
  const path3Gruop = useRef([])
  const path4Gruop = useRef([])
  const checklistRef = useRef({
    check1: false,
    check2: false,
    check3: false,
    check4: false
  })


  const pathGruop = index == 1 ? path1Gruop : index == 2 ? path2Gruop : index == 3 ? path3Gruop : index == 4 ? path4Gruop : []
  const flagref = useRef([true, true, true, true])
  const content = useContext(cutContext)
  const levelname = useRef()
  let delid = useRef();
  let flies;
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
      title: '设备型号',
      dataIndex: 'category'
    },
    {
      title: '设备编号',
      dataIndex: 'sn'
    },
    {
      title: '设备名称',
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
    // {
    //   title: '用能类型',
    //   dataIndex: 'customerType',
    //   render: (text) => {
    //     return (
    //       <>
    //         {text === 1 ? <span>客户用能</span> : <span>公共用能</span>}
    //       </>
    //     )
    //   }
    // },
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
    console.log(record, record.path1Group?.length > 0)
    EditModalFormRef?.current?.onOpen()

    editform.setFieldsValue({
      ...record,
      commProtocol: record.commProtocol ? record.commProtocol : '',
    })
    console.log(editform.getFieldsValue(), flagref)
  }

  //确认编辑
  const editOk = () => {
    console.log(editform.getFieldsValue())
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
        factor
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
        commPort,
        commProtocol: commProtocol ? commProtocol : 0,
        commAddress,
        factor: 0,
        customerType: 0,
      }
      console.log(params, editform.getFieldValue(), path1Gruop, path2Gruop, path3Gruop, path4Gruop, pathGruop)
      const resp = await UpdateFlow(params)
      if (resp.success) {
        message.success("更新成功")
        EditModalFormRef?.current?.onCancel()
        getQueryByPageElectric(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else {
        message.error(resp.errMsg)
      }
    }).catch(e => { console.log(e) })
  }

  const onEditCancel = () => {

    EditModalFormRef?.current?.onCancel()
  }
  //打开删除窗口
  const onDelete = (record) => {
    console.log(record)
    DelModalRef?.current?.onOpen()
    delid.current = record.sn
  }
  //确认删除
  const delOk = async () => {
    const { success, errMsg } = await DeleteFlow({
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
        getQueryByPageElectric(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      }, 0)

    } else {
      message.error(errMsg)
    }
  }

  //打开新增窗口
  const addopen = () => {
    if (!levelname.current) {
      message.warning('请先添加区域名称')
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
      commProtocol: '',
      commAddress: '',
      factor: 1
    })
    modalFormRef?.current?.onOpen()

  }

  //确认新增
  const addOk = async () => {
    return addform.validateFields().then(async () => {
      const formvalue = addform.getFieldsValue()
      console.log(formvalue)
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
        // customerType:0,
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commProtocol: formvalue.commProtocol ? formvalue.commProtocol : 0,
        commAddress: formvalue.commAddress ? formvalue.commAddress : 0,
        factor: 1,
        /*  path1Name:formvalue.channel1,
         path2Name:formvalue.channel2,
         path3Name:formvalue.channel3,
         path4Name:formvalue.channel4,
         path1Group:checklistRef.current.check1&&path1Gruop.current.length>0?path1Gruop.current:[],
         path2Group:checklistRef.current.check2&&path2Gruop.current.length>0?path2Gruop.current:[],
         path3Group:checklistRef.current.check3&&path3Gruop.current.length>0?path3Gruop.current:[],
         path4Group:checklistRef.current.check4&&path4Gruop.current.length>0?path4Gruop.current:[], */
      }
      const res = await AddFlow(params)
      if (res.success) {
        message.success('新增成功!')
        // addform.resetFields()
        //  modalFormRef?.current?.onCancel()
        getQueryByPageElectric(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
      } else {
        message.error(res.errMsg)
      }
    }).catch(() => {
      return Promise.reject('出错')
    })
  }

  //新增弹窗取消
  const onAddCancel = () => {
    modalFormRef?.current?.onCancel()
    flagref.current = [true, true, true, true]
    setTransition(undefined)
    setMaskTransitionName(undefined)
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
      console.log(resp)
      if (resp.success && Array.isArray(resp.data)) {
        const data = [{ name, id: 0 }, ...resp.data]
        setSelectopts(() => [...data])
        setAddOpts(() => [...resp.data])
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取已使用的光纤列表
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


    if (res.success && Array.isArray(res.data)) {
      setAlarmopts([{ name: '不启用告警方案', id: 0 }, ...res.data])
    } else {
      setAlarmopts([{ name: '不启用告警方案', id: 0 }])
    }
  }
  //获取流量计列表
  const getQueryByPageElectric = async (curpage = 0, pageSize = 0, id, like, customerType) => {
    setLoading(true)
    let params = {
      projectId,
      // pageNum: page.current,
      // pageSize: page.pageSize,
      pageNum: curpage ? curpage : pageRef.current.current,
      pageSize: pageSize ? pageSize : pageRef.current.pageSize,
      areaId: id ? id : 0,
      alike: like ? like : '',
      deviceStyle: 14,
      customerType: customerType ? customerType : 0
    }
    const resp = await QueryByPageFlow(params)
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

      const resp = await QueryByPageFlow(params)
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
    const res = await ImportFlow(formData)
    if (res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        getQueryByPageElectric(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
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
  const openarea = (index) => {
    console.log(index)
    // flagref.current[index]=true
    areaModaref.current.onOpen()
  }
  const areacancel = () => {
    console.log(flagref, index)
    areaModaref.current.onCancel()
    if (flagref.current[index]) {
      index == 1 ? path1Gruop.current = [] : index == 2 ? path2Gruop.current = [] : index == 3 ? path3Gruop.current = [] : path4Gruop.current = []
      // pathGruop.current =[]
    }

    // setTransition(undefined)
    // setMaskTransitionName(undefined)
  }
  const areaok = () => {
    console.log(index)
    areaModaref.current.onCancel()
    flagref.current[index] = false

    console.log(path1Gruop.current, path2Gruop.current, path3Gruop.current, path4Gruop.current)
  }
  useEffect(() => {
    if (oneLevel?.length > 0) {
      getOneLevel()
      getQueryByPageElectric()
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
    getList: getQueryByPageElectric,
    tb: tableLoadRef,
    // btnlist: true
  }
  const ModalFormProps = {
    modalFormRef,
    width: 732,
    name: '新增流量计',
    transitionName: transitionName,
    maskTransitionName: maskTransitionName,
    onOk: addOk,

    onAddCancel: onAddCancel,
    // isfiber:true,
    openarea,
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
    link: '/deviceExcel/flowmeter.xlsx',
    name: '流量计导入',
    uploadprops,
    onOk: onImportOk
  }
  const EditModalFormProps = {
    EditModalFormRef,
    width: 732,
    name: '编辑流量计',
    onOk: editOk,
    onEditCancel: onEditCancel,
    isfiber: true,
    openarea,
  }

  const ErrModalProps = {
    ErrModalRef,
    ref: errlistRef,
    onOk: () => { ErrModalRef.current.onCancel() }
  }
  const AreaOptionProps = {
    areaModaref,
    width: 1368,
    areacancel,
    index,
    channelName1,
    channelName2,
    channelName3,
    channelName4,
    areaok,
  }
  const EditOptionProps = {
    editareaRef
  }
  const AddModalComp = useMemo(() => {
    return (
      <MyContext.Provider value={{
        addopts: addoptsRef.current,
        gatewaylist: gatewayRef.current,
        devicelist: deviceRef.current,
        alarmopts: alarmoptsRef.current,
        form: addform, deviceStyle, levelname,
        channelName1,
        setChannelName1,
        channelName2,
        setChannelName2,
        channelName3,
        setChannelName3,
        channelName4,
        setChannelName4,
        setIndex,
        setTransition,
        setMaskTransitionName,
        checklistRef,
        path1Gruop,
        path2Gruop,
        path3Gruop,
        path4Gruop,
      }}>
        <AddModalForm {...ModalFormProps} >
        </AddModalForm>
      </MyContext.Provider>
    )
  }, [addopts, gatewaylist, devicelist, alarmopts])

  const EditModalComp = useMemo(() => {
    return (
      <MyContext.Provider value={{
        addopts,
        gatewaylist: gatewayRef.current,
        devicelist: deviceRef.current,
        alarmopts: alarmoptsRef.current,
        form: editform,
        deviceStyle, levelname,
        setIndex,
        setIndex,
        setTransition,
        setMaskTransitionName,
        checklistRef,

      }}>
        <EditModalForm {...EditModalFormProps}></EditModalForm>
      </MyContext.Provider>
    )
  }, [addopts, gatewayRef.current, deviceRef.current, alarmoptsRef.current])
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} pagination={page} paginationShow={true} dataSource={dataSource} loading={loading} ref={tableLoadRef} onChange={(page, pageSize) => {
          setPage(() => ({
            ...page
          }))
          getQueryByPageElectric(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
        }} onExport={onExport}></Table>

      </Comp>

      {AddModalComp}



      <MultImport {...ImportProps}></MultImport>
      <DeleteModal DelModalRef={DelModalRef} name="删除提示" content="是否确认删除流量计？" onOk={delOk}></DeleteModal>
      {EditModalComp}
      <ErrorMessage {...ErrModalProps}></ErrorMessage>
      <MyContext.Provider value={{
        path1Gruop,
        path2Gruop,
        path3Gruop,
        path4Gruop,
        rankindex: index
      }}>
        <AreaOption {...AreaOptionProps}></AreaOption>
      </MyContext.Provider>


      {/* <MyContext.Provider value={{
  
      }}>
        <AreaOption {...EditOptionProps}></AreaOption>
      </MyContext.Provider> */}
    </div>
  )
}

