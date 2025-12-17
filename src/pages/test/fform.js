import React from 'react'
import {Button} from 'antd'
import moment from 'moment'
export default function Index() {
  const getQuery = () => {
    let form = new FormData();
    form.append("check_in", moment().subtract(1, "day").format("YYYY-MM-DD"));
    form.append("check_out",  moment().subtract(1, "week").format("YYYY-MM-DD"));
  // form.append("lang",  ["HTML12","CSS123","JAVA12","JAVASCRIPT","C++123","C#1234"] );// ["HTML","CSS","JAVA","JAVASCRIPT","C++","C#"]
    let body = {
      check_in: moment().subtract(1, "day").format("YYYY-MM-DD"),
      check_out: moment().subtract(1, "week").format("YYYY-MM-DD")
      
    }
    fetch("auth/bookable", {
      method: "get", 
      query: body, 
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
  return (
    <div>
      <Button onClick={getQuery}>请求</Button>
      <Button onClick={getcookie}>cookie</Button>
    </div>
  )
}
