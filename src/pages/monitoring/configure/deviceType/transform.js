import React, { useEffect, useState, useRef,forwardRef,useImperativeHandle } from 'react'
import DeviceContent from './deviceContent'
import gateWayImg from '@imgs/gateway.png';
import style from './style.module.less'
import AllColumns from './columns'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message ,Divider } from 'antd';
import Table from '@com/useTable'
import electricImg from '@imgs/diaobiao.png'
import UploadImg from './upload.jsx'

const { DeviceTypeManager: { AllDeviceStyle, DeviceQueryNotUsed, DeviceQueryCategoryFull } } = Monitoring;
export default function Electric() {
  const [dataSource, setDataSource] = useState([])
  const [defaultTableData,setDefaultTableData] = useState(null)
  const { DeviceTypeManager: { } } = Monitoring;
  const ModalRef = useRef(null)
  const foRef = useRef(null)
  const projectId = useSelector(state => state.system.menus.projectId)
  const [addForm] = Form.useForm()
  let tableData=[];
  let params = {
    projectId,
    pageNum: 1,
    pageSize: 10,
    alike: ''
  }

  const getTableData = async () => {
    // const result = await GatewayType(params)
    // const { data, errMsg, success } = result;
    // if (success && Array.isArray(data)) {
    // }
  }
  //新增时获取未使用的电表名
  const getDeviceQueryNotUsed = async () => {
    let params = {
      projectId,
      deviceStyle: 1
    }
    const r = await DeviceQueryNotUsed(params)
    if (r.success && Array.isArray(r.data)) {
      const arr = r.data.map((item, index) => ({ label: item, value: item }))
      setDataSource(arr)
      getDeviceQueryCategoryFull(r.data[0])
    }
  }

  //获取默认电表的详细信息
  const getDeviceQueryCategoryFull = async (category) => {
    let params = {
      projectId,
      category,
    }
    const r = await DeviceQueryCategoryFull(params)
    if (r.success) {
      const data = r.data
      const arr = data.points.map((item,index)=>({
        index:index+1,
        dataMark:item.alias,
        dataName:item.name,
        dataUnit:item.unit,
        isSave:item.isSave,
        watchPoint:item.isRuningPoint,
        dataOrder:item.secquence
      }))
      console.log(foRef,arr)
      if(foRef.current){
        foRef.current.setPointSource(arr)
      }else{
        setDefaultTableData(arr)
      }
      addForm.setFieldsValue({
        DeviceType: data.category,
        Cycle: data.rateType,
        Control: data.control,
        IsCount: data.calculate,
        IsRead: data.realTimeReading,
        DefaulImg:`data:image/jpeg;base64,${data.imageBase64}` ,
        ImageUpload:'',
        // Point:arr,
      })
    }
  
  }
  const open = () => {
    ModalRef.current.onOpen()
  }
  const onOk = () => {
    console.log(addForm.getFieldsValue(),foRef.current.pointSource)
  }
  useEffect( () => {
    getTableData()
    getDeviceQueryNotUsed()
    getDeviceQueryCategoryFull()
  }, [])
  let addModalProp = {
    addForm,
    dataSource,
    getDeviceQueryCategoryFull,
    defaultTableData
  }
  let deviceProps = {
    value: 0,
    name: '新增电表类型',
    AddModal: <AddModal ref={foRef} {...addModalProp} />,
    cancelText: '取消',
    okText: '确认',
    onOk,
    width: 1032,
    open,
    ModalRef
  };
  return (
    <div>
      <DeviceContent {...deviceProps} >
        <Table columns={AllColumns[1]}></Table>
      </DeviceContent>
    </div>
  )
}


let Count = ({ value,index,pointSource }) => {
  const [num,setNum] =useState(value|| 0)
  const reduce = () => {
    if (num < 0) return
    setNum(num - 1)

    pointSource[index]['dataOrder']=num-1
  }
  
  const add = () => {
    setNum(num + 1)
    pointSource[index]['dataOrder']=num+1
  }
  return (
    <div className={style.countNum}>
      <div onClick={reduce} className={style.opts}>-</div>
      <div className={style.numbers}>{num}</div>
      <div onClick={add} className={style.opts}>+</div>
    </div>
  )
}

