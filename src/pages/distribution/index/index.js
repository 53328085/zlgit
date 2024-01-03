import React from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import Comhead from '../usehead/com'
import {useLocation} from 'react-router-dom'
export default function Index() {
   const location = useLocation()
   let {state={}} = location
   let {nested = ''} = state;
   let show = nested !== 'report'
   let style = show ? {
    flex: 1, display: "grid", gridTemplateRows: "48px 1fr", rowGap: "16px"
   }: {
    display: 'flex',
    flex: 1,
   }
 const {Content } = Layout;   
    return (  
      <Content className='page--main'>
        <div style={style}>
         { show && <Comhead /> }
           <Outlet/>
        </div>
       </Content>
    )
  
}
