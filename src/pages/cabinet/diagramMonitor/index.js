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
        /* margin-right: 16px; */
        .box_title{
            width: 100%;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            /* background-color: ${props=> props.theme.primaryColor}; */
            background-color: #039;
            font-size: 24px;
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
        top: 122px;
        width: calc(100% - 64px);
        border-top: 4px solid #000;
    `
    const MainDashedLine = styled.div`
        position: absolute;
        left: 32px;
        top: 106px;
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
        <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
            <MainLine></MainLine>
            <MainDashedLine></MainDashedLine>
            <BottomDashedLine></BottomDashedLine>
            <ContentBox>
                <div className='box_title' style={{backgroundColor:'#000', borderRight: '1px solid rgba(0, 153, 204, 1)'}}>
                    <span>P1</span>
                </div>
                <Incoming></Incoming>
            </ContentBox>
            <ContentBox>
                <div className='box_title' style={{backgroundColor:'#333', borderRight: '1px solid rgba(0, 153, 204, 1)'}}>
                    <span>P2</span>
                </div>
                <Filtering></Filtering>
            </ContentBox>
            <ContentBox>
                <div className='box_title' style={{backgroundColor:'#000', borderRight: '1px solid rgba(0, 153, 204, 1)'}}>
                    <span>P3</span>
                </div>
                <div className='dia_box'>
                    <FeederLine></FeederLine>
                    <FeederLine></FeederLine>
                    <FeederLine></FeederLine>
                </div>
                
            </ContentBox>
            <ContentBox>
                <div className='box_title' style={{backgroundColor:'#333'}}>
                    <span>P4</span>
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