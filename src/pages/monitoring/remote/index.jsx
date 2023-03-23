import React,{useState} from 'react'
import { useAntdTable, usePagination } from 'ahooks'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import { Remote } from '@api/api.js'
import {Button, Form,message,Modal } from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import {columns,realcolumns} from './columns'
import CustContext from '@com/content.js'
import SearchBtn from './searchbtn'
import Bluecolumn from '@com/bluecolumn'
import redwarn from '@imgs/redwarn.png'
import styles from './style.module.less'

export default function Index() {
  const projectId = useSelector(selectProjectId)
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
  const [areaId,setareaId] = useState(1) //areaId
  const [form] =Form.useForm()
  let params = {
    pageNum: 1,
    pageSize: 14,
    projectId: projectId,
    areaId:areaId,
    gatewayId:0,
    deviceStyle:1,
    category:'',
    alike:'',
    state:0
  }
  const getTableData =()=>{
    return Remote.AllMeter(params).then(res=>{
      let {success,data,totalNum} =res
      console.log(res)
    if(success&&Array.isArray(data)){
      
    }else{
      message.error(res.errMsg)
    }
    })
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
        title={<Bluecolumn name="分闸控制"/>}
        width={640}
        open={brake}
        centered={true}
        closable={false}
        className={styles.readout}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        // onCancel={handleCancel}
        footer={[
          <Button key="back" style={{width:96,height:32,borderColor:'rgb(204,204,204)',color:'#999'}} onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" style={{backgroundColor:'#FF4D4F', color:'#fff',width:96,height:32}}  onClick={handleCancel}>
            确定
          </Button>,
        ]}
      >
        <div style={{fontSize: '18px',height:'106px',lineHeight: '106px',display:'flex',alignItems:'center'}}><img src={redwarn} className={styles.imgclass}></img><p style={{lineHeight:'48px',height:'106px',fontSize:'16px',width:257}}>分闸后,将导致该电表控制内的所有用电设备断电，请谨慎操作！</p></div>
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
        //onCancel={handleCancel}
        footer={[
          <Button key="back" style={{width:96,height:32,borderColor:'rgb(204,204,204)',color:'#999'}} onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" style={{backgroundColor:'#FF4D4F', color:'#fff',width:96,height:32}}  onClick={handleCancel}>
            确定
          </Button>,
        ]}
      >
                <div style={{fontSize: '18px',height:'106px',lineHeight: '106px',display:'flex',alignItems:'center'}}><img src={redwarn} className={styles.imgclass}></img><p style={{lineHeight:'48px',height:'106px',fontSize:'16px',width:257}}>合闸后,该电表控制内的所有用电设备将恢复供电，请确认！</p></div>
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
