import React,{useState} from 'react'
import { useAntdTable, usePagination } from 'ahooks'
import { Remote } from '@api/api.js'
import {Form,Modal } from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import {columns} from './columns'
import CustContext from '@com/content.js'
import SearchBtn from './searchbtn'
import Bluecolumn from '@com/bluecolumn'
import redwarn from '@imgs/redwarn.png'
export default function Index() {
  const tabs = [
    {label: '单表控制', value: 'single'},
    {label: '批量控制', value: 'batch'},
  ]
  
  const [value,setvalue] = useState('single')
  const [brake,setbrake] = useState(false) //分闸弹窗显示
  const [switching,setswitching] = useState(false) //合闸弹窗显示
  const [form] =Form.useForm()
  let params = {
    meterType: 0,
    projectId: 1,
    regionId: 0,
    buildingId: 0,
    floorId: 0,
    roomId: 0,
    type: 0,
    pageNum: 1,
    pageSize: 14,
    alike: ''
  }
  const getTableData =async ({current,pageSize},formData)=>{
    const res =await Remote.AllMeter(params)
    let {success,data,totalNum} =res
    console.log(res)
    if(success&&Array.isArray(data)){
      return {
        total:totalNum,
        list:data
      }
    }else{
      return{
        total:0,
        list:[]
      }
    }
  }
 
  const {tableProps,search} = useAntdTable(getTableData,{
    form,
    refreshDeps:[value]
  })
  const  handleCancel=()=>{
    setbrake(false)
    setswitching(false)
  }

  const {submit} =search
  const propsData ={
    tabs,
    form,
    search,
    value,
    setvalue
  }
 const propsSearch ={
  brake,
  setbrake,
  switching,
  setswitching
 }
  
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount  form={form} search={search}>
      <SearchBtn {...propsSearch}/>
      <UserTable columns={columns}  {...tableProps} rowSelection={{
          type: value==='single'?'radio':'checkbox',
        }} rowKey={v=>v.id}></UserTable>
       
    </Pagecount>
    <Modal
        title={<Bluecolumn name="远程控制"/>}
        width={640}
        visible={brake}
        centered={true}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p style={{fontSize: '18px',height:'106px',lineHeight: '106px'}}><img src={redwarn}></img>确认要对所选设备进行分闸操作？</p>
      </Modal>
      <Modal
        title={<Bluecolumn name="远程控制"/>}
        width={640}
        visible={switching}
        centered={true}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p style={{fontSize: '18px',height:'106px',lineHeight: '106px'}}><img src={redwarn}></img>确认要对所选设备进行合闸操作？</p>
      </Modal>
    </CustContext.Provider>
  )
}
