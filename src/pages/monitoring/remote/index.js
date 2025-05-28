import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useAntdTable } from 'ahooks'
import { Remote, Monitoring,operationDesigin } from '@api/api.js'
import { Form, Button, Table, Select, message, Divider, Space, DatePicker,Input } from 'antd'

import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import CustContext from '@com/content.js'
import { selectProjectId, selectOneLevelDefaultId, deviceStyle, filterDeviceStyle } from '@redux/systemconfig.js'
import {manager,maintenance} from "@redux/user"
import styled from 'styled-components'

import CModal from '@com/useModal'

import { deepClone } from '@topology/core'
import { Serach, Cdivider, disabledDate } from "@com/comstyled"
import {CustTransO, i18t, i18warning,ExportExcel, CustButtonT,CustButton} from "@com/useButton"
import {cipher} from "@com/usehandler"
const { RuntimeLog: { QueryDeviceLogs },PowerNeed, CheckPowerOnce,SetUserPower} = Monitoring
const {QueryProjectMaintenance} = operationDesigin
const Mainbox = styled.div`
   display: flex;
   flex-direction: column;
   flex: 1;

`
// 设备日志
const columnsLogD = [
    {
        title: '设备编号',
        dataIndex: 'sn',
        key: 'sn',

    },
    {
        title: '设备类型',
        dataIndex: 'meterType',
        key: 'meterType',

    },
    {
        title: '设备型号',
        dataIndex: 'category',
        key: 'category',
        id: 'id'
    },

    {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',

    },
    {
        title: '描述',
        dataIndex: 'content',
        key: 'content',

    },
    {
        title: '操作时间',
        dataIndex: 'time',
        key: 'time',

    },
    {
        title: '操作者',
        dataIndex: 'creator',
        key: 'creator',
        id: 'id'
    },
];

