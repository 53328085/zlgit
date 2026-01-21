import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState, useEffect } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Transfer } from 'antd'

const DeviceSettingDialog = ({ onRefreshClick }, ref) => {
  const modalRef = useRef()
  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])

  const showDialog = useMemoizedFn((params) => {
    initData()
  })

  const initData = useMemoizedFn(() => {
    const newTargetKeys = []
    const newMockData = []
    for (let i = 0; i < 2000; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: i % 2 === 0,
      }
      if (data.chosen) {
        newTargetKeys.push(data.key)
      }
      newMockData.push(data)
    }
    setTargetKeys(newTargetKeys)
    setMockData(newMockData)
  })

  useImperativeHandle(ref, () => ({
    showDialog
  }))

  const onChange = (newTargetKeys, direction, moveKeys) => {
    console.log(newTargetKeys, direction, moveKeys)
    setTargetKeys(newTargetKeys)
  }

  return (
    <CustomModal
      ref={modalRef}
      title=""
      width={800}
      footer={null}
      mold="cust"
    >
      <Transfer
        showSearch
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={onChange}
        render={item => item.title}
        pagination
      />
    </CustomModal>
  )
}

export default forwardRef(DeviceSettingDialog)
