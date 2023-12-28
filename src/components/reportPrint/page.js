import React from 'react'
import styled from 'styled-components'
const Pagecont =  styled.div`
    height: 806px;
              display: grid;
              grid-template-rows: 36px 1fr;
              row-gap: 32px;
              background-color: #fff;
              page-break-after: always;
              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: #237ae4;
                color: #fff;
                font-size: 14px;
                padding: 0 16px;
              }
              .main {
                padding: 16px;
              }


`

export default function Page(props) {
  
  return (
    <Pagecont>
       <div className='header'>
          
       </div>
       <div className='main'>
          {props.children}
       </div>
    </Pagecont>
  )
}
