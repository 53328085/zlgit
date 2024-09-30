import React, { useState,  useEffect,memo, useRef } from "react";
import moment from "moment";
import styled from "styled-components";
 
 import {Button, Space} from 'antd'
import Titlelayout from '@com/titlelayout'
 
import Ichart  from '@com/useEcharts/Ichart';
 
 

 const Mainbox = styled.div`
 flex:1;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 32px;
 flex-direction: column;
 .wk {
   font-size:24px;
   color: #515151;
 }
  .box {
   width: 50px;
   height: 50px;
   border: 1px solid #ff7313;
   border-radius: 50%;;
    
  }
 `
 
 
 
 
 
 
 
 
export default function Index() {   
  

 const ref=useRef()
  
 const tbref = useRef()
  
const [num, setNum] = useState(100)

const getNum =() => {
   const params = {
      age: num
   }
   console.log('num', params.age)
}

// getBoundingClientRect
const getMessage = function(el, msg) {
   try {
      const div = document.createElement("div");
      const {left, bottom} = el.getBoundingClientRect()
      div.style.cssText=`position: absolute; left: ${left}px; top:${bottom}px`
      div.innerHTML = msg
      document.body.appendChild(div)
      return div
    
   } catch (error) {
      console.log(error)
   }
  
}


 const onMouseDown = (e) => {
  // console.log(e)
 //  e.target.style.position="absolute"

 }
  
const onMouseOver=(e) => {
 //  console.log(e);
   let {clientX, clientY} = e;
  // e.target.style.left = clientX + 'px';
  // e.target.style.top = clientY+'px'
}
 
 const onClick = (e) => {
    Element.prototype.showTag = function() {
      console.log(this.tagName)
    }
    let div = document.createElement('div')
    div.textContent="黑神话悟空"
    div.className="wk"
       let div2 = document.createElement('div')
    div2.textContent="后面的数据"
    const box = document.querySelectorAll(".box")[0];
    box.insertAdjacentElement("beforebegin",div)
 }
 
 
 const clone = () => {
    document.write("<h1>创建标题</h1>")
 }
const getclass = () => {
    ref.current.style.removeProperty("color");
    let sty = getComputedStyle(ref.current);
    console.log(sty.fontSize)
  
}
  
    return (
      <Mainbox>
      <Space>
      <Button onClick={()=> setNum(num+1)}>add</Button>
      <span>num: {num}</span>
      <Button onClick={getNum}>info</Button>
      <Button onClick={clone}>克隆</Button>
      <Button onClick={getclass}>Class</Button>
      </Space>
         <table ref={tbref} id="tablezl">
            <caption>员工信息表</caption>
            
            <thead>
               <tr>
                  <th scope="col">姓名</th>
                  <th>年龄</th>
                  <th>住址</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td scope="row">朱正林</td>
                  <td>46</td>
                  <td>萧山</td>
               </tr>
               <tr>
                  <td>王杰</td>
                  <td>26</td>
                  <td>滨江</td>
               </tr>
            </tbody>
           
         </table>
         <div>前一个元素节点</div>
            前一个节点 
            <div className="box" data-name-age="zhuzl,46" id="mz" style={{color: "#237ae4", fontSize: "16px"}} onMouseDown={onMouseDown} onMouseOver={onMouseOver} onClick={onClick} ref={ref}>{/* 注释的内容 */}
               文本节点
                <span hidden>马来人</span>
            </div>
             后一个节点
             <div>后一个元素节点</div>
            <p style={{color: "#ff7313"}}>node节点</p>

        {/* 注释也是节点 */}
       </Mainbox>
    )
}
