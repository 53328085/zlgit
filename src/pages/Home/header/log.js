import React, { useState, useEffect } from "react";
import { Space, Divider } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import n31 from "./icon/31N.png";
import h31 from "./icon/31H.png";
import n32 from "./icon/32N.png";
import h32 from "./icon/32H.png";
import n33 from "./icon/33N.png";
import h33 from "./icon/33H.png";
const Cdiv = styled.div`
  display: flex;
  height: 64px;
  overflow: hidden;
`;
const Ldiv = styled.div`
  height: inherit;
  background-color: #135abd;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Idiv = styled.div`
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  height: inherit;
  width: 112px;
  display: flex;
  justify-content: center;
  align-items: end;
  padding-bottom: 4px;
  background-repeat: no-repeat;
  background-position: top 4px center;
  &:last-child {
    border-right: none;
  }
  &:hover {
    background-color: #3988e7;
    cursor: pointer;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  span {
    line-height: 1;
  }
`;
const Idiv1 = styled(Idiv)`
  background-image: url(${n31});
  &:hover {
    background-image: url(${h31});
  }
`;
const Idiv2 = styled(Idiv)`
  background-image: url(${n32});
  &:hover {
    background-image: url(${h32});
  }
`;
const Idiv3 = styled(Idiv)`
  background-image: url(${n33});
  &:hover {
    background-image: url(${h33});
  }
`;
const Triangle = styled.div`
    width: 0; 
 	height: 0;
 	border-width: 32px;
 	border-style: solid;
 	border-color: transparent #135abd transparent transparent;
`;
export default function Log() {
  // const [user, setUser] = useState('')
  const loginName = useSelector((state) => state.user)?.loginName;

  return (
    <Cdiv>
      <Triangle />
      <Ldiv>
        <Idiv1>
          <span> 数据大屏</span>
        </Idiv1>
        <Idiv2>
          <span>平台配置</span>
        </Idiv2>
        <Idiv3>
          <span>{loginName}</span>
        </Idiv3>
      </Ldiv>
    </Cdiv>
  );
}
