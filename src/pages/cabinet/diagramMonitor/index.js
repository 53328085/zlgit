import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import Incoming from './incoming.js'
import Filtering from './filtering.js'
import FeederLine from './feederLine.js'
import LoopLine from './loopLine.js'


import styled from "styled-components";


export default function Index() {
    const state = useReactive({
        showOpen: true,
    })

    const changeState = () => {
        state.showOpen = !state.showOpen
    }

    const ContentBox = styled.div`
        min-width: 260px;
        background-color: #fff;
        margin-right: 16px;
        .box_title{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${props=> props.theme.primaryColor};
            font-size: 20px;
            color: #fff;
        }
        .nameItem{
            margin-top: 16px;
            width: 100%;
            display: flex;
            align-items: center;
            .item{
                margin-left: 51px;
                margin-right: 19px;
                width: 85px;
                height: 25px;
                border: 1px solid #237ae4;
                background-color: #ecf5ff;
                color: #237ae4;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }
        }
        .dia_box{
            display: flex;
            /* align-items: flex-end; */
            padding: 32px;
            padding-right: 48px;
            min-height: 800px;
            position: relative;
            
        }
    `

    const MainLine = styled.div`
        position: absolute;
        left: 32px;
        top: 140px;
        width: calc(100% - 64px);
        border-top: 4px solid #000;
    `
    const MainDashedLine = styled.div`
        position: absolute;
        left: 32px;
        top: 124px;
        width: calc(100% - 64px);
        border-top: 4px dashed #000;
    `
    const BottomDashedLine = styled.div`
        position: absolute;
        left: 32px;
        bottom: 16px;
        width: calc(100% - 64px);
        border-top: 4px dashed #000;
    `

    return (
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <MainLine></MainLine>
            <MainDashedLine></MainDashedLine>
            <BottomDashedLine></BottomDashedLine>
            <ContentBox>
                <div className='box_title'>
                    <span>P1 进线柜</span>
                </div>
                <div className='nameItem'>
                    <div className='item'>进线回路</div>
                </div>
                <Incoming></Incoming>
            </ContentBox>
            <ContentBox>
                <div className='box_title'>
                    <span>P2 有源滤波柜</span>
                </div>
                <div className='nameItem'>
                    <div className='item'>滤波回路</div>
                </div>
                <Filtering></Filtering>
            </ContentBox>
            <ContentBox>
                <div className='box_title'>
                    <span>P3 馈线柜</span>
                </div>
                <div className='nameItem'>
                    <div className='item'>馈线回路1</div>
                    <div className='item'>馈线回路2</div>
                    <div className='item'>馈线回路3</div>
                </div>
                <div className='dia_box'>
                    <FeederLine></FeederLine>
                    <FeederLine></FeederLine>
                    <FeederLine></FeederLine>
                </div>
                
            </ContentBox>
            <ContentBox>
                <div className='box_title'>
                    <span>P4 出线柜</span>
                </div>
                <div className='nameItem'>
                    <div className='item'>出线回路1</div>
                    <div className='item'>出线回路2</div>
                    <div className='item'>出线回路3</div>
                    <div className='item'>出线回路4</div>
                    <div className='item'>出线回路5</div>
                    <div className='item'>出线回路6</div>
                    <div className='item'>出线回路7</div>
                    <div className='item'>出线回路8</div>
                    <div className='item'>出线回路9</div>
                </div>
                <div className='dia_box'>
                    
                    <LoopLine showItem></LoopLine>
                    <LoopLine ></LoopLine>
                    <LoopLine showItem></LoopLine>
                    <LoopLine></LoopLine>
                    <LoopLine></LoopLine>
                    <LoopLine></LoopLine>
                    <LoopLine></LoopLine>
                    <LoopLine></LoopLine>
                    <FeederLine></FeederLine>
                </div>
            </ContentBox>
        </div>
    )
}