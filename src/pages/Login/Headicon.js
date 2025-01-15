import React, {memo} from 'react'
import styled, {css} from 'styled-components'
import imgurl from './icon'
import {useSelector} from 'react-redux'
import { systemConfigInfo} from "@redux/systemconfig";
import {Typography} from 'antd'
import {media} from '@com/usehandler' 
const {Link} = Typography
const csssty = css`
  flex: 0 0  70px;
  padding: 0  32px ;
  .logo {
    height: 60px;
  }
  .cmmi {
    height: 60px;
  }
`
const  Headcust = styled.div`
    display: flex;
 // height: 130px;
  flex-basis: 130px;
 // flex: 1;
  padding: 0 54px 0 96px;
  justify-content: space-between;
  align-items: flex-end; 
  .logo {
    height: 90px;
  }
  .cmmi {
    height: 72px;
  }
  ${props => props.theme.laptop ? csssty : null}
`
export default memo(function Index() {
  const data = useSelector(systemConfigInfo) || {}
  const  {systemLogoImage, cmmi} = data
  
  return (
    <Headcust>
        { (systemLogoImage || imgurl.logo) && <img src={systemLogoImage ?  `data:image/png;base64,${systemLogoImage}` : imgurl.logo}  alt='' className='logo'  />} {/* width={120} */}
        <div style={{display: 'flex', width: '402px', justifyContent: 'center'}}>
         {1 ==1 && <Link href='https://www.cmmiinstitute.com/pars/appraisals/69522' target="_blank"> { imgurl.credentials &&  <img src={imgurl.credentials} className='cmmi'    />}</Link>}
         </div>
    </Headcust>
    
  )
})
