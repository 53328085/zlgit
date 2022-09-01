import React, {useContext}  from 'react'
import {Tabs} from 'antd'
import CustContext from '../content'
import  './style.less'

export default function Maincontent(props) {
 const {tabs, value, setvalue} = useContext(CustContext)
 //const {tabs, value, setvalue} = props
 const tabstyl = {
     background: '#237ae4',
     color: '#fff'
 }
 const onChange = (key) => {
     setvalue(key)
 }
 const TabsEl = () => {
     if (!tabs) return null  
     const {TabPane} = Tabs
     return (
        <Tabs  onChange={onChange} activeKey={value} animated tabBarGutter={16} type="card" id='custTab'>
            {tabs.map(t => <TabPane tab={t.label} key={t.value} className='custTabPane'></TabPane>)}
        </Tabs>
     )
 } 
  return (
    <div className='page--content--box'>
        <TabsEl></TabsEl>
        <div className='page--content--main'>{props.children}</div>
    </div>
  )
}
