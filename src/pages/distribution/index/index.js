import React from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import Comhead from '../usehead/com'
export default function Index() {
 const {Content } = Layout;    
 
  
    return (  
      <Content className='page--main'>
        <div style={{flex: 1, display: "grid", gridTemplateRows: "48px 1fr", rowGap: "16px"}}>
           <Comhead /> 
           <Outlet/>
        </div>
       </Content>
    )
  
}
