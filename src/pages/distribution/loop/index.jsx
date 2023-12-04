import React, { useState, useMemo, useEffect, useRef } from 'react'
import style from './style.module.less'
import { Select, Button, DatePicker, Form, Divider, message,Table } from 'antd'
import { SyncOutlined, UploadOutlined, RollbackOutlined, SearchOutlined } from '@ant-design/icons';
import LoopSelect from './loopSelect'
import ContentTable from './contentTable';
import LoopDetail from './loopDetail';
import { useSelector, useDispatch } from 'react-redux'
import BlueColumn from '@com/bluecolumn'
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import { selectOneLevel } from "@redux/systemconfig";
import {Link} from 'react-router-dom'
import {ExportExcel} from '@com/useButton'
import styled from 'styled-components';
const WrapTable = styled.div`
.ant-table{
    .ant-table-scroll {
      .ant-table-hide-scrollbar {
        overflow-y: auto !important;
      }
    }
}
   
`
export default function Index() {

    const roomopts = useSelector(state => state.system.roomId)
    const [roomlist, setRoomList] = useState(roomopts)
    const [roomId, setRoomId] = useState(roomopts[0]?.id)
    const [form] = Form.useForm()
    const projectId = useSelector(state => state.system.menus.projectId)
    const oneLevel = useSelector(selectOneLevel)
    const selectRef=useRef()
    const [tableData,setTableData] =useState([])
    const tableRef=useRef()
    const columns = [
        {
            title: '回路名称',
            dataIndex: 'lineName',
            width: 176,
            
        }, 
        {
            title:"总分表",
            dataIndex:'type',
            width:80,
            render:(text,record)=><span>{text==1?'总表':'分表'}</span>
        },{
            title:"设备编号",
            dataIndex:'sn',
            width:160,
            render: (text, record) => <Link style={{ color: '#237ae4', textDecoration: 'underline', cursor: 'pointer' }} target="blank" to={`/deviceDetail?sn=${record.sn}`}>{text}</Link>
        },{
            title: '电压',
            children: [
                {
                    title: 'Ua(V)',
                    dataIndex: 'Ua',
                    width: 96
                },
                {
                    title: 'Ub(V)',
                    dataIndex: 'Ub',
                    width: 96
                },
                {
                    title: 'Uc(V)',
                    dataIndex: 'Uc',
                    width: 96
                },
            ]
        }, {
            title: '电流',
            children: [
                {
                    title: 'Ia(V)',
                    dataIndex: 'Ia',
                    width: 96
                },
                {
                    title: 'Ib(V)',
                    dataIndex: 'Ib',
                    width: 96
                },
                {
                    title: 'Ic(V)',
                    dataIndex: 'Ic',
                    width: 96
                },
            ]
        }, {
            title: '功率因数',
            dataIndex: 'PFt',
            width: 95
        }, {
            title: '总有功功率',
            children:[
                {
                    title:'(kW)',
                    width:96,
                    dataIndex: 'Pt',
                }
            ]
        },{
            title: '总无功功率',
            children:[
                {
                    title:'(kVar)',
                    width:96,
                    dataIndex: 'Qt',
                }
            ]
        },  {
            title: '总能耗',
            children:[
                {
                    title:'(kW·h)',

                    dataIndex: 'Ep',
                }
            ]
        },
    ]

    // const tableData = [
    //     {
    //         key: '1',
    //         name: '总进线1',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 12568.32
    //     }, {
    //         key: '1-1',
    //         name: '回路1-1',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 3668.32
    //     }, {
    //         key: '1-2',
    //         name: '回路1-2',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 5645.32
    //     }, {
    //         key: '1-2-1',
    //         name: '回路1-2-1',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 1568.32
    //     }, {
    //         key: '1-2-2',
    //         name: '回路1-2-2',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 1228.97
    //     }, {
    //         key: '2',
    //         name: '总出线2',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 2568.35
    //     }, {
    //         key: '2-1',
    //         name: '回路2-1',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 2348.32
    //     }, {
    //         key: '2-2',
    //         name: '回路2-2',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 1984.32
    //     }, {
    //         key: '2-2-1',
    //         name: '回路2-2-1',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 3291.32
    //     }, {
    //         key: '2-2-2',
    //         name: '回路2-2-2',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 1292.92
    //     }, {
    //         key: '2-2-3',
    //         name: '回路2-2-3',
    //         Ua: 42323.23,
    //         Ub: 233.31,
    //         Uc: 231.38,
    //         Ia: 235.36,
    //         Ib: 301.32,
    //         Ic: 302.21,
    //         PF: 0.98,
    //         TWP: 125.36,
    //         TRP: 53.36,
    //         TED: 3568.32
    //     }
    // ]

    const getRoomList = async (areaId) => {
        const resp = await distributionRoom.RoomList(projectId, areaId)
        if (resp.success) {
          setRoomList(resp.data)
          if (Array.isArray(resp.data) && resp.data.length > 0) {
            form.setFieldValue('roomId', resp.data[0][['id']])
            setRoomId(resp.data[0][['id']])
           
          } else {
            form.setFieldValue('roomId', [])
            setRoomId(null)
            setTableData([])
    
          }
        }
      }
    const changeArea = (v) => {
        getRoomList(v)
    }
 

   
    const getLinePoint=async(roomId,lineId)=>{
       const res =  await DistributionRoomRuntime.LineRuntimePoints(projectId,roomId,lineId)
       if(res.success){
        if(res.data){
            const dataes = structuredClone(res.data)
            dataes.forEach((it, i) => {
                   if (Array.isArray(it.data)) {
                       it.data.forEach((item, index) => {
                           it[item.name] = item.value
                       })
                   }
    
               })
         
            setTableData(dataes)
        }else{
            setTableData([])
        }
       }else{
        message.error(res.errMsg)
       }
    }
   const  onExport=()=>{
        return {
            list:tableData, 
            total:tableData.length
        }
    }
    const refresh=()=>{
        console.log(selectRef.current.selectedKeys)
        getLinePoint(roomId,selectRef.current.selectedKeys)
    }
    useEffect(()=>{
        const {roomId} = form.getFieldsValue()
        getLinePoint(roomId,0)
    },[roomId])

    return (
        <div>
            <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
                <Form
                    form={form}
                    colon={false}
                    layout="inline"
                    initialValues={{
                        area: oneLevel.length > 0 ? oneLevel[0]?.id : null,
                        roomId: roomlist.length > 0 ? roomlist[0].id : null
                    }}
                >
                    <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
                        <Select 
                        style={{ width: 200 }} 
                        options={oneLevel} 
                        fieldNames={{ label: 'name', value: 'id' }} 
                        onChange={changeArea}
                        placeholder="请选择园区"
                        ></Select>
                    </Form.Item>
                    <Form.Item>
                        <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
                    </Form.Item>
                    <Form.Item name="roomId" >
                        <Select
                            value={roomId}
                            options={roomlist}
                            fieldNames={{ label: 'name', value: 'id' }}
                            style={{ width: 240 }}
                            placeholder="请选择配电房"
                            onChange={(v)=>{
                                setRoomId(v)   
                            }}></Select>
                    </Form.Item>
                </Form>
            </div>
         
            <div className={style.content}>
                <LoopSelect form={form} projectId={projectId} roomId={roomId} ref={selectRef} getLinePoint={getLinePoint}></LoopSelect>
                <div className={style.contentRight}>
                    <div className={style.contentheader}>
                        <BlueColumn name="详细参数"/>
                        <div className={style.buttonList}>
                            <span style={{paddingRight:40,fontSize:16}}>参量采集时间 : 2020-09-03 09:35:21</span>
                            <Button className='refresh' type='primary' icon={<SyncOutlined />} onClick={refresh}>刷新</Button>
                            {/* <Button className='headerButton' type='primary' icon={<UploadOutlined />} >导出</Button> */}
                            <ExportExcel tb={tableRef}/>
                        </div>
                    </div>
                    <div style={{height:16}}></div>
                    <WrapTable>
                    <ContentTable  
                    columns={columns} 
                    tableData={tableData} 
                    tableRef={tableRef} 
                    onExport={onExport}
                    height={
                      630
                      }
                    ></ContentTable>
                 
                    </WrapTable>
                   
                 
                </div>
            </div>
        </div>
    )
}
