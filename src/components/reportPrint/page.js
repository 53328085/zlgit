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
                padding: 0 16px 16px 16px;
                display: grid;
                grid-template-rows: ${({count, rows}) => count ? `repeat(${count}, auto) 1fr` : rows };
                row-gap: 32px;
              }


`

export default function page() {
  return (
    <div>page</div>
  )
}
