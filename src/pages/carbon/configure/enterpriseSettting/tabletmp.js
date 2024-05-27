import React, {useState} from 'react'
import Usetable from '@com/useTable'
import {CLink} from '@com/useButton'
const columns = [
    {
      title:"",
      dataIndex: 'categoryName',
      key: 'categoryName',
     
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
      align: 'center'
    },
    {
      title: '操作',
      key: 'option',
      render: (_, record) => <CLink text="Modificationfactor" /> 
    }

  ]
export default function Index({tabledata, setSaveData}) { 

  const {categoryName, subCategory} = tabledata
  const rowspan = Array.isArray(subCategory) ?subCategory.length + 1 : 1
  columns[0].title = categoryName;
  columns[0].onCell= (_, index) => {

    if(index == 0) {
      return  ({ rowSpan: rowspan, style: {backgroundColor: "#e7effd"}})
     }else {
       return {rowSpan: 0}
     }
    /*   return {
        rowSpan: subCategory?.length ? subCategory?.length +1 : 1,
      }; */
    }
  const datas = subCategory.map((c) => ({categoryName, ...c}))
   
  return (
    <Usetable columns={columns} dataSource={datas} />  
  )
}
