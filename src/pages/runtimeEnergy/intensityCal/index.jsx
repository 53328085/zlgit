import PageContent from '@com/pagecontent'
import styled from 'styled-components'
import TitleLayout from '@com/titlelayout'
import React from 'react'

const CustomPageContent = styled(PageContent)`
    margin-bottom: 16px;
`

export default function Index () {
  return (
    <CustomPageContent bgcolor="transparent" pd="0">
      <TitleLayout title="能耗强度分析" key="intensityCal">
        <div style={{ padding: '20px', minHeight: '400px' }}>
          <p>能耗强度分析页面内容</p>
        </div>
      </TitleLayout>
    </CustomPageContent>
  )
}
