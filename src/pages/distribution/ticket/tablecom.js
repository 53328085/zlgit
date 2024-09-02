import React from 'react'
import {Space} from 'antd'
import Usetable from '@com/useTable'
import {CustButton,   CustLink } from '@com/useButton'
export default function Index({columns, value,datas=[], onChange}) {

    const edit = (record) => {

    }
    const ondel = (id) => {

    }
    const mcolumns = [
        ...columns,
        {
            title: '操作', 
            key: 'op',
            align: 'center',
            width: 130,
            render(record){
               return <Space><CustLink text="edit" onClick={()=> edit(record)} /><CustLink text="delete" type="danger" onClick={() =>ondel(record.id)} /></Space>
            }
          },
      ]
  return (
    <Usetable columns={mcolumns}  dataSource={value}  hbg="#d3e4fa"  hbc="#515151"  /> 
  )
}
