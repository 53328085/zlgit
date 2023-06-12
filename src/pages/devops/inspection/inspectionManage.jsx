import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Input, Button, DatePicker, Modal, Timeline, Select, Divider, message, Form, Space } from 'antd';
import { SearchOutlined, CheckCircleFilled } from '@ant-design/icons'
import { CompleteIcon, UnCompleteIcon, ResolveIcon, WaitIcon } from './completeicon'
import UserTable from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import { useSelector } from 'react-redux'
import { columns } from './columns'
import { useAntdTable, usePagination } from 'ahooks'
import { operation } from '@api/api'
import zhanwei from '@imgs/zhanwei.png'
import moment from 'moment'
import { useForm } from 'antd/lib/form/Form';
import { ExportExcel } from '@com/useButton'
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Item } = Form
export default function Warncontent({ style, areavalue }) {
    const tableRef = useRef()
    const openModal = useRef()
    const [form] = useForm()
    // order = useRef()
    // order.current=false
    const [order, setOrder] = useState(false)
    const [orderdetail, setOrderdetail] = useState()
    const [rangerTime, setRangerTime] = useState([moment(), moment()])
    const [stateopts, setStateopts] = useState([{
        label: '全部',
        value: 0,
    }])
    const orderSn = useRef()
    const projectId = useSelector(state => state.system.menus.projectId)
    const oneLevel = useSelector(state => state.system.onelevel)
    columns[0].render = (_, record, rowIndex) => (<a style={{ textDecoration: 'underline' }} onClick={() => {
        setOrder(true);
        orderSn.current = _
        getInspectionDetail(record.id)
    }}>{_}</a>)
    const [key, setKey] = useState()
    const [totalnum, setTotalNum] = useState()
    //工单分页查询
    /*     const getInspectionPage = async ()=>{
            let parmas={
                projectId,
                ...tableParams,
                start:rangerTime[0].format('YYYY-MM-DD'),
                end:rangerTime[1].format('YYYY-MM-DD'),
                areaId:areavalue,
                state:status
            }
          const res =  await operation.InspectionPage(parmas)   
          if(res.success){
            setTableData(res.data)
          }else{
            message.error(res.errMsg)
          }
        } */

    const getInspectionPage = ({ current, pageSize }, form) => {
        let { state, date } = form
        console.log(date)
        let start = date[0]?.format('YYYY-MM-DD')
        let end = date[1]?.format('YYYY-MM-DD')
        let params = { pageSize, pageNum: current, state, start, end, areaId: areavalue, projectId }
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
        refreshDeps: [areavalue, projectId]
    })
    console.log(tableProps, search)
    const { submit } = search

    //工单状态查询
    const getInspectionStatistics = async () => {
        let params = {
            projectId,
            start: rangerTime[0].format('YYYY-MM-DD'),
            end: rangerTime[1].format('YYYY-MM-DD'),
            areaId: areavalue,
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


    const getInspectionDetail = async (inspectionId) => {
        try {
            let param = {
                projectId,
                inspectionId
            }
            const res = await operation.InspectionDetail(param)
            if (res.success) {
                setOrderdetail(res.data || [])
            } else {
                message.error(res.errMsg)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const onExport = () => {
        const formdata = form.getFieldsValue()
        return getInspectionPage({ current: 1, total: totalnum }, formdata)
    }
    useEffect(() => {
        if (oneLevel.length > 0) {
            //  getInspectionPage()
            getInspectionStatistics()
        }

    }, [areavalue, rangerTime, projectId])
    useEffect(() => {
        if (key == 1) {
            tableRef.current.download()
        } else if (key == 2) {
            tableRef.current.downloadAll()
        }
    }, [key])
    return (
        <div className={style.OrderContent}>
            <Form form={form} layout='inline' className={style.SearchContent} initialValues={{
                date: [moment(), moment().add(7, 'day')],
                state: 0,
            }}>
                <Item name="date" style={{ marginRight: '0px' }}>
                    <RangePicker separator={<>至</>} size="default" style={{ width: 376 }} format="YYYY-MM-DD" onChange={(e) => {
                        setRangerTime([...e])
                        submit(e)
                    }} />
                    {/*   <Button size='default' style={{ width: 96, marginLeft: 16 }} icon={<SearchOutlined />} type="primary" onClick={search}>查询</Button> */}
                </Item>
                <Space style={{ marginLeft: 'auto' }} size={32}>
                    <Item name="state" label="巡检状态" style={{ marginRight: '0px' }}>
                        <Select style={{ width: 128 }} options={stateopts} onChange={submit}></Select>
                    </Item>
                    <Divider type='vertical' style={{ height: 32, borderColor: '#d7d7d7' }} dashed />
                    {/* <Button size='default' style={{ width: 96 }} onClick={(()=>{tableRef.current.download()})}>导出</Button> */}
                    <ExportExcel setKey={setKey} />
                </Space>


            </Form>
            <div style={{ marginTop: 16, display: 'flex', height: 700 }}>
                <UserTable
                    columns={columns}
                    {...tableProps}
                    rowKey="sn"
                    ref={tableRef}
                    onExport={onExport}
                ></UserTable>
            </div>
            <Modal
                title={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 16, padding: 16 }}>
                    <BlueColumn name="工单详情" />
                    <div>工单编号:{orderSn.current}</div>
                    <div style={{ width: 96, height: 32, lineHeight: '32px', textAlign: 'center', color: '#fff', borderRadius: 2, backgroundColor: '#237ae4', fontSize: 14, cursor: 'pointer' }} onClick={() => { setOrder(false) }}>关闭</div>
                </div>)}
                open={order}
                width={960}
                onCancel={() => { setOrder(false) }}
                closable={false}
                bodyStyle={{ paddingLeft: 52 }}
                footer={
                    null
                    // <div style={{ textAlign: 'center' }}>
                    //     <Button style={{ width: 96, height: 36, padding: 0, borderRadius: 4 }} onClick={() => { setOrder(false) }}>关闭</Button>
                    // </div>
                }
            >
                <Timeline mode='left' >
                    <Timeline.Item label={orderdetail?.createTime} dot={<CompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: 50, fontWeight: 'bold' }} >平台派单</div>
                    </Timeline.Item>
                    <Timeline.Item label={orderdetail?.state !== 1 ? orderdetail?.confirmTime : null} dot={orderdetail?.state !== 1 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
                        <div style={{ minHeight: 50 }}><span style={{ paddingRight: 64, fontWeight: 'bold', color: orderdetail?.state !== 1 ? '#000' : '#ccc' }}>派单确认</span>{orderdetail?.operator}</div>
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
                        {/* <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                        <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img>
                        <img src={zhanwei} style={{ width: 124, height: 80, marginTop: 12, marginRight: 16 }}></img> */}
                        <div style={{ padding: '12px 0', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>处理详情描述:</div>
                        <div>
                            <TextArea rows={4} style={{ width: 528, height: 80 }} value={orderdetail?.description} />
                        </div>
                    </Timeline.Item>
                    <Timeline.Item dot={orderdetail?.state > 3 ? <CompleteIcon /> : <UnCompleteIcon />} className={style.timeline}>
                        <div style={{ fontWeight: 'bold', color: orderdetail?.state > 3 ? '#000' : '#ccc' }}>完成</div>
                    </Timeline.Item>
                </Timeline>


            </Modal>
        </div>
    )
}
