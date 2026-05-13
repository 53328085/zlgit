import React, { useState } from 'react'
import PageContent from '@com/pagecontent'
import EfficiencyAdvanceTrend from './components/EfficiencyAdvanceTrend'
import EnergyDispatchOptimization from './components/EnergyDispatchOptimization'
import { Flex } from 'antd'
import styled from 'styled-components'
import AILayout from './components/AILayout'



export default function Index() {
  const [currentYear, setCurrentYear] = useState(2025)

  return (
    <PageContent bgcolor="transparent" pd="0">
      <Flex gap={12} style={{ minHeight: '100%' }}>
        <Flex vertical gap={12} style={{ minHeight: '100%', width: '60%' }}>
          <EfficiencyAdvanceTrend currentYear={currentYear} style={{ flex: 1 }} />
          <EnergyDispatchOptimization />
        </Flex>
        <AILayout />
      </Flex>
    </PageContent>
  )
}
