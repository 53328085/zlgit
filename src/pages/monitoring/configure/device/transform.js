import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import { useSelector } from 'react-redux'
import { Form, Row, Col, Select, Input, Divider, message } from 'antd'
import Comp from './comp'
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { MultImport } from './modalCom'
import { Monitoring } from '@api/api.js'
import { DeleteModal } from './modalCom'
import { MyContext } from './formcomp'
import style from './style.module.less'


const {
  DeviceManager: {
    QueryByPageTransformer,
    AeraQueryAll,
    QueryListGateWay,
    QueryUsedDeviceCategory,
    QueryPlanList,
    AddTransformer,
    UpdateTransformer,
    DeleteTransformer
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
  const [dataSource, setDataSource] = useState([])
  const projectId = useSelector(state => state.system.menus.projectId)
  const compRef = useRef()
  const modalFormRef = useRef()
  const modalImportRef = useRef()
  const DelModalRef = useRef()
  const EditModalFormRef = useRef()
  const pageRef= useRef(page)
  pageRef.current=page
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()
  let delid;
  // let pageObj={ 
  //   current: 1,
  //   pageSize: 2,
  //   hideOnSinglePage:false
  // }
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
      title: '变压器型号',
      dataIndex: 'category'
    },
    {
      title: '变压器编号',
      dataIndex: 'sn'
    },
    
    {
      title: '额定容量(kVA)',
      dataIndex: 'name'
    },
    {
      title: '所属网关',
      dataIndex: 'gatewayName',
      render: (text, record, index) => {
        if (Array.isArray(gatewaylist)) {
          const gatewayfilter = gatewaylist.filter(it => it.id === record.gatewayId)
          console.log(gatewayfilter)
          return (
            <span>{gatewayfilter[0]['id'] === 0 ? '/' : gatewayfilter[0].category}</span>
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
  //打开编辑窗口
  const onEdit = (record) => {
    console.log(record)
    EditModalFormRef?.current?.onOpen()
    editform.setFieldsValue({ ...record })
  }

  //确认编辑
  const editOk = async () => {
    addform.validateFields().then(async () => {
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
        ratedFrequency
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
        ratedFrequency
      }
      const resp = await UpdateTransformer(params)
      if (resp.success) {
        message.success("更新成功")
        EditModalFormRef?.current?.onCancel()
        getQueryByPageTransformer(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      } else {
        message.error(resp.errMsg)
      }
    })
    
  }
  //打开删除窗口
  const onDelete = (record) => {
    DelModalRef?.current?.onOpen()
    delid = record.id
  }
  //确认删除
  const delOk = async () => {
    console.log(delid)
  
    const { success, errMsg } = await DeleteTransformer({
      projectId,
      id: delid
    })
    if (success) {
      message.success('删除成功')
      if(page.pageSize*page.current>=page.total){
        setPage({
          ...page,
          current:page.current-1
        })
      }
      DelModalRef?.current?.onCancel()
      setTimeout(()=>{
        getQueryByPageTransformer(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      },0)
     
    } else {
      message.error(errMsg)
    }
    console.log(res)
  }


  //打开新增窗口
  const addopen = () => {
    addform.setFieldsValue({
      areaId: '',
      alarmPlanId: '',
      address: '',
      remark: '',
      gatewayId: '',
      category: '',
      sn: '',
      name: '',
      capacity:'',
      ratedU:'',
      ratedI:'',
      ratedFrequency:''
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
        capacity:formvalue.capacity,
        ratedU:formvalue.ratedU,
        ratedI:formvalue.ratedI,
        ratedFrequency:formvalue.ratedFrequency
      }
      const res = await AddTransformer(params)
      if (res.success) {
        message.success('新增成功!')
        modalFormRef?.current?.onCancel()
        // getQueryByPageTransformer()
        getQueryByPageTransformer(pageRef.current.current,pageRef.current.pageNum,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
      } else {
        message.error(res.errMsg)
      }
    })



  }
  //打开批量导入窗口
  const multExport = () => {
    modalImportRef?.current?.onOpen()
  }
  //获取园区
  const getAeraQueryAll = async () => {
    try {
      const resp = await AeraQueryAll(projectId)
      if (resp.success && Array.isArray(resp.data)) {
        const data = [{ name: '全部园区', id: 0 }, ...resp.data]
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
        setGatewaylist(() => ([{ category: '(无)直连设备', id: 0 }, ...arr]));
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
  //获取变压器列表
  const getQueryByPageTransformer = async (curpage=0,pageSize=0,id, like, customerType) => {
    setLoading(true)
    let params = {
      projectId,
      // pageNum: page.current,
      // pageSize: page.pageSize,
      pageNum: curpage?curpage:pageRef.current.current,
      pageSize: pageSize?pageSize:pageRef.current.pageSize,
      areaId: id ? id : 0,
      alike: like ? like : '',
      customerType: customerType ? customerType : 0
    }
    const resp = await QueryByPageTransformer(params)
    setLoading(false)
    setPage({
      ...page,
      current:resp.pageNum,
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



  useEffect(() => {
    getQueryByPageTransformer()
    getAeraQueryAll()
    getQueryUsedDeviceCategory()
    getQueryPlanList()
    getQueryListGateWay()
    

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
    getList: getQueryByPageTransformer
  }
  const ModalFormProps = {
    modalFormRef,
    width: 746,
    name: '新增变压器',
    addopts,
    gatewaylist,
    devicelist,
    onOk: addOk
  }
  const ImportProps = {
    modalImportRef,
    width: 560,
    name: '/deviceExcel/electric.xlsx'
  }
  const EditModalFormProps = {
    EditModalFormRef,
    width: 746,
    name: '编辑变压器',
    onOk: editOk
  }


  return (
    <div>
      <Comp {...ComProps}>
        <Table columns={columns} pagination={page} dataSource={dataSource} loading={loading} onChange={(page,pageSize)=>{
        setPage(()=>({
          ...page
        }))
        getQueryByPageTransformer(page.current,page.pageSize,compRef.current.selvalue,compRef.current.inpvalue,compRef.current.energyVal)
        }}></Table>
      </Comp>
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: addform, deviceStyle }}>
        <AddModalForm {...ModalFormProps} >
        </AddModalForm>
      </MyContext.Provider>
      <MultImport {...ImportProps}></MultImport>
      <DeleteModal DelModalRef={DelModalRef} name="删除提示" content="是否确认删除变压器？" onOk={delOk}></DeleteModal>
      <MyContext.Provider value={{ addopts, gatewaylist, devicelist, alarmopts, form: editform, deviceStyle }}>
        <EditModalForm {...EditModalFormProps}></EditModalForm>
      </MyContext.Provider>

    </div>
  )
}


//新增form表单组件
export const FormComp = (props) => {
  const { TextArea } = Input
  const { addopts, gatewaylist, devicelist, alarmopts, form } = useContext(MyContext)
  const [area, setArea] = useState([])
  const rules = [{
    required: true
  }]
  
  const changeGateway = (v, option) => {
    console.log(v, option)
    if (v) {
      const arr = addopts?.filter(it => (it.id === option.areaId))
      setArea([...arr])
      form.setFieldsValue({ areaId: arr[0].id, commPort: '', commProtocol: 0 })
    } else {
      setArea([])
      form.setFieldsValue({areaId:''})
    }
  }
  const validatorfunc= (_,value)=>{
    console.log(value,!Number(value))
    if(!Number(value))
    {
     return Promise.reject(new Error("请输入正确的额定容量"))
    }else{
      if(Number(value)<=0){
     return   Promise.reject(new Error("请输入正确的额定容量"))
      }else{
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
        span: 7
      }}
      validateTrigger="onFinish"
    >
      <Row className={style.customItem}>
        <Col flex={1}>
          <Form.Item label="所属园区" name="areaId" rules={rules}>
            {
              area.length > 0 ? <Select
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                options={area}
                disabled
              ></Select> : <Select
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
              fieldNames={{
                label: 'category',
                value: 'id',
              }}
              onChange={changeGateway}
              options={gatewaylist}
            ></Select>
          </Form.Item>
          <Form.Item label="额定容量" name="capacity" rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(KVA)</span>} />
          </Form.Item>
          <Form.Item label="额定电压" name="ratedU" rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(V)</span>}/>
          </Form.Item>
          <Form.Item label="额定电流" name="ratedI" rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(A)</span>}/>
          </Form.Item>
          <Form.Item label="额定频率" name="ratedFrequency" rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(Hz)</span>}/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
//新增设备
export let AddModalForm = ({ modalFormRef, ...other }) => {
  return (
    <Modal mold='cust' ref={modalFormRef} {...other}>
      <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
      <FormComp >
      </FormComp>
    </Modal>
  )

}




//编辑设备
export const EditModalForm = ({ EditModalFormRef, ...other }) => {
  return (
    <Modal mold='cust' ref={EditModalFormRef} {...other}>
      <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
      <EditFormComp >
      </EditFormComp>
    </Modal>
  )

}

//编辑form表单组件
export const EditFormComp = (props) => {
  const { TextArea } = Input
  const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle } = useContext(MyContext)
  const [area, setArea] = useState([])
  const [coms, setComs] = useState(0)
  const [isdisable, setIsdisable] = useState(false)
  const rules = [{
    required: true
  }]
  const changeGateway = (v, option) => {
    console.log(v, option)
    setIsdisable(false)
    if (v) {
      const arr = addopts?.filter(it => (it.id === option.areaId))
      setArea([...arr])
      setComs(option.com)
      form.setFieldsValue({ areaId: arr[0].id, commPort: '', commAddress: 0, commProtocol: '' })
    } else {
      setArea([])
      form.setFieldsValue({ commAddress: 0, commPort: 0, commProtocol: 0 })
    }
  }
  const validatorfunc= (_,value)=>{
    console.log(value,!Number(value))
    if(!Number(value))
    {
     return Promise.reject(new Error("请输入正确的额定容量"))
    }else{
      if(Number(value)<=0){
     return   Promise.reject(new Error("请输入正确的额定容量"))
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
        span: 7
      }}
    >
      <Row className={style.customItem}>
        <Col flex={1}>
          <Form.Item label="所属园区" name="areaId" rules={rules}>
            {
              (area.length || isdisable) > 0 ? <Select
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                options={area}
                disabled
              ></Select> : <Select
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
              fieldNames={{
                label: 'category',
                value: 'id',
              }}
              onChange={changeGateway}
              options={gatewaylist}
            ></Select>
          </Form.Item>
          <Form.Item label="额定容量" name="capacity"  rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(KVA)</span>}/>
          </Form.Item>
          <Form.Item label="额定电压" name="ratedU" rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(V)</span>}/>
          </Form.Item>
          <Form.Item label="额定电流" name="ratedI"  rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(A)</span>}/>
          </Form.Item>
          <Form.Item label="额定频率" name="ratedFrequency" rules={[{ validator:validatorfunc}]}>
            <Input suffix={<span>(Hz)</span>}/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
