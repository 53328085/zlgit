import React, {useCallback, useEffect, useMemo, useState, memo, useContext, createContext, useRef, useReducer, useId} from 'react'
import {Form, Input, Button, Space, Typography} from 'antd'
import { drawEcharts } from "@com/useEcharts";
import {nanoid} from '@reduxjs/toolkit'
 const {Link, Text, Paragraph} = Typography
const Agecontext = createContext(null)
const Namecontext = createContext(null)
const Ac = memo(function AC({fn}){
    console.log(fn)
  
   useEffect(() => {
    console.log('useeffect --child')
   }, [])
  return (
     <div>
      <h1>{fn.age}</h1> 
    
      </div>
   
  )
})

function reducer(state, action) {
    let {id, text, done} = action.item
    console.log(action.item)
    switch (action.type) {
      case 'add':
        return  [ ...state,
           action.item
         ]
      case 'save':
        return state.map(s => {
          if(s.id ==id) {
            return action.item
          }else {
            return s
          }
        })
      
      case 'del':
         return state.fillter(s => s.id !=id)
      case 'done':
        return state.map(s => {
          if(s.id == id) {
            s.done = done
          } 
          return s
        })
      case 'changename':
        return {
          ...state,
          name: action.nextName
        }
      default:
         return []
    }
}
 
let initlist =  [
  
]

const  Add =({dispatch}) => {
  const [value, setValue] =useState()
  const id = useId()
  return (
    <Space>
      <Input value={value} onChange={e => setValue(e.target.value)} />
       <Button onClick={() => {
        dispatch({
          type: 'add',
          item:{
            id: nanoid(),
            done: false,
            text: value
          }
        })
       }}>ADD</Button>
    </Space>
  )
}
const Item = ({id, text, done, dispatch}) => {
  console.log(done)
  const [isedit, setIsedit] = useState(false)
  const [context, setContext] = useState(text)
  const [isdone, setIsdone] = useState(done)
   return (
    <Space>
      <input  type="checkbox" checked={isdone} onChange={(e) => {
        setIsdone(e.target.checked)
         dispatch({
          type: 'done',
          item: {
            done: e.target.checked,
            id: id,
          }
         })
        }} /> 
      { isedit ? <input value={context} onChange={(e) => setContext(e.target.value)} /> 
       :  <Text>{text}</Text>
       }
     { isedit ?   <Button onClick={() =>{
      setIsedit(false)
      dispatch({
        type: 'save',
        item: {
          id,
          text: context,
          done: isdone

        }
       })} }>保存</Button>
     : <Button onClick={() => setIsedit(true)}>编辑</Button>
       }
       <Button onClick={() => dispatch({
        type: 'del',
        item: {
          id,
        }
       })}>删除</Button>
    </Space>
   )
}
function createdIndex(vname) {
 console.log('create')
  const initarr = []
  for(let i =0;i<100; i++) {
     initarr.push(
      {
        id: i,
        time: new Date().getTime(),
        text: vname + Math.random().toString().slice(0, 8),
        done: Math.random()*1000 > 0.5
      }
     )

  }
  return initarr
}
let vname = "zh"
export default function Index() {
  const [state, dispatch] = useReducer(reducer, vname, createdIndex)
  const [v, setV] = useState('')
  const [va, setVa] = useState('')
 // console.log(state);
  const img =useRef({
    title: ''
  })
   const count = useRef(0)
    
   useEffect(() => {
     count.current=100
   }, [])
  
   return (
    
     <div style={{display: 'flex', flex: 1, padding: "20px", alignItems: 'flex-start', flexDirection: "column"}}>
       <Space>
        <Input value={va} onChange={e => setVa(e.target.value)}></Input>
         <Input value={v} onChange={e => {
          img.current.title = e.target.value
          console.log(img)
          setV(e.target.value)
          }}></Input>

          <Button onClick={() => alert(count.current++)}>add</Button>
          <Text> </Text>
          </Space>
     </div>
     
   )
}