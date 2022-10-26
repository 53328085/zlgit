import React from 'react'
import styled from 'styled-components'
 import Userserach from '@com/useSerach'
import Maincontent from './maincontent'
const Pagecontent = styled.div`
    flex:1;
    display: grid;
    grid-template-rows: ${p => p.showserach ? '52px 1fr' : '1fr'};
    row-gap: 16px;
`
export default function Index(props) {
  const {showserach } = props
  return (
    <Pagecontent showserach={showserach}>
      {showserach && <Userserach  /> }
       <Maincontent {...props}></Maincontent>
    </Pagecontent>
  )
}
