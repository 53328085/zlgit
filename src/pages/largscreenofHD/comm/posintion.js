import React from 'react'
import {Position} from '../style'
import mark from '../icon/mark.gif'
export default function Index(props) {
  let {x,y,name,items, visiable} = props
  return (
    <Position left={x} top={y} visiable={visiable}>
        <div className="ptitle">今日用能—{name}</div>
          <div className="pcontent">
 {
                items?.map?.((i,idx)=> <div className="pitem" key={idx}>
                    <div className="plabel">{i.name}</div>
                    <div className='pvalue'>{i.value}</div>
                    </div>)
            }
          </div>
          <img src={mark} className='mark'></img>
    </Position>
  )
}

