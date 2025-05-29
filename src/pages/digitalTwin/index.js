import React from 'react'
import styled from 'styled-components'
const Mainbox=styled.div`
flex:1;
display: flex;
.iframe {
   flex:1;
   border:none;

}
`
export default function Index() {
  return (
    <Mainbox>
        <iframe className='iframe' src="http://192.168.100.33:8008/web3d/PRJ2024110418361399288736/index.html#/?sceneId=SCENE2025012211035819266505"></iframe>
    </Mainbox>
  )
}
