import React from 'react'
import styled from 'styled-components'
 import Userserach from '@com/useSerach'
import Maincontent from './maincontent'
const Pagecontent = styled.div`
    flex:1;
    display: grid;
    grid-template-rows: ${p => p.showserach ? '48px 1fr' : '1fr'};
    row-gap: 16px;
    ${p=> p.custsty};
`
export default function Index(props) {
  const {showserach, custsty,...rest } = props
  return (
    <Pagecontent showserach={showserach} custsty={custsty}>
      {showserach && <Userserach  /> }
       <Maincontent {...rest}></Maincontent>
    </Pagecontent>
  )
}
