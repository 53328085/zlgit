import React, {useState, useEffect,useRef} from 'react'
import {Button,Space} from 'antd'
import moment from 'moment'
import { user } from '@pages/Home/header/icon'
export default function Index() {
  const [data, setData]=useState(null)
  const [olData, setOlData] = useState(null)
  const [time, setTime]=useState(null)
  const [nowTime, setNowTime]=useState(null)
  const [count, setCount]=useState(0)
  const num=useRef(0)
  const ref=useRef()
  const olref= useRef()
  const timeId= useRef(null)
  
   // timeId.current=moment()  渲染阶段ref不要读取和赋值错误
   // console.log(timeId.current)
 
  const getQuery = () => {
    let form = new FormData();
    form.append("check_in", moment().subtract(1, "day").format());
    form.append("check_out",  moment().subtract(1, "week").format());
  // form.append("lang",  ["HTML12","CSS123","JAVA12","JAVASCRIPT","C++123","C#1234"] );// ["HTML","CSS","JAVA","JAVASCRIPT","C++","C#"]
    let query =new URLSearchParams({
      check_in: moment().subtract(1, "week").format("YYYY-MM-DD"),
      check_out: moment().subtract(1, "day").format("YYYY-MM-DD")
      
    })
    fetch(`auth/bookable?${query}`, {
      method: "get",  
    })
    .then(res => res.json())
    .catch(e=>{
      console.log(e)
    });
  }
  const getcookie=()=> {
    fetch("auth/test", {
      method:"get",
   }).then(res => res.json())
   .catch(e=>{
     console.log(e)
   });
  }
  const getAsync=()=>{
    fetch("auth/upload", {
      method:"get",
   })
   .then(res => res.text())
   .then(res => {setData(res)
})
   .catch(e=>{
     console.log(e)
   });
  }
  const fn=(a)=>{
    console.log(a)
  }
  const getList=()=>{
    fetch(`auth/jsonp?callback=fn`, {
      method:"get",
   })
   .then(res => res.text())
   .then(res =>{
    eval(res)
   } )
 .catch(e=>{
     console.log(e)
   });
  }
  useEffect(() => { 
    if(data) {
      ref.current.innerHTML =data
    }
  }, [data]);

  useEffect(() => { 
    if(olData) {
      olref.current.innerHTML =olData
    }
  }, [olData]);
  const getTime=()=>{
    setTime(moment().format('YYYY-MM-DD HH:mm:ss'))
    setNowTime(moment())
    clearInterval(timeId.current)
  timeId.current=  setInterval((str)=>{ // 安全
      console.log(str)
      setTime(moment().format('YYYY-MM-DD HH:mm:ss'))
    },10,"结束")
  }
  let st;
  if (time!=null && nowTime!=null){
    st=moment(time).diff(moment(nowTime),'seconds')
  }
 
  const cancelTime=()=>{
     if(timeId.current){
      clearInterval(timeId.current)
     }
  }
  useEffect(()=>{ 
    num.current=count // 安全
  },[count])

 
  return (
    <div>
    <Space>    
      <Button onClick={getAsync}>上传图片</Button>
      <Button onClick={getList}>jsonp</Button>
      <Button onClick={getTime}>时间：{time}</Button>
      <Button onClick={cancelTime}>取消</Button>
      <Button onClick={()=>setCount(c=>c+1)}>add</Button>
    </Space>
    <div>时间过去了:{st}</div>
    <div ref={ref}> </div>
    <div ref={olref}></div>
    <div>count:{count}</div>
    <div>num:{num.current}</div>
    </div>
  )
}
