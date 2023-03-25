import React from 'react'
import GouIcon from '@imgs/gou.png'
export const  CompleteIcon=()=> {
  return (
    <div style={{width:26,height: 26,backgroundColor:'rgb(1,187,112)',borderRadius:'50%',textAlign:'center',lineHeight:'24px' }}>
        <img src={GouIcon} alt="" />
    </div>
  )
}
export const  UnCompleteIcon=()=> {
  return (
    <div style={{width:26,height: 26,backgroundColor:'rgb(204,204,204)',borderRadius:'50%',textAlign:'center',lineHeight:'24px' }}>
        <img src={GouIcon} alt="" />
    </div>
  )
}
export const ResolveIcon=()=>(<div style={{width:16,height: 16,backgroundColor:'rgb(2,219,114)',borderRadius:'50%',marginRight:16 }}></div>)
export const WaitIcon=()=>(<div style={{width:16,height: 16,backgroundColor:'rgb(244,67,54)',borderRadius:'50%',marginRight:16 }}></div>)
export const ProcessIcon=()=>(<div style={{width:16,height: 16,backgroundColor:'rgb(0,204,255)',borderRadius:'50%',marginRight:16 }}></div>)