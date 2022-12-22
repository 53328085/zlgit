import React,{useState} from 'react'
import { useAntdTable, usePagination } from 'ahooks'
import { Remote } from '@api/api.js'
import {Button, Form,Modal } from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import {columns,realcolumns} from './columns'
import CustContext from '@com/content.js'
import SearchBtn from './searchbtn'
import Bluecolumn from '@com/bluecolumn'
import redwarn from '@imgs/redwarn.png'
import styles from './style.module.less'

export default function Index() {
  const tabs = [
    {label: '单表控制', key: 'single'},
    {label: '批量控制', key: 'batch'},
  ]
  const meterType={
    'single':0,
    'batch':1
  }
  const [value,setvalue] = useState('single')
  const [brake,setbrake] = useState(false) //分闸弹窗显示
  const [switching,setswitching] = useState(false) //合闸弹窗显示
  const [readout,setreadout] = useState(false) //实时抄读显示
  const [form] =Form.useForm()
  let params = {
    meterType: meterType[value],
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
    const res =await Remote.AllMeter({...params,formData})
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
  const realReadout = ()=>{
      setreadout(true)
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
  setswitching,
  realReadout
 }
  
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount  form={form} search={search} showserach={true}>
      <SearchBtn {...propsSearch}/>
      <UserTable columns={columns}  {...tableProps} rowSelection={{
          type: value==='single'?'radio':'checkbox',
        }} rowKey={v=>v.id}></UserTable>
       
    </Pagecount>
    <Modal
        title={<Bluecolumn name="远程控制"/>}
        width={640}
        open={brake}
        centered={true}
        closable={false}
        className={styles.readout}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p style={{fontSize: '18px',height:'106px',lineHeight: '106px'}}><img src={redwarn} className={styles.imgclass}></img>确认要对所选设备进行分闸操作？</p>
      </Modal>
      <Modal
        title={<Bluecolumn name="远程控制"/>}
        width={640}
        open={switching}
        centered={true}
        closable={false}
        className={styles.readout}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p style={{fontSize: '18px',height:'106px',lineHeight: '106px'}}><img src={redwarn} className={styles.imgclass}></img>确认要对所选设备进行合闸操作？</p>
      </Modal>
      <Modal
      title={<Bluecolumn name="实时抄读"/>}
      open={readout}
      centered={true}
      onCancel={()=>{setreadout(false)}}
      width={1218}
      className={styles.readout}
      footer={[<Button onClick={()=>{setreadout(false)}}>关闭</Button>]}
      >
        <UserTable columns={realcolumns}  ></UserTable>
       
      </Modal>
    </CustContext.Provider>
  )
}
