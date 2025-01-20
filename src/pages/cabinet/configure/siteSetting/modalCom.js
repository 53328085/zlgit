import React, { useEffect, useRef, useState, useContext, createContext, forwardRef, useImperativeHandle } from 'react'

import Modal from '@com/useModal'

import { Form, Row, Col, Select, Input, Divider, Upload } from 'antd'
import upCloud from '../imgs/upcloud.png'
import style from './style.module.less'
import Table from '@com/useTable'
const { Dragger } = Upload;
// export const MyContext = createContext({ addopts: [], gatewaylist: [], devicelist: [], alarmopts: [] })
//删除modal组件
export let DeleteModal = ({ DelModalRef, name = '', content = '', ...other }) => {
  return (
    <Modal mold='cust' ref={DelModalRef} {...other} className={style.DelModal} type="warn" title={name}>
      {content}
    </Modal>
  )
}
//批量上传导入
export let MultImport = ({ modalImportRef, link = '/deviceExcel/gateway.xlsx', name = '', uploadprops, ...other }) => {
  return (
    <Modal mold='cust' ref={modalImportRef} {...other} title={name}>
      {/* <BlueColumn name={name} styled={{ padding: '24px 0px' }}></BlueColumn> */}
      <Dragger {...uploadprops} accept=".xlsx">
        <img src={upCloud}></img>
        <p style={{ margin: '32px 0', fontSize: 16 }}>导入Excel 文件，自动识别文件内容并导入变电站配置</p>
        <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', }}>点击上传</span></p>
        <a style={{ color: '#237ae4', textDecoration: 'underline', fontSize: 16 }} onClick={(e) => { e.stopPropagation() }} href={link}>下载模板</a>
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
//批量上传报错
export let ErrorMessage = forwardRef(
  (props, ref) => {
    const { ErrModalRef, ...other } = props
    const [list, setList] = useState([])
    useImperativeHandle(ref, () => ({
      setList
    }))
    const columns = [{
      title: '错误行',
      dataIndex: 'row'
    }, {
      title: '错误原因',
      dataIndex: 'cause'
    }]
    return (
      <Modal mold='cust' ref={ErrModalRef} {...other}>
        <Table columns={columns} dataSource={list} style={{ marginTop: 32 }} scroll={{
          y: 650
        }}></Table>
      </Modal>

    )
  }
)






