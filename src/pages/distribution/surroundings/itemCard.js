import React from "react";
import { Divider, Image } from 'antd'
import Titlelayout from '@com/titlelayout' 
import imgurl from '@imgs'
import styled from "styled-components";
const Mainbox = styled.div`
   flex: 1;
   display: flex;
   justify-content: space-between;
   column-gap: 32px;
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
export default function Index(props) {

   
    return (
    <Titlelayout layout="flex" shadow="y" pl="0px" bl="none" title={<strong>{props.title}</strong>}>
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