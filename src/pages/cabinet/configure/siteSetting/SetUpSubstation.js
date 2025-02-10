import React, { useState, useEffect } from 'react'
import styled, { css } from "styled-components";
import { Form, Select, Input, InputNumber, message, Drawer } from 'antd'

import Cupload from "@com/useUpload.js"

const { Item } = Form
const Content = styled.div`
width:900px;
margin: 50px auto;
&&{
    .form{
    display: flex;
    justify-content: space-between;
    }
.left{
    .flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
    .right{

        .imgbox {
            display: flex;
            background-color: #fff;
            width: 330px;
            height: 230px;
            box-sizing: border-box;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(215, 215, 215, 1);
            border-radius: 4px;
            padding: 16px;
           }
    }
}
`
export default function Index() {
    const [form] = Form.useForm()
    const rules = [
        { required: true }
    ]
    return (
        <Content>
            <Form form={form} layout="vertical" className='form'>
                <div className='left'>
                    <Item label="变电站名称" name="name" rules={rules}  >
                        <Input style={{ width: 420, height: 40 }} />
                    </Item>
                    <Item label="变电站地址" name="adress" rules={rules}  >
                        <Input style={{ width: 420, height: 40 }} />
                    </Item>
                    <div className='flex'>
                        <Item label="变电站容量(kVA)" name="rong" rules={rules}  >
                            <InputNumber style={{ width: 180, height: 40, lineHeight: '40px' }} min='0' />
                        </Item>
                        <Item label="变电站电压等级(kV)" name="grade" rules={rules}  >
                            <InputNumber style={{ width: 180, height: 40, lineHeight: '40px' }} min='0' />
                        </Item>
                    </div>
                </div>
                <div className='right'>
                    <Item label="变电站图片上传" name="image" rules={rules} >
                        {/* value={energyImage.current} onChange={onChnage} */}
                        <div className='imgbox'>
                            <Cupload wpx={1368} hpx={800} swpx={400} shpx={235} maximum={800} />
                        </div>
                    </Item>
                </div>
            </Form>
        </Content>
    )
}