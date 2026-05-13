import { Flex } from "antd"
import styled from "styled-components"
import { formatGrowth, formatNumber } from "../Constant"
import { ReactComponent as IconDown } from '../icon/down.svg'
import { ReactComponent as IconUp } from '../icon/up.svg'

const MainView  = styled(Flex)`
    flex: 1;
    height: 96px;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 0 14px;
`

const Title = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #303133;
    line-height: 22px;
`

const Unit = styled.div`
    font-family: Helvetica;
    font-size: 13px;
    color: #909399;
    line-height: 16px;
    text-align: left;
    font-style: normal;
`

const Value = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 22px;
    color: #276FFF;
    line-height: 30px;
    text-align: left;
    font-style: normal;
`

const Desc = styled.div`
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 13px;
    color: #909399;
    line-height: 18px;
    text-align: left;
    font-style: normal;
`

const Rate = styled.div`
    color: ${props => props.color};
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    text-align: left;
    font-style: normal;
`


export default function HeadCardView({
    title = '',
    icon = null,
    unit = '',
    value = 0,
    rate = 0,
    desc = '',
}) {        
  
  return (
    <MainView align='center' gap={14}>
      {icon}
      <Flex vertical>
        <Flex align='baseline' gap={4}>
            <Title>{title}</Title>
            <Unit>{unit}</Unit>
        </Flex>
        <Value>{formatNumber(value, true, 2)}</Value>
        <Flex align='baseline' gap={6}>
            <Desc>{desc}:</Desc>
            <div dangerouslySetInnerHTML={{ __html: formatGrowth(formatNumber(rate, false, 2)) }}></div>
            {rate >= 0 ? <IconUp /> : <IconDown />}
        </Flex>
      </Flex>
    </MainView>
  )
}