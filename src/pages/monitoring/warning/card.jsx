import React from 'react'
import styled from 'styled-components'

export default function Card(props) {

  return (
    <div style={{
        display:'flex',
        alignItems:'center',
        padding:'0 16px',
        width:'320px',
        height:'64px',
        backgroundColor:'#FFFFFF',
        margin:'16px 16px 16px 0',
        border:'1px solid #d7d7d7',
        borderRadius:'4px',
        fontSize:16
        }}>
        <img src={props.imgurl} alt="" />
        <div style={{marginLeft:'25px'}}>{props.title}</div>
        <div style={{fontSize:18,margin:'0 0 0 auto'}}>{props.value}</div>
    </div>
  )
}
