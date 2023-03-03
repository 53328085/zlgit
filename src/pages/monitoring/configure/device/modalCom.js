import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import WarningPng from '@imgs/warning.png'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { Form, Row, Col, Select, Input, Divider, Upload } from 'antd'
import upCloud from './imgs/upcloud.png'
import style from './style.module.less'
const { Dragger } = Upload;
// export const MyContext = createContext({ addopts: [], gatewaylist: [], devicelist: [], alarmopts: [] })
//删除modal组件
export let DeleteModal = ({ DelModalRef, name = '', content = '', ...other }) => {
  return (
    <Modal mold='cust' ref={DelModalRef} {...other} className={style.DelModal}>
      <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
      <div>
        <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
        <span>{content}</span>
      </div>
    </Modal>
  )
}
//批量上传导入
export let MultImport = ({ modalImportRef, name = '/deviceExcel/gateway.xlsx', ...other }) => {
  return (
    <Modal mold='cust' ref={modalImportRef} {...other}>
      <BlueColumn name="网关设备批量导入" styled={{ padding: '24px 0px' }}></BlueColumn>
      <Dragger>
        <img src={upCloud}></img>
        <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', }}>点击上传</span></p>
        <a style={{ color: '#237ae4', textDecoration: 'underline', fontSize: 16 }} onClick={(e) => { e.stopPropagation() }} href={name}>下载模板</a>
      </Dragger>
    </Modal>
  )
}
//计数器
export let Count = ({ value, onChange }) => {
  console.log(value)
  const [number, setNumber] = useState(0)
  const reduce = () => {
    number > 0 && number > 0 && setNumber(number - 1)
    onChange(number - 1)
  }

  const add = () => {
    setNumber(number + 1)
    onChange(number + 1)
  }
  const inpBlur = (e) => {


  }
  return (
    <div className={style.countNum}>
      <div onClick={reduce} className={style.opts} style={{ borderRight: 'none' }}>-</div>
      <Input className={style.numbers} defaultValue={number} onBlur={inpBlur} value={number} onChange={(e) => { setNumber(e.target.value); onChange(e.target.value) }} />
      <div onClick={add} className={style.opts} style={{ borderLeft: 'none' }}>+</div>
      <span style={{ paddingLeft: 16 }}>(秒)</span>
    </div>
  )
}







