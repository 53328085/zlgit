import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {message} from 'antd'
import {getOnelevel} from '@redux/systemconfig.js'
import { useDispatch} from 'react-redux'
import { Area } from "@api/api.js";

export const custMsg = ({success=true, type='success', content='', duration=0.1, onClose= () => {}} = {}) => {   
    if (!['success','error', 'warning'].includes(type)) return ;  
     message[success ? 'success' : 'error']({
        content,
        duration,
        onClose,
       })
}

export function useWinSize(projectId, update) {    
    const dispatch = useDispatch()
    const uplevel = async () => {
      try {
        let {success, data}  = await Area.QueryAll({projectId,level: 1,parentId: 0})
        if (success && Array.isArray(data)){ 
           dispatch(getOnelevel(data))
        }else {
            dispatch(getOnelevel([]))
        }
      } catch (error) {
        console.log(error)
      }
    
    }
    useEffect(() => {
        uplevel()
    }, [update])
    return null 
 }
 
export function numberformat(n){
  let num = parseFloat(n)
  if(num > 0) {
   return <><span style={{color: "#f00"}}>&#9650;&nbsp;</span><span>&#43;{n}</span></>
  }else if(num < 0) {
   return <><span style={{color: "#090"}}>&#9660;&nbsp;</span><span>{n}</span></>
  }else {
   return <span>{n}</span>
  }

}
export  const Statebox = styled.div.attrs(props => ({
  bgColor: '#009966',
}))`
  position: absolute;
  top: ${props => props.top};
  right: ${props => props.right};
  transform: rotate(45deg);
  background-color: ${props => props.bgColor};
  color: #fff;
  width: ${props => props.width};
  text-align: center;
  font-size: 14px;
`
