import React, {useEffect, useState} from 'react'
import {Tree, message, Spin} from 'antd'
import styled from 'styled-components'
import {Carbon} from '@api/api'
import Titlelayout from "@com/titlelayout"
import {useRequest} from 'ahooks'
const CTree = styled(Tree)``

export default function Index({enterpriseId, setTreeId}) {
    const [checkedId, setCheckedId] = useState([])
    let arrid = []
    const getreeid = (data) => {
        data.forEach(d => {
             arrid.push(d.id)
            if(Array.isArray(d.nodes)) {
                getreeid(d.nodes)
            }
        })
    }
    const getData =async () => {
        if(Number.isInteger(enterpriseId)) {
            let {success, errMsg, data} = await   Carbon.QueryCarbonBoundary(enterpriseId)
            if(success && Array.isArray(data) && data.length >0) {
                getreeid(data)
                setTreeId(arrid)
                setCheckedId([...arrid])
                return data
            

            }else {
                if(!success) message.warning(errMsg || '数据出错')
                setTreeId([])
                return []
            }
      }
    }

  const {data, error, loading} =useRequest(getData, {
    refreshDeps: [enterpriseId],
  })
 
  const onCheck = (v) => {
    setCheckedId(v);
    setTreeId(v)
  }
  return (
    <Titlelayout layout="flex">
        <div style={{flex: 1}}>
         { loading  ?   <Spin />
           : <CTree checkable checkedKeys={checkedId}  onCheck={onCheck} defaultExpandedKeys={[data[0]?.id]} treeData={data} fieldNames={{title: 'name', key: 'id',children: 'nodes'}} height={654} />
           }
       </div>
    </Titlelayout>
  )
}
