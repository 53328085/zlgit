import React, {useState, useEffect} from 'react'
import {Space, Divider} from 'antd'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
const Ldiv = styled.div`
  height: 64px;
  background-color: #135abd;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const Idiv = styled.div`
   border-right: 1px solid rgba(255,255,255,0.3);
 
   width: 112px;
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   &:last-child {
    border-right: none;
   }
   &:hover {
    background-color: #3988e7;
    cursor: pointer;
   }
`
const Idiv1 = styled(Idiv)`
  background-image: url('@src/home/header/icon/31N.png');
  background-position: top center;

`
export default function Log() {
 // const [user, setUser] = useState('')
  const loginName = useSelector(state => state.user)?.loginName

  return (
    <Ldiv>
       
            <Idiv1>

                数据大屏
            </Idiv1>
            <Idiv>
                平台配置
            </Idiv>
            <Idiv>
               {loginName}
            </Idiv>
       
    </Ldiv>
  )
}
