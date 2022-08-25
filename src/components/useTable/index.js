import React from 'react'
import {Table} from 'antd'
import styled from 'styled-components'
export default function index(props) { 
  const {pagination, ...otherprops} =props
  const paginationProp = Object.assign( {}, {
    hideOnSinglePage: true,
    showTotal: (total) => `共${total}条记录`
  }, pagination)

  const Divbox = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    justify-content: space-between;
  `
  const Tablecom = styled(Table)`
    display: flex;
    flex:1;
    flex-direction: column;
    .ant-spin-nested-loading, .ant-spin-container {
      display: flex;
      flex:1;
      flex-direction: column;
      justify-content: space-between;
    }
  `
  return (
    <Divbox>
       {/*  <Tablecom {...props} bordered   onChange={changePage} size="small"  pagination={pagination} /> */}
        <Tablecom { ...otherprops} bordered   size="small"  pagination={paginationProp}  />
    </Divbox>
  )
}
