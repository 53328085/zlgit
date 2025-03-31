import React from 'react'
import leftBox from '@imgs/leftBox.png'
import flower from '@imgs/flower.png'
import styled, {css} from 'styled-components'
import { Progress ,Image, Typography} from 'antd';
import {useSelector} from "react-redux"
 
import {CustTransO} from "@com/useButton"
import { themeColor } from '@redux/systemconfig.js'
import imgsrc from './imgs'
const {Paragraph,Text} =Typography
const CProgress = styled(Progress)`
&& {
    .ant-progress-inner {
      //  border: 1px solid #fff;
    }
}
  

`
const sty = css`
    padding: 14px 4px;
    .up {
      column-gap: 8px;
    }
    
`
const Cardbox = styled.div`
 
  //  width: 325px;
   // height: 130px;
    border-radius: 8px;
    padding: ${props=> props.theme.laptop ? "4px" : "14px 15px"};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color:  ${props=> props.theme.primaryderived};
    color: ${props=> props.theme.bgcolorfont};
    .uppart{
      display: flex;
      column-gap: ${props => props.theme.laptop ? "8px" : "16px"};
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #C9CDD6;
      .imgBox{
        width: 54px;
        height: 54px;
        overflow: hidden;
        .img{
          max-width: 100%;
        }
      }
      .leftpart{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .font1{
          font-size: ${props=> props.theme.laptop ? "12px" : "16px"};
        //  color:rgba(48, 49, 51, 1);
          line-height: 2;
        }
        .font2{
          font-size:  ${props=> props.theme.laptop ? "20px" : "31px"};
          color:${props=>props.theme.primaryColor};
          line-height: 1;
        }
        .num {
          color: ${props=> props.theme.bgcolorfont};
        }
      }
    }
    .downpart {
      display: flex;
      justify-content: flex-end;
      align-items: center; 
      .tip {
        padding-right: 8px;
      }
    }
    ${props=> props.theme.laptop ? sty : null}
  
`
 
 
export default function Index({name='',text, imgtype, value=0, yoy=0}) {
  let {carnstrokecolor,carntrailcolor} = useSelector(themeColor)
 
  return (
     <Cardbox>
      <div className='uppart'>
        <div className="imgBox">
           <img src={imgsrc[text]} alt="" className='img'></img>
        </div>
        <div className="leftpart">
          <div className="font1">
             <Text ellipsis={{tooltip: name}} className='num'>{name}</Text> 
          </div>
          <div className="font2">
            <CustTransO ns="comm" text="intlNumberWithOptions" val={value} />
          </div>
        </div>
      
      </div>
      <div className="downpart">
          {
            imgtype==1 ? (
               <>
              <span className='tip'> <CustTransO ns="comm" text="yoy" /></span>
              <Text   type={parseFloat(yoy) >= 0 ? "success" :  "danger" }>{yoy}</Text>
              </>
            ) : <> <span className='tip'>{yoy}</span>
                <CProgress percent={parseFloat(yoy)} showInfo={false}  strokeWidth={12} trailColor={carntrailcolor} strokeColor={carnstrokecolor} /></>
          }
        </div>
     </Cardbox> 
  )
}
