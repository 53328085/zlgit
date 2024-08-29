import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Input, Button, DatePicker, Modal, Timeline, Select,  message, Form, Space,Image } from 'antd';
 
import {useOutletContext} from 'react-router-dom'
import { CompleteIcon, UnCompleteIcon  } from './completeicon'
import UserTable from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import {CheckCircleOutlined} from "@ant-design/icons"
import { columns } from './columns'
import { useAntdTable, usePagination } from 'ahooks'
import { operation } from '@api/api'
import zhanwei from '@imgs/zhanwei.png'
import moment from 'moment'
import { useForm } from 'antd/lib/form/Form';
import { ExportExcel, CustButton } from '@com/useButton'
import  CModal from "@com/useModal"
import { Cdivider, Cspin } from "@com/comstyled";
import styled from 'styled-components';
import style from './style.module.less'
import Pagecount from '@com/pagecontent'
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Item } = Form
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
const Imain = styled.div`
   && {
    display:  flex;
    flex-direction: column;
    row-gap: 16px;
    padding-top: 32px;
    width: 720px;
    .strong {
        font-weight: bold;

    }
    .icons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        row-gap: 8px;
        width: 720px;
        .icon {
            display: flex;
            align-items: center;
            column-gap: 4px;
        }
    }
    .imgs {
        display: flex;
        column-gap: 16px;
        .img {
            width: 132px;
            height: 96px;
        }
    }
   }

`
export default function Warncontent() {
    let {exparams} = useOutletContext()
 
    let {areaId, projectId} = exparams
    const condition = Number.isInteger(areaId) && Number.isInteger(projectId)
    
    const tableRef = useRef()
  
    const [form] = useForm()
    // order = useRef()
    // order.current=false
    const [order, setOrder] = useState(false)
    const [orderdetail, setOrderdetail] = useState({})
    const [rangerTime, setRangerTime] = useState([moment().subtract('day', 7), moment()])
    const [stateopts, setStateopts] = useState([{
        label: '全部',
        value: 0,
    }])
    const orderSn = useRef()  
   
    columns[0].render = (_, record, rowIndex) => (<a style={{ textDecoration: 'underline' }} onClick={() => {
      
        orderSn.current = _
        getInspectionDetail(record.id)
    }}>{_}</a>)
    const [key, setKey] = useState()
    const [totalnum, setTotalNum] = useState()
  

    const getInspectionPage = ({ current, pageSize }, form) => {
        if(!condition) return
        let { state, date } = form       
        let start = date[0]?.format('YYYY-MM-DD')
        let end = date[1]?.format('YYYY-MM-DD')
        let params = { pageSize, pageNum: current, state, start, end, areaId, projectId }
        return operation.InspectionPage(params).then(res => {
            let { success, data, total } = res
            setTotalNum(total)
            if (success && Array.isArray(data) && data.length > 0) {
                return {
                    list: data,
                    total,
                }
            } else {
                return {
                    list: [],
                    total: 0,
                }

            }
        })

    }
    const { tableProps, search } = useAntdTable(getInspectionPage, {
        form,
        defaultPageSize: 14,
        refreshDeps: [areaId, projectId]
    })
     const { submit } = search
   
    // 工单状态查询
    const getInspectionStatistics = async () => {
        let params = {
            projectId,
            start: rangerTime[0].format('YYYY-MM-DD'),
            end: rangerTime[1].format('YYYY-MM-DD'),
            areaId,
        }
        const res = await operation.InspectionStatisticsTime(params)
        const data = res.data
        if (res.success) {
            setStateopts([
                {
                    label: `全部 (${data.all})`,
                    value: 0,
                },
                {
                    label: `待处理 (${data.wait})`,
                    value: 1,
                },
                {
                    label: `处理中 (${data.process})`,
                    value: 2,
                },
                {
                    label: `已完成 (${data.finish})`,
                    value: 3,
                }
            ])
        } else {
            message.error(res.errMsg)
        }
    }

    const [loading, setLoading] = useState(false)
    const getInspectionDetail = async (inspectionId) => {
        try {
            setLoading(true)
            let param = {
                projectId,
                inspectionId
            }
           
            const res = await operation.InspectionDetail(param)
            if (res.success) {
                setOrderdetail(res.data || {})
                setOrder(true);
            } else {
                message.error(res.errMsg)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }

    }

    const onExport = () => {
        const formdata = form.getFieldsValue()
        return getInspectionPage({ current: 1, total: totalnum }, formdata)
    }
    useEffect(() => {
            if(!condition) return;
            
            getInspectionStatistics()
         

    }, [areaId, rangerTime, projectId])
    // useEffect(() => {
    //     if (key == 1) {
    //         tableRef.current.download()
    //     } else if (key == 2) {
    //         tableRef.current.downloadAll()
    //     }
    // }, [key])

    const Finsh = (
        <>
         
        </>
    )

    return (
        <Pagecount>
            <Mainbox>
            <Form form={form} layout='inline' className={style.SearchContent} initialValues={{
                date: [moment().subtract(7, 'day'), moment()],
                state: 0,
            }}>
                <Item name="date" style={{ marginRight: '0px' }}>
                    <RangePicker separator={<>至</>} size="default" style={{ width: 376 }} format="YYYY-MM-DD" onChange={(e) => {
                        setRangerTime([...e])
                        submit(e)
                    }} />
                </Item>
                <Space style={{ marginLeft: 'auto' }} size={64} split={<Cdivider/>}>
                    <Item name="state" label="巡检状态" style={{ marginRight: '0px' }}>
                        <Select style={{ width: 128 }} options={stateopts} onChange={submit}></Select>
                    </Item>
                    <ExportExcel setKey={setKey} tb={tableRef}/>
                </Space>


            </Form>
            <div style={{ display: 'flex', flex: 1}}>
                <Cspin spinning={loading} tip="数据加载中">
                <UserTable
                    columns={columns}                    
                    {...tableProps}
                    scroll={{y:591}}
                    rowKey="sn"
                    ref={tableRef}
                    onExport={onExport}
                ></UserTable>
                </Cspin>
            </div>
            <CModal
                title={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 16, color: "#515151" }}>
                      <span>巡检详情</span>
                      <div>巡检单号:{orderSn.current}</div>
                    <CustButton onClick={() => { setOrder(false) }}>关闭</CustButton>
                </div>)}
                open={order}
                width={960}
                onCancel={() => { setOrder(false) }}
               
                bodyStyle={{ paddingLeft: 52 }}
                footer={
                    null
                    // <div style={{ textAlign: 'center' }}>
                    //     <Button style={{ width: 96, height: 36, padding: 0, borderRadius: 4 }} onClick={() => { setOrder(false) }}>关闭</Button>
                    // </div>
                }
                mold="cust"
            >
                <Cdivider type="h" style={{marginBotton: "32px", marginTop: 0}} />
                <Timeline mode='left' >
                    <Timeline.Item label={orderdetail?.arriveTime} dot={orderdetail?.state!=1 ? <CompleteIcon /> :  <UnCompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: orderdetail?.state  <4   ? 270 : "auto", fontWeight: 'bold' }} >
                             <strong>到达巡检点</strong> 
                           {orderdetail?.state >3 ? <Imain>
                                <span className='strong'>检查项</span>
                                 <div className='icons'>
                                     {orderdetail?.contentVos?.map(o => o.state==1 ? <div className='icon' key={o.id}><CheckCircleOutlined style={{color: "#3f8be8", fontSize: "18px"}} />{o.name}</div>: null)}
                                 </div>
                                 <span className='strong'>巡检现场照片</span>
                                 <div className='imgs'>
                                    {
                                        orderdetail?.processImages?.map(img => <Image src={img} className='img' />)

                                    }
                                 </div>
                                 <span className='strong'>巡检详情描述</span>
                                 <Input.TextArea value={orderdetail.result}></Input.TextArea>
                                 <span className='strong'>巡检结果</span>
                                 <span>
                                   {['未知','正常','异常'][orderdetail?.finishState]??''}
                                  </span>
                            </Imain> : null}
                        </div>
                    </Timeline.Item>
                  {/*   <Timeline.Item label={orderdetail?.state !== 1 ? orderdetail?.confirmTime : null} dot={orderdetail?.state !== 1 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: orderdetail?.state !== 4 ? 150 : 50 }}><span style={{ paddingRight: 64, fontWeight: 'bold', color: orderdetail?.state !== 1 ? '#000' : '#ccc' }}>派单确认</span>{orderdetail?.operator}</div>
                    </Timeline.Item>
                    <Timeline.Item label={orderdetail?.state > 2 ? orderdetail?.arriveTime : null} dot={orderdetail?.state > 2 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: 100 }}>
                            <div style={{ fontWeight: 'bold', color: orderdetail?.state > 2 ? '#000' : '#ccc' }}>到达现场</div>
                            {orderdetail?.arriveImages?.map((it, index) => {
                                return <img src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }} key={index}></img>
                            })}
                            {!orderdetail?.arriveImages && (<img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>)}
                        </div>

                    </Timeline.Item>
                    <Timeline.Item label={orderdetail?.state > 3 ? orderdetail?.finishTime : null} dot={orderdetail?.state > 3 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
                        <div style={{ fontWeight: 'bold', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>故障处理</div>
                        {
                            orderdetail?.processImages?.map((it, index) => {
                                return <img src={it} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                            })
                        }
                        {!orderdetail?.processImages && (<img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>)}
                        
                        <div style={{ padding: '12px 0', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>处理详情描述:</div>
                        <div>
                            <TextArea rows={4} style={{ width: 528, height: 80 }} value={orderdetail?.description} />
                        </div>
                    </Timeline.Item> */}
                    <Timeline.Item dot={orderdetail?.state > 3 ? <CompleteIcon /> : <UnCompleteIcon />} label={orderdetail?.state > 3 ? orderdetail?.finishTime : null}   className={style.timeline}>
                        <div style={{ fontWeight: 'bold', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>完成</div>
                    </Timeline.Item>
                </Timeline>


            </CModal>
            </Mainbox>
        </Pagecount>
    )
}
