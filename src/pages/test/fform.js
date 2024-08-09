import React, {useRef} from 'react'
 import styled from 'styled-components'
 import {useReactToPrint} from 'react-to-print'
 import './print.css'
 import useMatch from './usematch.js'
export default function Index() {
  const ref = useRef()
  const pix = useMatch()
  console.log(pix)
  console.log(window.screen.width)
  const handlePrint = useReactToPrint({
    documentTitle: '打印文档',
    content: () => ref.current,
    bodyClass: '.printt'
 
  })
  return (
    <div style={{flex: 1}}>
       <button onClick={handlePrint}>打印</button>
    <div  className='print' ref={ref}><p>要在打印时让内容居中，可以通过CSS来实现。这通常涉及到设置适当的边距或使用一些特定的CSS属性来确保内容在页面上居中显示。以下是一些方法</p></div>
   
    </div>
  )
}
