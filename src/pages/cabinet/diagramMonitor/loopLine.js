import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open4_1 from './imgs/p4/4-1_open.svg'
import close4_1 from './imgs/p4/4-1_close.svg'

export default function Index(props) {

    const state = useReactive({
        showData: false,
        showItem: props.showItem ? true : false,
        onOpen: true
    })

    const DiaBox = styled.div`
        display: flex;
        /* padding: 32px;
        padding-right: 48px;
        min-height: 800px; */
        margin-right: 32px;
        position: relative;
        .click_box{
            width: 48px;
            height: 144px;
            background-color: transparent;
            position: absolute;
            left: 42px;
            top: 152px;
            cursor: pointer;
        }
        .data_box{
            width: 160px;
            height: 148px;
            border: 1px solid rgba(110, 169, 238, 1);
            background-color: rgba(239, 246, 255, 1);
            border-radius: 4px;
            position: absolute;
            left: -20px;
            top: 316px;
            padding: 16px 12px;
            font-size: 14px;
            color: #333;
        }
        .item_box{
                position: absolute;
                width: 156px;
                height: 64px;
                left: 67px;
                top: 30px;
                background-color: #fff;
                border-bottom: 2px solid #333;
                z-index: 10;
            }
    `

    const handleMouseEnter = () => {
        state.showData = true
    }
    const handleMouseLeave = () => {
        state.showData = false
    }

    const changeState = () => {
        state.onOpen = !state.onOpen
    }


    return (
        <DiaBox>
            <img src={ state.onOpen ? open4_1 : close4_1} style={{ width: 124, height: 673, marginTop: 26 }}></img>
            {
                state.showItem ? <div className='item_box'></div> : null
            }
            <div className='click_box' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => changeState()}></div>
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