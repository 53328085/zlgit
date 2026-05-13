import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import styled from 'styled-components'
import CModal from '@com/useModal'

const ContentText = styled.div`
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 13px;
  color: #303133;
  line-height: 18px;
  text-align: left;
  font-style: normal;
`

const SectionTitle = styled.div`
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 13px;
  color: #303133;
  line-height: 18px;
  text-align: left;
  font-style: normal;
  margin-bottom: 8px;
`

function ComputerDescModal(_, ref) {
  const modalRef = useRef(null)

  const showModal = () => {
    modalRef.current?.onOpen()
  }

  useImperativeHandle(ref, () => ({
    showModal
  }))

  return (
    <CModal
      title="计算说明"
      ref={modalRef}
      mold="cust"
      footer={null}
      closable={true}
      width={592}
    >
      <ContentText>
        <SectionTitle>标准依据:</SectionTitle>
        <div style={{ marginLeft: 16, marginBottom: 16 }}>《综合能耗计算通则》(GB/T2589-2020)</div>
      </ContentText>
      <ContentText>
        <SectionTitle>折标系数:</SectionTitle>
        <div style={{ marginLeft: 16, marginBottom: 16 }}>
          <div>煤炭 0.7143 kgce/kg</div>
          <div>天然气 0.0013 kgce/m³</div>
          <div>电力 0.1229 kgce/kWh</div>
          <div>热力 0.0341 kgce/MJ</div>
        </div>
      </ContentText>
      <ContentText>
        <SectionTitle>计算公式:</SectionTitle>
        <div style={{ marginLeft: 16 }}>综合能耗=∑(各能源品种消费量×折标系数)</div>
      </ContentText>
    </CModal>
  )
}

export default forwardRef(ComputerDescModal)