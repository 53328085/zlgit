import React from "react";
import { Divider, Image } from 'antd'
import Titlelayout from '@com/titlelayout' 
import imgurl from '@imgs'
import styled from "styled-components";
const Mainbox = styled.div`
   flex: 1;
   display: flex;
   justify-content: space-between;
   align-items: center;
   .leftcard{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .cardTitle{
                        border-left: 4px solid #fff;
                        font-size: 14px;
                        color: #000;
                        font-weight: bold;
                    } 
                    .cardData{
                           font-size: 18px;
                           color: #000;
                       }
                    .desc{
                        font-size: 14px;
                        color: #000;
                        .normalSign{
                            background-color: #00ff33;
                            display: inline-block;
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            margin-right: 12px;
                        }
                        .warnSign{
                            background-color: #f93e3e;
                        }
                    }
                } 
                    .imgDiv{
                        width: 64px;
                        height: 64px;
                    }
                    
                   
               


`
export default function Index(props) {
    return (
        <Titlelayout layout="flex" shadow="y">
            <Mainbox>
            <div className="leftcard">
                <div className="cardTitle">{props.title}</div>
                <div className="cardData">{props.value?props.value:'————'}</div>
                <div className="desc">
                    {
                        props.value?<span className="normalSign"></span>:<span className="normalSign warnSign"></span>
                    }
                    
                    <span>{props.desc}</span>
                </div>
            </div>

           
                <div className="imgDiv">
                    <Image src={imgurl[props.img]} preview={false} />
                </div>
                </Mainbox>
            
        </Titlelayout>
    )
}