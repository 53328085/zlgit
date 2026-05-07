import { useEffect, useState, useRef, useContext } from "react";
import { Header ,Control} from "./style";
import {
    Form,
    Select,
    Input,
    InputNumber,
    Switch,
} from "antd";
import { CustButtonT, ExportExcel, ChartList } from "@com/useButton";
export const Tabs = ({ form, onSearchClick }) => {
    const { Item } = Form;
    // 空调类型 1.分体式空调 2.多联机空调外机 3.多联机空调内机 4.中央空调面板
    const airTypeOptions = [
        { label: "全部", value: 0 },
        { label: "分体式空调", value: 1 },
        { label: "多联机空调", value: 3 },
        { label: "中央空调面板", value: 4 },
    ];
    const switchOptions = [
        { label: "全部", value: 0 },
        { label: "开启", value: 1 },
        { label: "关闭", value: 2 },
    ];
    return (
        <Header>
            <div className="form">
                <Form
                    form={form}
                    layout="inline"
                    colon={false}
                    className="condition"
                    initialValues={{
                        alike: '',
                        cSn: '',
                        type: 0,
                        ioState: 0
                    }}
                >
                    {/* <Item name="alike" label="空调名称" style={{ marginLeft: 16 }}>
                        <Input placeholder="请输入空调名称"></Input>
                    </Item>
                    <Item name="cSn" label="空调编号" style={{ marginLeft: 16 }}>
                        <Input placeholder="请输入空调编号"></Input>
                    </Item> */}
                    <Item name="alike" label="关键字" style={{ marginLeft: 16, fontWeight: 400 }}>
                        <Input style={{ width: "240px" }} placeholder="请输入空调名称/空调编号" allowClear ></Input>
                    </Item>
                    <Item name="type" label="空调类型" style={{ marginLeft: 16, fontWeight: 400 }}>
                        <Select options={airTypeOptions} style={{ width: "140px" }}></Select>
                    </Item>
                    <Item name="ioState" label="开关状态" style={{ marginLeft: 16, fontWeight: 400 }}>
                        <Select options={switchOptions} style={{ width: "140px" }}></Select>
                    </Item>
                    <Item style={{ marginLeft: 16 }}>
                        <CustButtonT text="search" onClick={onSearchClick}></CustButtonT>
                    </Item>
                </Form>
            </div>
        </Header>
    )
}
export const Tabs2 = ({ form, onControlClick }) => {
    const { Item } = Form;

    const modelOptions = [
        { label: "制冷", value: 1 },
        { label: "除湿", value: 2 },
        { label: "送风", value: 3 },
        { label: "制热", value: 4 },
        // { label: "自动", value: 5 },
    ];
    const windOptions = [
        { label: "高速", value: 1 },
        { label: "中速", value: 2 },
        { label: "低速", value: 3 },
        // { label: "微风", value: 4 },
        { label: "自动", value: 5 },
    ];
    // 监听开关变化并手动设置表单值
    const handleSwitchChange = (checked) => {
        // 明确设置值：开->1，关->2
        form.setFieldValue('ioState', checked ? 1 : 2);
    };
    return (
        <Control>
            <Form
                form={form}
                layout="inline"
                colon={false}
                className="control"
                initialValues={{
                    ioState: 1,
                    workMode: 1,
                    windSpeed: 5,
                    temperature: 24,
                }}
            >
                <Item name="ioState" label="开关" style={{ marginLeft: 16 }}>
                    <Switch checkedChildren="开" unCheckedChildren="关"
                        onChange={handleSwitchChange} defaultChecked />
                </Item>
                <Item name="workMode" label="模式" style={{ marginLeft: 16 }}>
                    <Select options={modelOptions} style={{ width: "140px" }}></Select>
                </Item>
                <Item name="windSpeed" label="风速" style={{ marginLeft: 16 }}>
                    <Select options={windOptions} style={{ width: "140px" }}></Select>
                </Item>
                <Item name="temperature" label="温度" style={{ marginLeft: 16 }}>
                    <InputNumber style={{ width: "140px" }} addonAfter="℃" />
                </Item>
                <Item style={{ marginLeft: 16 }}>
                    <CustButtonT text="控制" onClick={onControlClick}></CustButtonT>
                </Item>
            </Form>
        </Control>
    )
}