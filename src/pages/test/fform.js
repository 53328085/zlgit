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

/*   import React, { useEffect, useState,useMemo } from 'react'
import {useDispatch, useSelector} from 'react-redux'
 
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
import {getWebsiteMenu, menuAdd, addMany, removeOne,selectIds,selectAll, selectById, allmenus} from "@redux/reduxTest"
import {useSubIndustryListQuery, useSaveItemsMutation,   useTestqQuery,
  useTestmMutation, carbonSlice} from "@redux/carbon.js"
import {CustTransO, i18warning, i18t} from "@com/useButton"

const Sign =({id, label}) => {
  return (
    <div>
      <h1>id: {id}</h1>
      <h2>label: {label}</h2>
    </div>
  )
}
const Com1 =() => {
  const [getline, {isLoading: loading}] = useTestmMutation();
  const [projectId, setProjectId] = useState(3)
  let {data, isSuccess, isFetching, isLoading,error, isError, refetch} = useTestqQuery(projectId, {
    skip: !Number.isInteger(projectId),
    refetchOnMountOrArgChange: true
  }) 
  const onchange = (e) => {
    let id = parseInt(e.target.value);
    setProjectId(id);
  }
  console.log('isFetching:',isFetching) // 
  console.log('isLoading:',isLoading)
  console.log('isSuccess:',isSuccess)
  console.log(data)
  let content;
  if(isLoading) {
    content = <div>isLoading</div>
  }else if(isFetching) {
   // content =<div>isFetching</div>
  }else if(isError) {
    content =<div>{JSON.stringify(error)}</div>
  }else if(isSuccess) {
    content = data?.data?.menus?.map(d => <Sign {...d} key={d.id}/>)
  }

 
  let name = `zhuzl${Math.random()}`;
  return <div style={{height: "400px", overflowY: "auto"}}>
        <button onClick={() => getline(name)}>添加数据</button>
        <button onClick={refetch}>刷新数据</button>
        <input type="number" onChange={onchange}></input>
       <h2>请求的数据</h2>
       <div >
        {content}
        </div>
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
    if(!Array.isArray(data?.data)) return []
    const sorted = data?.data?.slice()
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
} */
 

// 测试各种组件
/* import { Timeline } from 'antd';
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
export default App; */


// 测试react API
/* import React, {useState,memo,useMemo, useTransition} from 'react'

const Test=memo(({data}) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <h3>{data}</h3>
    </div>
  )
})
const Test2=memo(({persons, age}) => {
   
 
  return (
    <div>
      <ul>
        {persons.map(p => (<li>name:{p.name} age: {p.age}</li>))}
      </ul>
    </div>
  )
})
const Per= ({p}) => {
  return <li>name: {p.name}, age: {p.age} 时间：{p.time}</li>
}
function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}
function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}

const PostsTab = memo(function PostsTab() {
  // 打印一次。真正变慢的地方在 SlowPost 内。
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();

  while (performance.now() - startTime < 5) {
    console.log(performance.now())
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}

export default function Index() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    console.log(nextTab)
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <div>
    <div style={{display: "flex", backgroundColor: "#ccc", height: "40px"}}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
  
    </div>
    <div style={{width: "600px", height: "400px"}}>
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
      </div>
    </div>
  );
} */

import { useState } from 'react';
import useInput from './useInput';
export default function Index() {
  const firstprops = useInput('zl')
  const lastprops = useInput('zhu')
  return (
    <>
      <label>
        First name:
        <input  {...firstprops} />
      </label>
      <label>
        Last name:
        <input  {...lastprops} />
      </label>
      <p><b>Good morning, {firstprops.value} {lastprops.value}.</b></p>
    </>
  );
}
