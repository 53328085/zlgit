import React from 'react'

 import Userserach from '@com/useSerach'
import Maincontent from './maincontent'
export default function Index(props) {
  const {search, form, ...otherProps} = props 
  return (
    <div className='page--content'>
       <Userserach search={search} form={form} />
       <Maincontent {...otherProps}></Maincontent>
    </div>
  )
}
