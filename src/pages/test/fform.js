import React, { useState, useEffect, memo, useRef } from "react";
import  {flushSync} from 'react-dom'
import {nanoid} from "@reduxjs/toolkit"
import moment from "moment";
import styled from "styled-components";

import { Button, Space, Row, Col, Divider } from "antd";
import Titlelayout from "@com/titlelayout";

import Ichart from "@com/useEcharts/Ichart";

const Mainbox = styled.div`
  flex: 1;

  position: relative;
  .scroll { 
    border: 25px solid #e8c48f;
    padding: 20px;  
  }
`;
let list =  Array.from({length: 10}, (_, index) => ({id: index, text: `text${index}`}))
let todos = Array.from({length: 20}, (_,index) => ({id: index + 1, text: "待办事项"+(index+1)}))
export default function Index() {
  const ref = useRef();
  const uref=useRef()
  const listRef = useRef(null)
  const [todoes, setTodoes] = useState(todos)
  const getMap = () => {
    if(!listRef.current) {
      return listRef.current = new Map()
    }
    return listRef.current
  }
  const getText =() => {
    const li = listRef.current.get(1)
    console.log(li.textContent)
  }
  const [el, setEl] = useState(null);
  const onExpend = () => {
   ref.current.style.height = `${ref.current.scrollHeight + 50}px`
    
  }
  const onRefsh =() => {
   setEl(ref.current)
   
  }
  const addto =() => {
    let  id =  new Date().getTime()
    flushSync(() => {
      setTodoes([ ...todoes,{id, text: "待办事项"+id}]);
    })
  
    uref.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }
  const inref = useRef()
  const y =useRef(0)
  const hanlderscroll =() => {
    console.log('scrollTop',ref.current.scrollTop)
    console.log('clientHeight', ref.current.clientHeight)
    if (ref.current.scrollTop >= ref.current.clientHeight) {
      // inref.current.style.transform="translateY(0px)"
      ref.current.scrollTop=0
    }else {
       ref.current.scrollTop+=10
      
    }
  }
  let timer = useRef()
  const nosc = () => {
     console.log(timer)
     console.log('scrollTop',ref.current.scrollTop)
     clearInterval(timer.current)
  }
  useEffect(() => {
   //setEl(ref.current);
   ref.current.addEventListener('click',function(e) {
    
    console.log('捕获阶段事件')
   }, {capture: true})
  }, []);
 
  return (
    <Mainbox>
      <Divider>offset</Divider>
      <Space size={8}>
        <div span={4}>offsetParent: {el?.offsetParent?.toString()}</div>
        <div span={4}>offsetTop: {el?.offsetTop}</div>
        <div span={4}>offsetLeft: {el?.offsetLeft}</div>
        <div span={4}>offsetHeight: {el?.offsetHeight}</div>
        <div span={4}>offsetWidth: {el?.offsetWidth}</div>
      </Space>
      <Divider>client</Divider>
      <Row gutter={8}>
        <Col span={4}>clientTop: {el?.clientTop}</Col>
        <Col span={4}>clientLeft: {el?.clientLeft}</Col>
        <Col span={4}>clientWidth: {el?.clientWidth}</Col>
        <Col span={4}>clientHeight: {el?.clientHeight}</Col>
      </Row>
      <Divider>SCROLL</Divider>
      <Row gutter={8}>
        <Col span={4}>scrollTop: {el?.scrollTop}</Col>
        <Col span={4}>scrollLeft: {el?.scrollLeft}</Col>
        <Col span={4}>scrollWidth: {el?.scrollWidth}</Col>
        <Col span={4}>scrollHeight: {el?.scrollHeight}, 是内容区域的完整内部高度</Col>
      </Row>
      <div style={{padding: "30px"}}>
      <div ref={ref} style={{position: 'relative', overflow: 'auto', height: '200px', width: '300px', margin: "auto", border: "1px solid #ff7313"}} >
        <div ref={inref}   className="scroll">
        <p>
          这里没有水平滚动条，所以它恰好是 border 内的总和：CSS-height 200px
          加上顶部和底部的 padding（2 * 20px），总计 240px。
        </p>
        <p>
          现在 clientWidth —— 这里的 “content width” 不是 300px，而是
          284px，因为被滚动条占用了 16px。所以加起来就是 284px 加上左侧和右侧的
          padding，总计 324px。
        </p>
        <p>
          如果这里没有 padding，那么 clientWidth/Height 代表的就是内容区域，即
          border 和 scrollbar（如果有）内的区域。
        </p>
        <p>
          现在 clientWidth —— 这里的 “content width” 不是 300px，而是
          284px，因为被滚动条占用了 16px。所以加起来就是 284px 加上左侧和右侧的
          padding，总计 324px。
        </p>
        <p>
          如果这里没有 padding，那么 clientWidth/Height 代表的就是内容区域，即
          border 和 scrollbar（如果有）内的区域。
        </p>
        </div>
      </div>
      </div>
      <Space>
         <Button onClick={onExpend}>扩展</Button>
         <Button onClick={onRefsh}>刷新</Button>
         <Button onClick={getText}>获取文本</Button>
         <Button onClick={addto}>新增待办事项</Button>
         <Button onClick={nosc}>取消滚动</Button>
      </Space>
      <ul key="ut">
         {
            list.map(l => <li key={nanoid()} ref={(node) => {
               let map = getMap()
               map.set(l.id, node)
               return () => {
                  map.delete(l.id)
               }
              
            }}>{l.text}</li>)
         }
      </ul>
      <ul ref={uref} style={{height: "300px", overflow: "auto"}}>
            {todoes.map(d => <li key={d.id}>{d.text}</li>)}
      </ul>
    </Mainbox>
  );
}
