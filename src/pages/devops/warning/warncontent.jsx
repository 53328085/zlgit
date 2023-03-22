import React, { useEffect, useState,useRef } from 'react'
import {useSelector} from 'react-redux'
import { Input, Button ,message} from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import UserTable from '@com/useTable'
import { columns } from './columns'
// import { useAntdTable, usePagination } from 'ahooks'
import { operation } from '@api/api'
const { Search } = Input;
export default function Warncontent({ style,areavalue }) {
    const tableRef =useRef()
    const projectId = useSelector(state => state.system.menus.projectId)
    const [tableParam,setTableParam] = useState({
        current:1,
        pageSize:10,  
    })
    const [inpvalue,setInpValue] = useState()
    const [tableData,setTableData] = useState()
    //分页
    const changePage=(page)=>{
        const {current,pageSize}=page
        setTableParam({...page})
        getAlarmPage(current,pageSize)
    }
    const search=()=>{
        setTableParam({ 
            current:1,
            pageSize:10,  
        })
        getAlarmPage(1,10)
    }
    //获取告警信息
    const getAlarmPage=async(pageNum=1,pageSize=10)=>{
        let param = {
            projectId,
            pageNum:pageNum,
            pageSize:pageSize,
            alike:inpvalue?inpvalue:'',
            areaId:areavalue
        }
        const res =  await operation.AlarmPage(param)
        if(res.success){
            setTableData(res.data)
        }else{
            message.error(res.errMsg)
        }
    }
    useEffect(()=>{
        getAlarmPage()
    },[areavalue])

    return (
        <div className={style.WarnContent}>
            <div className={style.SearchContent}>
                {/* <Search
                    placeholder="请输入设备编号/安装地址"
                    allowClear
                    enterButton={<><SearchOutlined />&nbsp; 查询</>}
                    size="default"
                    style={{ width: 356 }}
                /> */}
                <div>
                <span style={{paddingRight:16,}} >告警查询</span>
                <Input
                    style={{
                        width: 356,
                        marginRight:0,
                    }}
                    onChange={(e)=>{setInpValue(e.target.value)}}
                />
                <Button style={{width:80,borderLeft:'none'}}  className={style.searchbtn} onClick={ search }>查询</Button>
                </div>
               
                <Button size='default' style={{ width: 96 }} onClick={tableRef?.current?.download}>导出</Button>
            </div>
            <div style={{ marginTop: 16 ,minHeight:700,display:'flex',justifyContent:'column'}} >
                <UserTable 
                columns={columns} 
                dataSource={tableData} 
                pagination={tableParam}  
                rowKey="sn" 
                ref ={tableRef}
                onChange={changePage}
                ></UserTable>
            </div>

        </div>
    )
}
