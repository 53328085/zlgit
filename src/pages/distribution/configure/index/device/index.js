import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button,  Space, message, Typography, Divider} from 'antd';
import {useTranslation} from 'react-i18next'
import UseTransfer from '@com/useTransfer'
import { useAntdTable } from 'ahooks';
import {useSelector} from 'react-redux'
 
import {selectProjectId, selectcurlRommid, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import {  DistributionMeter } from '@api/api.js'
import { cloneDeep } from 'lodash';
import Usetable from '@com/useTable'
import CModal from '@com/useModal'
 
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import {  ExportExcel, CustButton} from '@com/useButton'
import Mask from "@com/mask"
import {SetLine} from './addcomp'
const {Link} = Typography

export default function Index() {
  const {t} = useTranslation(["button"])
  const tableRef = useRef()
  const roomId = useSelector(selectcurlRommid)
  const areaId = useSelector(selectOneLevelDefaultId)
  const { queryPageTransformer, queryUnusedTransformer, configureTransformer } = DistributionMeter
  const [messageApi, contextHolder] = message.useMessage();
  const [targ, setTarg] = useState(false)
  const setlineRef =useRef()
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  const projectId = useSelector(selectProjectId);



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
    return queryPageTransformer(projectId, roomId, current, pageSize).then(res => {
      let {success, data, total} = res || {}
     
      if(success){
        if(Array.isArray(data)){
         
          setSubTable(data)         
          setTotal(total)
          return {
            list: data,
            total,
          }
        }else{
          
          setSubTable([])
          return {
            list: [],
            total: 0
          }
        }
        
      }else {
        setTotal(0)
      }
    }).catch(e => {
      console.log(e)
    })
  }
  const {tableProps, refresh: queryTable } = useAntdTable(getTableData,{
   // manual:true
   refreshDeps: [roomId,projectId],
   defaultPageSize: 14
  })


  const columns = [
    {
      align:'center',
      title: '设备类型',
      dataIndex: 'sn',
      key: 'sn',
    },{
        align:'center',
        title: '设备名称',
        dataIndex: 'category',
        key: 'category',
      },{
      align:'center',
      title: '设备编号',
      dataIndex: 'name',
      key: 'name',
    },{
      align:'center',
      title: '设备型号',
      dataIndex: 'address',
      key: 'address',
      width: 480
    },{
        align:'center',
        title: '安装位置',
        dataIndex: 'capacity',
        key: 'capacity',
      },{
        align:'center',
        title: '备注',
        dataIndex: 'ratedU',
        key: 'ratedU',
      },
    {
      title: '操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space>
          <Link type="danger" underline onClick={() => deleteRecord(record)}>{t("button:delete")}</Link>
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
        group.push(item.id)
      })
    }
    let data = {
      projectId,
      roomId,
      group
    }
    configureTransformer(data).then(res=> {
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
    setTarg(true)
    if(areaId == 0 || !areaId){
      message.warning('请先选择园区!')
      return;
    }
    if(roomId){
        queryUnusedTransformer(projectId, roomId).then(res => {
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
      params.subData.map(item => {
        group.push(item.id)
      })
    }
    let data = {
      projectId,
      roomId,
      group
    }
    configureTransformer(data).then(res=> {
      if(res.success){
        messageContent('success','变压器设备配置成功!')
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
    subTitle:'配电房变压器',
    unknownTitle:'未选中的变压器设备'
  }  
 

  const onExport =useCallback(async () => { 
     console.log(total)
    return getTableData({current: 1, pageSize: total})
 }, [total, roomId])
 const Title = (
    <div style={{display: 'flex',justifyContent: "space-between", alignItems: "center"}}>
      <span>变压器管理</span>
            <Space size={32}>
            <CustButton onClick={()=> settingClick()}>
                 {t("button:addEquipment")}
            </CustButton>
            {/* <ExportExcel tb={tableRef} /> */}
        
            </Space>
    </div>
 )
  return (
    <Pagecont showserach={false} custserach pd="0px" >  
      {contextHolder}
      <Titlelayout title= {Title}  layout="flex" dr="column">
       {/*  <Divider style={{margin: "16px 0"}} /> */}
        <Mask task={targ}><SetLine  ref={setlineRef} areaId={areaId} getQueryPageDevice={queryTable} setTarg={setTarg}/></Mask>
      <Usetable ref={tableRef}  bordered columns={columns}   rowKey='id'  {...tableProps}   sheetName="变压器管理" onExport={onExport} ></Usetable>
      <CModal title="删除提示" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} type="warn" mold="cust">
         是否确认在该配电房中删除该变压器？ 
      </CModal>
      
      </Titlelayout>
    </Pagecont>
  )
}
