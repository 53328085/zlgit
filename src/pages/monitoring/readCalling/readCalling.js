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
    const [selectTableList, setselectTableList] = useState([])
    const [loading, setLoading] = useState(false);
    const [selectTableListRadio, setselectTableListRadio] = useState([])
    const [selectTableListCheckbox, setselectTableListCheckbox] = useState([])
    // const [selectTableKeyRadio, setselectTableKeyRadio] = useState([])
    // const [selectTableKeyCheckbox, setselectTableKeyCheckbox] = useState([])
    let params = {
        pageNum: pageNum,
        pageSize: 15,
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
                setdataSourceLog(data)
                settotalalarm(res.total)
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
            setselectTableList(selectTableListCheckbox)
        } else if (val == 1) {
            setSelectionType("radio")
            setselectTableList(selectTableListRadio)
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
            key: 'sn',
            id: 'id'
        },
        {
            title: '设备名称',
            dataIndex: 'name',
            key: 'sn',
            id: 'id'
        },
        {
            title: '安装地址',
            dataIndex: 'address',
            key: 'sn',
            id: 'id'
        },
        {
            title: '设备状态',
            dataIndex: 'status',
            render: (status) => <span> {status == null ? '未知' : (status[0] == 'Open' || status[1] == 'Open') ? '分闸' : '合闸'} </span>,
            key: 'sn',
            id: 'id'
        },
    ];
    let realcolumns = [
        {
            title: '抄读时间',
            dataIndex: 'LastSampleTime',
            key: 'sn',
            id: 'sn',
        },
        {
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn',
            id: 'sn',
        },
        {
            title: 'A相电压(V)',
            dataIndex: 'Ua',
            key: 'sn',
            id: 'sn',
        },
        {
            title: 'B相电压(V)',
            dataIndex: 'Ub',
            key: 'sn',
            id: 'sn',
        },
        {
            title: 'C相电压(V)',
            dataIndex: 'Uc',
            key: 'sn',
            id: 'sn',
        },
        {
            title: 'A相电流(A)',
            dataIndex: 'Ia',
            key: 'sn',
            id: 'sn',
        },
        {
            title: 'B相电流(A)',
            dataIndex: 'Ib',
            key: 'sn',
            id: 'sn',
        },

        {
            title: 'C相电流(A)',
            dataIndex: 'Ic',
            // render: (data) => <span> {JSON.parse(data).Ic} </span>,
            key: 'sn',
            id: 'sn',
        },
        {
            title: '总电度(kWh)',
            dataIndex: 'EP',
            key: 'sn',
            id: 'sn',
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
    let snList = []
    const rowSelectionRadio = {
        selectTableListRadio,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setselectTableListRadio(selectedRows)
            setselectTableList(selectedRows)
        },
    }
    const rowSelectionCheckbox = {
        selectTableListCheckbox,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setselectTableListCheckbox(selectedRows)
            setselectTableList(selectedRows)
        },
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
                        } else {
                            message.error('设备' + item.sn + '抄读失败！')
                            setLoading(false)
                        }
                    })
                    if (isOkList.length > 0) {
                        let count = [1, 2, 3]
                        let arr = []
                        let resData = []
                        let status = true
                        count.map((item, index) => {
                            setTimeout(() => {
                                if (status) {
                                    Remote.CallingResponse(isOkList).then(res => {
                                        arr.push(index)
                                        let { success, data } = res
                                        if (success) {
                                            resData = []
                                            data.map(item => {
                                                if (item.isOk == true && item.errorCode == 0) {
                                                    resData.push(item)
                                                } else {
                                                    isOkList = []
                                                    isOkList.push({ sn: item.sn, taskNo: item.taskNo })
                                                }
                                                console.log(arr, resData)
                                                if (arr.length == 3 || resData.length == data.length) {
                                                    setreadout(true)
                                                    setLoading(false)
                                                    status = false
                                                    let arrlist = []
                                                    resData.map(item => {
                                                        arrlist.push({ ...JSON.parse(item.data), sn: item.sn })
                                                    })
                                                    setdataSourceRead(arrlist)
                                                    console.log(dataSourceRead)
                                                }
                                            })
                                        } else {
                                            message.error(res.errMsg)
                                            setLoading(false)
                                        }

                                    })
                                }

                            }, 5000 * index)

                        })

                    }

                } else {
                    message.error(res.errMsg)
                }
            })
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
                            <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
                            <Button size='middle' style={{ width: 96, height: 32, backgroundColor: '#237AE4', color: '#fff' }} onClick={() => { changeReadout() }}>实时抄读</Button>
                        </div>
                        <img src={imgurl.line} className={style.timeline} ></img>
                        {selectionType == 'radio' ? <div>
                            <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} pagination={false} rowSelection={{
                                type: 'radio',
                                ...rowSelectionRadio,
                            }} bordered></Table>
                            <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} />
                        </div> : <div>
                            <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} pagination={false} rowSelection={{
                                type: 'checkbox',
                                ...rowSelectionCheckbox,
                            }} bordered></Table>
                            <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} />
                        </div>}
                    </div>
                </div>
                <Modal
                    title={<Bluecolumn name="实时抄读" />}
                    open={readout}
                    centered={true}
                    onCancel={() => { setreadout(false) }}
                    width={1218}
                    className={style.readoutBule}
                    footer={[<Button type='primary' style={{ width: 96, height: 36 }} onClick={() => { setreadout(false) }}>关闭</Button>]}
                >
                    <UserTable className={style.readTable} columns={realcolumns} dataSource={dataSourceRead} rowKey={realcolumns => realcolumns.sn} ></UserTable>

                </Modal>
            </div>
        </Spin>
    )
}
