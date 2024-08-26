import React from "react";
import { Divider, Image, Typography } from "antd";

import Titlelayout from "@com/titlelayout";
import imgurl from "@imgs";
import svgurl from "@svgs";
import styled from "styled-components";

const { Text } = Typography;
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .val {
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    color: "#1e1e1e";
    width: 183px;
    height:100%;
    .title{
        color:#333;
        font-weight:700;
        font-size:14px
    }
  }
  .imgDiv {
    width: 69px;
    height: 69px;
    border: 1px solid ${(props) => props.bdcolor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export default function Index(props) {
  console.log(props);
  return (
    <Titlelayout layout="flex" bgcolor={props.bgcolor} pl="0px" bl="none">
      <Mainbox bdcolor={props.bdcolor}>
        <div className="imgDiv">
          <Image src={svgurl[props.img]} preview={false} />
        </div>

        <div className="val">
        <div className="title">{props.title}</div>
          {props.ht ? (
            <>
              <div className>
                <span>{props.tValue}</span>
                <span>{props.hValue}</span>
              </div>
              <div>
                {props.children}
              </div>
            </>
          ) : (
            props.value
          )}
        </div>
      </Mainbox>
    </Titlelayout>
  );
}
