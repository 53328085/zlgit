import React from 'react'
import { Form,Select,Button } from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import style from './style.module.less'
export default function DevopSearch() {
    const { Item } = Form

    
    return (
        <div className={style.header}>
            <Form 
            layout='inline'
            className={style.formstyle}
            >
                <Item label="区域选择" >
                    <Select style={{width:330}} size="default">
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Item>
                <Item>
                    <Select  placeholder="全部建筑物" style={{width:200}} size="default">
                        <Select.Option value="demo">1号楼</Select.Option>
                    </Select>
                </Item>
                <Item>
                    <Select placeholder="全部楼层" style={{width:200}} size="default">
                        <Select.Option value="demo" >1层</Select.Option>
                    </Select>
                </Item>
                <Item>
                   <div className={style.search}><SearchOutlined />&nbsp; 查询</div>
                </Item>
            </Form>
            <div className={style.check}>
                
            </div>
        </div>
    )
}
