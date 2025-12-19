import React, {useState, useEffect,useRef} from 'react'
import {Button,Space} from 'antd'
import moment from 'moment'
import { user } from '@pages/Home/header/icon'
export default function Index() {
  const [data, setData]=useState(null)
  const [olData, setOlData] = useState(null)
  const ref=useRef()
  const olref= useRef()
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
  const getList=()=>{
    fetch("auth", {
      method:"get",
   })
   .then(res => res.text())
   .then(res => {setOlData(res)
}).catch(e=>{
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
  return (
    <div>
    <Space>    
      <Button onClick={getAsync}>async</Button>
      <Button onClick={getList}>list</Button>
    </Space>
    <div ref={ref}> </div>
    <div ref={olref}></div>
    </div>
  )
}
