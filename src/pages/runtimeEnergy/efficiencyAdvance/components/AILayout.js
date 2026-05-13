import { Flex, Input } from "antd";
import aiIcon from "../icon/ai_logo.png";
import { CustButton } from "@com/useButton";
import { useState } from "react";
import EmptyAIResultIcon from "../icon/ai_result_empty.png";
import styled from "styled-components";

const AILayoutView = styled(Flex)`
    width: calc(40% - 12px);
    height: 100%;
    background: linear-gradient( 180deg, #FFFFFF 0%, #1E50E6 100%);
    border-radius: 8px;
    padding: 8px 19px 20px 19px;
`

const Title = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #1E50E6;
    line-height: 20px;
    text-align: left;
    font-style: normal;
`

const InputContent = styled(Flex)`
    background: rgba(255,255,255,0.9);
    border-radius: 8px;
    padding: 12px;
    margin-top: 6px;
`

const ResultContent = styled(Flex)`
    flex: 1;
    width: 100%;
    background: rgba(255,255,255,0.9);
    border-radius: 6px;
    padding: 12px;
    margin-top: 20px;
`

const Result = styled.div`
    height: 100%;
    overflow: auto;
`
const EmptyText = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #303133;
    line-height: 20px;
    text-align: left;
    font-style: normal;
`

export default function AILayout() {

    const [result, setResult] = useState('')

    return (
        <AILayoutView vertical>
            <Flex align="center" gap={11}>
                <img src={aiIcon} alt="" />
                <Title>我是您的AI能效分析助手，输入分析需求帮您高效节能～</Title>
            </Flex>
            <InputContent gap={12} vertical align="flex-end">
                <Input.TextArea
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    styled={{ width: '100%' }}
                    placeholder="请详细描述您的分析需求，例如:分析生产车间A第一季度的用电情况，从错峰生产的角度给出生产建议..."
                />
                <CustButton>开始分析</CustButton>
            </InputContent>
            <ResultContent align="center" justify="center">
                {result ? <Result /> : (
                    <Flex vertical align="center" gap={12}>
                        <img src={EmptyAIResultIcon} alt="" />
                        <EmptyText>输入分析需求帮您高效节能</EmptyText>
                    </Flex>
                )}
            </ResultContent>
        </AILayoutView>
    )
}
