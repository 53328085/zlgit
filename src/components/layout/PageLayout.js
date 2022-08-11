import React from 'react'
import { Layout} from 'antd'
import Copyright from './Copyright'
import style from './index.module.less'
export default function PageLayout(props) {
  const { Header, Footer, Sider, Content } = Layout;
  const CustHeader = () => {
    let Custheader = props.custheader
    if(Custheader) {
      return <Header className={style.header}>{ props.custheader}</Header>
    }
    return null
  }
  const CustContent = () => {
    if(props.sider && props.content) {
      return (
        <Content>
        <Layout>
          <Sider theme='light' width={208} collapsible={true}>{props.sider}</Sider>
          <Content>{props.Content}{props.children}</Content>
        </Layout>
        </Content>
      )
    }
    if(props.content) return <Content className={style.content}>{props.content}</Content>
  }
  return (
    <Layout className={style.pagelayout}>
      <CustHeader/>
      {props.children}
       <Footer className={style.footer}>
          <Copyright />
       </Footer>
    </Layout>
    
  )
}
