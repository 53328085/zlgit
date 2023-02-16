import React, {useState, useRef, useEffect, useCallback} from 'react'
import {Form, Space, Input, Button, Select} from 'antd'
import styled from 'styled-components'
// import Custmodl from '@com/useModal'
import {AreaSetting} from '@api/api.js'
 
const Item = Form.Item
const Boxitem = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 32px);
  row-gap: 32px;
  padding: 32px 0 16px 0;
  border-bottom: 1px dotted #dedede;
  .iptbox {
    display: grid;
    grid-template-columns: 320px 96px 96px 96px;
    column-gap: 16px;
  }
  .delbox {
    display: grid;
    grid-template-columns: 120px 112px;
    column-gap: 32px;
    .ant-btn {
      padding-left: 0;
      padding-right: 0;
    }
  }
`
export default function Region({projectId, CModal}) {
 const mref = useRef()
 const [form] = Form.useForm()
 const [modalform] = Form.useForm()
 const {QueryAreaLevels} = AreaSetting
 const [disabled, setDisabled] = useState(true)
 const {initialValues, setInitialValues} = useState({
    oneLever: '园区',
    twoLever: '建筑物',
    threeLever: '房间'
 })
 const [lever, setLever] = useState('')
const [title, setTitle] = useState()
const [datas, setDatas] = useState(null)
 const edit = (type) => {
    setTitle('修改区域名称')
    let l = ['', '一'][type]
    setLever(l)
    console.log(mref)
     mref.current.onOpen()
 }
 const add = () => {
    setTitle('新增区域')
     mref.current.onOpen()
 }
  const queryarealevels = async () => {
     try {
        let {success, data} = await QueryAreaLevels(projectId)
        success && setDatas(data)
     } catch (error) {
        console.log(error);
     }
  }
  const onFinish = () => {

  }
  const onOk = ()=> {
   
  }
 const numberFormat = useCallback((number) =>  new Intl.NumberFormat('zh-Hans-CN-u-nu-hanidec').format(number), [projectId])
  useEffect(() => {
     queryarealevels();
  }, [projectId])
  return (
    <div style={{flex: 1}}>
        <Form
        style={{width: '705px'}}
         form={form}
         onFinish={onFinish}
        >
         {
          
           datas?.map((d, index)=> (
            <Boxitem style={{paddingTop: 0}}>
               <span>{numberFormat(d.level)}级区域</span>
               <div className='iptbox'>                
                   <Item name={d.id.toString() + d.level} label="" initialValue={d.name}>
                   <Input  />
                   </Item>
                   <Button type='primary' ghost onClick={() => edit(1)}>修改区域</Button>
                   <Button type="primary" danger ghost disabled={index != datas?.length - 1}>删除</Button>
                   <Button type='primary' ghost onClick={() => edit(1)}>编辑字段</Button>
              </div>
            </Boxitem>
           ))


         }

         <Boxitem style={{borderBottom: 'none'}}>
             <div className='delbox'>
             <Button type="primary" onClick={add}>+新增下级区域</Button>
             <Button type="primary" >保存</Button>
             </div>
          </Boxitem>
         
        </Form>
        <CModal title={title} ref={mref}  mold="cust" width={512} okText="保存" onOk={onOk}>
             <Form name="modalform" ref={modalform}>
                 <Item name="name" label="区域名称">
                     <Input/>
                 </Item>
                 <Item name="use" label="区域用途">
                      <Select>
                         <Select.Option value="0">无</Select.Option>
                         <Select.Option value="1">楼层</Select.Option>
                         <Select.Option value="2">房间</Select.Option>
                      </Select>
                 </Item>
             </Form>
        </CModal>
    </div>
  )
}
