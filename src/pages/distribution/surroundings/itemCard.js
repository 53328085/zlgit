import React from "react";
import { Divider, Image, Typography } from 'antd'

import Titlelayout from '@com/titlelayout' 
import imgurl from '@imgs'
import styled, {css} from "styled-components";
const {Text} = Typography
const Mainbox = styled.div`
   flex: 1;
   display: flex;
   justify-content: space-between;
  // column-gap: 32px;
    .val {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        color: "#1e1e1e";
        width: 183px;
    }
     .imgDiv{
        width: 64px;
        height: 64px;
      }

`
const custsty = css`
.ant-card-body {
    padding: 0px 20px;
}

`
export default function Index(props) {

   
    return (
    <Titlelayout layout="flex" bgcolor={props.bgcolor} bg="transparent"  pl="0px" bl="none" custsty={custsty} title={<Text strong ellipsis={{tooltip: props.title}}>{props.title}</Text>}>
            <Mainbox>
                <div className="val">
                    {
                       props.ht  ? <><span>{props.tValue}</span><span>{props.hValue}</span></> :  props.value 
                    }
                </div>
           
                <div className="imgDiv">
                    <Image src={imgurl[props.img]} preview={false} />
                </div>
        </Mainbox>
        </Titlelayout>
    )
}