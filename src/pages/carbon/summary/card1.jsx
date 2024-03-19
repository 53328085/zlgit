import React from 'react'
import BlueColumn from '@com/bluecolumn'
import leftBox from '@imgs/leftBox.png'
import styled from 'styled-components'
import { Progress } from 'antd';
const Progressdiv =styled.progress`

   border-radius: 10px;
   border:  1px solid #d7d7d7;
   height: 8px;
   width: 160px;
   margin-left: 5px;
   padding: 1px;
    &::-webkit-progress-value {
        background: #ffff99;
        border-radius:10px;
    }
    &::-webkit-progress-bar{
     background-color:transparent;
     border-radius:10px;
}

`
export default function card({name,bgcolor='#009966',numberval=1000.00,compareval}) {
const bg = {
    width: 4,
    height: 24,
    backgroundColor: '#fff'
}
const cardstyle={
    backgroundColor:bgcolor,
    width:320,
    height:128,
    border: '1px solid #d7d7d7',
    borderRadius:4,
    // marginRight: 18,
    color: '#fff',
    padding: 14,
    display:'flex',
    flexDirection:'column',
}
const flexdiv ={
    display: 'flex',
    justifyContent: 'space-between',
   
}
const wrapdiv ={
    ...flexdiv,
    flex: 1,
}

  return (
    <div style={cardstyle}>
       {/* <BlueColumn name={name} bg={bg}></BlueColumn> */}
       <div style={wrapdiv}>
        <img src={leftBox} alt="" style={{width:96,height:112}}/>
        <div>
            <p style={{fontSize:16,fontWeight:400,lineHeight:'30px',textAlign:'right'}}>{name}</p>
            <p style={{fontSize:28,fontWeight:700,lineHeight:'50px',textAlign:'right'}}>{numberval.toFixed(2)}</p>
            <p style={{fontSize:16,...flexdiv}}>同比 <span style={{paddingLeft:16}}>{compareval}</span></p>
        </div>
       </div>
    </div>
  )
}
