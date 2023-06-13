import React, { useState, useEffect, useMemo,useRef } from 'react'
import { Input, Button, DatePicker, Modal, Timeline,Select,Divider, message  } from 'antd';
import { SearchOutlined, CheckCircleFilled } from '@ant-design/icons'
import { CompleteIcon, UnCompleteIcon,ResolveIcon, WaitIcon } from './completeicon'
import UserTable from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import { useSelector } from 'react-redux'
import { columns } from './columns'
import { useAntdTable, usePagination } from 'ahooks'
import { operation } from '@api/api'
import zhanwei from '@imgs/zhanwei.png'
import moment from 'moment'
import {  ExportExcel} from '@com/useButton'
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
export default function Warncontent({ style ,areavalue}) {
    const tableRef = useRef()
    const openModal = useRef()
    // order = useRef()
    // order.current=false
    const [order,setOrder]=useState(false)
    const [orderdetail,setOrderdetail]=useState()
    const [tableParams,setTableParams] = useState({current:1,pageSize:10})
    const [rangerTime,setRangerTime] = useState([moment(),moment()])
    const [status,setStatus] = useState(0)
    const [tableData,setTableData] = useState()
    const [key,setKey] = useState()
    const [stateopts,setStateopts] = useState([{
        label:'全部',
        value:0,
    }])
    const orderSn=useRef()
    const projectId = useSelector(state => state.system.menus.projectId)
    const oneLevel = useSelector(state => state.system.onelevel)
    columns[0].render = (_,record,rowIndex)=>(<a style={{textDecoration:'underline'}} onClick={()=>{
        setOrder(true);
        orderSn.current=_
        getOrderDetail(record.id)
    }}>{_}</a>)
    //工单分页查询
    const getOrderPage = async (pageNum=1,pageSize=10)=>{
        let parmas={
            projectId,
            pageSize,
            pageNum,
            start:rangerTime[0].format('YYYY-MM-DD'),
            end:rangerTime[1].format('YYYY-MM-DD'),
            areaId:areavalue,
            state:status
        }
      const res =  await operation.OrderPage(parmas)   
      if(res.success){
        setTableData(res.data)
        setTableParams({
            current:res.pageNum,
            pageSize:res.pageSize,
            total:res.total
        })
      }else{
        message.error(res.errMsg)
      }
    }
    //工单状态查询
    const getOrderStatistics=async()=>{
        let params={
            projectId,
            start:rangerTime[0].format('YYYY-MM-DD'),
            end:rangerTime[1].format('YYYY-MM-DD'),
            areaId:areavalue,
        }
        const res = await operation.OrderStatistics(params)
        const data =res.data
        if(res.success){
            setStateopts([
                {
                    label:`全部 (${data.all})`,
                    value:0,
                },
                {
                    label:`待处理 (${data.wait})`,
                    value:1,
                },
                {
                    label:`处理中 (${data.process})`,
                    value:2,
                },
                {
                    label:`已完成 (${data.finish})`,
                    value:3,
                }
            ])
        }else{
            message.error(res.errMsg)
        }
    } 
    //分页
    const changePage=(page)=>{
        console.log(page)
        const {current,pageSize}=page
        // setTableParam({...page})
        getOrderPage(current,pageSize)
    }
    //日期范围变化
    const changeRange=(dates)=>{
        setRangerTime([dates[0],dates[1]])
    }
    //查询
    const search =()=>{
        getOrderPage()
        getOrderStatistics()
    }
    //工单详情
    const getOrderDetail= async(orderId)=>{
        let param ={
            projectId,
            orderId
        }
        const res = await operation.OrderDetail(param)
        if(res.success){
            setOrderdetail(res.data)
        }else{
            message.error(res.errMsg)
        }
       
    }
    const onExport=()=>{
        return new Promise(async (resolve, reject) => {
            let parmas={
                projectId,
                pageSize:key==1?tableParams.pageSize:tableParams.total,
                pageNum:tableParams.current,
                start:rangerTime[0].format('YYYY-MM-DD'),
                end:rangerTime[1].format('YYYY-MM-DD'),
                areaId:areavalue,
                state:status
            }
            const res = await operation.OrderPage(parmas)
            if(res.success){
                if(res.success){
                    resolve({
                      total:res.total,
                      list:res.data
                    })
                  }else{
                    reject(res.errMsg)
                  }
            }
        })
    }
    useEffect(()=>{
        if(oneLevel.length>0){
            getOrderPage()
            getOrderStatistics()
        }
        
    },[areavalue])
    useEffect(()=>{
        oneLevel.length>0&&getOrderPage()
        
    },[status])
    // useEffect(()=>{
    //     tableRef.current.downloadAll()
    // },[key])
    return (
        <div className={style.OrderContent}>
            <div className={style.SearchContent}>
                <div>
                    <RangePicker separator={<>至</>} size="default" style={{ width: 376 }} defaultValue={rangerTime} onChange={changeRange}/>
                    <Button size='default' style={{ width: 96, marginLeft: 16 }} icon={<SearchOutlined />} type="primary" onClick={search}>查询</Button>
                </div>
                <div style={{marginLeft:'auto'}}>
                    <span style={{paddingRight:16}}>工单状态</span>
                    <Select style={{width:128}} defaultValue={status} options={stateopts} onChange={(v)=>{setStatus(v)}}></Select>
                </div>
                <Divider type='vertical' style={{height:32,borderColor:'#d7d7d7',margin:'0 32px'}} dashed/>
                {/* <Button size='default' style={{ width: 96 }} onClick={(()=>{tableRef.current.download()})}>导出</Button> */}
                <ExportExcel setKey={setKey} tb={tableRef}></ExportExcel>
            </div>
            <div style={{ marginTop: 16,display:'flex',height:700 }}>
                <UserTable 
                columns={columns} 
                dataSource={tableData} 
                pagination={tableParams} 
                ref={tableRef}
                onChange={changePage}
                onExport={onExport}
                ></UserTable>
            </div>
            <Modal
                title={(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:16,padding:16}}>
                    <BlueColumn name="工单详情"/>
                    <div>工单编号:{orderSn.current}</div>
                    <div style={{width:96,height:32,lineHeight:'32px',textAlign:'center',color:'#fff',borderRadius:2,backgroundColor:'#237ae4',fontSize:14,cursor:'pointer'}} onClick={() => { setOrder(false) }}>关闭</div>
                </div>)}
                open={order}
                width={960}
                onCancel={()=>{setOrder(false)}}
                closable={false}
                bodyStyle={{paddingLeft:52}}
                footer={
                    null
                    // <div style={{ textAlign: 'center' }}>
                    //     <Button style={{ width: 96, height: 36, padding: 0, borderRadius: 4 }} onClick={() => { setOrder(false) }}>关闭</Button>
                    // </div>
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
                        {/* <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                        <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                        <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img> */}
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
        </div>
    )
}
