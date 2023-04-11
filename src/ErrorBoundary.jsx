import React, { Component } from 'react'
import {Alert, Space, Typography, Button} from 'antd'
let {Text} = Typography
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
      return <Alert message="Error" type="error" description='页面加载失败'> </Alert>;
    }

    return this.props.children;
  }
}
