import React from "react";
import styled from "styled-components";
import { useSelector } from 'react-redux'
import {themeColor,MRGB } from '@redux/systemconfig.js'

const CommItem = styled.div`
  background-color: #f5f5f5;
  padding: 14px 16px;
  border-radius: 8px;
  background-color: ${(props) => props.theme?.primaryderived || "#ffffff"};
  align-items: center;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  column-gap: 16px;
  .cardImgBox {
    width: 54px;
    height: 54px;
    background-color: ${(props) =>
      props.theme?.primaryColor || "#ffffff"}; // var(--ant-primary-color) ;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    .cardImg {
      width: 40px;
    }
  }
  .ItemValue {
    flex: auto;
    text-align: left;
    .valueTitle {
      font-size: 16px;
      color: ${(props) => props.theme.bgcolorfont};
    }
    .valueData {
      //margin-top: 10px;
      font-size: 31px;
      color: ${(props) => props.theme.bgcolorfont};
    }
  }
  .boxCard {
    flex: auto;
    height: 102px; 
    background-color: rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.2);
    border: 1px solid rgba(${props => props.rgb[0]},${props => props.rgb[1]},${props => props.rgb[2]},0.2);;
    display: flex;
    font-size: 14px;
    justify-content: space-around;
    flex-direction: column;
    padding: 16px;
    border-radius: 6px;
    p {
      display: flex;
      align-items: center;
      justify-content: space-between;  
      .span {
        font-size: 16px;
        font-weight: bold;
      }
      .on {
        color: ${(props) => props.theme.successColor || "#52c41a"}; 
      }
      .off {
        color: ${(props) => props.theme.warningColor || "#faad14"}; 
      }
    }
  }
`;
export default function Index({
  img,
  title,
  value,
  isShow,
  on,
  off,
  per,
  onValue,
  offValue,
  perValue,
  isRed,
  isGreen,
  isredE,
  onClick,
  after = null,
}) {
  const mrgb = useSelector(MRGB) 
  const [r, g, b] = Array.isArray(mrgb) ? mrgb : []  
  return (
    <CommItem rgb={[r, g, b]} onClick={onClick}>
      <div className="cardImgBox">
        <img src={img} className="cardImg" alt={title}></img>
      </div>
      <div className="ItemValue">
        <div className="valueTitle">{title}</div>
        <div className="valueData">{value}</div>
      </div>
      {isShow ? (
        <div className="boxCard">
          <p>
            <span>{on}</span>
            {isGreen ? (
              <span className="on span">{onValue}</span>
            ) : (
              <span>
                {onValue}
                {after}
              </span>
            )}
          </p>
          <p>
            <span>{off}</span>
            {isRed ? (
              <span className="off span">{offValue}</span>
            ) : (
              <span>
                {offValue}
                {after}
              </span>
            )}
          </p>
          <p>
            <span>{per}</span>
            {isredE ? (
              <span className="off span">{perValue}</span>
            ) : (
              <span className="span">
                {perValue}
                {after}
              </span>
            )}
          </p>
        </div>
      ) : (
        ""
      )}
    </CommItem>
  );
}
