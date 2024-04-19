import React, { useState, useMemo, useEffect, useRef } from 'react'
import style from './style.module.less'
import { Typography, message,Space } from 'antd'
import { SyncOutlined, UploadOutlined, RollbackOutlined, SearchOutlined } from '@ant-design/icons';
import LoopSelect from './loopSelect'
import ContentTable from './contentTable';
import LoopDetail from './loopDetail';
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment';
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import { selectcurlRommid, roomId } from "@redux/systemconfig";
//import {Link} from 'react-router-dom'
import {ExportExcel, RefreshButton} from '@com/useButton'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout'
import Pagecount from '@com/pagecontent' 
import UseTable from '@com/useTable'
 
const {Link} = Typography
export default function Index() {
   
    
    const projectId = useSelector(state => state.system.menus.projectId)
    const curid = useSelector(selectcurlRommid)
    const roomIds = useSelector(roomId)
   //  const roomId = [curid]
    const  RoomId = useMemo(() => {
       return  curid==0 ? roomIds?.filter(r => r.id!=0).map(m => m.id) : [curid]
    }, [curid])
    const selectRef=useRef()
    const [tableData,setTableData] =useState([])
    const tableRef=useRef()
    const time = moment().format("YYYY-MM-DD hh:mm:ss")
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
            render: (text, record) => <Link underline  target="blank" href={`/deviceDetail?sn=${record.sn}`}>{text}</Link>
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
                    title: 'Ia(A)',
                    dataIndex: 'Ia',
                    width: 96
                },
                {
                    title: 'Ib(A)',
                    dataIndex: 'Ib',
                    width: 96
                },
                {
                    title: 'Ic(A)',
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
 
   
    const getLinePoint=async(RoomId,lineId)=>{
       const res =  await DistributionRoomRuntime.LineRuntimePoints(projectId,RoomId,lineId)
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
        
        getLinePoint(RoomId,selectRef.current.selectedKeys)
    }
    useEffect(()=>{
         if(RoomId)  getLinePoint(RoomId,0);
    },[RoomId])

    return (
        <Pagecount bgcolor="transparent" pd="0">
            <div className={style.content}>
                <LoopSelect   projectId={projectId} roomId={RoomId} ref={selectRef} getLinePoint={getLinePoint}></LoopSelect>
                <Titlelayout title={<div style={{display: 'flex',alignItems: 'center', justifyContent: 'space-between'}}>
                    <span>详细参数</span>
                    <Space size={4}>
                        <span style={{paddingRight:40,fontSize:16}}>参量采集时间 :{time}</span>
                        <RefreshButton onClick={refresh}>刷新</RefreshButton>
                        <ExportExcel tb={tableRef}/>
                    </Space>
                </div>} layout="flex">
                     <div style={{display: 'flex', flex: 1, paddingTop: '16px'}}>
                    <UseTable 
                    hbg="#f0f9ff" 
                    hbc="#515151"
                    columns={columns} 
                    dataSource={tableData} 
                    ref={tableRef} 
                    onExport={onExport}
                    scroll={{
                        y:630
                    }
                      }
                    ></UseTable>
                 </div>                 
                </Titlelayout>
            </div>
        </Pagecount>
    )
}
