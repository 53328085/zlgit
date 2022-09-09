import React from 'react'
import { Input, Button, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import style from './style.module.less'
import { useNavigate } from 'react-router-dom'
export default function Searchbtn(props) {
    const {Option} =Select
    const {brake,setbrake,switching,setswitching} =props
    const navigate = useNavigate()
    const btnstyle = {
        width: '96px',
        fontSize: '14px',
        backgroundColor: '#237ae4',
    }
    const fenzha=()=>{
        setbrake(!brake)
    }
    const hezha=()=>{
        setswitching(!switching)
    }
    const log=()=>{
        navigate('/index/monitoring/oplog')
    }
    return (
        <>
          <Input.Group className={style.searchbtn}>
            <Select style={{ width: 120  }} size='default' placeholder="全部类型">
                <Option value="1">电表</Option>
                <Option value="2">水表</Option>
                <Option value="3">燃气表</Option>
            </Select>
            <Input   style={{ width: 260,height: 32,fontSize: 14}} placeholder="请输入设备编号/安装地址" />
            <Button type="primary" icon={<SearchOutlined />} style={btnstyle} size="default">查询</Button>
            <div className={style.line}></div>
           
        </Input.Group>
        <Input.Group className={style.searchbtn}>
        <Button type="primary" style={btnstyle} size="default">实时抄读</Button>
            <div className={style.line}></div>
            <Button type="primary" danger style={{ ...btnstyle, marginRight: 16, backgroundColor: '#f56c6c' }} size="default" onClick={fenzha}>分闸</Button>
            <Button type="primary" danger style={{ ...btnstyle, backgroundColor: '#f56c6c' }} size="default" onClick={hezha}>合闸</Button>
            <div className={style.line}></div>
            <Button type="primary" style={btnstyle} size="default" onClick={log}>操作日志</Button>
        </Input.Group>
        </>
      

    )
}
