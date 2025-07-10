import React from 'react'
import Common from './common'
import styled from 'styled-components'
const Main = styled.div`
 flex:1;
 display: flex;
`
export default function water() {
    const addMainLine = () => {

    }
    let commonProps = {
        addMainLine
    }
    return (
        <Main>
            <Common type={7} />
        </Main>
    )
}