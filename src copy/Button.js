import btcs from './button.module.css'
import './another.css'
import React from 'react'
const RButton = React.forwardRef((props, ref) => {
   <button ref={ref}>
       {props.children}
   </button>
})
const ref = React.createRef()
const CButton = () =>  <RButton ref={ref}>REF转发</RButton>

export default  CButton