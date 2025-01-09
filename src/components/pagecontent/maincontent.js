import React, {useContext, useEffect, useMemo, useState}  from 'react'
import {useSearchParams, useLocation, useNavigate} from 'react-router-dom'
import {Tabs} from 'antd'
import CustContext from '../content'

import styled from 'styled-components'
 
const Tabsbox = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 0px;
    max-width: inherit;
  //  width:  calc(100vw - 220px);
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 41px;
        min-width: ${props => props.tabwidth || '145px'} ;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;  
        transition: none;
        &:hover {
            background-color: ${props => props.theme.primaryColor || "#237ae4" };
            color: #fff;
            transition: all 0.3s;
        }
        .ant-tabs-tab-btn{
            transition: none;
        }
        .ant-tabs-tab-btn:active {
            color:#fff
        }
    }
    .ant-tabs-tab.ant-tabs-tab-active {
        background-color: ${props => props.theme.primaryColor || "#237ae4" };
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: none;
        }
    }
   }  
 
}
`
const Pagecontentbox = styled.div`
    /* display: flex;
    flex-direction: column;
    flex: ${p => p.beTabs ? '41px 1' :  1}; */
    display: grid;
    grid-template-rows: ${p => p.beTabs ? '41px 1fr' :  '1fr'};
`
/* 
 // custserach 自定义搜索

*/
const PageContentMain = styled.div`  
    background-color: ${props => props.bgcolor};
    padding: ${props => props.pd};
    display: flex;
    flex-direction: column;
    position: relative;
   // flex: 1;
 
  /*   height:  ${props => {
         let {showserach, beTabs, custserach} = props 
         if (showserach || custserach) return beTabs ? '764px' : '805px'
         if (!showserach && !custserach) return beTabs ? '832px' : '873px'
       
          
    }};  */
    overflow-y: auto;
    & .flexcol {
         flex: 1;
        display: flex;
        flex-direction: column;
    }
`

PageContentMain.defaultProps = {
    pd: "16px",
    bgcolor: "#fff"
}
export default function Maincontent(props) {
    const [searchParams, setSearchParams] = useSearchParams()
 
    const location = useLocation()
   
    
    const navigate = useNavigate()
    const {tabs, value, setvalue, tabwidth, tabgap, initialval=null} = useContext(CustContext) || {}
    const beTabs = useMemo(() => Array.isArray(tabs) && tabs.length > 0, [tabs])
    //const {tabs, value, setvalue} = props
    const [defaultTab, setDefaultTab] = useState(value)
    const [pathName, setPathName] = useState()
    const [urlstate, setUrlstate] = useState()

 const onChange = (key) => {  
    
    setvalue(key)
    setDefaultTab(key)
    let {search} = location || {}
  
    let query =search ? new URLSearchParams(search) : new URLSearchParams()
   
    if(query?.has('item')) {
        query?.set('item', key)
    }else {
        query?.append('item', key)
    }
  
  
  navigate(`${pathName}?${query.toString()}`, {state: urlstate})
 }

useEffect(() => {   
    
    let {pathname, state, search} = location
    let query =search ? new URLSearchParams(search) : new URLSearchParams()
    let isItem = query.has('item')
    let param = query.get('item')
    setPathName(pathname)
    setUrlstate((s) => ({...s, ...state}))
   
    
   
    if((Number.isInteger(parseInt(initialval)) || initialval) &&isItem) {
         let obj = {}
         for(let [key, val] of query?.entries()) {
            obj[key] = val
         }
         obj['item'] = initialval
        
        setvalue(initialval)
        setDefaultTab(initialval)
        setSearchParams({...obj})
        // console.log(query)
       // setSearchParams(query)
    }else if(param) {       
        if(setvalue && tabs?.length > 0) {
            setvalue(param)
            setDefaultTab(param)
        }      
       
    }
}, [location.pathname, setvalue, initialval])
 const TabsEl = () => {   
  //   if (!beTabs) return null    
     return (
      <Tabsbox  
        onChange={onChange} 
        defaultActiveKey={defaultTab} 
        animated 
        tabPosition="top"
        tabBarGutter={tabgap || 16} 
        tabwidth={tabwidth} 
        tabgap ={tabgap}
        type="card"
         items={tabs}
        >
        </Tabsbox>
     )
 } 
 let {minw=true} = props
 let minsty = minw ? {overflow: "hidden", minWidth: "1024px"} : null
  return (
    <Pagecontentbox beTabs={beTabs}> 
      {beTabs ? <div style={minsty}>
       <TabsEl ></TabsEl>
        </div> 
        :null
}
        <PageContentMain   beTabs={beTabs}  {...props}>
          {props.children}
        </PageContentMain>
    </Pagecontentbox>
  )
}
