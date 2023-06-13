import React, { useEffect, useState,useRef } from 'react'
import {useSelector} from 'react-redux'
import { Input, Button ,message,Timeline,Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import UserTable from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import UseModal from '@com/useModal'
import unknow from './imgs/unknow.png'
import { CompleteIcon, UnCompleteIcon,ResolveIcon, WaitIcon } from './completeicon'
// import { useAntdTable, usePagination } from 'ahooks'
import { operation } from '@api/api'
import style from './style.module.less'
import zhanwei from '@imgs/zhanwei.png'
import {  ExportExcel} from '@com/useButton'
const { Search,TextArea } = Input;
export default function Warncontent({ style,areavalue }) {
    const tableRef =useRef()
    const modalRef =useRef()
    const projectId = useSelector(state => state.system.menus.projectId)
    const oneLevel = useSelector(state => state.system.onelevel)
    const [tableParam,setTableParam] = useState({
        current:1,
        pageSize:10, 
        total:0 
    })
    const [inpvalue,setInpValue] = useState()
    const [tableData,setTableData] = useState([])
    const [open,setOpen] =useState(false)
    const [order,setOrder]=useState()
    const [orderdetail,setOrderDetail] = useState()
    const [key,setKey] = useState()
    const  columns = [
        {
            title: '最新告警时间',
            dataIndex: 'time',
            key: 'time',
          },
          {
            title: '告警详情',
            dataIndex: 'content',
            key: 'content',
          },
          {
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '设备地址',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn',
          },
          {
            title: '设备型号',
            dataIndex: 'category',
            key: 'category',
          },
         
          {
            title: '操作',
            key: 'option',
            align:'center',
            export:false,
            render:(_,val)=>(
                <span 
                style={{color:_.orderId==0?'red':'#237ae4',textDecoration:'underline',cursor:'pointer'}} 
                onClick={()=>{
                  if(_.orderId==0){
                    dispatchOrder(_,val)
                  }else{
                    setOrder(true)
                    getOrderDetail(_.orderId)
                  }
                  }}
                >{_.orderId==0?'派单':'已派单'}</span>
            ),
          },
          {
            title: '设备详情',
            key: 'deteail',
            align:'center',
            export:false,
            render: (_, record) => (
                <a  style={{textDecoration:'underline'}} href={`/deviceDetail?sn=${record.sn}`} target='blank'>详情</a>
              
            ),
          },
    ]
    let dispatchId;
    //分页
    const changePage=(page)=>{
        console.log(page)
        const {current,pageSize}=page
        // setTableParam({...page})
        getAlarmPage(current,pageSize)
    }
    const search=()=>{
        getAlarmPage(1,10)
    }
    //获取告警信息
    const getAlarmPage=async(pageNum=1,pageSize=10)=>{
        let param = {
            projectId,
            pageNum:pageNum,
            pageSize:pageSize,
            alike:inpvalue?inpvalue:'',
            areaId:areavalue
        }
        const res =  await operation.AlarmPage(param)
        if(res.success){

            setTableData([...res.data])
            setTableParam({
              ...tableParam,
              current:res.pageNum,
              pageSize:res.pageSize,
              total:res.total
            })
        }else{
            message.error(res.errMsg)
        }
    }
     //派单
     const dispatchOrder = (text,record)=>{
        modalRef.current.onOpen()
        dispatchId =record.id
        console.log(text,record)
    }
    //确认派单
    const dispatchOrderOk =async ()=>{
      const res =   await operation.DispachOrder({
        projectId,
        alarmId:dispatchId
      })  
      if(res.success){
        modalRef.current.onCancel()
        getAlarmPage(tableParam.current)
        message.success('派单成功！')
      }else{
        message.error(res.errMsg)
      }
    }
     //工单详情
     const getOrderDetail= async(orderId)=>{
      let param ={
          projectId,
          orderId
      }
      const res = await operation.OrderDetail(param)
      if(res.success){
        setOrderDetail(res.data)
      }else{
          message.error(res.errMsg)
      }
     
    }
    const onExport =()=>{
      return new Promise(async (resolve, reject)=>{
        let param = {
          projectId,
          pageNum:key==1?tableParam.current:1,
          pageSize:key==1?tableParam.pageSize:tableParam.total,
          alike:inpvalue?inpvalue:'',
          areaId:areavalue
      }
        const resp =  await operation.AlarmPage(param)
        if(resp.success){
          resolve({
            total:resp.total,
            list:resp.data?resp.data:[]
          })
        }else{
          reject(resp.errMsg)
        }
          
      })
    }
    useEffect(()=>{
      oneLevel.length>0&&getAlarmPage()
    },[areavalue])
    // useEffect(()=>{
    //   if(key==1){
    //     tableRef.current.download()
    //   }else if(key==2){
    //     tableRef.current.downloadAll()
    //   }
    // },[key])
    return (
        <div className={style.WarnContent}>
            <div className={style.SearchContent}>
                {/* <Search
                    placeholder="请输入设备编号/安装地址"
                    allowClear
                    enterButton={<><SearchOutlined />&nbsp; 查询</>}
                    size="default"
                    style={{ width: 356 }}
                /> */}
                <div>
                <span style={{paddingRight:16,}} >告警查询</span>
                <Input
                    style={{
                        width: 290,
                        marginRight:0,
                    }}
                    placeholder="输入设备编号/安装地址"
                    onChange={(e)=>{setInpValue(e.target.value)}}
                />
                <Button style={{width:80,borderLeft:'none',background:'#f5f7fa'}}  className={style.searchbtn} onClick={ search }>查询</Button>
                </div>
               
                {/* <Button size='default' style={{ width: 96 }} onClick={tableRef?.current?.download}>导出</Button> */}
                <ExportExcel setKey={setKey} tb={tableRef}></ExportExcel>
            </div>
            <div style={{ marginTop: 16 ,minHeight:700,display:'flex',justifyContent:'column'}} >
                <UserTable 
                columns={columns} 
                dataSource={tableData} 
                pagination={tableParam}  
                ref ={tableRef}
                onChange={changePage}
                onExport={onExport}
                ></UserTable>
            </div>
            <UseModal 
            ref={modalRef}
            mold = 'cust' 
            okText="立即派单" 
            onOk={dispatchOrderOk}
            >
                <BlueColumn name="派单提示" styled={{padding: '24px 0'}}/>
                <div style={{margin:'16px 0'}}>
                    <img src={unknow} alt="" style={{margin:'0 16px'}}/>
                    <span>是否要对本告警事件进行派单？</span>
                </div>
            </UseModal>
          <DispatchComp order={order} setOrder={setOrder} orderdetail={orderdetail}/>
        </div>
    )
}


let DispatchComp=({order,setOrder,orderdetail=null,orderSn=""})=>{
  return (
    <Modal
    title={(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:16,padding:16}}>
        <BlueColumn name="工单详情"/>
        <div>工单编号:{orderSn}</div>
        <div style={{width:96,height:32,lineHeight:'32px',textAlign:'center',color:'#fff',borderRadius:2,backgroundColor:'#237ae4',fontSize:14,cursor:'pointer'}} onClick={() => { setOrder(false) }}>关闭</div>
    </div>)}
    open={order}
    width={960}
    onCancel={()=>{setOrder(false)}}
    closable={false}
    bodyStyle={{paddingLeft:52}}
    footer={
        null
    }
    >
    <Timeline mode='left' >
        <Timeline.Item label={orderdetail?.createTime} dot={<CompleteIcon />} className={style.timeline}>
            <div style={{ minHeight: 50,fontWeight:'bold' }} >平台派单</div>
        </Timeline.Item>
        <Timeline.Item label={orderdetail?.state!==1?orderdetail?.confirmTime:null} dot={orderdetail?.state!==1?<CompleteIcon />:<UnCompleteIcon/>} className={style.timeline}>
            <div style={{ minHeight: 50 }}><span style={{paddingRight:64,fontWeight:'bold',color:orderdetail?.state!==1?'#000':'#ccc'}}>派单确认</span>{orderdetail?.operator}</div>
        </Timeline.Item>
        <Timeline.Item label={orderdetail?.state>2?orderdetail?.arriveTime:null} dot={orderdetail?.state>2?<CompleteIcon />:<UnCompleteIcon/>} className={style.timeline}>
            <div style={{ minHeight: 100 }}>
                <div style={{fontWeight:'bold',color:orderdetail?.state>2?'#000':'#ccc'}}>到达现场</div>
                {orderdetail?.arriveImages?.map((it,index)=>{
                    return   <img src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} key={index}></img>
                })}
                {!orderdetail?.arriveImages&&(<img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>)}
            </div>
           
        </Timeline.Item>
        <Timeline.Item label={orderdetail?.state>3?orderdetail?.finishTime:null} dot={orderdetail?.state>3?<CompleteIcon />:<UnCompleteIcon/>} className={style.timeline}>
            <div style={{fontWeight:'bold',color:orderdetail?.state>3?'#000':'#ccc'}}>故障处理</div>
            {
                orderdetail?.processImages?.map((it,index)=>{
                    return  <img src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                })
            }
            {!orderdetail?.processImages&&(<img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>)}

            <div style={{padding:'12px 0',color:orderdetail?.state>3?'#000':'#ccc'}}>处理详情描述:</div>
            <div>
            <TextArea rows={4} style={{width:528,height:80}} value={orderdetail?.result}/>
            </div>
        </Timeline.Item> 
        <Timeline.Item  dot={orderdetail?.state>3?<CompleteIcon />:<UnCompleteIcon/>} className={style.timeline}>
            <div style={{fontWeight:'bold',color:orderdetail?.state>3?'#000':'#ccc'}}>完成</div>
        </Timeline.Item>
    </Timeline>


</Modal>
  )
}
