import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open4_2 from './imgs/p4/4-2_open.svg'
import close4_2 from './imgs/p4/4-2_close.svg'

export default function Index() {

    const state = useReactive({
        showData: false
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
            left: 32px;
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
    `

    const handleMouseEnter = () => {
        state.showData = true
    }
    const handleMouseLeave = () => {
        state.showData = false
    }

    return (
        <DiaBox>
            <img src={open4_2} style={{ width: 124, height: 673, marginTop: 26 }}></img>
            <div className='click_box' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></div>
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