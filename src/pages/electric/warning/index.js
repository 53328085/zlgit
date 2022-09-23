import React from 'react'
import { Form, Select, Button, Checkbox } from 'antd'
import WarnContent from './warncontent'
import style from './style.module.less'

const { Item } = Form

export default function Index() {

  return (
    <div className={style.warning}>
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
                <Item label="报警类型">
                    <Select placeholder="" style={{ width: 280 }} size="default">
                        <Select.Option value="demo">1号楼</Select.Option>
                    </Select>
                </Item>
                
                <Item className={style.exportBtn}>
                    <div className={style.search}>导出</div>
                </Item>
            </Form>
        </div>
      <WarnContent style={style} />
    </div>
  )
}
