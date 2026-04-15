import React, { useEffect, useState } from 'react'
import {Image} from 'antd'
import styled from 'styled-components'
 
import {PowerQuality} from "@api/api"
import {isObject} from "@com/usehandler"
import dnzlzl from './dnzlzl.jpg'
import { data } from 'browserslist'
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
  column-gap: 32px; 
  padding-left: 16px;
  color: #515151;
  .img {
     width: 274px;
  }
  .info {
    width: 514px;
    font-size: 18px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    row-gap: 32px;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    p {
      line-height: 1;
    }
  }
`
 

const arrlen =(arr) => {
  return Array.isArray(arr) && arr?.length >0
}
 
 
export default function Index({projectId, day, sn}) {
   
  const [datas, setDatas] = useState({})
  
  const [loading, setLoading] =useState(false)

  const getData = async() => {
      try {
       setLoading(true) 
       const body ={
        projectId,
        sn,
        day: day.format("YYYY-MM-DD"),
       
       }
      let {success, data} = await  PowerQuality.DNZLZL(body)
        if(success && isObject(data)) {
          setDatas(data)
        }else {
          setDatas({})
        }
      } catch (error) {
        setDatas({})
        console.log(error)
      }finally{
        setLoading(false)
      }
      
  }
 
  useEffect(() => {
     if(Number.isInteger(parseInt(projectId))&& sn && day) {
        getData()
     }
  }, [projectId, day, sn ])

  return (
    <Mainbox>
       <div className="img" key="img">
        <Image src={dnzlzl} />
       </div>
        <div className="info" key="info">
          <p>容量：{datas?.rl}</p>
          <p>型号：{datas?.xh}</p>
          <p>功率：{datas?.gl}</p>
          <p>电网侧有功功率：{datas?.yggl}</p>
          <p>电网侧无功功率：{datas?.wggl}</p>
          <p>电网侧视在功率：{datas?.szgl}</p>
        </div>
      
     </Mainbox>
  )
}
