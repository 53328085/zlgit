import React, { useEffect, useState,useRef } from 'react'
import {useSelector} from 'react-redux'
import { Input, Button ,message} from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import UserTable from '@com/useTable'
import BlueColumn from '@com/bluecolumn'
import Modal from '@com/useModal'
import unknow from './imgs/unknow.png'
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
    const [open,setOpen] =useState(false)
    const  columns = [
        {
            title: '最新告警时间',
            dataIndex: 'time',
            key: 'time',
          },
          {
            title: '告警详情',
            dataIndex: 'content',
            key: 'content',
          },
          {
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn',
          },
          {
            title: '设备型号',
            dataIndex: 'category',
            key: 'category',
          },
          {
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '安装地址',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: '操作',
            key: 'option',
            align:'center',
            render:(_,val)=>(
                <span style={{color:'red',textDecoration:'underline',cursor:'pointer'}} onClick={dispatchOrder}>派单</span>
            ),
          },
          {
            title: '设备详情',
            key: 'deteail',
            align:'center',
            render: (_, record) => (
                <a  style={{textDecoration:'underline'}}>详情</a>
            ),
          },
    ]
    //派单
    const dispatchOrder = ()=>{
        setOpen(true)
    }
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
                        width: 290,
                        marginRight:0,
                    }}
                    placeholder="输入设备编号/安装地址"
                    onChange={(e)=>{setInpValue(e.target.value)}}
                />
                <Button style={{width:80,borderLeft:'none',background:'#f5f7fa'}}  className={style.searchbtn} onClick={ search }>查询</Button>
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
            <Modal mold = 'cust' open={open} okText="立即派单" onCancel={()=>{setOpen(false)}}>
                <BlueColumn name="派单提示" styled={{padding: '24px 0'}}/>
                <div style={{margin:'16px 0'}}>
                    <img src={unknow} alt="" style={{margin:'0 16px'}}/>
                    <span>是否要对本告警事件进行派单？</span>
                </div>
            </Modal>
        </div>
    )
}

