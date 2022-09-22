import React, {useState, useEffect} from 'react'
import {Menu, Image} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import styled from 'styled-components'
import {monitoring, energy, devops, electric, distribution} from './menus'
import style from './style.module.less'
import Title from '../header/title'
import energyicon from '@imgs/energy.png'
const Imgbox = styled.div`
   padding: 20px 0 16px 0;
   border-bottom: 1px dotted #ffff;
   margin: 0 8px 20px 8px;
`
const Showimg = () => {
  return (
    <Imgbox>  <Image src={energyicon} preview={false} style={{border: '1px solid #fff'}} /></Imgbox>
   )
}
const Sdiv = styled.div`
   display: flex;
   flex-direction: column;
   padding-top:16px;
`
const Cmenu = styled(Menu)`
   background: none;
   .ant-menu-item {
     padding-left: 32px;
     display: flex;
     align-items: center;
   }
   .custicon {
    font-size: 16px;
    color:#fff;
   }
   .ant-menu-item.ant-menu-item-selected{    
      background-color: #3333cc;
      .ant-menu-title-content, .custicon {
        color:#33FF00;
      }
    }
   .ant-menu-title-content {
     color:#fff;
     display: inline-block;   
     padding-left: 32px;
   }
`
export default function Sider() {
  const [key, Setkey] = useState('outline')
  const menuList = {
    monitoring,
    energy,
    devops,
    electric,
    distribution
  }
  const [menus, setMenus] = useState(menuList['monitoring'])
  const [path, setPath] = useState('monitoring')
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    console.log(location)
    let {selectedKeys, path} = location.state || {selectedKeys: 'outline', path: '/index'}
    setPath(path)
    setMenus(menuList[path])
    Setkey(location.state?.selectedKeys) 
  },[location])

  const onSelect = (e) => {
    console.log(e)
     let label = menuList[path]?.find(item => item.key == e.key)?.label
     Setkey(e.key)
     navigate(`/index/${path}/` + e.key, {state: {title: label, selectedKeys: e.key, path}})
  }
 
  return (
    <Sdiv> 
       <Title/>
       <Showimg/>
       <Cmenu  onClick={onSelect} selectedKeys={[key]} items={menus} className={style.custmenu}></Cmenu>
    </Sdiv>
  )
}
