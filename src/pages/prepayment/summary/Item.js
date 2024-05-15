import React from 'react'
import styled from 'styled-components'
const Itembox =styled.div` 
    border-radius: 4px;
    display: grid;
    grid-template-rows: 32px 1fr;
    box-shadow: 0px 1px 2px rgb(0 0 0 / 35%);
    .itemTitle {
      background-color: ${props => props.theme.primaryColor};
      padding: 0 16px;
      color: #fff;
      display: flex;
      align-items: center;
    }
    .itemContent {
      display: flex;
      flex:1;
      padding: 8px;
      background-color: #fff;
    }
 
`
export default function Item({title, children}) {
  return (
    <Itembox>
        <div className='itemTitle'>{title}</div>
            {children}
    </Itembox>
  )
}
