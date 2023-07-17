import React, { useEffect, useRef, useState, useContext, useMemo } from 'react'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import { MultImport, DeleteModal, ErrorMessage } from './modalCom'
import restart from './imgs/restart.png'
import { Form, Row, Col, Select, Input, Divider, Upload, message, Button, Spin } from 'antd'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import imgurl from './imgs/index.js'
import cutContext from '@com/content'
import { publishState } from '@redux/systemconfig'
import { useRequest,useLatest  } from 'ahooks';
const { DeviceManager:
  { AeraQueryAll,
    QueryUsedGateway,
    GatewayAdd,
    QueryByPageGateWay,
    GatewayUpdate,
    GatewayDelete,
    GatewayImport,
    OneLevel,
    StartReboot, State, StartDownloadTask, DownloadTaskState } } = Monitoring
export default function gateway() {
  const publish = useSelector(publishState)
  const [selectopts, setSelectopts] = useState()
  const selectoptsRef = useRef()
  selectoptsRef.current = selectopts
  const [addopts, setAddOpts] = useState()
  const addoptsRef = useRef()
  addoptsRef.current = addopts
  const [usecategory, setUsecategory] = useState()
  const usecategoryRef = useRef()
  usecategoryRef.current = usecategory
  const [dataSource, setDataSource] = useState()
  const [delId, setDelId] = useState()
  const [gatewaySn, setGatewaySn] = useState('')
  const [gatewayCnt, setGatewayCnt] = useState('')
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
  const errlistRef = useRef()
  const ErrModalRef = useRef()
  const [editform] = Form.useForm()
  const [addForm] = Form.useForm()
  const content = useContext(cutContext)
  const oneLevel = useSelector(state => state.system.onelevel)
  const projectId = useSelector(state => state.system.menus.projectId)
  const levelname = useRef()
  const [spinLoading, setspinLoading] = useState('')
  const [spinShow, setSpinShow] = useState(false)
  const modalReStartResRef = useRef()
  const optcss = {
    color: '#237ae4',
    textDecoration: 'underline',
    cursor: 'pointer',
  }
  let startsn;
  let flies;
  let edittag = false
  let columns = [
    {
      title: oneLevel[0]?.levelName ? oneLevel[0].levelName : '园区名称',
      dataIndex: 'areaName',
      key: 'areaName'
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '网关编号',
      dataIndex: 'sn',
      key: 'sn'
    },
    {
      title: '网关型号',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '网关名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'IMEI',
      dataIndex: 'imei',
      key: 'imei'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '操作',
      dataIndex: 'option',
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
      },
      key: 'sn'
    },
  ]
  columns.forEach(it => it.align = 'center')
  if (publish) {
    columns.pop()
  }
  let errcolumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text) => { return (<span>1</span>) },
      key: 'erros'
    },
    {
      title: '错误内容',
      dataIndex: 'erros',
      key: 'erros'
    },
  ]
  //打开参数下发弹窗
  const onKeyParam = (record) => {
    setGatewaySn(record.sn)
    setGatewayCnt(record.cnt)
    keyParamRef?.current?.onOpen()
  }
  //打开重启网关弹窗
  const onRestart = (record) => {
    console.log(record)
    modalReStartRef?.current?.onOpen()
    startsn = record.sn
    startsnref.current = record.sn
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
    if (!levelname.current) {
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
  const getOneLevel = async () => {
    const res = await OneLevel(projectId)
    if (res.success) {
      levelname.current = res.data.name
      getAeraQueryAll(res.data.name)
    } else {
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
        heartInterval: heartInterval ? parseInt(heartInterval) : 30,
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
  const addSure = () => {
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
        heartInterval: heartInterval ? parseInt(heartInterval) : 30,
        remark
      }
      const { data, success, errMsg } = await GatewayAdd(params)
      if (success) {
        message.success('应用成功')
        getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue)
      } else {
        message.error(errMsg)
      }
    })
  }
  const cancelOk = () => {
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
  const editSure = () => {
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

      const { data, success, errMsg } = await GatewayUpdate(params)
      if (success) {
        message.success('更新成功')
        getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue)
        // edittag = true
      } else {
        message.error(errMsg)
      }
    })
  }
  const editCancel = () => {
    // if (edittag) {
    //   getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue)
    // }
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
  const [isSuccess, setisSuccess] = useState(true)
  const [gatewayRes, setgatewayRes] = useState('')//操作结果成功失败

  //确认重启
  let [rebootNum, setrebootNum] = useState(0)
  const latest = useLatest(rebootNum)
  const startsnref = useRef()
  const polloption = useRequest(
    () => {
      return State(startsnref.current)
    }, {
    manual: true,
    pollingInterval: 2000,
    onError: (error) => {
      message.error(error.message);
    },
    onSuccess(result,params){
      if(result.data.code===1){
        polloption.cancel();
        if(result.data.message){
          setisSuccess(false)
          setSpinShow(false)
          modalReStartResRef?.current?.onOpen()
          setgatewayRes(result.data.message)
        }else{
          setisSuccess(true)
          modalReStartResRef?.current?.onOpen()
          setgatewayRes("重启网关成功!")
          setSpinShow(false)
        }
      }
      if (latest.current == 15) {
        polloption.cancel();
        modalReStartResRef?.current?.onOpen()
        setgatewayRes('任务超时，请重试！')
        setisSuccess(false)
        setSpinShow(false)
      }
      setrebootNum(latest.current+1)
      console.log(result,params)
    }
  })
  const startOk = async () => {
    modalReStartRef?.current?.onCancel()
    setspinLoading('正在重启网关……')
    setSpinShow(true)
    const { data, success, errMsg } = await StartReboot(startsn)
    if (success) {
      if(data.code===1){
        setSpinShow(false)
        modalReStartResRef?.current?.onOpen()
        setgatewayRes(data.message)
        setisSuccess(false)
      }else{
        polloption.run()
      }
      
    } else {
      message.error(errMsg)
    }
  }
  //原确认重启(废弃)
  const startOk1 = async () => {
    modalReStartRef?.current?.onCancel()
    setspinLoading('正在重启网关……')
    setSpinShow(true)
    const res = await StartReboot(startsn)
    if (res.success) {
      let data = JSON.parse(res.data)
      if (data.code == 0) {
        let list = []
        let state = true
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            if (state) {
              State(startsn).then(result => {
                list.push(i)
                if (result.success) {
                  if (JSON.parse(result.data).code == 0) {
                    state = false
                    setisSuccess(true)
                    modalReStartResRef?.current?.onOpen()
                    setgatewayRes(JSON.parse(result.data).message)
                    //message.success(JSON.parse(result.data).message)
                    setSpinShow(false)
                  }
                } else {
                  state = false
                  setisSuccess(false)
                  setSpinShow(false)
                  // message.error('重启失败！')
                  modalReStartResRef?.current?.onOpen()
                  setgatewayRes(JSON.parse(result.data).message)
                }
                if (list.length == 10 && result.data.code == 1) {
                  // message.error('任务超时，请重试！')
                  modalReStartResRef?.current?.onOpen()
                  setgatewayRes('任务超时，请重试！')
                  setisSuccess(false)
                  setSpinShow(false)
                }
              })
            }
          }, 3000 * i)
        }
      } else {
        setSpinShow(false)
        modalReStartResRef?.current?.onOpen()
        setgatewayRes(data.message)
        setisSuccess(false)
      }
    } else {
      message.error(res.errMsg)
    }
  }

  const operateOk = () => {
    modalReStartResRef?.current?.onCancel()
  }
  const [gatewayResTips, setgatewayResTips] = useState('')//操作结果成功失败
  const [errorList, seterrorList] = useState([])
  //参数下发
  let [countnum, setCountNum] = useState(0)
  const poll = () => {
    let time = countnum === 0 ? 0 : 3000
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        DownloadTaskState(gatewaySn).then(res => {
          if (res.data.code === 1) {
            if (res.data.message) {
              setisSuccess(false)
              modalReStartResRef?.current?.onOpen()
              seterrorList(res.data.message)
              setSpinShow(false)
              resolve('break')
            } else {
              setisSuccess(true)
              modalReStartResRef?.current?.onOpen()
              setgatewayRes('网关参数下发成功！')
              setgatewayResTips('注意：重启网关后参数才生效')
              setSpinShow(false)
              resolve('break')
            }
          } else {

            setCountNum(countnum++)
            resolve(countnum)
            // poll()
          }
        }).catch(err => { console.log(err) })
      }, time)
    })

  }
  const downloadOk = () => {
    keyParamRef?.current?.onCancel()
    setspinLoading("网关参数正在下发，请稍候")
    setSpinShow(true)
    StartDownloadTask(projectId, gatewaySn).then(async result => {
      if (result.success) {
        while (countnum < 15) {
          const resp = await poll()
          if (resp == 'break') break;
          if (resp === 15) {
            setisSuccess(false)
            modalReStartResRef?.current?.onOpen()
            setgatewayRes('网关参数下发失败！')
            setSpinShow(false)
          }
        }

      } else {
        setisSuccess(false)
        setspinLoading('')
        setSpinShow(false)
        modalReStartResRef?.current?.onOpen()
        setgatewayRes(res.errMsg)
      }
    })
  }
  //原参数下发(废弃)
  const downloadOk1 = () => {
    keyParamRef?.current?.onCancel()
    let rebootNum = parseInt(gatewayCnt % 5 == 0 ? gatewayCnt / 5 : gatewayCnt / 5 < 1 ? 1 : gatewayCnt / 5 + 1)
    let rebootTime = rebootNum < 2 ? 10 : rebootNum * 5
    setspinLoading("网关参数正在下发，请稍候…… 预计" + rebootTime + "秒后完成")
    setSpinShow(true)
    for (let a = 0; a < (rebootNum < 2 ? 10 : rebootNum * 5); a++) {
      setTimeout(() => {
        if (rebootTime > 0) {
          rebootTime--;
          setspinLoading("网关参数正在下发，请稍候…… 预计" + rebootTime + "秒后完成")
          console.log(rebootTime)
        } else {
          setSpinShow(false)
        }
      }, 1000 * a)
    }
    StartDownloadTask(projectId, gatewaySn).then(res => {
      if (res.success) {
        let list = []
        let state = true
        for (let i = 0; i < (rebootNum < 2 ? 2 : rebootNum); i++) {
          setTimeout(() => {
            if (state) {
              DownloadTaskState(gatewaySn).then(result => {

                if (result.success) {
                  let data = JSON.parse(result.data)
                  if (data.code == 1) {
                    if (data.erros.length == 0) {
                      state = false
                      rebootTime = 0
                      setisSuccess(true)
                      modalReStartResRef?.current?.onOpen()
                      setgatewayRes('网关参数下发成功！')
                      setgatewayResTips('注意：重启网关后参数才生效')
                      setSpinShow(false)

                    } else {
                      state = false
                      rebootTime = 0
                      setisSuccess(false)
                      modalReStartResRef?.current?.onOpen()
                      seterrorList(data.errors)
                      setSpinShow(false)
                    }
                  } else {
                    list.push(i)
                    if (list.length == (rebootNum < 2 ? 2 : rebootNum)) {
                      state = false
                      rebootTime = 0
                      setisSuccess(false)
                      modalReStartResRef?.current?.onOpen()
                      setgatewayRes('网关参数下发失败！')
                      setSpinShow(false)
                    }
                  }
                } else {
                  state = false
                  rebootTime = 0
                  setisSuccess(false)
                  modalReStartResRef?.current?.onOpen()
                  setgatewayRes(JSON.parse(result.data).message)
                  setSpinShow(false)
                }
              })
            }
          }, 5000 * i)
        }
      } else {
        rebootTime = 0
        setspinLoading('')
        setSpinShow(false)
        setisSuccess(false)
        modalReStartResRef?.current?.onOpen()
        setgatewayRes(res.errMsg)
      }
    })
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
        alike: compRef.current.inpvalue
      }
      const resp = await QueryByPageGateWay(params)
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
    const res = await GatewayImport(formData)
    if (res.success) {
      if (res.data.success) {
        message.success("上传成功")
        modalImportRef.current.onCancel()
        // getQueryByPageGateWay(pageRef.current.current, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue,)
        getQueryByPageGateWay(1, pageRef.current.pageNum, compRef.current.selvalue, compRef.current.inpvalue,)
        setPage({
          ...page,
          current: 1
        })
        // pageRef.current.current =1
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
  const ComProps = {
    addopen,
    multExport,
    ref: compRef,
    selectopts,
    page,
    setPage,
    exportExecel,
    levelname,
    placeholder: '输入网关编号/安装地址',
    getList: getQueryByPageGateWay,
    tb: tableLoadRef
  }
  let ModalFormProps = {
    modalFormRef,
    width: 746,
    addopts: addoptsRef.current,
    selectopts: selectoptsRef.current,
    addForm,
    usecategory: usecategoryRef.current,
    onOk: addOk,
    onCancel: cancelOk,
    onSure: addSure,
    levelname
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
    onSure: editSure,
    onCancel: editCancel,
    levelname
  }

  const ErrModalProps = {
    ErrModalRef,
    ref: errlistRef,
    onOk: () => { ErrModalRef.current.onCancel() }
  }
  const AddFormComp = useMemo(() => {
    return (<AddModalForm {...ModalFormProps}></AddModalForm>)
  }, [addoptsRef.current, selectoptsRef.current, usecategoryRef.current])
  const EditFormComp = useMemo(() => <EditModalForm {...EditProps}></EditModalForm>, [levelname.current])
  useEffect(() => {
    if (oneLevel?.length > 0) {
      getOneLevel()
      getQueryByPageGateWay()
      getQueryUsedGateway()
    }
  }, [])

  return (
    <Spin tip={spinLoading} spinning={spinShow}>
      <div>

        <Comp {...ComProps}>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={page}
            loading={loading}
            ref={tableLoadRef}
            rowKey={columns => columns.sn}
            onExport={onExport}
            onChange={(page, pageSize) => {
              setPage(() => ({
                ...page
              }))
              getQueryByPageGateWay(page.current, page.pageSize, compRef.current.selvalue, compRef.current.inpvalue)
            }}></Table>
        </Comp>
        {/* <AddModalForm {...ModalFormProps}></AddModalForm> */}
        {AddFormComp}
        <MultImport {...ImportProps}></MultImport>
        <ReStart modalReStartRef={modalReStartRef} startOk={startOk}></ReStart>
        <ReStartRes modalReStartResRef={modalReStartResRef} operateOk={operateOk} isSuccess={isSuccess} gatewayRes={gatewayRes}
          errorList={errorList} columns={errcolumns} gatewayResTips={gatewayResTips}></ReStartRes>
        <KeyParam keyParamRef={keyParamRef} gatewaySn={gatewaySn} downloadOk={downloadOk}></KeyParam>
        <DeleteModal DelModalRef={modalDelRef} name="删除网关" content="是否确认删除网关？" onOk={delOk}></DeleteModal>
        {EditFormComp}
        <ErrorMessage {...ErrModalProps}></ErrorMessage>

      </div>
    </Spin>
  )
}

//新增网关组件
let AddModalForm = ({ modalFormRef, addopts, addForm, usecategory, levelname, ...other }) => {
  const rules = { required: true, }
  return (
    <Modal mold='cust' ref={modalFormRef} {...other} footer={[
      <Button onClick={other.onCancel}>取消</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onSure}>应用</Button>,
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
                showSearch
                options={usecategory}
              ></Select>
            </Form.Item>
            <Form.Item label="网关编号" name="sn" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="网关密码" name="pwd" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="网关名称" name="name" rules={[rules, { max: 12, message: '网关名称最大长度12位' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="心跳周期" name="heartInterval" rules={[{ pattern: /^[1-9]+[0-9]*$/, message: '心跳周期需为正整数' }]}>
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
  const [number, setNumber] = useState(value ? Number(value) : 30)

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
//重启结果
let ReStartRes = ({ modalReStartResRef, operateOk, gatewayRes, isSuccess, errorList, columns, gatewayResTips }) => {
  return (
    <Modal mold='cust' ref={modalReStartResRef} footer={[<Button key="submit" type="primary" onClick={operateOk}> 关闭</Button>,]}>
      <BlueColumn name="操作提示" styled={{ padding: '24px 0px', color: '#237ae4' }}></BlueColumn>
      {errorList ? <div style={{ margin: '16px 32px 0' }}>
        <img src={isSuccess ? imgurl.success : imgurl.fail}></img>
        <span style={{ paddingLeft: 32, fontSize: 16 }}>{gatewayRes}</span>
        <p style={{ color: 'red', width: 343, textAlign: 'center' }}>{gatewayResTips}</p>
      </div> : <Table bordered columns={columns} dataSource={errorList} rowKey='erros' size='small' pagination={false} />}

    </Modal>
  )
}
//参数下发组件
const KeyParam = ({ keyParamRef, gatewaySn, downloadOk }) => {
  return (
    <Modal mold='cust' ref={keyParamRef} onOk={downloadOk}>
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
const EditModalForm = ({ modalEditRef, editform, levelname, ...other }) => {
  const rules = { required: true, }
  return (
    <Modal mold='cust' ref={modalEditRef} {...other} footer={[
      <Button onClick={other.onCancel}>取消</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
      <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onSure}>应用</Button>,
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
              <Input disabled />
            </Form.Item>
            <Form.Item label="网关密码" name="pwd" rules={[rules]}>
              <Input />
            </Form.Item>
            <Form.Item label="网关名称" name="name" rules={[rules, { max: 12, message: '网关名称最大长度12位' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="心跳周期" name="heartInterval" rules={[{ pattern: /^[1-9]+[0-9]*$/, message: '心跳周期需为正整数' }]}>
              <Count></Count>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
