import React, { useRef, useState, useCallback } from 'react'
import {  Button,  Space,   message, Typography, Divider } from 'antd';
 
import UseTransfer from '@com/useTransfer'
import { useAntdTable } from 'ahooks';
import {useSelector} from 'react-redux' 
import {selectProjectId, selectcurlRommid, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import {  DistributionMeter } from '@api/api.js'
import { cloneDeep } from 'lodash';
import CModal from '@com/useModal'
 
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import {  ExportExcel} from '@com/useButton'
import Usetable from '@com/useTable'
const {Link} = Typography

export default function Index() {
  const tableRef = useRef() 
  const {  QueryUnusedCDCW ,QueryPageCDCW,ConfigureCDCW} = DistributionMeter
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
    return QueryPageCDCW(projectId, roomId, current, pageSize).then(res => {
      if(res.success){
        setTotal(res.total)
        if(Array.isArray(res.data) && res.data?.length > 0){         
          setSubTable(res.data)
          return {
            list: res.data,
            total: res.total
          }
        }else{           
          setSubTable([])
          return {
             list: [],
             total: 0
          }
        }
        
      }
    })
  }
  const {run: queryTable, tableProps } = useAntdTable(getTableData,{
    refreshDeps: [roomId,projectId],
    defaultPageSize: 10,
  })
 

  const columns = [
    {
      align:'center',
      title: '触点测温名称',
      dataIndex: 'sn',
      key: 'sn',
    },{
      align:'center',
      title: '安装地址',
      dataIndex: 'name',
      key: 'name',
    },{
      align:'center',
      title: '触点测温编号',
      dataIndex: 'category',
      key: 'category',
    },{
      align:'center',
      title: '触点测温型号',
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
          <Link  type="danger" underline onClick={() => deleteRecord(record)}>删除</Link>
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
    ConfigureCDCW(data).then(res=> {
      if(res.success){
        messageContent('success','设备删除成功!')
        if(subTable.length == 1 && pageNum > 1){
          setPageNum(pageNum  - 1)
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
      QueryUnusedCDCW(projectId, roomId).then(res => {
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
    ConfigureCDCW(data).then(res=> {
      if(res.success){
        messageContent('success','触点测温设备配置成功!')
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
    subTitle:'配电房触点测温设备',
    unknownTitle:'未选中的触点测温设备'
  }  
  const Title = (
    <div style={{display: 'flex',justifyContent: "space-between"}}>
      <span>配电房触点测温</span>
            <Space size={32}>
            <Button type="primary" onClick={()=> settingClick()} style={{ width: 96}}>
                选择设备
            </Button>
            <ExportExcel tb={tableRef} />
        
            </Space>
    </div>
 )

 const onExport =useCallback(async () => {   
 return getTableData({current: 1, pageSize: total})
}, [total, roomId])
  return (
    <Pagecont showserach={false} custserach pd="0px" >  
      
      {contextHolder}     
      <Titlelayout title= {Title}  layout="flex" dr="column">       
      <Divider style={{margin: "16px 0"}} />
         
        <UseTransfer mask={transTag} transferTitle={transferTitle} saveValue={getSaveValue} columns={transferColumns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
         
      <Usetable ref={tableRef}   columns={columns}   rowKey='id' {...tableProps}   sheetName="配电房触点测温" onExport={onExport}  ></Usetable>
      <CModal  title="删除提示" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512}  mold="cust" type="warn" closable={false}>
         是否确认在该配电房中删除该触点测温？ 
      </CModal>
      </Titlelayout>
    </Pagecont>
  )
}
