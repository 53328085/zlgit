import React, {useState, useEffect,useRef} from 'react'
import {Button,Space,Form, Input} from 'antd'
import moment from 'moment'
import Chart from './chart'
import Grid from './grid'
export default function Index() {
  const [data, setData]=useState(null)
  const [olData, setOlData] = useState(null)
  const [time, setTime]=useState(null)
  const [nowTime, setNowTime]=useState(null)
  const [count, setCount]=useState(0)
  const [form] = Form.useForm();
  const num=useRef(0)
  const ref=useRef()
  const olref= useRef()
  const timeId= useRef(null)
  const [show, setShow] = useState(true);
  const inputRef = useRef(null);
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
  const formdata = new FormData();
  formdata.append('last', 'zhu');
  formdata.append('last', 'zl');
  const getPost=()=>{
    fetch(`auth/user/zhuzl/zhejiang/xiao/shang`, {
      method:"get", 
   })
   .then(res => res.text())
   .then(res =>{
     console.log(res)
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

  const submit=()=>{
    let values = form.getFieldsValue();
    let formdata = new FormData();
    for (let [key, value] of Object.entries(values)){
      formdata.append(key, value)
    }
    console.log(values)
    fetch(`auth/login`, {
      method:"post", 
      body:  formdata,
   })
   .then(res => res.text())
   .then(res =>{
     console.log(res)
   } )
 .catch(e=>{
     console.log(e)
   });
  }
  const query=()=>{
    fetch(`auth/query?name=zhu&password=zl&lang=HTML12`, {
      method:"get", 
   })
   .then(res => res.text())
   .then(res =>{
     console.log(res)
   } )
 .catch(e=>{
     console.log(e)
   });
  }
  const formdatahandler=()=>{
    let formdata = new FormData();
    formdata.append('name', '朱正林');
    formdata.append('password', 'asd123');
    formdata.append('lang', 'golang');
    fetch(`auth/formdata`, {
      method:"post", 
      body:formdata
   })
   .then(res => res.text())
   .then(res =>{
     console.log(res)
   } )
 .catch(e=>{
     console.log(e)
   });
  }
  const bindhandler=()=>{    // Bind() 和 ShouldBind() 都用于将请求数据（如 JSON、表单、查询参数等）绑定到 Go 结构体
    let formdata = new FormData();
    formdata.append('name', '朱正林');
    formdata.append('password', 'asd123');
    formdata.append('lang', 'golang');
    const obj = {
      name: '朱正林',
      password: 'asd123',
      lang: 'golang',
    };
   
    fetch(`auth/bind/007?name=zhu&password=zl&lang=c#', {
}`, {
      method:"post", 
      body: JSON.stringify(obj),
   })
   .then(res => res.text())
   .then(res =>{
     console.log(res)
   } )
 .catch(e=>{
     console.log(e)
   });
  }
  const redirecthandler=()=>{ 
    fetch(`auth/redirect?name=zhu&password=zl&lang=c#`, {
          method:"get",  
       })
       .then(res => res.text())
       .then(res =>{
         console.log(res)
       } )
     .catch(e=>{
         console.log(e)
       });
  }
  return (
    <div>
      <Form form={form}>
              <Form.Item label="姓名" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="密码" name="password">
                <Input />
              </Form.Item>
              <Form.Item label="语言" name="lang">
                <Input />
              </Form.Item>
      </Form>
    <Space>    
      <Button onClick={getAsync}>上传图片</Button>
      <Button onClick={getList}>jsonp</Button>
      <Button onClick={getPost}>post</Button>
      <Button onClick={submit}>提交</Button>
      <Button onClick={query}>查询字符串参数</Button>
      <Button onClick={formdatahandler}>表单数据</Button>
      <Button onClick={bindhandler}>数据绑定</Button>
      <Button onClick={redirecthandler}>重定向</Button>
    </Space>
      
    </div>
  )
}
