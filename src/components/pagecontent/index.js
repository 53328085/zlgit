import React from 'react'

 import Userserach from '@com/useSerach'
import Maincontent from './maincontent'
export default function Index(props) {
 
  return (
    <div className='page--content'>
       <Userserach  />
       <Maincontent {...props}></Maincontent>
    </div>
  )
}
