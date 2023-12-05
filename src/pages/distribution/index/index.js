import React from 'react'
import {Layout} from 'antd'
import {Outlet, useLocation} from 'react-router-dom'
import Comhead from '../usehead/com'
export default function Index() {
 const {Content } = Layout;    
 const {state} = useLocation()
 let  report = state?.nested === 'report'  // 是否是运行报告页面
    return (  
      <Content className='page--main'>
        <div style={{flex: 1, display: "grid", gridTemplateRows: "48px 1fr", rowGap: "16px"}}>
           <Comhead /> 
           <Outlet/>
        </div>
       </Content>
    )
  
}
