// import React, { useEffect, useState, useRef,forwardRef,useImperativeHandle } from 'react'
// import DeviceContent from './deviceContent'
// import gateWayImg from '@imgs/gateway.png';
// import style from './style.module.less'
// import AllColumns from './columns'
// import { Monitoring } from '@api/api.js'
// import { useSelector } from 'react-redux'
// import { Button, Form, Input, Row, Col, Upload, Select, Switch, message ,Divider } from 'antd';
// import Table from '@com/useTable'
// import electricImg from '@imgs/diaobiao.png'
// import UploadImg from './upload.jsx'

// export default function water() {
//   const [dataSource, setDataSource] = useState([])
//   const [defaultTableData,setDefaultTableData] = useState(null)
//   const { DeviceTypeManager: { } } = Monitoring;
//   const ModalRef = useRef(null)
//   const foRef = useRef(null)
//   const projectId = useSelector(state => state.system.menus.projectId)
//   const [addForm] = Form.useForm()
//   let tableData=[];
//   let params = {
//     projectId,
//     pageNum: 1,
//     pageSize: 10,
//     alike: ''
//   }

//   const getTableData = async () => {
//     // const result = await GatewayType(params)
//     // const { data, errMsg, success } = result;
//     // if (success && Array.isArray(data)) {
//     // }
//   }
//   //新增时获取未使用的电表名
//   const getDeviceQueryNotUsed = async () => {
//     let params = {
//       projectId,
//       deviceStyle: 1
//     }
//     const r = await DeviceQueryNotUsed(params)
//     if (r.success && Array.isArray(r.data)) {
//       const arr = r.data.map((item, index) => ({ label: item, value: item }))
//       setDataSource(arr)
//       getDeviceQueryCategoryFull(r.data[0])
//     }
//   }

//   //获取默认电表的详细信息
//   const getDeviceQueryCategoryFull = async (category) => {
//     let params = {
//       projectId,
//       category,
//     }
//     const r = await DeviceQueryCategoryFull(params)
//     if (r.success) {
//       const data = r.data
//       const arr = data.points.map((item,index)=>({
//         index:index+1,
//         dataMark:item.alias,
//         dataName:item.name,
//         dataUnit:item.unit,
//         isSave:item.isSave,
//         watchPoint:item.isRuningPoint,
//         dataOrder:item.secquence
//       }))
//       console.log(foRef,arr)
//       if(foRef.current){
//         foRef.current.setPointSource(arr)
//       }else{
//         setDefaultTableData(arr)
//       }
//       addForm.setFieldsValue({
//         DeviceType: data.category,
//         Cycle: data.rateType,
//         Control: data.control,
//         IsCount: data.calculate,
//         IsRead: data.realTimeReading,
//         DefaulImg:`data:image/jpeg;base64,${data.imageBase64}` ,
//         ImageUpload:'',
//         // Point:arr,
//       })
//     }
  
//   }
//   const open = () => {
//     ModalRef.current.onOpen()
//   }
//   const onOk = () => {
//     console.log(addForm.getFieldsValue(),foRef.current.pointSource)
//   }
//   useEffect( () => {
//     getTableData()
//     getDeviceQueryNotUsed()
//     getDeviceQueryCategoryFull()
//   }, [])
//   let addModalProp = {
//     addForm,
//     dataSource,
//     getDeviceQueryCategoryFull,
//     defaultTableData
//   }
//   let deviceProps = {
//     value: 0,
//     name: '新增电表类型',
//     AddModal: <AddModal ref={foRef} {...addModalProp} />,
//     cancelText: '取消',
//     okText: '确认',
//     onOk,
//     width: 1032,
//     open,
//     ModalRef
//   };
//   return (
//     <div>
//       <DeviceContent {...deviceProps} >
//         <Table columns={AllColumns[1]}></Table>
//       </DeviceContent>
//     </div>
//   )
// }
