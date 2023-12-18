import React from 'react'
import Titlelayout from "@com/titlelayout";
import {} from 'antd'
import styled from "styled-components";
import Pagecount from "@com/pagecontent";
import {CustButton} from '@com/useButton'
 
const Main = styled.div`
   display: grid;
   grid-template-rows: 64px 1fr;
   row-gap: 16px;
   .title {
      padding: 16px;
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      .text {
        padding-left: 16px;
        border-left: 4px solid #237ae4;

      }
   }
   .imgbox {
     background-color: #fff;
     width: 432px;
    height: 264px;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    border-radius: 4px;
    padding: 16px;
   }
   .tip {
     color: #999;
     text-align: center;
     width: 432px;
     margin-top: 16px;
   }
`
export default function Index() {
  return (
     <Main>
        <div className='title'>
            <span>园区图片</span>
        </div>
        <div>
           <div className='imgbox'></div>
           <div className='tip'>（图片大小为: 1368*800 png或jpg 格式,不超过800KB）</div>
        </div>
     </Main>
  )
}
