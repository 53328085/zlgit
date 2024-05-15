import React from 'react'
import leftBox from '@imgs/leftBox.png'
import flower from '@imgs/flower.png'
import styled from 'styled-components'
import { Progress ,Image, Typography} from 'antd';
import Titlelayout from '@com/titlelayout';
const {Paragraph,Text} =Typography
const CProgress = styled(Progress)`
&& {
    .ant-progress-inner {
        border: 1px solid #fff;
    }
}
  

`
const Mainbox = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 8px;
  color: #fff;
  
  overflow: hidden;
  .content {
    flex: 1;
    display: flex;
    align-items: center;
    row-gap: 16px;
  }
  .imgbox {
   // padding-top: 16px;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 120px;
    p {
        color: #fff;
    }
   
    .yoy {
        font-size: 16px;
    }
  }
  .num{
      font-size: 28px;
      max-width: 160px;
      color: #fff;
      text-align: right;
    }
  .right.center {
    align-items: center;
  }
`
 
export default function card({name='',bgcolor='#009966', title='',value=0, yoy=0}) {
 
 let content 
 if(title) {
    content = (
        <div className='content'>
           <Image src={flower} preview={false} width={42}   />
           <div style={{flex: 1,paddingLeft: "16px"}}>
               <p style={{textAlign:"right"}}><Text className='num' ellipsis={value} >{value}</Text></p>
              <div style={{display: "flex", rowGap: '16px'}}>
                <span style={{fontSize: '12px', paddingRight: '8px'}}>{yoy}</span>
                <CProgress percent={parseFloat(yoy)} showInfo={false} size="small" trailColor={bgcolor} strokeColor="#ff9" />
              </div>
           </div>
       </div>
    )
   
 }else {
    content = (
        <>
          <div className='imgbox' key="img">
          <Image src={leftBox} preview={false} width={96} height={100}  />
          </div>
          <div className='right' key="right">
             <p>{name}</p>
             <div>
             <p style={{textAlign: "right"}} key="a"><Text className='num' ellipsis={value} >{value}</Text></p>
             <p style={{textAlign: "right"}} key="b">同比<Text  ellipsis={value} style={{paddingLeft:"10px", fontSize: "16px", color: "#fff"}}>{yoy}</Text></p>
             </div>
          </div>
        </>
        )
 }

  return (
    <Titlelayout title={title} bgcolor={bgcolor} layout="flex" hv="24px" bg="transparent" bl="4px solid #fff" fc="#fff" style={{height: '128px'}}>
        <Mainbox>
            {content}
        </Mainbox>
    </Titlelayout>
  )
}
