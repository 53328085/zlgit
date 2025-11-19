import React, { useState, useEffect } from 'react'
import Usetable from '@com/useTable'
export default function Index({ source, type, tabvalue }) {
  console.log(type)

  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [tab, setTab] = useState(1)
  const getData = () => {
    try {
      let keys = Object.keys(source[0])
      let cols = keys.map(k => ({
        title: k == "time" ? ['', '时间', "日期", "月份"][type] : k,
        dataIndex: k,
        key: k
      }))
      setColumns(cols)
      setDataSource(source)
      setTab(tabvalue)
    } catch (error) {

    }


  }
  useEffect(() => {
    if (Array.isArray(source) && source.length > 0 && Number.isInteger(type) && Number.isInteger(tabvalue)) {
      getData();
    }
  }, [type, source, tabvalue])
  return (
    <div style={{ padding: "16px 0" }}>
      <Usetable columns={columns} dataSource={dataSource} scroll={{
        y: tab == 0 ? 360 : 632
      }} />
    </div>
  )
}
