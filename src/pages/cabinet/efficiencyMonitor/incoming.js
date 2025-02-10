import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open1_1 from './imgs/p1/1-1_open.svg'
import close1_1 from './imgs/p1/1-1_close.svg'
import open1_2 from './imgs/p1/1-2_open.svg'
import close1_2 from './imgs/p1/1-2_close.svg'
import open1_3 from './imgs/p1/1-3_open.svg'
import close1_3 from './imgs/p1/1-3_close.svg'

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
            <img src={open1_2} style={{ width: 114, height: 258, marginTop: 440 }}></img>
            <img src={close1_1} style={{ width: 232, height: 672, marginTop: 26, marginLeft: '-14px' }}></img>
            <img src={open1_3} style={{ width: 120, height: 274, marginTop: 440, marginLeft: '-60px' }}></img>
        </DiaBox>
    )
}