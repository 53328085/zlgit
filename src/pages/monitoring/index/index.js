import React, {useState} from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import Serach from '@com/useSerach/comhead'
export default function Index() {
   const location = useLocation()
   let {state={}} = location
   let {nested = '', primary} = state;
 
 console.log(location)
 const [inpage, setInpage] = useState(['monitor', 'gateway'])
 const [showRoom, setShowroom] = useState(true) // 是否显示配电房选择框
 const [isall, setIsall] =useState('visible')
 let showSerach =  inpage.includes(nested)
 let style = showSerach ? {
  flex: 1, display: "grid", gridTemplateRows: "48px 1fr", rowGap: "16px"
 }: {
  display: 'flex',
  flex: 1,
 }
 const context ={
   setInpage,
   setShowroom,
   setIsall,
 }
 const {Content } = Layout;   
    return (  
      <Content className='page--main'>
        <div style={style}>
         { showSerach && <Serach isall={isall} /> }
           <Outlet context={context} />
        </div>
       </Content>
    )
  
}
