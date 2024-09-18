import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {nanoid} from '@reduxjs/toolkit' 
import UserTable from "@com/useTable";
import {PowerQuality} from "@api/api"
import {soecolumns} from './columns'
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 32px minmax(680px, 1fr);
  row-gap: 16px;
  padding-left: 16px;
  .op {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      padding-left: 16px;
      height: 25px;
      border-left: 5px solid ${props => props.theme.primaryColor};
      line-height: 25px;
      color: #515151;
    }
  } 
 
`
 

const arrlen =(arr) => {
  return Array.isArray(arr) && arr?.length >0
}
 
 
export default function Index({projectId, day, sn}) {

  const [datas, setDatas] = useState([])
 

  const [loading, setLoading] =useState(false)

  const getData = async() => {
      try {
       setLoading(true)
       const body ={
        projectId,
        sn,
        day: day.format("yyyy-MM-DD")
       }
      let {success, data} = await  PowerQuality.SOE(body)
        if(success && arrlen(data)) {
          setDatas(data)
        }else {
          setDatas([])
        }
      } catch (error) {
        setDatas([])
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
       <UserTable columns={soecolumns} dataSource={datas} istheme="theme" rowKey={nanoid()} loading={loading} scroll={{
      scrollToFirstRowOnChange: true, 
       y: 672
     }
    }></UserTable>
     </Mainbox>
  )
}
