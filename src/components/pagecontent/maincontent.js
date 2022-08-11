import React  from 'react'
import {Radio, Tabs} from 'antd'
export default function maincontent(props) {
 const {tabs, value, setvalue} = props
 const onChange = (key) => {
     setvalue(key)
 }
 const TabsEl = () => {
     if (!tabs) return null  
     const {TabPane} = Tabs
     return (
        <Tabs  onChange={onChange} activeKey={value} type="card" >
            {tabs.map(t => <TabPane tab={t.label} key={t.value}></TabPane>)}
        </Tabs>
     )
 } 
  return (
    <div>
        <TabsEl></TabsEl>
        {props.children}
    </div>
  )
}
