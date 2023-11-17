import React, {memo} from 'react'
import styled from 'styled-components'
import imgurl from './icon'
import {useSelector} from 'react-redux'
import { getSystemconfiginfo} from "@redux/systemconfig";
 
const  Headcust = styled.div`
    display: flex;
  height: 130px;
  flex: 1;
  padding: 0 54px 0 96px;
  justify-content: space-between;
  align-items: flex-end;
  
`
export default memo(function Index() {
  const {systemLogoImage} = useSelector(getSystemconfiginfo) || {}
  return (
    
    <Headcust>
        { (systemLogoImage || imgurl.logo) && <img src={systemLogoImage ?  `data:image/png;base64,${systemLogoImage}` : imgurl.logo}  alt='' width={120} />}
        <div style={{display: 'flex', width: '402px', justifyContent: 'center'}}>
         { imgurl.credentials &&  <img src={imgurl.credentials}   width={200} />}
         </div>
    </Headcust>
    
  )
})
