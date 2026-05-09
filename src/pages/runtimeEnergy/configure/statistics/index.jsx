import PageContent from '@com/pagecontent'
import UseTree from '@com/useTree'
import { Flex } from 'antd'
import React, { useEffect, useState } from 'react'


export default function Index() {
  const [treeId, setTreeId] = useState(0)

  useEffect(() => {
    console.log('treeId--->', treeId)
  }, [treeId])

  return (
    <PageContent bgcolor="transparent" pd="0">
      <Flex gap={12} style={{ minHeight: '100%' }}>
        <Flex style={{ width: 265 }}>
          <UseTree
            title="选择区域"
            areaId={0}
            multiple={false}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={0}
            energytype={1}
            allselect={false}
            showSearch={false}
          />
        </Flex>
        <Flex flex={1} gap={12} vertical></Flex>
      </Flex>
    </PageContent>
  )
}
