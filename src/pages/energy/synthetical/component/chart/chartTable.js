import React, { useState, useEffect } from 'react'
import Usetable from '@com/useTable'
export default function Index({ source, type }) {
  console.log(type)

  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])

  console.log(source)
  console.log(columns)
  const getData = () => {
    try {
      let keys = Object.keys(source[0])
      console.log(keys)
      let cols = keys.map(k => ({
        title: k == "time" ? ['', '时间', "日期", "月份"][type] : k,
        dataIndex: k,
        key: k
      }))
      console.log(cols)
      setColumns(cols)
      setDataSource(source)
    } catch (error) {
        console.log(error)
    }


  }
  useEffect(() => {
    if (Array.isArray(source) && source.length > 0 && Number.isInteger(type)) {
      getData();
    }
  }, [type, source])
  return (
    <div style={{ padding: "16px 0" }}>
      <Usetable columns={columns} dataSource={dataSource} scroll={{
        y:  632
      }} />
    </div>
  )
}
