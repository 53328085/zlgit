import React from 'react'
import styled from 'styled-components'
import {Button} from "antd"
import {MenuUnfoldOutlined,MenuFoldOutlined} from "@ant-design/icons"
import {useDispatch} from 'react-redux'
import {  configState, siderDesignerMenus, siderRunMenus, getisDistribution, adaptation,sidershow,getsidershow} from "@redux/systemconfig";
const Main =styled.div`
 padding-left: 8px;
 padding-top: ${props => props.show ? "194px" : "0px"};
`
export default function Index({show=true}) {
  console.log(typeof show)
  const dispatch = useDispatch()
  const toggleCollapsed = ()=> {
    dispatch(getsidershow(show))
  }
  return (
    <Main show={show}>
        <Button
        type="primary"
        onClick={toggleCollapsed}
        size="small"
      >
   
       {show ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    
      </Button>
    </Main>
  )
}
