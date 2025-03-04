import React from 'react'
import styled from 'styled-components'
import {Button} from "antd"
import {MenuUnfoldOutlined,MenuFoldOutlined} from "@ant-design/icons"
import {useDispatch, useSelector} from 'react-redux'
import {  collapsed,pgTitle, getCollapsed } from "@redux/systemconfig";
const Main =styled.div`
 padding-left: ${props => props.Collapsed ?  "0px" :"8px"};
 height: 24px;
 display: flex;
 justify-content: ${props => props.Collapsed ?  "center" :"space-between"};
 align-items: center;
 .module{
  font-size: 14px;
  color:#fff;
  font-weight: bold;
 }
 //padding-top: ${props => props.show ? "194px" : "0px"};
`
export default function Index() {
  const Collapsed = useSelector(collapsed)
  const PgTitle = useSelector(pgTitle)
   
  const dispatch = useDispatch()
  const toggleCollapsed = ()=> {
    dispatch(getCollapsed(!Collapsed))
  }
  return (
    <Main Collapsed={Collapsed}>
       {!Collapsed && <span className='module'>{PgTitle}</span>}  
        <Button
        type="primary"
        onClick={toggleCollapsed}
        size="small"
        style={{backgroundColor: "rgba(40, 45, 70, 1)" ,border: "none"}}
      >
   
       {Collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    
      </Button>
    </Main>
  )
}
