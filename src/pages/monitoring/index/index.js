import React, {useEffect, useState} from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import Serach from '@com/useSerach/comhead'
import {useDispatch, useSelector} from 'react-redux'
import {levelDefaultLabel, selectOneLevel, getOnelevel} from '@redux/systemconfig.js' 
export default function Index() {
   const dispatch = useDispatch();
   const location = useLocation()
   let {state={}} = location
   let {nested = '', primary} = state;
   let whole =  ['runtimeMonitor']  // 需要显示搜索 ***（全部）的模块
   const onelevel = useSelector(selectOneLevel)
   const varlabel = useSelector(levelDefaultLabel) 
 const [inpage, setInpage] = useState(['monitor', 'gateway', 'point', 'camera', 'remote', 'control', 'call']) // 需要显示搜索的页面
 const [showRoom, setShowroom] = useState(true) // 是否显示配电房选择框
 
 const [exparams, setexparams] = useState({deviceStyle: 1})
 const [config, setConfig] = useState({
  isdevsty: false, // 表计类型
 })
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
   setConfig,
   exparams
 }
 const props = {
    config,
    setexparams
 }

useEffect(() => {   
  if(whole.includes(primary)) {   
    let  isin = onelevel.find(l => l.id == 0);   
      if(!isin) dispatch(getOnelevel([{name: `${varlabel}(全部)`, id: 0, levelName: varlabel}, ...onelevel]));
  }else {
    let level = onelevel.filter(l => l.id!=0);
    dispatch(getOnelevel([...level]))
  }

}, [primary])

 useEffect(() => {
   setConfig({
    ...config,
    isdevsty: nested=='point',
   })
 }, [nested])
 const {Content } = Layout;   
    return (  
      <Content className='page--main'>
        <div style={style}>
         { showSerach && <Serach  {...props}  />  }
           <Outlet context={context}   />
        </div>
       </Content>
    )
  
}
