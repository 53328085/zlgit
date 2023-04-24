import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { useRequest, useToggle, useAntdTable,useReactive  } from 'ahooks'
import { GetLogOperation, Remote, Monitoring } from '@api/api.js'
import { Form, DatePicker, Input, Button, Table, Pagination, Select, message, Modal, Spin, Divider, Space } from 'antd'
import Bluecolumn from '@com/bluecolumn'
import { flushSync } from 'react-dom'
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
import { cloneDeep } from 'lodash'
import { deepClone } from '@topology/core'
const { RangePicker } = DatePicker;

export default function Index() {
    const projectId = useSelector(selectProjectId)
    let [areaId, setAreaId] = useState(1)   
    const [DataSourceReadR, setDataSourceReadR] = useState()
    const [tabledata, setTabledata] = useState()
    const tabledataRef = useRef()
    tabledataRef.current = tabledata
    const myref = useRef()
    const tableRef = useRef()
    tableRef.current = DataSourceReadR
    let dataSourceReadR = []
  
    const [brake, setbrake] = useState(false)
    const [brakeC, setbrakeC] = useState(false)
    const [brakeResult, setbrakeResult] = useState(false)
    // const [selectTableList, setselectTableList] = useState([])
    // const [selectTableListRadio, setselectTableListRadio] = useState()
    const tableRefs= useRef()
   
    // const selectTableListRadio = useReactive([])
     
    // const [selectTableListCheckbox, setselectTableListCheckbox] = useState([])

    /* let params = {
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
    }, [projectId, pageNum, areaId, deviceStyle, alike]) */
    const [form] = Form.useForm()
    const {Item} = Form
    const getData = ({current, pageSize}, form) => {
       let {alike, deviceStyle} = form
       let params ={pageNum: current, pageSize, projectId, areaId, gatewayId: 0, state: 0,category: '', deviceStyle, alike}
       return Remote.AllMeter(params).then(res => {
        let {success, data, total} = res
        if(success && Array.isArray(data) && data.length > 0) {
           return {
            list: data,
            total,
           }
        }else {
            return {
                list: [],
                total: 0,
               }
        }
       }).catch(e => {
        console.log(e)
       })

    }
   const {tableProps, search} = useAntdTable(getData, {
    form,
    defaultPageSize: 18,
    refreshDeps: [areaId]
   })
   const {submit} = search

    const changeArea = (value) => {
        setAreaId(value);
    };
  /*   const submit = e => {
        setalike(e.target.value)
    } */
/*     const changeType = () => {
        getData()
    } */
    let [state, setstate] = useState(1)
    const changeTab = val => {
        setstate(val)     
        if (val == 2) {
            setSelectionType("checkbox")
            // setselectTableList(selectTableListCheckbox)
            // tableRefs.current=selectTableListCheckbox
        } else if (val == 1) {
            setSelectionType("radio")
            // let list = []
            // list.push(tableRefs.current[0])
            // setselectTableList(selectTableListCheckbox ? list : [])
            // tableRefs.current=tableRefs.current ? list : []
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
            title: '开关状态',
            dataIndex: 'status',
            render: (status) => <span> {status == null ? '未知' : (status[0] == 'Open' || status[1] == 'Open') ? '分闸' : '合闸'} </span>,
            key: 'sn',
            id: 'id'
        },
    ];
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
    const rowSelectionRadio = {
        tableRefs,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            tableRefs.current = selectedRows
            // setselectTableListRadio(selectedRows)
            //setselectTableList(selectedRows)
        },
    }
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const rowSelectionCheckbox = {
        tableRefs,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // setselectTableListCheckbox(selectedRows)
            // setselectTableList(selectedRows)
            // setSelectedRowKeys(selectedRowKeys);
            tableRefs.current = selectedRows
        },
    }
    const handleCancel = type => {
        if (type == 'open') {
            setbrake(false)
        } else if (type == 'close') {
            setbrakeC(false)
        }
        tableRefs.current=[]
        //getData()
    }
    const [isComplate, setisComplate] = useState(false)
    const [snList, setsnList] = useState()

    const [changeBtnType, setchangeBtnType] = useState('')
    const openStatus = type => {
        setbrakeResult(true)
        setisComplate(true)
        setbrake(false)
        setbrakeC(false)
        setchangeBtnType(type)
        console.log(changeBtnType)
    }
    const handleCancelResult = () => {
        setbrakeResult(false)
        getData()
    }
    const changeDisabled = () => {
        setisComplate(false)
    }
    const changesetbrake = (type) => {
        console.log(tableRefs.current)
        if (tableRefs.current.length > 0) {
            setsnList([])
            let List = []
            if (tableRefs.current.length > 0) {
                tableRefs.current.map((item, index) => {
                    List.push(item.sn)
                    dataSourceReadR.push({ sn: item.sn, state: '操作中，请稍候……' })

                })
            }
            setsnList(List)
            let all = [...dataSourceReadR]

            setDataSourceReadR(deepClone(all))
            setTabledata(deepClone(all))
            myref.current?.setDataSourceRead(deepClone(all))
            tabledataRef.current = all
            console.log(all, dataSourceReadR, tabledataRef.current)
            console.log(DataSourceReadR, dataSourceReadR, all)
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
        <div className={style.main}>
            <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
            <div className={style.header}>
                <Button className={state == 1 ? style.tabon : style.taboff} onClick={() => { changeTab(1) }}>单表控制</Button>
                <Button className={state == 2 ? style.tabon : style.taboff} onClick={() => { changeTab(2) }}>批量控制</Button>
            </div>
            <div className={style.body}>
                <div className={style.mainBox} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Form form={form} className={style.bodyHeader} layout='inline' initialValues={{deviceStyle: 0, alike: ''}}>
                        <Space size={32}>
                        <Item name="deviceStyle" style={{marginBottom: '0px', marginRight: '0px'}}>
                        <Select
                            
                            style={{
                                width: 128,
                            }}
                            onChange={submit}
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
                        </Item>
                        <Divider type="vertical" style={{margin: '0px', height: '32px'}} dashed />
                        <Item name="alike" label="设备查询" style={{marginBottom: '0px', marginRight: '0px'}}>
                            <Input.Search placeholder='请输入设备编号/安装地址' allowClear style={{ width: '370px' }} size='middle' enterButton="查询" onSearch={submit} /> 
                             
                        </Item>
                        <Divider type="vertical" style={{margin: '0px', height: '32px'}} dashed />
                        <Space size={16}>
                        <Button size='middle' style={{ width: 96, height: 32, backgroundColor: '#F56C6C', border: 'none', color: '#fff' }} onClick={() => { changesetbrake(1) }}>分闸</Button>
                        <Button size='middle' style={{ width: 96, height: 32, backgroundColor: '#F56C6C', border: 'none', color: '#fff' }} onClick={() => { changesetbrake(2) }}>合闸</Button>
                        </Space>
                        </Space>
                    </Form>
                    <img src={imgurl.line} className={style.timeline} ></img>
                    {selectionType == 'radio' ? <div style={{display: 'flex', flex: 1}}>
                        <UserTable columns={columnsLog}   rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} {...tableProps}  rowSelection={{
                            type: 'radio',  
                            ...rowSelectionRadio,
                          
                        }} bordered></UserTable>
                      {/*   <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} /> */}
                    </div> : <div style={{display: 'flex', flex: 1}}>
                        <UserTable columns={columnsLog}   rowKey={columnsLog => columnsLog.sn} className={style.alarmTable} {...tableProps}  rowSelection={{
                            type: 'checkbox',
                            ...rowSelectionCheckbox,
                        }} bordered></UserTable>
                       {/*  <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} /> */}
                    </div>}
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
                    <Button key="back" style={{ width: 96, height: 32, borderColor: 'rgb(204,204,204)', color: '#999' }} onClick={() => { handleCancel('open') }}>
                        取消
                    </Button>,
                    <Button key="submit" style={{ backgroundColor: '#FF4D4F', color: '#fff', width: 96, height: 32 }} onClick={() => { openStatus('open') }}>
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
                    <Button key="back" style={{ width: 96, height: 32, borderColor: 'rgb(204,204,204)', color: '#999' }} onClick={() => { handleCancel('close') }}>
                        取消
                    </Button>,
                    <Button key="submit" style={{ backgroundColor: '#FF4D4F', color: '#fff', width: 96, height: 32 }} onClick={() => { openStatus('close') }}>
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
                destroyOnClose
                footer={[
                    <Button key="submit" disabled={isComplate} style={{ backgroundColor: '#237AE4', color: '#fff', width: 96, height: 32 }} onClick={handleCancelResult}>
                        完成
                    </Button>,
                ]}
            >
                <MyTable snList={snList} dataSourceRead={tabledataRef.current} changeDisabled={changeDisabled} ref={myref} changeBtnType={changeBtnType} />

            </Modal>

        </div>
    )
}
const MyTable = forwardRef(({ snList, dataSourceRead, changeDisabled, changeBtnType }, ref) => {
    const [DataSourceRead, setDataSourceRead] = useState(deepClone(dataSourceRead))
    let columnsRead = [
        {
            title: '设备编号',
            dataIndex: 'sn',
            key: 'state',
            id: 'id'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            id: 'id'
        }
    ]
    const getOpera = () => {
        return new Promise(async (resolve, reject) => {
            let res
            if (changeBtnType == 'open') {
                res = await Remote.Open(snList)
            } else if (changeBtnType == 'close') {
                res = await Remote.Close(snList)
            }
            if (res.success) {
                let snRemoteList = []
                let setResultInfo = {}
                let setResultInfoList = []
                res.data.forEach((item, index) => {
                    setResultInfo = { id: "", status: 2 }
                    setResultInfoList.push(setResultInfo)
                    setResultInfoList[index].id = item.id
                    if (item.errorCode == 0) {
                        snRemoteList.push(item.sn)
                    } else {
                        for (let i = 0; i < dataSourceRead.length; i++) {
                            if (dataSourceRead[i].sn == item.sn) {
                                dataSourceRead[i].state = item.description ? item.description : '操作失败'
                            }
                        }
                        if (snRemoteList.length == 0 && index == res.data.length - 1) {
                            changeDisabled()
                            resolve(dataSourceRead)
                            Remote.SetResult(setResultInfoList).then((res) => { })
                        }
                    }
                })
                if (snRemoteList.length > 0) {
                    let count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
                                                if (items.errorCode == 0 && items.isOk) {
                                                    newsnList.push(items.sn)
                                                }
                                                else {
                                                    setResultInfoList[i].status = 2
                                                    for (let i = 0; i < dataSourceRead.length; i++) {
                                                        if (dataSourceRead[i].sn == items.sn) {
                                                            dataSourceRead[i].state = items.errorMessage ? items.errorMessage : '操作失败'
                                                        }
                                                    }
                                                    console.log(dataSourceRead)
                                                    if (newsnList.length == 0 && i == res.data.length - 1) {
                                                        status = false
                                                        changeDisabled()
                                                        resolve(dataSourceRead)
                                                        Remote.SetResult(setResultInfoList).then((res) => { })
                                                    }
                                                }
                                            })
                                            setTimeout(() => {
                                                if (newsnList.length > 0) {
                                                    Remote.BatchValveStatus(newsnList).then(result => {
                                                        if (result.success) {
                                                            snRemoteList = []
                                                            result.data.map((aitem, aindex) => {
                                                                if (changeBtnType == 'open') {
                                                                    if (aitem.status[0] == 'Open' || aitem.status[1] == 'Open') {
                                                                        for (let i = 0; i < dataSourceRead.length; i++) {
                                                                            if (dataSourceRead[i].sn == aitem.sn) {
                                                                                dataSourceRead[i].state = aitem.errorMessage ? aitem.errorMessage : '操作成功'
                                                                            }
                                                                        }
                                                                        resolve(dataSourceRead)
                                                                        setResultInfoList[aindex].status = 1
                                                                    } else {
                                                                        snRemoteList.push(aitem.sn)

                                                                    }
                                                                    if (aitem.status[0] != 'Open' && aitem.status[1] != 'Open' && state.length == 10) {
                                                                        for (let i = 0; i < dataSourceRead.length; i++) {
                                                                            if (dataSourceRead[i].sn == aitem.sn) {
                                                                                dataSourceRead[i].state = aitem.errorMessage ? aitem.errorMessage : '操作失败'
                                                                            }
                                                                        }
                                                                        setResultInfoList[aindex].status = 2
                                                                    }
                                                                } else if (changeBtnType == 'close') {
                                                                    if (aitem.status[0] == 'Close' || aitem.status[1] == 'Close') {
                                                                        for (let i = 0; i < dataSourceRead.length; i++) {
                                                                            if (dataSourceRead[i].sn == aitem.sn) {
                                                                                dataSourceRead[i].state = aitem.errorMessage ? aitem.errorMessage : '操作成功'
                                                                            }
                                                                        }
                                                                        setResultInfoList[aindex].status = 1
                                                                    } else {
                                                                        snRemoteList.push(aitem.sn)

                                                                    }
                                                                    if (aitem.status[0] != 'Close' && aitem.status[1] != 'Close' && state.length == 10) {
                                                                        for (let i = 0; i < dataSourceRead.length; i++) {
                                                                            if (dataSourceRead[i].sn == aitem.sn) {
                                                                                dataSourceRead[i].state = aitem.errorMessage ? aitem.errorMessage : '操作失败'
                                                                            }
                                                                        }
                                                                        setResultInfoList[aindex].status = 2
                                                                    }
                                                                }

                                                            })

                                                            if (state.length == 10 || snRemoteList.length == 0) {
                                                                status = false
                                                                changeDisabled()
                                                                resolve(dataSourceRead)
                                                                Remote.SetResult(setResultInfoList).then((res) => { })
                                                            }

                                                        }
                                                    })
                                                }
                                            }, 0)
                                        } else {
                                            message.error(res.errMsg)

                                        }
                                    })

                                }

                            }
                        }, 7000 * index)
                    })

                }
            } else {
                message.error(res.errMsg)
            }
        })

    }
    useImperativeHandle(ref, () => {
        setDataSourceRead
    })

    useEffect(() => {
        console.log(dataSourceRead)
    }, [JSON.stringify(dataSourceRead)])
    useEffect(() => {
        if (snList && snList.length > 0) {
            getOpera().then(res => {
                console.log(res)
                const a = JSON.parse(JSON.stringify(res))
                setDataSourceRead(a)
            })
        }
    }, [snList])
    return (
        <Table columns={columnsRead} dataSource={DataSourceRead} rowKey={columnsRead => columnsRead.sn} className={style.Table} pagination={false} bordered></Table>
    )
}
) 