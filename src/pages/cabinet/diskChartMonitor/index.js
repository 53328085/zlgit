import React, {useState, useEffect} from 'react'
import simple from './imgs/simple.svg'
import styled from "styled-components";

export default function Index(){

    const MainPage = styled.div`
        height: 857px;
        width: 100%;
        overflow-y: hidden;
    `

    return(
        <MainPage>
            <div >
            <img src={simple} style={{width:'260px', height:'800px'}} ></img>
            </div>
            <div>
            <img src={simple} style={{width:'260px', height:'800px'}}></img>
            </div>
        </MainPage>
    )
}