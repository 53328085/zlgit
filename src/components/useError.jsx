import React, { Component } from 'react'
import {Button, Empty, Typography, Space} from 'antd'
 import {useErrorBoundary} from 'react-error-boundary'
 import imgurl from '@imgs';
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
      return <Empty image={imgurl.error}
         imageStyle={{width: '200px', height: '180px'}}
         style={style}
         description={<Paragraph><Text strong type="warning">抱歉！页面出错点击</Text><Link  onClick={() => window.location.reload(true)}>刷新</Link>或<Link type='primary' ghost onClick={() => window.history.back()}>返回</Link></Paragraph>}
      /> ;
    }

    return this.props.children;
  }
}

export function Fallack({error}) {
   const {resetBoundary} = useErrorBoundary()
   return <Empty image={imgurl.error}
   imageStyle={{width: '200px', height: '180px'}}
   style={style}
   description={<Paragraph><Text strong type="warning">抱歉！页面出错点击</Text><Link  onClick={resetBoundary}>刷新</Link></Paragraph>}
   /> ;
}