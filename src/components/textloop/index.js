 
import React, { useState, Fragment, useEffect, useMemo } from 'react';
import {Typography} from 'antd'
import {CaretRightOutlined} from '@ant-design/icons'
import styled from 'styled-components';
import { TextLoop } from "react-text-loop-next";
import {Editapi} from '@api/api'
import warn from './waring.svg'
import Snk from './snker.png'
const {Text} = Typography
const Showbox =styled.div`
    height: 48px;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f00;
    cursor: pointer;
     
 `
const Textscroll = styled.div`
  width: 538px;
  height: 48px;
  background-color: #f00;
  display: flex;
  align-items: center;
  padding: 0 6px 0px 8px ;
  overflow: hidden;
  column-gap: 8px;
 
  .warning {
     background-color: #fff;
     display: flex;
     align-items: center;
     column-gap: 8px;
     font-size: 16px;
     height: 32px;
     padding: 0 4px 0 8px;
     color: #f00;
     .ant-typography {
        color: #f00;
    }
     .img {
        width: 24px;
        height: 24px;
     }
  }
  .scroll {
    width: 353px;
    height: 48px;
    display: flex;
    flex-direction: column;
    
    padding: 4px 8px;
    justify-content: center;
    .ant-typography {
        color: #fff;
    }
    
    
  }
 
`
const App = ({projectId, roomId}) => {
   const [arr, setArr]=useState([])
 
   const num = arr?.length ?? ''
   const [show, setShow] = useState(true)

   const CTextLoop = useMemo(() => {
    if(arr.length > 0) {
     return <TextLoop>
      {arr.map((d,i) => (<div className='scroll' style={{backgroundColor: i%2==0 ? "#ff4848" : 'transparent' }} key={d.warningTime} >
            <Text>{d.warningTime}</Text>
            <Text ellipsis={{tooltip: d.alarmEvent}}>{d.alarmEvent}</Text>
        </div>))
      }
        </TextLoop>
    }
   }, [arr])
   const getAramlist =async () => {
      try {
        let {success, data}  = await Editapi.AlarmList({},{projectId,roomId})
        if(success && Array.isArray(data)) {
          setArr(data)
        }else {
          setArr([])
        }
      } catch (error) {
        
      }
   }
   useEffect(() => {
    if([projectId, roomId].every(n => Number.isInteger(parseInt(n)))) {
       getAramlist()
    }
    
   }, [projectId, roomId])
   return(
        <Fragment>
          {show ?
        <Textscroll>
             <div className='warning'>
                <img src={warn} alt="" className='img' /> 
                <Text ellipsis={{tooltip: num}}>告警({num})</Text>
             </div>
              {CTextLoop}
       {/*       <TextLoop>
              {
           arr.map((d,i) => {
                console.log(d.warningTime)
                return (<div className='scroll' style={{backgroundColor: i%2==0 ? "#ff4848" : 'transparent' }} key={d.warningTime} >
                    <Text>{d.warningTime}</Text>
                    <Text ellipsis={{tooltip: d.alarmEvent}}>{d.alarmEvent}</Text>
                </div>) })
              
              }
             </TextLoop>  */}          
             <CaretRightOutlined style={{color: "#fff", fontSize: '16px', cursor: "pointer", marginLeft: 'auto'}} onClick={() => setShow(false)} />            
        </Textscroll>
        : <Showbox  onClick={() =>setShow(true) }><img src={Snk} alt="" /> </Showbox> }
        </Fragment>
   )
};
export default App;