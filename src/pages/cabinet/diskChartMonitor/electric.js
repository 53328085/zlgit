//遥测
import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import {Typography} from 'antd'
import arrow from './imgs/arrow.svg'

const {Text} = Typography
const Elects = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 128px);
  row-gap: 16px;
  column-gap: 32px;
  .box{
   width: 128px;
   display: flex;
   flex-direction: column;

   .btn {
     height: 40px;
     display: flex;
     align-items: center;
     padding-left: 16px;
     padding-right: 8px;
     background-color: #033;
     color: #3F0;
     position: relative;
     justify-content: space-between;
     cursor: pointer;
      
   }
}
`
const Elect = ({datas, onhandler})=> {
  const { name,desc,value,unit, lastSampleTime} = datas
    return (
      <div className='box' onClick={() => onhandler(datas)} >
          <Text ellipsis={{tooltip:desc}}>{desc}</Text>
          <div className="btn">{value}{unit}
            <img src={arrow} width={12} /> 
          </div>
      </div>  
    )
  }
export default function Index({datas, onClick}) {
  if(Array.isArray(datas) && datas.length > 0) {
    return (
      <>
         <div className="htitle">
                   <span>遥测</span>
                   <span>{moment().format("yyyy-MM-DD HH:mm:ss")}</span>
                 </div>
        <Elects>
            {
                datas.map(d => <Elect  datas={d} onhandler={onClick} />)
            }
        </Elects>
        </>
      )
     
  }else {
    return null
  }

}
