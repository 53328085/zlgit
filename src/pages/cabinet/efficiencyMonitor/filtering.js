import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open2_1 from './imgs/p2/2-1_open.svg'
import close2_1 from './imgs/p2/2-1_close.svg'

export default function Index() {

    const state = useReactive({
        showData: false
    })

    const DiaBox = styled.div`
        display: flex;
        padding: 32px;
        padding-right: 48px;
        min-height: 800px;
        position: relative;
    `

    return (
        <DiaBox>
            <img src={open2_1} style={{ width: 315, height: 760, marginTop: -22 }}></img>
        </DiaBox>
    )
}