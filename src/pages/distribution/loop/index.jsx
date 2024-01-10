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
import { selectcurlRommid } from "@redux/systemconfig";
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
   
    
    const projectId = useSelector(state => state.system.menus.projectId)
    const roomId = useSelector(selectcurlRommid)
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
            dataIndex: 'phsA',
            width: 95
        }, {
            title: '总有功功率',
            children:[
                {
                    title:'(kW)',
                    width:96,
                    dataIndex: 'Pa',
                }
            ]
        },{
            title: '总无功功率',
            children:[
                {
                    title:'(kVar)',
                    width:96,
                    dataIndex: 'Q',
                }
            ]
        },  {
            title: '总能耗',
            children:[
                {
                    title:'(kW·h)',

                    dataIndex: 'EP',
                }
            ]
        },
    ]
 
   
    const getLinePoint=async(roomId,lineId)=>{
       const res =  await DistributionRoomRuntime.LineRuntimePoints(projectId,roomId,lineId)
       if(res.success){
        if(res.data){
            const dataes = structuredClone(res.data)
            dataes.forEach((it, i) => {
                   if (Array.isArray(it.data)) {
                       it.data.forEach((item, index) => {
                           it[item.alias] = item.value
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
         if(roomId)  getLinePoint(roomId,0);
    },[roomId])

    return (
        <div>
            <div className={style.content}>
                <LoopSelect   projectId={projectId} roomId={roomId} ref={selectRef} getLinePoint={getLinePoint}></LoopSelect>
                <div className={style.contentRight}>
                    <div className={style.contentheader} key="d">
                        <BlueColumn name="详细参数"/>
                        <div className={style.buttonList}>
                            <span style={{paddingRight:40,fontSize:16}}>参量采集时间 : 2020-09-03 09:35:21</span>
                            <Button className='refresh' type='primary' icon={<SyncOutlined />} onClick={refresh}>刷新</Button>
                            {/* <Button className='headerButton' type='primary' icon={<UploadOutlined />} >导出</Button> */}
                            <ExportExcel tb={tableRef}/>
                        </div>
                    </div>
                    <div style={{height:16}} key="e"></div>
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
