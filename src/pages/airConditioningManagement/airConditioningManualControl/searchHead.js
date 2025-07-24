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
export const Tabs = ({ onValuesChangeSearch, form, onSearchClick }) => {
    const { Item } = Form;
    // 空调类型 1.分体式空调 2.多联机空调外机 3.多联机空调内机 4.中央空调面板
    const typeOptions = [
        { label: "全部", value: 0 },
        { label: "分体式空调", value: 1 },
        { label: "多联机空调", value: 2 },
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
                    onValuesChange={onValuesChangeSearch}
                    colon={false}
                >
                    <Item name="alike" label="空调名称" style={{ marginLeft: 16 }}>
                        <Input placeholder="请输入空调名称"></Input>
                    </Item>
                    <Item name="cSn" label="空调编号" style={{ marginLeft: 16 }}>
                        <Input placeholder="请输入空调编号"></Input>
                    </Item>
                    <Item name="type" label="空调类型" style={{ marginLeft: 16 }}>
                        <Select defaultValue={0} options={typeOptions} style={{ width: "140px" }}></Select>
                    </Item>
                    <Item name="ioState" label="开关状态" style={{ marginLeft: 16 }}>
                        <Select defaultValue={0} options={switchOptions} style={{ width: "140px" }}></Select>
                    </Item>
                    <Item style={{ marginLeft: 16 }}>
                        <CustButtonT text="search" onClick={onSearchClick}></CustButtonT>
                    </Item>
                </Form>
            </div>
        </Header>
    )
}
export const Tabs2 = ({ onValuesChangeControl, form, onControlClick }) => {
    const { Item } = Form;

    const modelOptions = [
        { label: "制冷", value: 1 },
        { label: "制热", value: 2 },
        { label: "送风", value: 3 },
        { label: "除湿", value: 4 },
    ];
    const windOptions = [
        { label: "自动", value: 0 },
        { label: "低速", value: 1 },
        { label: "中速", value: 2 },
        { label: "高速", value: 3 },
    ];
    return (
        <div>
            <Form
                form={form}
                layout="inline"
                onValuesChange={onValuesChangeControl}
                colon={false}
            >
                <Item name="ioState" label="开关" style={{ marginLeft: 16 }}>
                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
                </Item>
                <Item name="workMode" label="模式" style={{ marginLeft: 16 }}>
                    <Select defaultValue={1} options={modelOptions} style={{ width: "140px" }}></Select>
                </Item>
                <Item name="windSpeed" label="风速" style={{ marginLeft: 16 }}>
                    <Select defaultValue={0} options={windOptions} style={{ width: "140px" }}></Select>
                </Item>
                <Item name="temperature" label="温度" style={{ marginLeft: 16 }}>
                    <InputNumber defaultValue={24} style={{ width: "140px" }} addonAfter="℃" />
                </Item>
                <Item style={{ marginLeft: 16 }}>
                    <CustButtonT text="控制" onClick={onControlClick}></CustButtonT>
                </Item>
            </Form>
        </div>
    )
}