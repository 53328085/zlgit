import React from 'react'
import {nanoid} from '@reduxjs/toolkit'
import {Pagination} from 'antd'
import style from './style.module.less'
import Custcard from './custCard'

export default function Index(props) {
  let {dataSource, onChange, pagination} = props 
  return (
    <div className={style.cardLayout}>
      <div className={style.cardlist}>
          {dataSource.map(item => <Custcard device={item}  key={nanoid()}/>)}
      </div>
      <div style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
         <Pagination {...pagination} hideOnSinglePage={true} onChange={onChange} size="small"  showTotal={(total) => `共${total}条记录`}/>
      </div>
     </div> 
  )
}