export default function Index() {
    const [form] = Form.useForm()
    const { Item } = Form
    const projectId = useSelector(selectProjectId)
    // const deviceStyles = useSelector(deviceStyle)
    const ismanager = useSelector(manager)
   // const ismaintenance = useSelector(maintenance)

    const deviceStyles = useSelector(filterDeviceStyle)
    const areaId = useSelector(selectOneLevelDefaultId);
    const [value, setvalue] = useState('1')
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
    const tableRefs = useRef()
    const [logparams, setLogparams] = useState({})
    const onValuesChange = (_, value) => {
        setLogparams(value)
    }
    useEffect(() => {
        if (value == 3) {
            setLogparams(form.getFieldsValue(true))
        }
    }, [value])
    const getLogData = ({ current, pageSize }) => {
        if (value != 3) return
        let { time, alike, deviceStyle } = logparams
        if (!time) return
        let [start, end] = time
        let params = { pageNum: current, pageSize, projectId, start: start.format("yyyy-MM-DD"), end: end.format("yyyy-MM-DD") }
        return QueryDeviceLogs(areaId, alike.trim(), deviceStyle, params).then(res => {
            let { success, data, total } = res

            if (success && Array.isArray(data) && data.length > 0) {
                console.log('suceess')
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
        }).catch(e => {
            console.log(e)
        })

    }

    const { tableProps: devieData } = useAntdTable(getLogData, {
        defaultPageSize: 18,
        refreshDeps: [areaId, value, logparams],
    })




    const getData = ({ current, pageSize }, form = {}) => {
        let { alike, deviceStyle } = form
        console.log(deviceStyle, "-----AllMeter")
        let params = { pageNum: current, pageSize, projectId, areaId, gatewayId: 0, state: 0, category: '', deviceStyle, alike: alike.trim() }
        return Remote.AllMeter(params).then(res => {
            let { success, data, total } = res

            if (success && Array.isArray(data) && data.length > 0) {
                console.log('suceess')
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
        }).catch(e => {
            console.log(e)
        })

    }
    const { tableProps, search } = useAntdTable(getData, {
        form,
        defaultPageSize: 18,
        // defaultParams: [{ current: 1, pageSize: 18 }, { areaId, projectId, gatewayId: 0, state: 0, category: '', alike: '', deviceStyle: 1 }],
        refreshDeps: [areaId, brakeResult]
    })

    const { submit } = search

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
        //  tableRefs.current=[]
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
        // getData(1,18)
    }
    const changeDisabled = () => {
        setisComplate(false)
    }

    // 香炉山项目 start
    const contrCategory="NPR550-U1"
    const custrulues =[
        {
        required: true, 
        },
        {
            validator: (_, value) => { 
                let reg =/^[\d]{6}$/
                if(reg.test(value)){
                    return Promise.resolve()
                }else {
                    return Promise.reject("请输入正确的密码")
                }
            }
        }
        ]

    const typeref = useRef()
    
    const [pwdform] = Form.useForm()
    const [setform] = Form.useForm()
    const pwdmodal = useRef()

    const setmodal = useRef()
    
   const onsetpwd= async()=> {
       try {
         const values = await setform.validateFields()
         values.projectId = projectId
        const {success, errMsg} = await  SetUserPower(values)
        if(success) {
            message.success("设置密码成功")   
            setmodal.current.onCancel()         
        }else {
          message.warning(errMsg || "数据出错")
        }
       } catch (error) {
        
       } 
   }

   const showpwd = () => { 
      setmodal.current.onOpen()
   }

    const onInputpwd=async()=> { // 密码确认
      try {
        
        let values =await pwdform.validateFields()
         values.projectId = projectId
         values.Pwd1 = cipher(values.Pwd1)
         values.Pwd2 = cipher(values.Pwd2)
         let {success, errMsg} =  await CheckPowerOnce(values)
         if(success) {
            changesetbrake(typeref.current)
         }else {
            message.warning(errMsg)
            
         }
      } catch (error) {
        console.log(error)
      }
    }
    const passwordhandler =async (type) => {
        try {
            if (tableRefs.current && tableRefs.current.length > 0) {
                typeref.current = type
          let category = tableRefs.current.map(r => r.category)
          console.log(category)
          console.log(tableRefs.current)
          if(category.includes(contrCategory)&& tableRef.current?.length >1) {
            return message.warning("微机保护不能批量控制")            
          }else if(category.includes(contrCategory)&& tableRefs.current?.length ==1) {
            pwdmodal.current.onOpen()           
          }else {
            changesetbrake(type)
          }
        } else {
            message.error('请先选择设备！')
        }
           // await  PowerNeed({projectId})
        } catch (error) {
            console.log(error)
        }
       

    }
  const [devops, setDevops] = useState([])
  const getMaintenance= async()=> {
     let {success, data} =  await QueryProjectMaintenance(projectId)
     if(success && Array.isArray(data) && data.length) {
        let dataops = data.map(d => ({label: d.name, value: d.id}))
        setDevops(dataops)
     }else {
        setDevops([])
     }
  }
  // ismanager
  useEffect(()=> {
     if(true) {   
        getMaintenance()
     }

  }, [])

    // 香炉山项目 end
    const changesetbrake =async (type) => {
        if (tableRefs.current && tableRefs.current.length > 0) {
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
            //  console.log(all, dataSourceReadR, tabledataRef.current)
            //   console.log(DataSourceReadR, dataSourceReadR, all)
            //  console.log(type)
            if (type == 1) {
                setbrake(true)
            } else if (type == 2) {
                setbrakeC(true)
            }
        } else {
            message.error('请先选择设备！')
        }

    }
    const tabs = [
        {
            label: "单表控制",
            key: 1,

        },
        {
            label: "批量控制",
            key: 2,

        },
        {
            label: "设备日志",
            key: 3,

        }
    ]
    let dataProps = {
        value,
        setvalue,
        tabs,
    }
    // 设置initialValues之前检查options数组是否有数据
    const initialValues = deviceStyles.length > 0 ? { deviceStyle: deviceStyles[0]?.deviceStyle, alike: '', time: [moment().subtract(7, 'day'), moment()] } : {};
    return (
        <CustContext.Provider value={dataProps}>
            <Pagecount>
                <div className='flexcol'>
                    <Form form={form} layout='inline' initialValues={initialValues} onValuesChange={onValuesChange} >
                        <Space size={16}>
                            <Item name="deviceStyle" style={{ marginBottom: '0px', marginRight: '0px' }}>

                                <Select
                                    style={{ width: "128px" }}
                                    fieldNames={{ label: "name", value: "deviceStyle" }}
                                    onChange={submit}
                                    options={deviceStyles}
                                />
                            </Item>
                            
                            <Item name="alike" label="设备查询" style={{ marginBottom: '0px', marginRight: '0px' }}>
                                <Serach placeholder='请输入设备编号/安装地址' allowClear size='middle' enterButton="查询" onSearch={submit} />

                            </Item>
                            {value == 3 && <Item name="time"><DatePicker.RangePicker disabledDate={disabledDate} format="YYYY-MM-DD" /></Item>}
                           {/*  {value != 3 && <> 
                                <Space size={16}>
                                    <CustButtonT ns="monitor" text="opening" danger onClick={() => { changesetbrake(1) }}>分闸</CustButtonT>
                                    <CustButtonT ns="monitor" text="closing"  danger   onClick={() => { changesetbrake(2) }}>合闸</CustButtonT>
                                </Space></>} */}
                               
                             {value !=3 && <> 
                             {
                               (manager|| maintenance) ?  <Space size={16}>
                               <CustButtonT ns="monitor" text="opening" danger onClick={() => { passwordhandler(1) }}>分闸</CustButtonT>
                               <CustButtonT ns="monitor" text="closing"  danger   onClick={() => { passwordhandler(2) }}>合闸</CustButtonT>
                               <CustButton  wh="auto"  onClick={() => { showpwd() }}>设置密码</CustButton>
                           </Space> :  null
                             }
                               </>}
                        </Space>
                    </Form>
                   


                    {value == 1 ? <div style={{ display: 'flex', flex: 1 }}>
                        <UserTable columns={columnsLog} rowKey={columnsLog => columnsLog.sn} {...tableProps} rowSelection={{
                            type: 'radio',
                            ...rowSelectionRadio,

                        }} bordered></UserTable>

                    </div> : value == 2 ? <div style={{ display: 'flex', flex: 1 }}>
                        <UserTable columns={columnsLog} rowKey={columnsLog => columnsLog.sn} {...tableProps} rowSelection={{
                            type: 'checkbox',
                            ...rowSelectionCheckbox,
                        }} bordered></UserTable>

                    </div> : <div style={{ display: 'flex', flex: 1 }}>
                        <UserTable columns={columnsLogD}     {...devieData}  ></UserTable>

                    </div>}

                </div>
                {/*   <Modal
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
            </Modal> */}

                <CModal
                    title="分闸控制"
                    width={640}
                    open={brake}
                    centered={true}
                    closable={false}
                    type="warn"
                    mold="cust"
                    onOk={() => openStatus('open')}
                    onCancel={() => handleCancel('open')}
                >
                    分闸后,将导致该电表控制内的所有用电设备断电，请谨慎操作！
                </CModal>
                <CModal
                    title="合闸控制"
                    width={640}
                    open={brakeC}
                    centered={true}
                    closable={false}
                    type="warn"
                    mold="cust"
                    onOk={() => { openStatus('close') }}
                    onCancel={() => { handleCancel('close') }}
                >
                    合闸后,该电表控制内的所有用电设备将恢复供电，请确认！
                </CModal>
                <CModal
                    title="远程控制"
                    width={640}
                    open={brakeResult}
                    centered={true}
                    closable={false}
                    destroyOnClose
                    mold="cust"
                    onCancel={() => {
                        setbrakeResult(false)
                    }}
                    onOk={handleCancelResult}
                >
                    <MyTable snList={snList} projectId={projectId} dataSourceRead={tabledataRef.current} changeDisabled={changeDisabled} ref={myref} changeBtnType={changeBtnType} />

                </CModal>
                <CModal
                    title="输入控制密码"
                    width={440}
                    destroyOnClose
                    ref={pwdmodal}
                    mold="cust" 
                    onOk={()=>onInputpwd()}
                >
                   <Form form={pwdform} labelCol={{flex: "8em"}} preserve={false} >
                      <Form.Item label="管理员密码" name="Pwd1" rules={custrulues}>
                        <Input.Password placeholder='请输入6位数字密码'></Input.Password>
                      </Form.Item>
                      {/* ismanager */}
                      {
                         <Form.Item label="运维人员" name="UserId" rules={[{
                            required:true
                         }]}>
                            <Select options={devops}></Select>
                        </Form.Item>
                      }
                      <Form.Item label="维护人员密码" name="Pwd2" rules={custrulues}>
                        <Input.Password placeholder='请输入6位数字密码' ></Input.Password>
                      </Form.Item>
                   </Form>
                </CModal>
                <CModal
                    title="设置控制密码"
                    width={440}
                    destroyOnClose
                    ref={setmodal}
                    mold="cust" 
                    onOk={()=>onsetpwd()}
                >
                   <Form form={setform} labelCol={{flex: "5em"}} preserve={false} >
                      <Form.Item label="用户密码" name="Pwd" rules={custrulues}>
                        <Input.Password placeholder='请输入6位数字密码'></Input.Password>
                      </Form.Item>
                   </Form>
                </CModal>

            </Pagecount>
        </CustContext.Provider>
    )
}
const MyTable = forwardRef(({ snList, projectId, dataSourceRead, changeDisabled, changeBtnType }, ref) => {
    console.log(snList)
    let params = {
        sns: snList,
        projectId,
    }
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
                res = await Remote.Open(params)
            } else if (changeBtnType == 'close') {
                res = await Remote.Close(params)
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
                            Remote.SetResult(setResultInfoList, projectId).then((res) => { })
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
                                    let post = {
                                        sns: snRemoteList,
                                        projectId,
                                    }
                                    Remote.StartBatchValveTask(post).then((res) => {
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
                                                        Remote.SetResult(setResultInfoList, projectId).then((res) => { })
                                                    }
                                                }
                                            })
                                            setTimeout(() => {
                                                if (newsnList.length > 0) {
                                                    let bodys = {
                                                        sns: newsnList,
                                                        projectId,
                                                    }
                                                    Remote.BatchValveStatus(bodys).then(result => {
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
                                                                        //resolve(dataSourceRead)
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
                                                                Remote.SetResult(setResultInfoList, projectId).then((res) => { })
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
        <Table columns={columnsRead} dataSource={DataSourceRead} rowKey={columnsRead => columnsRead.sn} pagination={false} bordered></Table>
    )
}
) 