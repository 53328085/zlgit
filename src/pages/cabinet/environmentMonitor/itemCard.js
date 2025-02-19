import React from "react";
import { Divider, Image, Typography } from 'antd'
import {useSelector} from "react-redux"
import Titlelayout from '@com/titlelayout'
import imgurl from '@imgs'
import { themeColor  } from '@redux/systemconfig.js'
import styled from "styled-components";
const { Text } = Typography
const Mainbox = styled.div`
   width:100%;
   height: 200px;
   display: flex;
   flex-direction: column; /* 使子元素垂直排列 */
    .val {
        font-size: 18px;
        color: #1e1e1e;
        text-align: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        .title{
            margin:0px 0px 10px 0px;
        }
        .data{
            display: flex;
            justify-content: space-around;
            font-size: 14px;
        }
    }
     .imgDiv{
        width: 64px;
        height: 64px;
        margin: auto;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
      }
                    
                   
               


`
export default function Index(props) {
    const {primaryColor, primaryderived} =useSelector(themeColor)

    return (
        <Titlelayout layout="flex" bgcolor={primaryderived} bg="transparent" pl="0px" bl="none" title=''>
            <Mainbox>
                <div className="imgDiv">
                    <Image src={imgurl[props.img]} preview={false} />
                </div>
                <div className="val">

                    <div className="title"><Text ellipsis={{ tooltip: props.title }}>{props.title}</Text></div>
                    <div className="data">{
                        props.ht ? <><span>{props.tValue}</span><span>{props.hValue}</span></> : props.value
                    }</div>
                </div>

            </Mainbox>
        </Titlelayout>
    )
}