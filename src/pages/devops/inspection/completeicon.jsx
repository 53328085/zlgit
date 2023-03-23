import React from 'react'
import GouIcon from '@imgs/gou.png'
export const  CompleteIcon=()=> {
  return (
    <div style={{width:20,height: 20,backgroundColor:'rgb(2,219,114)',borderRadius:'50%',textAlign:'center',lineHeight:'17px' }}>
        <img src={GouIcon} alt="" />
    </div>
  )
}
export const ResolveIcon=()=>(<div style={{width:20,height: 20,backgroundColor:'rgb(2,219,114)',borderRadius:'50%' }}></div>)
export const WaitIcon=()=>(<div style={{width:20,height: 20,backgroundColor:'rgb(244,67,54)',borderRadius:'50%' }}></div>)