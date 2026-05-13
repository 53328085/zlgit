import React, { useEffect } from 'react'
import {Position} from '../style'
import mark from '../icon/mark.gif'
export default function Index(props) {
  let {x,y,name,items, visiable,onshow} = props
  const onMouseOver=()=>{
     onshow()
  }
 
  return ( 
    <Position  visiable={visiable} left={x} top={y}> 
       <div className="contentmain">
        <div className="ptitle">今日用能—{name}</div>
          <div className="pcontent">
 {
                items?.map?.((i,idx)=> <div className="pitem" key={idx}>
                    <div className="plabel">{i.name}</div>
                    <div className='pvalue'>{i.text}</div>
                    </div>)
            }
          </div> 
          </div>
          <img src={mark} className='mark'  onMouseOver={onMouseOver}></img>
    </Position>
    
  )
}

