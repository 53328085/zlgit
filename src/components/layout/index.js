import React, { useMemo } from 'react'
import { Layout} from 'antd'
import styled from 'styled-components'
import Copyright from './Copyright'
import style from './index.module.less'
import {useSelector} from 'react-redux'
import {  configState,adaptation } from "@redux/systemconfig";
//import Logbg from './logBg.png'
//const Logbg = lazy(() => import("./logBg.png"))
const { Header, Footer, Sider, Content } = Layout;

const Csider = styled(Sider)`
  background-image: ${props => props.isconfig=='true'? 
  `linear-gradient(180deg, rgba(0, 51, 153, 1) 0%, rgba(0, 51, 153, 1) 0%, rgba(0, 51, 51, 1) 100%, rgba(0, 51, 51, 1) 100%)`
   : `linear-gradient(180deg, #0b41c7 0%,  #7662ff 100%)`};
   width: ${props => props.laptop ? '160px' : "200px"} ;
`
const Logheaer = styled(Header)`
&& {
  height: 138px;
  background-color: transparent; 
  padding: 0px;
}

`

export function LoginLayout(props) { // 登录页
 //const bgImg = useMemo(() => Logbg, []);
  
  return( 
  <Layout className={style.pagelayout} style={{backgroundImage: `url(${props.bgImg})`, backgroundSize: 'cover'}}>  
 { props.header &&  <Logheaer>
      {props.header}
    </Logheaer>
    }
    <Content>
      {props.children}
    </Content>  
    <Footer className={[style.footer, props.preview ? style.test : '']}>
        <Copyright />
    </Footer>
   </Layout>
  )
}

export function DefaultLayout(props) { // 默认首页
  const CustSider = (props) => {
    if(props.issider) return   <Sider>{props.sider}</Sider>
    return null
  }
  return (
    <Layout className={style.pagelayout}>
      <Header className={style.header}>{props.custheader}</Header>
      <Content className={style.content}>{props.children}</Content>
    </Layout>
  )
}
export function ProjectLayout(props) { // 项目内容
  const isconfig = useSelector(configState).toString()
  const {laptop} = useSelector(adaptation)
  console.log('taptop',laptop)
  return (
    <Layout className={style.pagelayout}>
     <Csider isconfig={isconfig} laptop={laptop}>{props.custsider}</Csider>
    <Layout>
      <Header className={style.header}>{props.custheader}</Header>
     
      <Content className={style.content}>{props.children}</Content>
     
    </Layout>
    </Layout>
  )
}

// 首页没有sider, header