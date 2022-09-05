import React, {useState, useEffect} from 'react'
import {Menu} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import {monitoring, energy} from './menus'

export default function Sider() {
  const [key, Setkey] = useState('outline')
  const menuList = {
    monitoring,
    energy
  }
  const [menus, setMenus] = useState(menuList['monitoring'])
  const [path, setPath] = useState('monitoring')
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    console.log(location)
    let {selectedKeys, path} = location.state
    setPath(path)
    setMenus(menuList[path])
    Setkey(location.state?.selectedKeys) 
  },[location])
  const items = [
    {
      label: '运行概述' ,
      key: "outline",
    
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
    {
      label: "操作日志",
      key: "oplog",
     
  },
   ]
  const onSelect = (e) => {
     let label = items.find(item => item.key == e.key)?.label
     Setkey(e.key)
     navigate(`/index/${path}/` + e.key, {state: {title: label, selectedKeys: e.key, path}})
  }
  console.log(menus)
  return (
    <div> 
      <Menu  onClick={onSelect} selectedKeys={[key]} items={menus}></Menu>
    </div>
  )
}
