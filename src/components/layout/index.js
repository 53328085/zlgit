import React, { useMemo, useState } from 'react'
import { Layout, Button} from 'antd'
import styled from 'styled-components'
import Copyright from './Copyright'
import style from './index.module.less'
import {useSelector} from 'react-redux'
import {hextodec} from '@com/usehandler'
import {  configState,adaptation,sidershow,themeColor,getCollapsed,collapsed } from "@redux/systemconfig";


//import ShowAside from "@com/showsider"
//import Logbg from './logBg.png'
//const Logbg = lazy(() => import("./logBg.png"))
const { Header, Footer, Sider, Content } = Layout;

const Cheader =styled(Header)`
 &&{
  display: flex;
    align-items: center;
    padding: 0px;
    background-color: ${props => props.theme.menusbgcolor || '#003366'};
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid rgba(${props=> props.rgb[0]}, ${props=> props.rgb[1]}, ${props=> props.rgb[2]}, 0.6);
    
 }
`

const Csider = styled(Sider)`
  background-image: ${props => props.isconfig=='true'? 
  `linear-gradient(180deg,  ${props.theme.desasiderstart || '#039'} 0%,  ${props.theme.desasiderend || '#033'} 100%)`
   : `linear-gradient(180deg, ${props.theme.runasiderstart || '#0b41c7'} 0%,  ${props.theme.runasiderend || '#7662ff'} 100%)`};
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
/*   const CustSider = (props) => {
    if(props.issider) return   <Sider>{props.sider}</Sider>
    return null
  } */
 let rgb = hextodec("#C9CDD6")
  return (
    <Layout className={style.pagelayout}>
      <Cheader rgb={rgb}>{props.custheader}</Cheader>
      <Content className={style.content}>{props.children}</Content>
    </Layout>
  )
}
export function ProjectLayout(props) { // 项目内容
  const isconfig = useSelector(configState).toString()
  const {laptop} = useSelector(adaptation)
  const siderdisplay = useSelector(sidershow)
  const Collapsed = useSelector(collapsed)
//  const [collapsed, setCollapsed] = useState(true)
let rgb = hextodec("#C9CDD6")
  return (
    <Layout className={style.pagelayout}>
    {
   /*    siderdisplay ? 
     <Csider isconfig={isconfig} laptop={laptop}>{props.custsider}</Csider>
     : <Sider width={48}><ShowSide show={true} /> </Sider> */
    
  }
   <Csider isconfig={isconfig} laptop={laptop} trigger={null} collapsible collapsed={Collapsed} collapsedWidth={54}>    
    {props.custsider}
    </Csider>
    <Layout>
      <Cheader rgb={rgb}>{props.custheader}</Cheader>
     
      <Content className={style.content}>{props.children}</Content>
     
    </Layout>
    </Layout>
  )
}

// 首页没有sider, header