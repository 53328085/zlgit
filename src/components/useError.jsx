import React, { Component, useEffect } from 'react'
import {Button, Empty, Typography, Space} from 'antd'
 import {useErrorBoundary} from 'react-error-boundary'
 import {useLocation} from 'react-router-dom'
 import imgurl from '@imgs';
 import {ReactComponent as Errorpg} from '@svgs/errorpage.svg'
 const {Link, Text, Paragraph} = Typography
 const style = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
 }
export default class ErrorBoundary extends Component {
 constructor(props) {
    super(props);
    this.state = {hasError: false}
 }
 static getDerivedStateFromError(error) {
  
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
   
     console.log(error)
     console.log(errorInfo)
  }
  
  render() {
    if (this.state.hasError) {    
      return <Empty image={<Errorpg />}
         imageStyle={{width: '200px', height: '180px'}}
         style={style}
         description={<Paragraph><Text strong type="warning">抱歉！页面出错</Text><Link  onClick={() => window.location.reload(true)}>尝试下重新加载</Link>或<Link type='primary' ghost onClick={() => window.history.back()}>返回</Link></Paragraph>}
      /> ;
    }

    return this.props.children;
  }
}
 
export function Fallack({error, custmsg}) {
   let {pathname} = useLocation()
  
   
  
   const {resetBoundary} = useErrorBoundary()
  // let error=props.error ?? '抱歉！页面出错'
   let msg =custmsg || "抱歉！页面出错"
   
   useEffect(() => {
     if(!pathname) return
     let errmsg = localStorage.getItem([pathname])
     console.log(errmsg)
     if(error?.message && errmsg !== (error.message+pathname)) {
        localStorage.setItem([pathname], error.message+pathname)
        resetBoundary()
     }
    
   }, [error,pathname])
   return (<Empty image={<Errorpg />}
   imageStyle={{width: '200px', height: '180px'}}
   style={style}
   description={<Paragraph><Text strong type="warning">{msg}</Text><Link  onClick={() => window.location.reload()}>试下刷新</Link></Paragraph>}
   />);
}