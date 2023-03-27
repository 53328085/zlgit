import React, { useEffect, useMemo, useState,useRef } from 'react'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message } from 'antd'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import {operationDesigin} from '@api/api'
import {SetLine} from './addcomp'
import commonstyle from './commonstyle.module.less'
export default function Index() {
  const ContainerDiv = styled.div`
      border: 1px solid #d7d7d7;
      background-color: #fff;
      height: 100%;
      padding: 16px;
      position: relative;
      overflow: hidden;
      .pdtop8{
        padding-top: 8px;
      }
      .pdbottom12{
        padding-bottom: 12px;
      }
      .searchbtn:hover,.searchbtn:focus{
        border-color: #d9d9d9 !important;
        color: #000;
      }
      .flexcss{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .btncss{
         width: 96px;
         height: 32px;
         background-color: #237ae4;
         border-radius: 2px;
         color: #fff;
         text-align: center;
         line-height: 32px;
         cursor: pointer;
         &:hover{
          opacity: .7;
         }
      }
  `
  const [tableParams,setTableParams]=useState({
    current:1,
    pageSize:10
  }) 
 
  const onelevel = useSelector(state => state.system.onelevel);
  const projectId = useSelector(state => state.system.menus.projectId)
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName, id: 0 }, ...onelevel]), [onelevel]) : []
  const [alike,setAlike] =useState("")
  const [areaId,setAreaId] = useState(onelevel.length>0?0:null)
  const [tableData,setTableData] = useState()
  const setlineRef =useRef()
 
 
  const columns = [
    {title:onelevel[0]?.levelName,dataIndex:'area'},
    {title:'安装地址',dataIndex:'address'},
    {title:'电表编号',dataIndex:'sn'},
    {title:'电表型号',dataIndex:'category'},
    {title:'电表名称',dataIndex:'name'},
    {title:'所属网关',dataIndex:'gateway'},
    {title:'用能类型',dataIndex:'customerType'},
    {title:'备注',dataIndex:'remark'},
    {title:'操作',dataIndex:''}
  ]
  //获取设备
  const getQueryPageDevice=async (pageNum=0)=>{
    let params={
      projectId,
      pageNum:pageNum?pageNum:tableParams.current,
      pageSize:tableParams.pageSize,
      areaId,
      alike
    } 
  const res =   await operationDesigin.QueryPageDevice(params)
  if(res.success){
    setTableData([...res.data])
  }else{
    message.error(res.errMsg)
  }
  }
 
   //打开新增
  const addDevice=()=>{
    setlineRef.current.setOpen(true)
    setlineRef.current.getQueryDeviceList()
  }

  const search = () => { }
  useEffect(()=>{
    getQueryPageDevice()
  },[])
  return (
    <ContainerDiv>
      <BlueColumn name="设备管理" />
      <Select
        options={options}
        fieldNames={{ label: 'name', value: 'id' }}
        style={{ width: 264 }}
        className="pdtop8 pdbottom12"
        defaultValue={onelevel.length > 0 ? 0 : null}
        onChange={(v)=>{setAreaId(v)}}
        value={areaId}
      ></Select>
      <Divider style={{ margin: 0, borderColor: '#d7d7d7' }} dashed></Divider>
      <div className='flexcss'>
        <div>
          <span style={{ paddingRight: 16, }} >设备查询</span>
          <Input
            style={{
              width: 290,
              margin: '16px 0'
            }}
            placeholder="输入设备编号/安装地址"
            onChange={(e) => { setInpValue(e.target.value) }}
          />
          <Button style={{ width: 80, borderLeft: 'none', background: '#f5f7fa' }} className='searchbtn' onClick={search}>查询</Button>
        </div>
        <div className='btncss' onClick={addDevice}>
          新增
        </div>
      </div>
      <Table columns={columns} dataSource={tableData}></Table>
      <SetLine addDevice={addDevice} ref={setlineRef} areaId={areaId} getQueryPageDevice={getQueryPageDevice}/>
    
      
    </ContainerDiv>
  )
}
