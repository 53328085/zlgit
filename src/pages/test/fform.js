import React from 'react'
import styled from 'styled-components'
const Printbox = styled.div`
  height: 400px;
 
  h1 {
    color: #69c0ff;
  }
  .pagebreak {
    page-break-after: always;
  }
`
export default function Index() {
  return (
    <div>
      
          <nav>
            <h1>你好</h1>
            <h2>哈喽</h2>
          </nav>
          <h1>第一页</h1>
          <p >
            <a href='http://www.sina.com.cn'>新浪</a>
          </p>
          <hr className='pagebreak' /> 
          <h1>第二页</h1>
         
          <hr className='pagebreak' /> 
          <h1>第三页</h1>
         <button onClick={() => window.print()}>print</button>
       
    </div>
  )
}
