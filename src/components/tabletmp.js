import React, {useState} from 'react'
import {Switch} from 'antd'
import Usetable from '@com/useTable'
import {CustLink,} from '@com/useButton'

export default function Index({tabledata}) { 
  console.dir(tabledata)
  const {categoryName, subCategory} = tabledata

  const columns = [
    {
      title:categoryName,
      dataIndex: 'categoryName',
      key: 'categoryName',
    /*   onCell: () => ({
        rowSpan: subCategory?.length ?? 1,
      }) */
    },
    {
      title: '排放类型',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      align: 'center'
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center'
    },
    {
      
      title: '数值',
      dataIndex: 'carbonEmissionFactor',
      key: 'carbonEmissionFactor',
      align: 'center'
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      key: 'enabled',
      align: 'center',
      render: (text, record) => <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={text==1} />
    },
    {
      title: '操作',
      key: 'option',
      render: (_, record) => <CustLink text="Modificationfactor" /> 
    }

  ]
   
  const datas = subCategory.map((c) => ({categoryName, ...c}))
  console.log(datas)
  return (
    <Usetable columns={columns} dataSource={datas} />  
  )
}
