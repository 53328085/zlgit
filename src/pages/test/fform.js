
import React, {useState, useMemo, useCallback, useEffect, useRef, forwardRef} from 'react'
import styled from 'styled-components'
import ReactToPrint, {PrintContextConsumer, useReactToPrint} from 'react-to-print'
import {Button} from 'antd'
const Counter = React.memo(({count}) => {
  console.log('Counter重新执行！' )
  return <span>{count()}</span>
})
const FacncyBtn = forwardRef((props, ref) => {
  return <><Button ref={ref}>{props.children}</Button></>
 })
 const list = ["apple", "peer", "banana", "lemon"];
export default function Fform() {

  const [autoconte, setAutoConte] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
    setAutoConte(s => s + 1)
   }, 1500)
   return () => {
     clearInterval(timer)
   }
  }, [])
  const [name, setName] = useState("apple");
  const [price, setPrice] = useState(0);
 const getProductName = useMemo(() => {
  console.log('修改名字的时候才触发')
  return () => name
}, [name])
  
  const [num] = useState(222) 
  const [height, setHeight] = useState(0);
  const [time, setTime] = useState(new Date())
  const measuredRef = useCallback(node => { // 接受html dom 元素作为参数  回调ref
    console.log(node);
    if(node !=null) {
      setHeight(node.getBoundingClientRect().height)
    }
  }, [])
  useEffect(() => { // 处理状态更新导致的副作用 componentDidMount / componentDidUpdate / componentWillUnmount
    getProductName()
  }, [name])
  useMemo(() => {}, [] ) // 保持对象引用不变
 /*  const count =  useMemo(() => () => num
  , [num]) */
 const count = useCallback(() => num, [num])
  return (
      <div>
         <p>自动执行：{autoconte}</p>
         <div>
           <Counter count={count} />
         </div>
      </div>   
  )
}
