import React, { useEffect, useRef, useState, useContext, createContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Form, Row, Col, Select, Input, Divider, message } from 'antd'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { MultImport,ErrorMessage } from './modalCom'
import { Monitoring } from '@api/api.js'
import { DeleteModal } from './modalCom'
import { AddModalForm, MyContext, EditModalForm} from './elecomp'
import cutContext from  '@com/content'
import {publishState} from '@redux/systemconfig'

const {
  DeviceManager: {
    QueryByPageGXCW,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddCDCW,
    UpdateCDCW,
    DeleteCDCW,
    ImportCDCW,
    OneLevel
  }
} = Monitoring

export default function gateway({ deviceStyle }) {
  const publish = useSelector(publishState)
  const [selectopts, setSelectopts] = useState([])
  const [gatewaylist, setGatewaylist] = useState()
  const gatewayRef =useRef()
  gatewayRef.current =gatewaylist
  const [devicelist, setDevicelist] = useState()
  const deviceRef =useRef()
  deviceRef.current = devicelist
  const [addopts, setAddOpts] = useState()
  const addoptsRef = useRef()
  addoptsRef.current = addopts
  const [alarmopts, setAlarmopts] = useState()
  const alarmoptsRef = useRef()
  alarmoptsRef.current = alarmopts
  const [transitionName,setTransition]=useState(undefined)
  const [maskTransitionName,setMaskTransitionName]=useState(undefined)
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10,
    hideOnSinglePage: false
  })
  const pageRef= useRef(page)
  pageRef.current=page
  const [dataSource, setDataSource] = useState([])
  const oneLevel = useSelector(state=>state.system.onelevel)
  const projectId = useSelector(state => state.system.menus.projectId)
  const compRef = useRef()
  const modalFormRef = useRef()
  const modalImportRef = useRef()
  const DelModalRef = useRef()
  const EditModalFormRef = useRef()
  const ErrModalRef=useRef()
  const errlistRef =useRef()
  const tableLoadRef = useRef()
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
 
  const content =useContext(cutContext)
  const levelname =useRef()
  let delid = useRef();
  let flies;
  const optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  let columns = [
    {
      title: oneLevel[0]?.levelName?oneLevel[0].levelName:'园区名称',
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
            <span>{gatewayfilter[0]['id']===0?'/':gatewayfilter[0].sn}</span>
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
      export:false,
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
  if(publish){
    columns.pop()
  }
  //打开编辑窗口
  const onEdit = (record) => {
    EditModalFormRef?.current?.onOpen()
    editform.setFieldsValue({ ...record, commProtocol: record.commProtocol ? record.commProtocol : '' })
  }
 
  //确认编辑
  const editOk = () => {
    editform.validateFields().then(async()=>{
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
        customerType:0,
        commPort,
        commProtocol:commProtocol?commProtocol:0,
        commAddress,
        factor:0
      }
      const resp = await UpdateCDCW(params)
      if(resp.success){
        message.success("更新成功")
        EditModalFormRef?.current?.onCancel()
        getQueryByPageElectric(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      }else{
        message.error(resp.errMsg)
      }
    })
  }
  //编辑应用
  const editSure=()=>{
    editform.validateFields().then(async()=>{
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
        customerType:0,
        commPort,
        commProtocol:commProtocol?commProtocol:0,
        commAddress,
        factor:0
      }
      const resp = await UpdateCDCW(params)

      if(resp.success){
        message.success("应用成功")
        getQueryByPageElectric(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      }else{
        message.error(resp.errMsg)
      }
    })
  }
  const onEditCancel=()=>{

    EditModalFormRef?.current?.onCancel()
  }
   //打开删除窗口
   const onDelete = (record) => {
    DelModalRef?.current?.onOpen()
    delid.current=record.sn
  }
  //确认删除
  const delOk=async()=>{
    const {success,errMsg} = await DeleteCDCW({
      projectId,
      sn:encodeURIComponent(delid.current)
    })
    if(success){
      message.success('删除成功')
      if(page.total%(page.pageSize*(page.current-1 ))===1){
        setPage({
          ...page,
          current:page.current-1
        })
      }
      DelModalRef?.current?.onCancel()
      setTimeout(()=>{
        getQueryByPageElectric(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      },0)
    
    }else{
      message.error(errMsg)
    }
  }

  //打开新增窗口
  const addopen = () => {
    if(!levelname.current){
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
        customerType:0,
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commProtocol: formvalue.commProtocol ? formvalue.commProtocol : 0,
        commAddress: formvalue.commAddress ? formvalue.commAddress : 0,
        factor: 0
      }
      const res = await AddCDCW(params)
      if (res.success) {
        message.success('新增成功!')
        modalFormRef?.current?.onCancel()
        getQueryByPageElectric(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  //新增确认应用
  const onSure=()=>{
    addform.validateFields().then(async () => {
      setTransition("")
      setMaskTransitionName("")
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
        commPort: formvalue.commPort ? formvalue.commPort : 0,
        commProtocol: formvalue.commProtocol ? formvalue.commProtocol : 0,
        commAddress: formvalue.commAddress ? formvalue.commAddress : 0,
        factor:0
      }
      const res = await AddCDCW(params)
     
      if (res.success) {
        message.success('应用成功!')
        getQueryByPageElectric(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      } else {
        message.error(res.errMsg)
      }
    }).catch(()=>{

    })
  }
  //新增弹窗取消
  const onAddCancel = ()=>{
    modalFormRef?.current?.onCancel()
    setTransition(undefined)
    setMaskTransitionName(undefined)
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
        console.log('resp',resp)
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
  //获取触点测温列表
  const getQueryByPageElectric = async (curpage=0,pageSize=0,id, like,customerType) => {
    setLoading(true)
    let params = {
      projectId,
      // pageNum: page.current,
      // pageSize: page.pageSize,
      pageNum: curpage?curpage:pageRef.current.current,
      pageSize: pageSize?pageSize:pageRef.current.pageSize,
      areaId: id ? id : 0,
      alike: like ? like : '',
      customerType:customerType?customerType:0
    }
    const resp = await QueryByPageGXCW(params)
    setLoading(false)
    setPage({
      ...page,
      current:resp.pageNum,
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
        pageSize:page.total,
        areaId:  compRef.current.selvalue?compRef.current.selvalue:0,
        alike: compRef.current.inpvalue,
        customerType:compRef.current.energyVal?compRef.current.energyVal:0
      }
     
      const resp = await QueryByPageGXCW(params)
      if(resp.success){
        resolve({list:resp.data?resp.data:[],total:resp.total})
      }else{
        reject(resp.errMsg)
      }
    })
  }
  //批量上传
  const onImportOk=async ()=>{
    const formData =new FormData()
    formData.append("file",flies[0])
    formData.append("projectId",projectId)
    const res = await ImportCDCW(formData)
     if(res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        getQueryByPageElectric(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
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
    if(oneLevel?.length>0){
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
    getList:getQueryByPageElectric,
    tb:tableLoadRef
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746,
    name: '新增触点测温',
    // addopts,
    // gatewaylist,
    // devicelist:deviceRef.current,
    transitionName:transitionName,
    maskTransitionName:maskTransitionName,
    onOk: addOk,
    onSure:onSure,
    onAddCancel:onAddCancel,
  
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
    link:'/deviceExcel/cdcw.xlsx',
    name:'触点测温导入',
    uploadprops,
    onOk:onImportOk
  }
  const EditModalFormProps = {
    EditModalFormRef,
    width: 746,
    name: '编辑触点测温',
    onOk: editOk,
    onSure:editSure,
    onEditCancel:onEditCancel
  }

  const ErrModalProps = {
    ErrModalRef,
    ref:errlistRef,
    onOk:()=>{ErrModalRef.current.onCancel()}
  }

  const EditModalComp=useMemo(()=>{
    return (
      <MyContext.Provider value={{ addopts, gatewaylist:gatewayRef.current, devicelist:deviceRef.current, alarmopts:alarmoptsRef.current, form: editform, deviceStyle,levelname }}>
      <EditModalForm {...EditModalFormProps}></EditModalForm>
    </MyContext.Provider>
    )
  },[addopts,gatewayRef.current,deviceRef.current,alarmoptsRef.current])
  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} pagination={page} dataSource={dataSource} loading={loading}  ref={tableLoadRef} onChange={(page, pageSize) => {
          setPage(() => ({
            ...page
          }))
          getQueryByPageElectric(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue, compRef.current.energyVal)
        }} onExport={onExport}></Table>

      </Comp>
    
      <MyContext.Provider value={{ addopts:addoptsRef.current, gatewaylist:gatewayRef.current, devicelist:deviceRef.current, alarmopts:alarmoptsRef.current, form: addform, deviceStyle,levelname }}>
        <AddModalForm {...ModalFormProps} >
        </AddModalForm>
      </MyContext.Provider>
      

      
      <MultImport {...ImportProps}></MultImport>
      <DeleteModal DelModalRef={DelModalRef} name="删除提示" content="是否确认删除触点测温？" onOk={delOk}></DeleteModal>
      {EditModalComp}
      {/* <MyContext.Provider value={{ addopts, gatewaylist:gatewayRef.current, devicelist:deviceRef.current, alarmopts:alarmoptsRef.current, form: editform, deviceStyle,levelname }}>
        <EditModalForm {...EditModalFormProps}></EditModalForm>
      </MyContext.Provider> */}
      <ErrorMessage {...ErrModalProps}></ErrorMessage>
    </div>
  )
}

