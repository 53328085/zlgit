import { useEffect, useState, useRef, useContext } from "react";
import { Header, Card, StyledRadioGroup, AlarmWrapper } from "./style";
import {
    Form,
    Select,
    Input,
    InputNumber,
    Switch,
    Divider,
    Button,
    ConfigProvider,
    Space,
} from "antd";
import { CustButtonT, ExportExcel, ChartList } from "@com/useButton";
export const Tabs = ({ onValuesChange, form, onSearchAirData }) => {
    const { Item } = Form;

    const typeOptions = [
        { label: "全部", value: "1" },
        { label: "分体式空调", value: "2" },
        { label: "多联机空调", value: "3" },
        { label: "中央空调面板", value: "4" },
    ];
    const switchOptions = [
        { label: "全部", value: "1" },
        { label: "开启", value: "2" },
        { label: "关闭", value: "3" },
    ];
    return (
        <Header>
            <div className="form">
                <Form
                    form={form}
                    layout="inline"
                    onValuesChange={onValuesChange}
                    colon={false}
                >
                    <Item name="name" label="空调名称" style={{ marginLeft: 16 }}>
                        <Input placeholder="请输入空调名称"></Input>
                    </Item>
                    <Item name="name" label="空调编号" style={{ marginLeft: 16 }}>
                        <Input placeholder="请输入空调编号"></Input>
                    </Item>
                    <Item name="name" label="空调类型" style={{ marginLeft: 16 }}>
                        <Select options={typeOptions} style={{ width: "140px" }}></Select>
                    </Item>
                    <Item name="name" label="开关状态" style={{ marginLeft: 16 }}>
                        <Select options={switchOptions} style={{ width: "140px" }}></Select>
                    </Item>
                    <Item style={{ marginLeft: 16 }}>
                        <CustButtonT text="search" onClick={onSearchAirData}></CustButtonT>
                    </Item>
                </Form>
            </div>
        </Header>
    )
}
export const Tabs2 = ({ onValuesChange, form, onControlClick }) => {
    const { Item } = Form;

    const modelOptions = [
        { label: "制冷", value: "1" },
        { label: "制热", value: "2" },
        { label: "送风", value: "3" },
        { label: "除湿", value: "4" },
    ];
    const windOptions = [
        { label: "自动", value: "1" },
        { label: "低速", value: "2" },
        { label: "中速", value: "3" },
        { label: "高速", value: "4" },
    ];
    return (
        <div>
            <Form
                form={form}
                layout="inline"
                onValuesChange={onValuesChange}
                colon={false}
            >
                <Item name="name" label="开关" style={{ marginLeft: 16 }}>
                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
                </Item>
                <Item name="model" label="模式" style={{ marginLeft: 16 }}>
                    <Select options={modelOptions} style={{ width: "140px" }}></Select>
                </Item>
                <Item name="wind" label="风速" style={{ marginLeft: 16 }}>
                    <Select options={windOptions} style={{ width: "140px" }}></Select>
                </Item>
                <Item name="temperature" label="温度" style={{ marginLeft: 16 }}>
                    <InputNumber style={{ width: "140px" }} addonAfter="℃" />
                </Item>
                <Item style={{ marginLeft: 16 }}>
                    <CustButtonT text="控制" onClick={onControlClick}></CustButtonT>
                </Item>
            </Form>
        </div>
    )
}