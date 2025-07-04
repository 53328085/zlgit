import React,{useRef} from 'react'
import {Space, Form} from 'antd'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components';
import UserTable from "@com/useTable";
import Titlelayout from '@com/titlelayout';
import {CustButtonT,ExportExcel} from "@com/useButton"

import CModal from '@com/useModal'
 
const TitleBox = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
`
  const cols =[ // 实时抄表  
  {
    title: '设备型号',
    dataIndex: 'nodeName', 
    key:'nodeName',
  },
  {
    title: '设备厂家',
    dataIndex: 'nodeName', 
    key:'nodeName',
  },
  {
    title: '设备缩略图',
    dataIndex: 'nodeName', 
    key:'nodeName',
  },
  {
    title: '当前设备数量',
    dataIndex: 'nodeName', 
    key:'nodeName',
  },
]
export default function Index() {
  const delref= useRef()
  const [form]=Form.useForm()
  const onDel=()=> {

  }
  const onEdit=()=> {

  }
  const onOkDel=()=> {}
  const title=(<TitleBox>
<span>配置路灯类型</span>
<Space><CustButtonT text="new"></CustButtonT><ExportExcel></ExportExcel></Space>
  </TitleBox>)
  return (
    <Pagecount>
      <Titlelayout layout="flex" title={title}>
        <div>
          <Form form={form} layout="inline">

          </Form>
        </div>
        <UserTable columns={cols} dataSource={[]}></UserTable>
      </Titlelayout>
        <CModal title="删除"  ref={delref} width={512} mold="cust" type="warn" onOk={onOkDel} >
                 是否确认删除备件？
               </CModal>
    </Pagecount>
  )
}

