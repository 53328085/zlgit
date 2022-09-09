import React from 'react'
import styled from 'styled-components'

export default function Card(props) {

  return (
    <div stye={{
        dispaly:'flex',
        alignItems:'center',
        padding:'0 16px',
        width:'320px',
        height:'64px'
        }}>
        <img src={props.imgurl} alt="" />
        <div>{props.title}</div>
        <div>{props.value}</div>
    </div>
    // <div>
    //      <img src={props.imgurl} alt="" />
    //     <div>{props.title}</div>
    //     <div>{props.value}</div>
    // </div>
  )
}
