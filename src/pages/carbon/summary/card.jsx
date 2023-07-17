import React from 'react'
import BlueColumn from '@com/bluecolumn'
import flower from '@imgs/flower.png'
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
    width:288,
    height:128,
    border: '1px solid #d7d7d7',
    borderRadius:4,
    marginRight: 18,
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
    marginTop:16
}

  return (
    <div style={cardstyle}>
       <BlueColumn name={name} bg={bg}></BlueColumn>
       <div style={wrapdiv}>
        <img src={flower} alt="" style={{width:42,height:42}}/>
        <div>
            <p style={{fontSize:28,fontWeight:700,lineHeight:'30px',textAlign:'right'}}>{numberval.toFixed(2)}</p>
            {compareval?<p style={{fontSize:16,...flexdiv}}>同比 <span style={{paddingLeft:16}}>{compareval}</span></p>:
            <div style={{display:'flex',alignItems:'center'}}>
                <span>80.0%</span><Progressdiv value="80" max="100" ></Progressdiv>
            </div>
            }
        </div>
       </div>
    </div>
  )
}
