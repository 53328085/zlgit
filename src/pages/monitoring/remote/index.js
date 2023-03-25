import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { useRequest, useToggle, useAntdTable } from 'ahooks'
import { GetLogOperation, Remote, Monitoring } from '@api/api.js'
import { Form, DatePicker, Input, Button, Table, Pagination, Select, message, Modal, Spin } from 'antd'
import Bluecolumn from '@com/bluecolumn'
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import CustContext from '@com/content.js'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import redwarn from '@imgs/redwarn.png'
import imgurl from './images/index.js'
import UseHeader from '@com/useHeader'
import style from './style.module.less'
import moment from 'moment'
const { RangePicker } = DatePicker;

export default function Index() {
    const projectId = useSelector(selectProjectId)
    let [areaId, setAreaId] = useState(1)
    let [pageNum, setpageNum] = useState(1)
    let [totalalarm, settotalalarm] = useState(1)
    let [dataSourceLog, setdataSourceLog] = useState([])
    let [dataSourceRead, setdataSourceRead] = useState([])
    let [DataSourceReadR, setDataSourceReadR] = useState([])
    const tableRef = useRef()
    tableRef.current = DataSourceReadR
    let dataSourceReadR = []
    let [alike, setalike] = useState('')
    let [deviceStyle, setdeviceStyle] = useState(0)
    let [brake, setbrake] = useState(false)
    let [brakeC, setbrakeC] = useState(false)
    let [readout, setreadout] = useState(false)
    let [brakeResult, setbrakeResult] = useState(false)
    const [loading, setLoading] = useState(false);
    let params = {
        pageNum: pageNum,
        pageSize: 18,
        projectId: projectId,
        areaId: areaId,
        gatewayId: 0,
        deviceStyle: deviceStyle,
        category: '',
        alike: alike,
        state: 0
    }
    const getData = () => {//设备统计
        return Remote.AllMeter(params).then(res => {
            let { success, data } = res
            if (success) {
                // setdataSourceLog(data)
                // setdataSourceLog([
                //     {
                //         id: 1,
                //         sn: 'shcb00471705'
                //     }, {
                //         id: 2,
                //         sn: 'shcb00471705'
                //     },
                // ])
            } else {
                message.error(res.errMsg)
            }
        })
    }
    useEffect(() => {
        if (areaId) {
            getData()
        }
    }, [projectId, pageNum, areaId, deviceStyle, alike])
    const changeArea = (value) => {
        setAreaId(value);
    };
    const submit = e => {
        setalike(e.target.value)
    }
    const changeType = () => {
        getData()
    }
    let [state, setstate] = useState(1)
    const changeTab = val => {
        setstate(val)
        setpageNum(1)
        if (val == 2) {
            setSelectionType("checkbox")
        } else if (val == 1) {
            setSelectionType("radio")
        }
    }
    const [selectionType, setSelectionType] = useState("radio");
    const columnsLog = [
        {
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn',
            id: 'id'
        },
        {
            title: '设备型号',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
        {
            title: '设备名称',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
        {
            title: '安装地址',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
        {
            title: '开关状态',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
    ];
    let realcolumns = [
        {
            title: '抄读时间',
            dataIndex: 'sn',
            key: 'sn',
            id: 'id'
        },
        {
            title: '设备编号',
            dataIndex: 'accountType',
            key: 'sn',
            id: 'id'
        },
        {
            title: 'A相电压(V)',
            dataIndex: 'deviceType',
            key: 'sn',
            id: 'id'

        },
        {
            title: 'C相电压(V)',
            dataIndex: 'categoryName',
            key: 'sn',
            id: 'id'
        },
        {
            title: 'A相电流(A)',
            dataIndex: 'customerNo',
            key: 'sn',
            id: 'id'
        },
        {
            title: 'B相电流(A)',
            dataIndex: 'customerName',
            key: 'sn',
            id: 'id'
        },

        {
            title: 'C相电流(A)',
            dataIndex: 'customerMobile',
            key: 'sn',
            id: 'id'
        },
        {
            title: '总电度(kWh)',
            dataIndex: 'address',
            key: 'sn',
            id: 'id'
        }
    ]
    let columnsRead = [
        {
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn',
            id: 'id'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'sn',
            id: 'id'
        }
    ]
    const onChangePageLog = (page, pageSize) => {
        console.log(page)
        setpageNum(page)
    }
    const headerProps = {
        isEnergy: false,//能耗类型
        isDate: false,//日期
        isShift: false,//班次
        isTab: false,//能耗、费用radioButton
        isSearch: false,//查询按钮
        isExport: false,//导出按钮
        //export: exportData //导出调用方法
    }
    const getFromChild = data => {
        console.log(data.areaId)//园区id
        if (data.areaId == undefined) {
            return
        } else {
            setAreaId(data.areaId)
        }
    }
    const handleChangeDevice = (value) => {
        console.log(value)
        setdeviceStyle(value)
    }
    const [selectTableList, setselectTableList] = useState([])
    let snList = []
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setselectTableList(selectedRows)

        },
    }
    const handleCancel = () => {
        setbrake(false)
        //setswitching(false)
    }
    let [isComplate, setisComplate] = useState(false)
    const closeStatus = () => {
        setbrakeResult(true)
        setisComplate(true)
        setbrakeC(false)
        snList = []
        if (selectTableList.length > 0) {
            selectTableList.map((item, index) => {
                snList.push(item.sn)
                dataSourceReadR.push({ sn: item.sn, state: '操作中，请稍候……' })
            })
        }
        setDataSourceReadR(() => dataSourceReadR)
        tableRef.current = [...dataSourceReadR]
        if (snList.length > 0) {
            Remote.Close(snList).then(res => {
                let { success, data } = res
                if (success) {
                    let snRemoteList = []
                    data.forEach((item, index) => {
                        if (item.errorCode == 0) {
                            snRemoteList.push(item.sn)
                        } else {
                            let arr = tableRef.current.map(items => {
                                return {
                                    ...items,
                                    state: item.description ? item.description : '操作失败'
                                }

                            })
                            setDataSourceReadR([...arr])
                        }
                    })
                    if (snRemoteList.length > 0) {
                        let count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]// 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                        let newsnList = []
                        let state = []
                        let status = true

                        count.map((item, index) => {
                            setTimeout(() => {
                                if (status) {
                                    if (snRemoteList.length > 0) {
                                        Remote.StartBatchValveTask(snRemoteList).then((res) => {
                                            if (res.success) {
                                                newsnList = []
                                                state.push(index)
                                                res.data.map((items, i) => {
                                                    if (items.errorCode == 0) {
                                                        newsnList.push(items.sn)
                                                    } else {
                                                    }
                                                })
                                                if (newsnList.length > 0) {
                                                    Remote.BatchValveStatus(newsnList).then(result => {
                                                        if (result.success) {
                                                            snRemoteList = []
                                                            result.data.map((aitem) => {
                                                                if (aitem.status[0] == 'Close' || aitem.status[1] == 'Close') {
                                                                    let arr = tableRef.current.map(item => {
                                                                        if (item.sn == aitem.sn) {
                                                                            return {
                                                                                ...item,
                                                                                state: aitem.errorMessage ? aitem.errorMessage : '操作成功'
                                                                            }
                                                                        }

                                                                    })
                                                                    setDataSourceReadR([...arr])
                                                                } else {
                                                                    snRemoteList.push(aitem.sn)

                                                                }
                                                                if (aitem.status[0] != 'Close' && aitem.status[1] != 'Close' && state.length == 20) {
                                                                    let arr = tableRef.current.map(item => {
                                                                        if (item.sn == aitem.sn) {
                                                                            return {
                                                                                ...item,
                                                                                state: aitem.errorMessage ? aitem.errorMessage : '操作失败'
                                                                            }
                                                                        }

                                                                    })
                                                                    setDataSourceReadR([...arr])
                                                                }

                                                            })
                                                            if (state.length == 20 || snRemoteList.length == 0) {
                                                                status = false
                                                                setisComplate(false)
                                                                getData()
                                                            }

                                                        }
                                                    })
                                                }
                                            } else {
                                                message.error(res.errMsg)

                                            }
                                        })

                                    }

                                }
                            }, 2000 * index)
                        })

                    }
                } else {
                    message.error(res.errMsg)
                }
            })
        }
    }
    const openStatus = () => {
        setbrakeResult(true)
        setisComplate(true)
        setbrake(false)
        snList = []
        if (selectTableList.length > 0) {
            selectTableList.map((item, index) => {
                snList.push(item.sn)
                dataSourceReadR.push({ sn: item.sn, state: '操作中，请稍候……' })
            })
        }
        setDataSourceReadR(() => dataSourceReadR)
        tableRef.current = [...dataSourceReadR]
        if (snList.length > 0) {
            Remote.Open(snList).then(res => {
                let { success, data } = res
                if (success) {
                    let snRemoteList = []
                    data.forEach((item, index) => {
                        if (item.errorCode == 0) {
                            snRemoteList.push(item.sn)
                        } else {
                            let arr = tableRef.current.map(items => {
                                return {
                                    ...items,
                                    state: item.description ? item.description : '操作失败'
                                }

                            })
                            setDataSourceReadR([...arr])
                        }
                    })
                    if (snRemoteList.length > 0) {
                        let count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]// 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                        let newsnList = []
                        let state = []
                        let status = true

                        count.map((item, index) => {
                            setTimeout(() => {
                                if (status) {
                                    if (snRemoteList.length > 0) {
                                        Remote.StartBatchValveTask(snRemoteList).then((res) => {
                                            if (res.success) {
                                                newsnList = []
                                                state.push(index)
                                                res.data.map((items, i) => {
                                                    if (items.errorCode == 0) {
                                                        newsnList.push(items.sn)
                                                    } else {
                                                    }
                                                })
                                                if (newsnList.length > 0) {
                                                    Remote.BatchValveStatus(newsnList).then(result => {
                                                        if (result.success) {
                                                            snRemoteList = []
                                                            result.data.map((aitem) => {
                                                                if (aitem.status[0] == 'Open' || aitem.status[1] == 'Open') {
                                                                    let arr = tableRef.current.map(item => {
                                                                        if (item.sn == aitem.sn) {
                                                                            return {
                                                                                ...item,
                                                                                state: aitem.errorMessage ? aitem.errorMessage : '操作成功'
                                                                            }
                                                                        }

                                                                    })
                                                                    setDataSourceReadR([...arr])
                                                                } else {
                                                                    snRemoteList.push(aitem.sn)

                                                                }
                                                                if (aitem.status[0] != 'Open' && aitem.status[1] != 'Open' && state.length == 20) {
                                                                    let arr = tableRef.current.map(item => {
                                                                        if (item.sn == aitem.sn) {
                                                                            return {
                                                                                ...item,
                                                                                state: aitem.errorMessage ? aitem.errorMessage : '操作失败'
                                                                            }
                                                                        }

                                                                    })
                                                                    setDataSourceReadR([...arr])
                                                                }

                                                            })
                                                            if (state.length == 20 || snRemoteList.length == 0) {
                                                                status = false
                                                                setisComplate(false)
                                                                getData()
                                                            }

                                                        }
                                                    })
                                                }
                                            } else {
                                                message.error(res.errMsg)

                                            }
                                        })

                                    }

                                }
                            }, 2000 * index)
                        })

                    }
                } else {
                    message.error(res.errMsg)
                }
            })
        }
    }
    const handleCancelC = () => {
        setbrakeC(false)
        //setswitching(false)
    }
    const handleCancelResult = () => {
        setbrakeResult(false)
    }
    const changeReadout = () => {
        snList = []
        if (selectTableList.length > 0) {
            selectTableList.map((item, index) => {
                snList.push(item.sn)
            })
        }
        console.log(snList)
        if (selectTableList.length > 0) {
            setLoading(true)
            Remote.StartCalling(snList).then(res => {
                let { success, data } = res
                if (success) {
                    let isOkList = []
                    data.map((item, index) => {
                        if (item.isOk == true && item.errorCode == 0) {
                            isOkList.push({ sn: item.sn, taskNo: item.taskNo })
                        }
                    })
                    if (isOkList.length > 0) {
                        let count = [1, 2, 3]
                        count.map((item, index) => {
                            setTimeout(() => {
                                Remote.CallingResponse(isOkList).then(res => {
                                    let { success, data } = res
                                    if (success) {
                                        data.map(item => {
                                            if (item.isOk == true && item.errorCode == 0) {
                                                setdataSourceRead(() => { dataSourceRead.push(item) })
                                            } else {
                                                isOkList = []
                                                isOkList.push({ sn: item.sn, taskNo: item.taskNo })
                                            }
                                        })
                                    } else {
                                        message.error(res.errMsg)
                                    }
                                })
                            }, 5000 * index)
                        })
                    }
                    setreadout(true)
                    setLoading(false)
                } else {
                    message.error(res.errMsg)
                }
            })
        } else {
            message.error('请先选择设备！')
        }
    }
    const changesetbrake = (type) => {
        if (selectTableList.length > 0) {
            console.log(type)
            if (type == 1) {
                setbrake(true)
            } else if (type == 2) {
                setbrakeC(true)
            }
        } else {
            message.error('请先选择设备！')
        }

    }
    return (
        <Spin tip="正在抄读，请稍候……" size="large" spinning={loading}>
            <div className={style.main}>
                <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
                <div className={style.header}>
                    <Button className={state == 1 ? style.tabon : style.taboff} onClick={() => { changeTab(1) }}>单表控制</Button>
                    <Button className={state == 2 ? style.tabon : style.taboff} onClick={() => { changeTab(2) }}>批量控制</Button>
                </div>
                <div className={style.body}>
                    <div className={style.mainBox}>
                        <div className={style.bodyHeader}>
                            <Select
                                defaultValue={0}
                                style={{
                                    width: 128,
                                }}
                                onChange={handleChangeDevice}
                                options={[
                                    {
                                        value: 0,
                                        label: '全部',
                                    },
                                    {
                                        value: 1,
                                        label: '电表',
                                    },
                                    {
                                        value: 2,
                                        label: '水表',
                                    },
                                    {
                                        value: 3,
                                        label: '燃气表',
                                    },
                                ]}
                            />
                            <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
                            <div className={style.contentTitle}>
                                <span>设备查询</span>
                                <Input placeholder='请输入设备编号/安装地址' style={{ width: 291, marginLeft: 16 }} size='middle' onChange={submit}></Input>
                                <Button size='middle' style={{ width: 80, backgroundColor: 'rgb(245,247,250)', borderLeft: 'none' }} onClick={() => { changeType() }}>查询</Button>
                            </div>
                        </div>
                        <img src={imgurl.line} className={style.timeline} ></img>
                        <div className={style.btnBox}>
                            <Button size='middle' style={{ width: 96, height: 32, backgroundColor: '#237AE4', color: '#fff' }} onClick={() => { changeReadout() }}>实时抄读</Button>
                            {/* <Button size='middle' style={{ width: 96, height: 32, backgroundColor: '#237AE4', color: '#fff' }} onClick={() => { changeType() }}>操作日志</Button> */}
                            <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
                            <Button size='middle' style={{ width: 96, height: 32, backgroundColor: '#F56C6C', marginRight: 16, color: '#fff' }} onClick={() => { changesetbrake(1) }}>分闸</Button>
                            <Button size='middle' style={{ width: 96, height: 32, backgroundColor: '#F56C6C', color: '#fff' }} onClick={() => { changesetbrake(2) }}>合闸</Button>
                        </div>

                        <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.id} className={style.alarmTable} pagination={false} rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }} bordered></Table>
                        <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} />
                    </div>
                </div>
                <Modal
                    title={<Bluecolumn name="分闸控制" />}
                    width={640}
                    open={brake}
                    centered={true}
                    closable={false}
                    className={style.readout}
                    footer={[
                        <Button key="back" style={{ width: 96, height: 32, borderColor: 'rgb(204,204,204)', color: '#999' }} onClick={handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" style={{ backgroundColor: '#FF4D4F', color: '#fff', width: 96, height: 32 }} onClick={openStatus}>
                            确定
                        </Button>,
                    ]}
                >
                    <div style={{ fontSize: '18px', height: '106px', lineHeight: '106px', display: 'flex', alignItems: 'center' }}><img src={redwarn} className={style.imgclass}></img><p style={{ lineHeight: '48px', height: '106px', fontSize: '16px', width: 257 }}>分闸后,将导致该电表控制内的所有用电设备断电，请谨慎操作！</p></div>
                </Modal>
                <Modal
                    title={<Bluecolumn name="合闸控制" />}
                    width={640}
                    open={brakeC}
                    centered={true}
                    closable={false}
                    className={style.readout}
                    footer={[
                        <Button key="back" style={{ width: 96, height: 32, borderColor: 'rgb(204,204,204)', color: '#999' }} onClick={handleCancelC}>
                            取消
                        </Button>,
                        <Button key="submit" style={{ backgroundColor: '#FF4D4F', color: '#fff', width: 96, height: 32 }} onClick={closeStatus}>
                            确定
                        </Button>,
                    ]}
                >
                    <div style={{ fontSize: '18px', height: '106px', lineHeight: '106px', display: 'flex', alignItems: 'center' }}><img src={redwarn} className={style.imgclass}></img><p style={{ lineHeight: '48px', height: '106px', fontSize: '16px', width: 257 }}>合闸后,该电表控制内的所有用电设备将恢复供电，请确认！</p></div>
                </Modal>
                <Modal
                    title={<Bluecolumn name="远程控制" />}
                    width={640}
                    className={style.readoutBule}
                    open={brakeResult}
                    centered={true}
                    closable={false}
                    footer={[
                        <Button key="submit" disabled={isComplate} style={{ backgroundColor: '#237AE4', color: '#fff', width: 96, height: 32 }} onClick={handleCancelResult}>
                            完成
                        </Button>,
                    ]}
                >
                    <Table columns={columnsRead} dataSource={DataSourceReadR} rowKey={columnsRead => columnsRead.sn} className={style.Table} pagination={false} bordered></Table>
                </Modal>
                <Modal
                    title={<Bluecolumn name="实时抄读" />}
                    open={readout}
                    centered={true}
                    onCancel={() => { setreadout(false) }}
                    width={1218}
                    className={style.readoutBule}
                    footer={[<Button type='primary' style={{ width: 96, height: 36 }} onClick={() => { setreadout(false) }}>关闭</Button>]}
                >
                    <UserTable className={style.readTable} columns={realcolumns} dataSource={dataSourceRead} rowKey={realcolumns => realcolumns.id} ></UserTable>

                </Modal>
            </div>
        </Spin>
    )
}
