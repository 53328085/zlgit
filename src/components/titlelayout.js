import React from 'react'
import styled from 'styled-components'
const Boxdiv = styled.div`
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #d7d7d7;
  display: grid;
  grid-template-rows: ${(props) => props.title ? `32px 1fr` : '1fr'};
  flex:1;
  background-color: #fff;
  h4 {
    padding-left: 12px;
    border-left: 4px solid #237ae4;
    display: flex;
    align-items: center;
  }
`
export default function Titlelayout({title='', children}) {
  return (
    <Boxdiv title={title}>
        {title ? (<h4>{title}</h4>) : null}
        {children}
    </Boxdiv>
  )
}
