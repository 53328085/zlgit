import { Flex } from "antd";
import styled from "styled-components";

const ContentText = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    font-style: normal;
`

const TitleText = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 13px;
    color: #606266;
    line-height: 21px;
    text-align: left;
    font-style: normal;
`

const CardContent = styled(Flex)`
    background: ${props => props.background};
    border-radius: 8px;
    padding: 14px;
`

const IconView = styled.div`
    width: 6px;
    height: 6px;
`

export default function CardView({ imgLogo, imgNotice, title, content, background, iconColor }) {
    return (
        <CardContent
            align="center"
            gap={14}
            background={background}
        >
            <img src={imgLogo} alt='' />
            <Flex vertical gap={9}>
                <Flex gap={6} align="center">
                    <IconView style={{ background: iconColor }} />
                    <TitleText style={{ color: iconColor }}>{title}</TitleText>
                    <img src={imgNotice} alt='' />
                </Flex>
                <ContentText>{content}</ContentText>
            </Flex>
        </CardContent>
    )
}