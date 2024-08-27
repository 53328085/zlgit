import React, { useState, useRef, useCallback } from 'react'
import { Input, Button, DatePicker, Modal, Timeline,Select, message ,Image, Space } from 'antd';
 
import { CompleteIcon, UnCompleteIcon} from './completeicon'
 
import {useOutletContext} from 'react-router-dom'
 
import UserTable from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
 
import { columns } from './columns'
import { useAntdTable, useRequest  } from 'ahooks'
import { operation } from '@api/api'
import zhanwei from '@imgs/zhanwei.png'
import moment from 'moment'
import {  ExportExcel, CustButton} from '@com/useButton'
import { Cdivider, Cspin } from "@com/comstyled";
import styled from 'styled-components';
import style from './style.module.less'
import Pagecount from '@com/pagecontent'
 
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Mainbox = styled.div`
   flex: 1;
   display: flex;
   flex-direction: column;
   row-gap: 16px;
   .serach {
    display: flex;
    justify-content: space-between;
    align-items: center;
   }
   .date {
     display: flex;
     align-items: center;
     column-gap: 16px;
   }
`
export default function Warncontent() {
    let {exparams} = useOutletContext()
 
    let {areaId, projectId} = exparams
    const condition = Number.isInteger(areaId) && Number.isInteger(projectId)
    const [total, setTotal] = useState(0)
    const tableRef = useRef()
    const openModal = useRef()
    // order = useRef()
    // order.current=false
    const [order,setOrder]=useState(false)
    const [orderdetail,setOrderdetail]=useState()
    const [tableParams,setTableParams] = useState({current:1,pageSize:10})
    const [rangerTime,setRangerTime] = useState([moment().subtract(1, 'months'),moment()])
    const [status,setStatus] = useState(0)   
    const [key,setKey] = useState()
    const [stateopts,setStateopts] = useState([{
        label:'全部',
        value:0,
    }])
    const orderSn=useRef()
    
    
    columns[0].render = (_,record,rowIndex)=>(<a style={{textDecoration:'underline'}} onClick={()=>{
       // setOrder(true);
        orderSn.current=_
        getOrderDetail(record.id)
    }}>{_}</a>)


    //工单分页查询

   const params = useRef({
        projectId,
        pageSize: 14,
        pageNum: 1,
        start:rangerTime[0].format('YYYY-MM-DD'),
        end:rangerTime[1].format('YYYY-MM-DD'),
        areaId,
        state:status
   })

    const getOrderPage = ({current, pageSize})=>{
        if(!condition) return
        params.current={
            projectId,
            pageSize,
            pageNum: current,
            start:rangerTime[0].format('YYYY-MM-DD'),
            end:rangerTime[1].format('YYYY-MM-DD'),
            areaId,
            state:status
        }
      return operation.OrderPage(params.current).then(res => {
          const {success, data, total=0, errMsg} = res
          setTotal(total)
          let f = Array.isArray(data);
          if(success) {
            return {
                list: f?data: [],
                total: f?total: 0
            }
          }else {
            message.warning(errMsg || "数据出错")
            return {
                list: [],
                total: 0
            }
          }
      })   
    }
    const {tableProps, run} = useAntdTable(getOrderPage, {
        refreshDeps: [projectId, areaId, status, rangerTime]
    })
    //工单状态查询
    const getOrderStatistics=async()=>{
        if(!condition) return
        let params={
            projectId,
            start:rangerTime[0].format('YYYY-MM-DD'),
            end:rangerTime[1].format('YYYY-MM-DD'),
            areaId,
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
    const {run: getStatistics} = useRequest(getOrderStatistics, {
        refreshDeps: [areaId, projectId, rangerTime]
    })
    //日期范围变化
    const changeRange=(dates)=>{
        setRangerTime([dates[0],dates[1]])
    }
    //查询
    const search =()=>{
       // getOrderPage() 
      // getOrderStatistics()
      getStatistics()
      run()
    }
    //工单详情
    const [loading, setLoading] = useState(false)
    const getOrderDetail= async(orderId)=>{
        try {
            setLoading(true)
            let param ={
                projectId,
                orderId
            }
            const res = await operation.OrderDetail(param)
            if(res.success){
                setOrderdetail(res.data || {})
                setOrder(true)
            }else{
                message.error(res.errMsg)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
   
       
    }
    const onExport=useCallback(()=>{
        params.current.pageSize = total
        params.current.pageNum = 1
        return  operation.OrderPage(params.current).then(res => {
            let {success, data, total} = res
            if (success) {
                return {
                  list: data.details || [],
                  total,
                };
              } else {
                message.error(res.errMsg);
                return {
                  list: [],
                  total: 0,
                };
              }
        })
    }, [total])
 
    return (
        <Pagecount>
            <Mainbox>
                <div className='serach'>
                <div className='date'>
                    <RangePicker separator={<>至</>} size="default" style={{ width: 376 }} defaultValue={rangerTime} onChange={changeRange}/>
                  {/*   <SerachButton onClick={search} />  */}
                </div>
                <Space  size={64}   split={<Cdivider />}>
                    <div>
                    <span style={{paddingRight:16}}>工单状态</span>
                    <Select style={{width:128}} defaultValue={status} options={stateopts} onChange={(v)=>{setStatus(v)}}></Select>
                    </div>
                    <ExportExcel setKey={setKey} tb={tableRef}></ExportExcel>
                </Space>
                </div>
              
          
               <div style={{display: 'flex', flex: 1}}>
               <Cspin spinning={loading} tip="数据加载中">
                <UserTable 
                columns={columns} 
                ref={tableRef}
                onExport={onExport}
                {...tableProps}
                ></UserTable>
                </Cspin>
              </div>
            <Modal
                title={(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:16,padding:16}}>
                    <BlueColumn name="工单详情"/>
                    <div>工单编号:{orderSn.current}</div>
                    <CustButton onClick={() => { setOrder(false) }}>关闭</CustButton>
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
                                return   <Image src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} key={index} />
                            })}
                            {!orderdetail?.arriveImages&&(<Image src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} />)}
                        </div>
                       
                    </Timeline.Item>
                    <Timeline.Item label={orderdetail?.state>3?orderdetail?.finishTime:null} dot={orderdetail?.state>3?<CompleteIcon />:<UnCompleteIcon/>} className={style.timeline}>
                        <div style={{fontWeight:'bold',color:orderdetail?.state>3?'#000':'#ccc'}}>故障处理</div>
                        {
                            orderdetail?.processImages?.map((it,index)=>{
                                return  <Image src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} />
                            })
                        }
                        {!orderdetail?.processImages&&(<Image src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} />)}
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
            </Mainbox>
        </Pagecount>
    )
}
