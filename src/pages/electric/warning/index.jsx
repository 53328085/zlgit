import React from 'react'
import { Form, Select, Button, Checkbox } from 'antd'
import WarnContent from './warncontent'
import style from './style.module.less'
import { useSelector } from 'react-redux'
import total from '../imgs/total.png'
import first from '../imgs/first.png'
import second from '../imgs/second.png'
import third from '../imgs/third.png'

const { Item } = Form
export default function Index() {
    const projectId = useSelector(state => state.system.menus.projectId)
    const arealist = useSelector(state => state.system.onelevel)
    const onelevel = arealist[0].levelName
    return (
        <div className={style.warning}>
            <div className={style.header}>
                <Form
                    layout='inline'
                    className={style.formstyle}
                >
                    <Item label="园区选择" >
                        <Select
                            style={{ width: 200 }}
                            options={[{ name: onelevel, id: 0 }, ...arealist]}
                            fieldNames={{ label: 'name', value: 'id' }}
                            defaultValue={0}
                        >
                        </Select>
                    </Item>
                </Form>
            </div>
            <div style={{display:'flex'}}>
                <Card />
                <Card />
                <Card />
                <Card />
            </div>

            <WarnContent style={style} />
        </div>
    )
}

let Card = ({ png = total }) => {
    const divcss = {
        width: 320,
        height: 64,
        border: '1px solid #d7d7d7',
        background: '#fff',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        fontSize: 18,
        marginTop: 16,
        marginRight: 16
    }
    return (
        <div style={divcss}>
            <img src={png} alt="" />
            <span style={{ fontSize: 16, paddingLeft: 16 }}>告警总数</span>
            <div style={{ marginLeft: 'auto' }}>2000</div>
        </div>
    )
}
