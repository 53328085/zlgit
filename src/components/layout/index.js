import React from 'react'
import { Layout} from 'antd'
import Copyright from './Copyright'
import style from './index.module.less'
import Logbg from './logBg.png'
const { Header, Footer, Sider, Content } = Layout;
export function LoginLayout(props) { // 登录页
  return( 
  <Layout className={style.pagelayout} style={{backgroundImage: `url(${Logbg})`, backgroundSize: 'cover'}}>  
    <Content>{props.children}</Content>  
    <Footer className={style.footer}>
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
  return (
    <Layout className={style.pagelayout}>
     <Sider>{props.custsider}</Sider>
    <Layout>
      <Header className={style.header}>{props.custheader}</Header>
      <Content className={style.content}>{props.children}</Content>
    </Layout>
    </Layout>
  )
}
/* export default function PageLayout(props) {
  const { Header, Footer, Sider, Content } = Layout;
  const CustHeader = () => {
    let Custheader = props.custheader
    if(Custheader) {
      return <Header className={style.header}>{ props.custheader}</Header>
    }
    return null
  }
  const CustSider = (props) => {
    if(props.sider) return   <Sider>{props.sider}</Sider>
    return null
  }

  
  if(props.isheader) {
    return (
      <Layout className={style.pagelayout}>
      <CustSider></CustSider>
      <Layout>
        <Header className={style.header}>{props.custheader}</Header>
        <Content className={style.content}>{props.children}</Content>
      </Layout>
    </Layout>
   )
    
  }else if(props.login) { // 登录页
    return (
      <Layout className={style.pagelayout}>
    
       <Content>{props.children}</Content>  
       <Footer className={style.footer}>
          <Copyright />
       </Footer>
    </Layout>
    )
  }
  const LoginLayout = (
    <Layout className={style.pagelayout}>
  
        <Content>{props.children}</Content>  
        <Footer className={style.footer}>
            <Copyright />
        </Footer>
    </Layout>
  )

} */
// 首页没有sider, header