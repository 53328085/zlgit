import React from 'react'
import styled from 'styled-components'
import {Button} from "antd"
import {MenuUnfoldOutlined,MenuFoldOutlined} from "@ant-design/icons"
import {useDispatch, useSelector} from 'react-redux'
import {  collapsed,pgTitle, getCollapsed } from "@redux/systemconfig";
const CButton = styled(Button)`
&& {
  background-color: rgba(40, 45, 70, ${props=> props.theme.opacity});
   border:  none ;
}
`
const Main =styled.div`
 padding-left: ${props => props.Collapsed ?  "0px" :"8px"};
 height: 24px;
 display: flex;
 justify-content: ${props => props.Collapsed ?  "center" :"space-between"};
 align-items: center;
 width: ${props=>props.collapsed ? "42px" : "auto"};
 .module{
  font-size: 14px;
  color: ${props => props.theme.asiderfontcolor};
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
        <CButton
        type="primary"
        onClick={toggleCollapsed}
        size="small" 
      >
   
       {Collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    
      </CButton>
    </Main>
  )
}
