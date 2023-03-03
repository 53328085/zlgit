import React, { useContext,useRef } from 'react'
import Comp from './comp'
import Table from '@com/useTable'
import {Addmodal} from './modalcomp'
export default function parkstreet({areaList}) {
  const addModalRef = useRef()
  const columns=[{
    title:'园区名称',
    dataIndex:''
  },
  {
    title:'安装地址',
    dataIndex:''
  },
  {
    title:'公共照明名称',
    dataIndex:''
  },
  {
    title:'所属控制箱',
    dataIndex:''
  },
  {
    title:'控制器编号',
    dataIndex:''
  },
  {
    title:'备注',
    dataIndex:''
  },
  {
    title:'操作',
    dataIndex:''
  }]
  const addopen=()=>{
    addModalRef.current.onOpen()
  }
  const comProps={
    addopen,
    areaList
  }
  const addModalProps = {
    addModalRef,
    width: 832,
    areaList
  }
  return (
    <div>
     <Comp {...comProps}>
      <Table columns={columns}></Table>
     </Comp>
     <Addmodal {...addModalProps}></Addmodal>
    </div>
  )
}
