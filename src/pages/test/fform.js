/* import React from 'react';
import { Translation, useTranslation, Trans } from 'react-i18next';

export   function MyComponent() {
  const {i18n} = useTranslation()
 
  return (
    <div>
     
   
    </div>
  )
}

function Tranocom({person={}, messages}) {
  const { name } = person;
  const count = messages.length;
  const {t} = useTranslation()
  return (
    <Trans i18nKey="userMessagesUnread" count={count} ns="test">
      Hello <h1 title={t('nameTitle')}>{{name}}</h1>, you have {{count}} unread message. <a to="/msgs">Go to messages</a>.
    </Trans>
  );
}
function Rendercom(props) {
  let obj= {
    name: 'zl',
    age: 42,
  }
  return <>

     {props.children(obj)}
  </>
}
let n = null
let fn =() => {
  console.log('null')
}
console.log(Array.isArray(n) &&  fn())
export default function Index() {
   let msg = Array.from({length: 10}, (i, v) => i)
   return (
    <div>
       <MyComponent />
        <Tranocom  person={{name: 'zhuzl'}} messages={msg}/>
    </div>
   )
} */

 /*  import React, { useEffect, useState,useMemo } from 'react'
import {useDispatch, useSelector} from 'react-redux'
 
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
import {getWebsiteMenu, menuAdd, addMany, removeOne,selectIds,selectAll, selectById, allmenus} from "@redux/reduxTest"
import {useSubIndustryListQuery, useSaveItemsMutation,   useTestqQuery,
  useTestmMutation, carbonSlice} from "@redux/carbon.js"
import {CustTransO, i18warning, i18t} from "@com/useButton"

const Sign =({id, name}) => {
  return (
    <div>
      <h1>id: {id}</h1>
      <h2>name: {name}</h2>
    </div>
  )
}
const Com1 =() => {
  const [getline, {isLoading: loading}] = useTestmMutation();

  let {data, isSuccess, isFetching, isLoading,error, isError, refetch} = useTestqQuery() 
   
  let selectdata =  carbonSlice.endpoints.Testq.select()
  
 
  let content;
  if(isLoading) {
    content = <div>isLoading</div>
  }else if(isFetching) {
   // content =<div>isFetching</div>
  }else if(isError) {
    content =<div>{JSON.stringify(error)}</div>
  }else if(isSuccess) {
    content = data.data?.map(d => <Sign {...d} key={d.id}/>)
  }

 
  let name = `zhuzl${Math.random()}`;
  return <div style={{height: "400px", overflowY: "auto"}}>
        <button onClick={() => getline(name)}>添加数据</button>
        <button onClick={() => refetch('zhuzl')}>刷新数据</button>
       <h2>请求的数据</h2>
       <div >
        {content}
        </div>
    </div>
}

const Com2=() => {
 
 
  return <div>
       com2
    </div>
}
export default function Index() {
   const [iscom1, setIscom1] = useState(true)
   const ids =  useSelector(selectIds)
   
   const all = useSelector(selectAll)
   const id = useSelector(state => selectById(state, '011007'))

   const menuses = useSelector(allmenus)
   const [skip, setSkip] = useState(true)
   let {data, isSuccess, isFetching, isLoading,error, isError} = useSubIndustryListQuery('0002', {    
    skip: false,
  }) 
  const sortedData = useMemo(() => {
    if(!Array.isArray(data.data)) return []
    const sorted = data.data.slice()
    sorted.sort((a, b) => a.subIndustryName.localeCompare(b.subIndustryName))
    return sorted
  }, [data])
  let content;
  if(isLoading) {
    content = <div>isLoading</div>
  }else if(isFetching) {
    content =<div>isFetching</div>
  }else if(isError) {
    content =<div>{JSON.stringify(error)}</div>
  }else if(isSuccess) {
    content =<ul> 
      {sortedData.map(s => <li>{s.subIndustryName}</li>)}
    </ul>
  }
 
  return (
    <div>
       <button onClick={() => setIscom1(!iscom1)}>{JSON.stringify(iscom1)}</button>
      
  
       {!iscom1 && <Com1 />}
       {content}
    </div>
  )
}
   */

// 测试各种组件
import { Timeline } from 'antd';
import {IconProvider, IeOutlined} from "@ant-design/icons"
import React from 'react';
const App = () => (
  <Timeline mode='left' >
    <Timeline.Item color='#ff7314' label="2015-09-01">Create a services site</Timeline.Item>
    <Timeline.Item color='green' label="2015-09-01">Solve initial network problems </Timeline.Item>
    <Timeline.Item dot={<IeOutlined />} label="2015-09-01">Technical testing </Timeline.Item>
    <Timeline.Item label="2015-09-01" position='left'>Network problems being solved </Timeline.Item>
  </Timeline>
);
export default App;