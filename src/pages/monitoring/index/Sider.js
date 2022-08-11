import React, {useState} from 'react'
import {Menu} from 'antd'
import {AppstoreOutlined} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'


export default function Sider() {
  const [key, Setkey] = useState('default')
  const navigate = useNavigate()
  const items = [
    {
      label: '运行概述' ,
      key: "default",
    
    },
    {
      label: '测点监测',
      key: "point",
    },
    {
      label: "网关监测",
      key: "gateway",
    },
    {
        label: "远程控制",
        key: "remote",
       
    },
    {
        label: "视频监控",
        key: "video",
      
    },
    {
        label: "告警监控",
        key: "warning",
       
    },
    {
        label: "配电系统图",
        key: "electrica",
       
    },
    {
        label: "损耗分析",
        key: "loss",
       
    },
    {
        label: "用户报告",
        key: "report",
       
    },
   ]
  const onSelect = (e) => {
    Setkey(e.key)
     navigate(e.key=='default' ? 'monitoring' : e.key)
  }
  return (
    <div> 
      <Menu  onClick={onSelect} selectedKeys={[key]} items={items}></Menu>
    </div>
  )
}
