import React, { useState, useMemo, useEffect, useRef } from 'react'
 
import { Typography, message,Space } from 'antd'
 
import LoopSelect from './loopSelect'
 
import { useSelector } from 'react-redux'
import moment from 'moment';
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import { selectcurlRommidl, roomId ,adaptation} from "@redux/systemconfig";
//import {Link} from 'react-router-dom'
import {ExportExcel, CustButtonT} from '@com/useButton'
import styled, {css} from 'styled-components';
import Titlelayout from '@com/titlelayout'
import Pagecount from '@com/pagecontent' 
import UseTable from '@com/useTable'
 
 
const {Link} = Typography
const sty = css`
    grid-template-columns: 265px 1fr;
`
const Mainbox = styled.div`
flex: 1;
display: grid;
grid-template-columns: 265px minmax(1397px,1fr);
column-gap: 16px;
 align-items: stretch;
.tbwrap {
    padding: 16px ;
    width: 100% ;
    background-color: #fff;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
   .ctitle{
     display: flex;
     justify-content: space-between;
     height: 32px;
     margin-bottom: 16px;
     .title {
        display: inline-flex;
        height: 32px;
        padding-left: 16px;
        border-left: 4px solid ${props => props.theme.primaryColor};
        align-items: center;
        color: #515151;
     }
   }
}
${props=> props.laptop ? sty : null}
`
export default function Index() {
   
    
    const projectId = useSelector(state => state.system.menus.projectId)
    const curid = useSelector(selectcurlRommidl)
    const roomIds = useSelector(roomId)    
    const {laptop} = useSelector(adaptation)
    console.log(laptop)
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
             width: 160,
            key: 'lineName'
        }, 
        {
            title:"总分表",
            dataIndex:'type',
            kye: 'type',
            width:80,
            render:(text,record)=><span>{text==1?'总表':'分表'}</span>
        },{
            title:"设备编号",
            dataIndex:'sn',
            width:140,
            key: 'sn',
            render: (text, record) => <Link underline  target="blank" href={`/deviceDetail?sn=${record.sn}`}>{text}</Link>
        },{
            title: '电压',
            children: [
                {
                    title: 'Ua(V)',
                    dataIndex: 'Ua',
                    width: 96,
                    key: 'Ua'
                },
                {
                    title: 'Ub(V)',
                    dataIndex: 'Ub',
                    width: 96,
                    key: 'Ub'
                },
                {
                    title: 'Uc(V)',
                    dataIndex: 'Uc',
                    width: 96,
                    key: 'Uc'
                },
            ]
        }, {
            title: '电流',
            children: [
                {
                    title: 'Ia(A)',
                    dataIndex: 'Ia',
                    width: 96,
                    key: 'Ia'
                },
                {
                    title: 'Ib(A)',
                    dataIndex: 'Ib',
                    width: 96,
                    key: 'Ib'
                },
                {
                    title: 'Ic(A)',
                    dataIndex: 'Ic',
                    width: 96,
                    key: 'Ic',
                },
            ]
        }, {
            title: '功率因数',
            dataIndex: 'phsA',
            width: 85
        }, {
            title: '总有功功率',
            children:[
                {
                    title:'(kW)',
                    width:96,
                    dataIndex: 'Pa',
                    key: 'Pa'
                }
            ]
        },{
            title: '总无功功率',
            
            children:[
                {
                    title:'(kVar)',
                    width:96,
                    dataIndex: 'Q',
                    key: 'Q'
                }
            ]
        },  {
            title: '总能耗', 
            width: laptop ? 96 : "auto",
            children:[
                {
                    title:'(kW·h)',
                    dataIndex: 'EP',
                    key: 'EP'
                }
            ]
        },
    ]
 
   
    const getLinePoint=async(RoomId,lineId)=>{
      
       if(!Number.isInteger(lineId)) return 
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
         console.log('RoomId', RoomId)
         if(Array.isArray(RoomId))  getLinePoint(RoomId,0);
    },[RoomId])
 
    return (
        <Pagecount bgcolor="transparent" pd="0">
            <Mainbox laptop={laptop}>
                <Titlelayout layout="flex" title="回路监测">
                <LoopSelect   projectId={projectId} roomId={RoomId} ref={selectRef} getLinePoint={getLinePoint}></LoopSelect>
                </Titlelayout>
              
                <div className='tbwrap'  >
                    <div className='ctitle'>
                    <span className='title'>详细参数</span>
                    <Space size={4}>
                        <span style={{paddingRight:40,fontSize:16}}>参量采集时间 :{time}</span>
                        <CustButtonT onClick={() => refresh()} src="refresh" text="refresh" /> 
                        <ExportExcel tb={tableRef}/>
                    </Space>
                    </div>
                  
                    <UseTable 
                    hbg="#f0f9ff" 
                    hbc="#515151"
                    columns={columns} 
                    rowKey={row => row.sn}
                    dataSource={tableData} 
                    ref={tableRef} 
                    onExport={onExport}
                    scroll={{
                        y:850
                    }
                      }
                    ></UseTable>
                 
                </div>
            </Mainbox>
        </Pagecount>
    )
}
