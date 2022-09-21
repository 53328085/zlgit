import React from 'react'
import {Card} from 'antd'
import styled from 'styled-components'
const Boxdiv = styled(Card)`
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #d7d7d7;
  display: grid;
  grid-template-rows: ${(props) => props.title ? `${props.hv || '32px'} 1fr` : '1fr'};
  flex:1;
  background-color: #fff;
  .ant-card-head {
    padding-left: ${({pl}) => pl || '16px'};
    border-left: ${({bl}) => bl || '4px solid #237ae4'};
    display: flex;
    align-items: center;
    border-bottom: none;
    min-height: ${(props) =>  props.hv || '32px'};
    height: ${(props) =>  props.hv || '32px'};
    padding-right: 0px;
    .ant-card-head-wrapper {
      flex:1;
      height: inherit;
      .ant-card-head-title {
         font-size: ${({fz}) => fz || '14px'};
         color: ${({fc}) => fc || '#515151'};
         padding: 0px;
      }
    }

  }
  .ant-card-type-inner .ant-card-head {
    background-color: transparent;
  }
 .ant-card-body {
  padding: 0;
 }
`
export default function Titlelayout({title='', children, ...other}) {
  return (
    <Boxdiv title={title} {...other}>       
        {children}
    </Boxdiv>
  )
}
