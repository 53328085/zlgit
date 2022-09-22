import React from 'react'
import { Form, Select, Button, Checkbox } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import style from './style.module.less'
export default function DevopSearch({ischeck=false}) {
    const { Item } = Form
    const optionsWithDisabled = [
        { label: '待处理', value: '1' },
        { label: '处理中', value: '2' },
        { label: '已完成', value: '3'},
      ];
    return (
        <div className={style.header}>
            <Form
                layout='inline'
                className={style.formstyle}
            >
                <Item label="区域选择" >
                    <Select style={{ width: 330 }} size="default">
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Item>
                <Item>
                    <Select placeholder="全部建筑物" style={{ width: 200 }} size="default">
                        <Select.Option value="demo">1号楼</Select.Option>
                    </Select>
                </Item>
                <Item>
                    <Select placeholder="全部楼层" style={{ width: 200 }} size="default">
                        <Select.Option value="demo" >1层</Select.Option>
                    </Select>
                </Item>
                <Item>
                    <div className={style.search}><SearchOutlined/>&nbsp; 查询</div>
                </Item>
            </Form>
            <div className={style.check}>
               {ischeck?<Checkbox.Group
                    options={optionsWithDisabled}
                    defaultValue={[]}  
                />: null} 
            </div>
        </div>
    )
}
