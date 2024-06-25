import React, {memo} from 'react'
import styled from 'styled-components'
import imgurl from './icon'
import {useSelector} from 'react-redux'
import { systemConfigInfo} from "@redux/systemconfig";
import {Typography} from 'antd'
const {Link} = Typography
const  Headcust = styled.div`
    display: flex;
 // height: 130px;
  flex-basis: 130px;
 // flex: 1;
  padding: 0 54px 0 96px;
  justify-content: space-between;
  align-items: flex-end;
  
`
export default memo(function Index() {
  const data = useSelector(systemConfigInfo) || {}
  const  {systemLogoImage, cmmi} = data
  console.log(cmmi)
  return (
    <Headcust>
        { (systemLogoImage || imgurl.logo) && <img src={systemLogoImage ?  `data:image/png;base64,${systemLogoImage}` : imgurl.logo}  alt=''  />} {/* width={120} */}
        <div style={{display: 'flex', width: '402px', justifyContent: 'center'}}>
         {cmmi ==1 && <Link href='https://www.cmmiinstitute.com/pars/appraisals/69522' target="_blank"> { imgurl.credentials &&  <img src={imgurl.credentials}   width={200} />}</Link>}
         </div>
    </Headcust>
    
  )
})
