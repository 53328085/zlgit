import React, {useState, useRef} from 'react'
import {Form, Space, Input, Button} from 'antd'
import styled from 'styled-components'
import Custmodl from '@com/useModal'
const Item = Form.Item
const Boxitem = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 32px);
  row-gap: 32px;
  padding: 32px 0 16px 0;
  border-bottom: 1px dotted #dedede;
  .iptbox {
    display: grid;
    grid-template-columns: 320px 96px 96px;
    column-gap: 16px;
  }
  .delbox {
    display: grid;
    grid-template-columns: 432px 96px;
    column-gap: 16px;
  }
`
export default function Datagroup() {
 const mref = useRef()
 const [form] = Form.useForm()
 const [disabled, setDisabled] = useState(true)
 const {initialValues, setInitialValues} = useState({
    oneLever: '园区',
    twoLever: '建筑物',
    threeLever: '房间'
 })
 const [lever, setLever] = useState('')
const [title, setTitle] = useState()
 const edit = (type) => {
    setTitle('修改区域名称')
    let l = ['', '一'][type]
    setLever(l)
    console.log(mref)
     mref.current.onOpen()
 }
 const add = () => {
    setTitle('新增区域名称')
     mref.current.onOpen()
 }
  return (
    <div style={{flex: 1}}>
        <Form
        style={{width: '545px'}}
      
         initialValues={initialValues}
         form={form}
        >
            
          <Boxitem style={{paddingTop: 0}}>
             <span>一级区域</span>
             <div className='iptbox'>                
                    <Item name="oneLever" label="">
                    <Input  />
                    </Item>
                    <Button type='primary' ghost onClick={() => edit(1)}>修改</Button>
                    <Button type="primary" danger ghost disabled={disabled}>删除</Button>
             </div>
          </Boxitem>
          <Boxitem >
             <span>二级区域</span>
             <div className='iptbox'>                
                    <Item name="twoLever" label="">
                    <Input  />
                    </Item>
                    <Button type='primary' ghost>修改</Button>
                    <Button type="primary" danger ghost disabled={disabled}>删除</Button>
             </div>
          </Boxitem>
          <Boxitem >
             <span>三级区域</span>
             <div className='iptbox'>                
                    <Item name="threeLever" label="">
                    <Input  />
                    </Item>
                    <Button type='primary' ghost>修改</Button>
                    <Button type="primary" danger ghost >删除</Button>
             </div>
          </Boxitem>
          <Boxitem style={{borderBottom: 'none'}}>
             <div className='delbox'>
             <Button type="primary" ghost onClick={add}>新增下级区域</Button>
             <Button type="primary" >保存设置</Button>
             </div>
          </Boxitem>
        </Form>
        <Custmodl title={title} ref={mref}  mold="cust" width={512} okText="保存">
             <div style={{display:"flex", alignItems: "center"}}>
                 <span>{lever ? `${lever}级` : ''}区域名称&nbsp;&nbsp;</span>
                 <Input style={{flex: 1}} />
             </div>
        </Custmodl>
    </div>
  )
}
