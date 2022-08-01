import React from 'react'
import {useParams, useHref, createRoutesFromChildren} from 'react-router-dom'
export default function NewDtl() {
 const params = useParams()
 //const href = useHref()
 //console.log(href)
 console.log(createRoutesFromChildren)
  return (
    <div>NewDtl: {params.id}</div>
  )
}
