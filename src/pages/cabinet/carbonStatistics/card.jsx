import React from 'react'
import leftBox from '@imgs/leftBox.png'
import flower from '@imgs/flower.png'
import styled, { css } from 'styled-components'
import { Progress, Image, Typography } from 'antd';
import { useSelector } from "react-redux"
import Titlelayout from '@com/titlelayout';
import { CustTransO } from "@com/useButton"
import { themeColor } from '@redux/systemconfig.js'
const { Paragraph, Text } = Typography
const CProgress = styled(Progress)`
&& {
    .ant-progress-inner {
        border: 1px solid #fff;
    }
}
  

`
const sty = css`
    
    .num{
      font-size:1.5em;
    }
    .right {
      p{
        font-size: 0.8em;
      }
      .yoy{
        font-size:0.8em;
      }
    }
    .imgbox2{
      width: 60px;
    }
    .content {
      font-size: 1em;
      .rightbox {
        padding-top: 8px;
        p {
          font-size: 0.8em;
        }
      }
    }
`
const Mainbox = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
//  align-items: stretch;
  padding: 0 8px;
  color: ${props => props.theme.bgcolorfont};
  height: 80px;
  overflow: hidden;
  font-size: 14px;
  .content {
    flex: 1;
    display: flex;
    align-items: center;
    column-gap: 8px;
    height: 54px;
    justify-content: space-between;
    
    .imgbox {
      align-self: center;
       width: 42px;
       overflow: hidden;
       display: flex;
       align-items: center;
       img {
        max-width: 100%;
       }
    }
    .rightbox {
      p {
        line-height: 1;
      }
       flex:1;
       display: flex;
       flex-direction: column;
       justify-content: space-between;
    }
  }
 
  .imgbox2 {
    width: 96px;
    display: flex;
    align-items: center;
    overflow: hidden;
    img {
      max-width: 100%;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    height:80px;
    p {
      //  color: #fff;
        line-height: 1;
         
    }
   
    .yoy {
        font-size: 16px;
        color: ${props => props.theme.bgcolorfont};
    }
  }
  .num{
      font-size: 28px;
    //  max-width: 160px;
     // color: #fff;
     color: ${props => props.theme.bgcolorfont};
      text-align: right;
    }
 
 
  .right.center {
    align-items: center;
  }
  ${props => props.laptop ? sty : null}
`

export default function card({ name = '', laptop, title = '', value = 0, yoy = 0 }) {
  let { primaryderived, carnstrokecolor, carntrailcolor, bgcolorfont } = useSelector(themeColor)
  let content
  if (title) {
    content = (
      <div className='content'>
        <div className='imgbox'>
          <img src={flower} alt="" />
        </div>
        <div className='rightbox'>
          <p style={{ textAlign: "right" }}>
            <Text className='num' ellipsis={value} ><CustTransO ns="comm" text="intlNumberWithOptions" val={value} />
            </Text>
          </p>
          <div style={{ display: "flex", rowGap: '16px' }}>
            <span style={{ fontSize: '12px', paddingRight: '8px' }}>{yoy}</span>
            <CProgress percent={parseFloat(yoy)} showInfo={false} size="small" trailColor={carntrailcolor} strokeColor={carnstrokecolor} />
          </div>
        </div>
      </div>
    )

  } else {
    content = (
      <>
        <div className='imgbox2' key="img">
          <img src={leftBox} alt="" />
        </div>
        <div className='right' key="right">
          <p style={{ textAlign: "right" }}>{name}</p>
          <p style={{ textAlign: "right" }} key="a">
            <Text className='num' ellipsis={value} ><CustTransO ns="comm" text="intlNumberWithOptions" val={value} />
            </Text></p>
          <p style={{ textAlign: "right" }} key="b">
            <CustTransO ns="comm" text="yoy" />
            <Text className='yoy' ellipsis={value} style={{ paddingLeft: "10px" }}>{yoy}</Text>
          </p>
        </div>
      </>
    )
  }

  return (
    <Titlelayout title={title} bgcolor={primaryderived} layout="flex" hv="24px" bg="transparent" bl={`4px solid  ${bgcolorfont}`} fc={bgcolorfont} style={{ height: '112px' }}>
      <Mainbox laptop={laptop}>
        {content}
      </Mainbox>
    </Titlelayout>
  )
}