let ImageUpload = ({ value = {}})=>{
  return(
       <img src={value } style={{ width: 120, height: 96,marginRight: 16 }}></img>
  )
}







let TableForm=forwardRef(({defaultTableData},ref)=>{
  const [pointSource,setPointSource] = useState([...defaultTableData])
  const [isSiwtched,setIsSwitched] = useState([])

  let arrs=[];
  const columns=[
    {
      title:'序号',
      key:'index',
      dataIndex:'index'
    },
    {
      title:'数据标识',
      key:'dataMark',
      dataIndex:'dataMark'
    },
    {
      title:'数据名称',
      key:'dataName',
      dataIndex:'dataName'
    },
    {
      title:'数据单位',
      key:'dataUnit',
      dataIndex:'dataUnit'
    },
    {
      title:'是否存储',
      key:'isSave',
      dataIndex:'isSave',
      // shouldCellUpdate:()=>true,
      render:(_,v,index)=>{
        return (
          <Switch checkedChildren="存储" unCheckedChildren="不存储" defaultChecked={_} 
          onChange={(o)=>{
            pointSource.forEach((it,index)=>{
              if(it.index===v.index){
                it.isSave=o
              }
            })
            
          }}/> 
          
        )
      }
    
    },
    {
      title:'标记运行监测点',
      key:'watchPoint',
      dataIndex:'watchPoint',
      shouldCellUpdate:(r,o)=>true,
      render:(t,v,index)=>{
        return(
          <Switch 
            checkedChildren="标记" 
            unCheckedChildren="不标记" 
            defaultChecked={t} 
            disabled={isSiwtched.length>3} 
            onChange={(o)=>{
              let arr = [...pointSource]
              arr.forEach((it,i)=>{
                if(it.index===v.index){
                  it.watchPoint=o
                }
              })
              setPointSource(arr)
              // if(isSiwtched.length<4){
              //   o&& setIsSwitched((d)=>{return [...d,v.index]})
              // }
              // console.log(isSiwtched,v)
              // const num = arr.filter((it,index)=>it.watchPoint).length
              // if(arrs.length>3){
              //   setIsSwitched(true)
              // }else{
              //   setIsSwitched(false)
              // }
            }}
            /> 
        )
      }
       
    },
    {
      title:'数据显示顺序',
      key:'dataOrder',
      dataIndex:'dataOrder',
      render:(_,v,i)=>{
        return <Count value={_} index={i} pointSource={pointSource} ></Count>
      }
    },
  ] 

  useImperativeHandle(ref,()=>({
    // setIsSwitched,
    pointSource,
    setPointSource
  }))
  return(
    <Table columns={columns} dataSource={pointSource} rowKey={record=>record.index} ></Table>
  )
})


