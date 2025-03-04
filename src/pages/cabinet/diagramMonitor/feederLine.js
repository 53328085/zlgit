import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open4_2 from './imgs/p4/4-2_open.svg'
import close4_2 from './imgs/p4/4-2_close.svg'

export default function Index() {

    const state = useReactive({
        showData: false,
        onOpen: true
    })

    const DiaBox = styled.div`
        display: flex;
        /* padding: 32px;
        padding-right: 48px;
        min-height: 800px; */
        padding-right: 84px;
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
            width: 112px;
            border: 1px solid rgba(0, 153, 51, 1);
            background-color: #000;
            border-radius: 4px;
            position: absolute;
            left: 100px;
            top: 144px;
            font-size: 14px;
            .data_box_title{
                display: flex;
                width: 100%;
                height: 24px;
                align-items: center;
                background-color: #00c;
                color: #fff;
                justify-content: center;
            }
            .data_box_item{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 0 8px;
                border-bottom: 1px dashed #0f3;
                font-size: 16px;
                color: #0f3;
                height: 36px;
            }
        }
    `

    return (
        <DiaBox>
            <img src={state.onOpen ? open4_2 : close4_2} style={{ width: 124, height: 673, marginTop: 50 }}></img>
            <div className='data_box'>
                <div className='data_box_title'>馈线</div>
                <div className='data_box_item'>
                    <span>Ia</span>
                    <div>
                        <span>54.3 </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>

                </div>
                <div className='data_box_item'>
                    <span>Ib</span>
                    <div>
                        <span>54.3 </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>

                </div>
                <div className='data_box_item' style={{ borderBottom: 'none' }}>
                    <span>Ic</span>
                    <div>
                        <span>54.3 </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>
                </div>
            </div>
        </DiaBox>
    )
}