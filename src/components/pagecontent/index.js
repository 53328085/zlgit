import React from 'react'

 import Userserach from '@com/useSerach'
import Maincontent from './maincontent'
export default function Index(props) {
  const {showserach=true, ...other} = props
  return (
    <div className='page--content'>
      {showserach && <Userserach  /> }
       <Maincontent {...other}></Maincontent>
    </div>
  )
}