//新增电表类型
let AddModal =forwardRef(
  ({ addForm, dataSource,getDeviceQueryCategoryFull,defaultTableData ,initialValues},ref) => { 
    const tableRef = useRef(null)
    // const [pointSource,setPointSource] = useState([...defaultTableData])
    // const [isSiwtched,setIsSwitched] = useState(false)
    // const [num,setNum]=useState(0)
    // const columns=[
    //   {
    //     title:'序号',
    //     key:'index',
    //     dataIndex:'index'
    //   },
    //   {
    //     title:'数据标识',
    //     key:'dataMark',
    //     dataIndex:'dataMark'
    //   },
    //   {
    //     title:'数据名称',
    //     key:'dataName',
    //     dataIndex:'dataName'
    //   },
    //   {
    //     title:'数据单位',
    //     key:'dataUnit',
    //     dataIndex:'dataUnit'
    //   },
    //   {
    //     title:'是否存储',
    //     key:'isSave',
    //     dataIndex:'isSave',
    //     render:(_,v,index)=>{
    //       return (
    //         <Switch checkedChildren="存储" unCheckedChildren="不存储" defaultChecked={_} 
    //         onChange={(o)=>{
    //           // console.log(v); 
    //           pointSource[index]=v;
    //           const arr = [...pointSource];
    //           arr.splice(index,1,v)
    //           // setPointSource(arr)
    //           setPointSource([...arr])
    //         }}/> 
    //       )
    //     }
      
    //   },
    //   {
    //     title:'标记运行监测点',
    //     key:'watchPoint',
    //     dataIndex:'watchPoint',
    //     render:(_,v,index)=>
    //     <Switch 
    //     checkedChildren="标记" 
    //     unCheckedChildren="不标记" 
    //     defaultChecked={_} 
    //     // disabled={isSiwtched?!pointSource[index].watchPoint:false} 
        
    //     onChange={(o)=>{
    //       // pointSource[index].watchPoint=o;
    //       // const arr = [...pointSource];
    //       // arr[index].watchPoint=o;
    //       // arr.splice(index,1,arr)
    //       // console.log(arr)
    //       // setPointSource(arr)
    //       // const flagArr = arr.filter((it,i)=>it.watchPoint)
    //       // if(flagArr.length>=4){
    //       //  setIsSwitched(true)
    //       // }else{
    //       //  setIsSwitched(false)
    //       //  }
    //       // arr[index]=[...arr[index],...v]
         
    //       // setPointSource((o,n)=>{
    //       //   console.log(o,n)
    //       // })
         
    //     }} />  
    //   },
    //   {
    //     title:'数据显示顺序',
    //     key:'dataOrder',
    //     dataIndex:'dataOrder',
    //     render:(_,v,i)=>{
    //       return <Count value={_} index={i} pointSource={pointSource}></Count>
    //     }
    //   },
    // ] 
    console.log(addForm.getFieldsValue())
    const handleChange=async (option)=>{
     await  getDeviceQueryCategoryFull(option)
     setControl(addForm.getFieldsValue().Control)

    }
    
    useEffect(()=>{
      // setPointSource(tableData)
    })
    useImperativeHandle(ref, ()=> ({
      pointSource:tableRef.current.pointSource,
      setPointSource:tableRef.current.setPointSource,
      handleChange:tableRef.current.handleChange,
     
    }))
    return (
      <Form
        layout="vertical"
        form={addForm}
        initialValues={
          initialValues
        }
      >
        <Row align='bottom'>
          <Col span={16}>
            <Row style={{ marginBottom: 16 }}>
              <Form.Item label="设备型号" name="DeviceType">
                <Select
                  style={{ width: 200 }}
                  options={dataSource}
                  onChange={handleChange}
                />
              </Form.Item>
            </Row>
            <Row >
              {/* <Col>
                <Form.Item label="心跳周期(秒)" name="Cycle">
                  <Count></Count>
                </Form.Item>
              </Col> */}
              <Col className={style.ColGap}>
                <Form.Item label="远程控制" name="Control" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!addForm.getFieldsValue().Control} checked={addForm.getFieldsValue().Control}/>
                  
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否计量" name="IsCount" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!addForm.getFieldsValue().IsCount}/>
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否抄读" name="IsRead" valuePropName='checked'>
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={8} align="bottom">
            <Row align="bottom">
              <Form.Item label="设备图片" name='DefaulImg' style={{margin:0} }>
               <ImageUpload></ImageUpload>
              </Form.Item>
              <Form.Item name='ImageUpload' >
              <UploadImg></UploadImg>
              </Form.Item>
            </Row>
          </Col>
        </Row>
        <Divider dashed/>
        <Row style={{fontWeight:'bold',marginBottom:16}}>数据点表（请启用4项数据标记为菜单【运行监测】卡片核心数据项）</Row>
        {/* <Table columns={columns} dataSource={pointSource} rowKey={record=>record.index}></Table> */}
        <TableForm ref={tableRef} defaultTableData={defaultTableData}  ></TableForm>
      </Form>
    )
  }
) 