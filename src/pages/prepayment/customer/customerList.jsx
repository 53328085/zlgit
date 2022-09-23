import React from 'react'
import { Form, Select, Input,Button } from 'antd'
import style from './style.module.less'
import  UseTable from '@com/useTable'
import dashed from '@imgs/dashed.png'
import {columns} from './columns'
const { Item } = Form
const { Option } = Select
const { Search } = Input;
export default function CustomerList() {
    return (
        <div>
            <Form layout='inline'>
                <Item label="客户查询">
                    <Input 
                    addonAfter={<div style={{ width: 96 }}>查询</div>} 
                    defaultValue="mysite" 
                    style={{ width: 549 }}
                    size="default"
                    />
                </Item>
                <div className={style.line}></div>
                <Item >
                    <Select placeholder="区域选择" size="default" className={style.selects}>
                        <Option></Option>
                    </Select>
                </Item>
                <Item >
                    <Select placeholder="建筑选择" size="default" className={style.selects}>
                        <Option></Option>
                    </Select>
                </Item>
                <Item>
                    <Select placeholder="楼层选择" size="default" className={style.selects}>
                        <Option></Option>
                    </Select>
                </Item>
                <Item >
                    <Select placeholder="房间选择" size="default" className={style.selects}>
                        <Option></Option>
                    </Select>
                </Item>
                <Item style={{marginLeft:'auto',marginRight:0}}>
                    <Button size='default' type='primary'>
                    开户
                    </Button>
                </Item>
               
                    
                
            </Form>
            <img src={dashed} alt="" className={style.dash}/>
            <UseTable columns={columns}></UseTable>
        </div>
    )
}
