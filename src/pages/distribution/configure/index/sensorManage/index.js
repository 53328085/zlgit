import React, { useRef, useState, useEffect, useCallback } from 'react'
import {  Button, Space, message, Typography, Divider } from 'antd';
import {useTranslation} from 'react-i18next' 
import UseTransfer from '@com/useTransfer'
import {  useAntdTable } from 'ahooks';
import {useSelector} from 'react-redux'
 
import {selectProjectId,   selectcurlRommid, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import { DistributionMeter } from '@api/api.js'
import { cloneDeep } from 'lodash';
import Usetable from '@com/useTable'
 
import { ExportExcel, CustButton} from '@com/useButton'
import CModal from '@com/useModal'
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
const {Link} = Typography
export default function Index() {
  const {t} = useTranslation(["button"])
  const tableRef = useRef()
 
  const { queryPageSensor, queryUnusedSensor, configureSensor } = DistributionMeter
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  const projectId = useSelector(selectProjectId);
  const roomId = useSelector(selectcurlRommid)
  const areaId = useSelector(selectOneLevelDefaultId)
  

  //设备查询
 
  const [total, setTotal] = useState(0)
 
  const getTableData = ({current, pageSize}) => {
    if(!roomId)  return  new Promise((resolve) => {
      setSubTable([])
      setTotal(0)
      resolve({
       list: [],
       total: 0
     })

 })
    return queryPageSensor(projectId, roomId, current, pageSize).then(res => {
      let {success, data, total=0,errMsg} = res
      setTotal(total)
      if(success && Array.isArray(data) && data.length > 0){
           return {
             list: data,
             total,

           }
        
      
      }else {
        if(!success) message.warning(errMsg || "数据出错")
        return {
          list: [],
          total: 0,
        }
        
      }
    })
  }
  const {tableProps, refresh: queryTable} = useAntdTable(getTableData,{
    refreshDeps: [roomId],
    defaultPageSize: 14
  })

  const columns = [
    {
      align:'center',
      title: '传感器编号',
      dataIndex: 'sn',
      key: 'sn',
    },{
      align:'center',
      title: '传感器名称',
      dataIndex: 'name',
      key: 'name',
    },{
      align:'center',
      title: '传感器型号',
      dataIndex: 'category',
      key: 'category',
    },{
      align:'center',
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      width: 480
    },{
      align:'center',
      title: '所属网关',
      dataIndex: 'gatewayName',
      key: 'gatewayName',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.gatewayName == ''? '/' : record.gatewayName}</span>
        </Space>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align:'center',
    },
    {
      title: '操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <Link underline type="danger"  onClick={() => deleteRecord(record)}>{t("button:delete")}</Link>
        </Space>
      ),
    },
  ];

 
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const deleteOk = () => {
    let deleteArr = cloneDeep(subTable)
    deleteArr.map((item, index) => {
      if(item.id = deleteId){
        deleteArr.splice(index, 1)
      }
    })
    let group = []
    if(deleteArr.length > 0){

      deleteArr.map(item => {
       // group.push(item.id)
       group.push(item.sn)
      })
    }
    let data = {
      projectId,
      roomId,
      sns:group
    }
    configureSensor(data).then(res=> {
      if(res.success){
        messageContent('success','设备删除成功!')
        if(subTable.length == 1 && pageNum > 1){
          
        }else{
          queryTable()
        }
        setDeleteModal(false)
      }else{
        messageContent('error', res.errMsg)
      }
    })
    
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const deleteRecord = (record) => {
    setDeleteId(record.id)
    setDeleteModal(true)
  }

  //穿梭框
  const [transTag, setTransTag] = useState('')
  const settingClick =() => {
    if(areaId == 0 || !areaId){
      message.warning('请先选择园区!')
      return;
    }
    if(roomId){
      queryUnusedSensor(projectId, roomId).then(res => {
        let { success, data } = res
        if(success){
          if(data){
            setUnknownTable(data)
          }else{
            setUnknownTable([])
          }
          setTransTag('open');
        }else{
          messageContent('error', res.errMsg)
        }
      })
    }else{
      messageContent('warning', '请先选择配电房')
    }
  }
  const  getSaveValue = params => {
    let group = []
    if(params.subData.length > 0){
      console.log(params.subData)
      params.subData.map(item => {
        group.push(item.sn)
      })
    }
    let data = {
      projectId,
      roomId,
      sns:group
    }
    configureSensor(data).then(res=> {
      if(res.success){
        messageContent('success','传感器设备配置成功!')
        queryTable()
        setTransTag('close')
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }

  const getCloseValue = params => {
    setTransTag(params)
  }

  const mainTable = []
  const [subTable, setSubTable]= useState([])
  const [unknownTable, setUnknownTable] = useState([])
  const transferColumns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'name',
        key:'name'
    },{
        align:'center',
        title: '安装地址',
        dataIndex:'address',
        key:'address'
    }
    ]

  const transferTitle = {
    mainTitle:'',
    subTitle:'配电房传感器',
    unknownTitle:'未选中的传感器设备'
  }  
 

 
  const onExport =useCallback(async () => { 
    console.log(total)
   return getTableData({current: 1, pageSize: total})
}, [total, roomId, projectId])

const Title = (
  <div style={{display: 'flex',justifyContent: "space-between", alignItems: "center"}}>
    <span>配电房传感器</span>
          <Space size={16}>
          <CustButton onClick={()=> settingClick()}>
              {t("button:selectDevice")}
          </CustButton>
          <ExportExcel tb={tableRef} />
          </Space>
  </div>
)
  return (
    <Pagecont showserach={false} custserach pd="0px" >
     
      {contextHolder}     
      <Titlelayout title= {Title}  layout="flex" dr="column">
    {/*   <Divider style={{margin: "16px 0"}} /> */}
       
        <UseTransfer mask={transTag} transferTitle={transferTitle} saveValue={getSaveValue} columns={transferColumns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
        
      <Usetable ref={tableRef}  columns={columns}   rowKey='id'  {...tableProps} sheetName="配电房传感器" onExport={onExport}></Usetable>
      <CModal title="删除提示" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} maskClosable={false} mold="cust" type="warn">
         是否确认在该配电房中删除该传感器？ 
       
      </CModal>
      </Titlelayout>
    </Pagecont>
  )
}
