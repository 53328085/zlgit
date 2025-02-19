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
        showData: false,
        onOpen: false,
        onOpen1_2: false,
        onOpen1_3: false
    })

    const DiaBox = styled.div`
        display: flex;
        padding: 32px;
        padding-right: 48px;
        min-height: 800px;
        position: relative;
        .click_box{
            width: 48px;
            height: 144px;
            background-color: transparent;
            position: absolute;
            left: 224px;
            top: 152px;
            cursor: pointer;
        }
        .click_box_2{
            width: 48px;
            height: 96px;
            background-color: transparent;
            position: absolute;
            left: 110px;
            bottom: 222px;
            cursor: pointer;
        }
        .click_box_3{
            width: 48px;
            height: 96px;
            background-color: transparent;
            position: absolute;
            left: 338px;
            bottom: 222px;
            cursor: pointer;
        }
        .data_box{
            width: 160px;
            height: 148px;
            border: 1px solid rgba(110, 169, 238, 1);
            background-color: rgba(239, 246, 255, 1);
            border-radius: 4px;
            position: absolute;
            left: 168px;
            top: 300px;
            padding: 16px 12px;
            font-size: 14px;
            color: #333;
        }
    `

    const handleMouseEnter = () => {
        state.showData = true
    }
    const handleMouseLeave = () => {
        state.showData = false
    }

    const changeState = (val) => {
        if(val == 1){
            state.onOpen = !state.onOpen
        }
        if(val == 2){
            state.onOpen1_2 = !state.onOpen1_2
        }
        if(val == 3){
            state.onOpen1_3 = !state.onOpen1_3
        }
    }

    return (
        <DiaBox>
            <img src={state.onOpen1_2 ? open1_2 : close1_2} style={{ width: 114, height: 258, marginTop: 440 }}></img>
            <img src={state.onOpen ? open1_1 : close1_1} style={{ width: 232, height: 672, marginTop: 26, marginLeft: '-14px' }}></img>
            <img src={state.onOpen1_3 ? open1_3 : close1_3} style={{ width: 120, height: 274, marginTop: 440, marginLeft: '-60px' }}></img>
            <div className='click_box_2' onClick={() => changeState(2)}></div>
            <div className='click_box_3' onClick={() => changeState(3)}></div>
            <div className='click_box' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => changeState(1)}></div>
            {
                state.showData ? <div className='data_box'>
                <div style={{ color:'#1F6ECD' }}>进线</div>
                <div style={{ color:'#1F6ECD' }}>NA8-2500-H/3D</div>
                <div style={{marginTop: 12}}>Ia   120.5 A / 38.2 ℃</div>
                <div>Ib   120.5 A / 38.2 ℃</div>
                <div>Ic   120.5 A / 38.2 ℃</div>
            </div> : null
            }
        </DiaBox>
    )
}