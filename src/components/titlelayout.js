import React from 'react'
import {Card } from 'antd'
import styled from 'styled-components'
const Boxdiv = styled(Card)`
  padding: ${props => props.pv};
  border-radius: 4px;
  border:  ${(props) =>  props.bordered=='y' ? ' 1px solid #d7d7d7' : 'none'};  
  display: grid;
  grid-template-rows: ${(props) => props.title ? `${props.hv || '32px'} 1fr` : '1fr'};
  flex:1;
  background-color: ${(props) =>  props.bgcolor || '#fff'};
  box-shadow: ${props => props.shadow=="y" ? `0px 2px 2px rgba(0, 0, 0, 0.349019607843137)` : 'none'} ;
  .ant-card-head {
    padding-left: ${({pl}) => pl || '16px'};
    border-left:  ${({bl, theme}) => bl || `4px solid ${theme.primaryColor}`};
    display: flex;
    align-items: center;
    border-bottom: none;
    min-height: ${(props) =>  props.hv || '32px'};
    /* height: ${(props) =>  props.hv || '32px'}; */
    height: ${(props) =>  props.hv || '32px'};;
    padding-right: 0px;
    background-color:${({bg}) => bg || '#fff'};
    z-index:${({zd}) => zd || 100};
  
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
  display: ${props => props.layout || 'block'};
  flex-direction: ${props => props.dr || 'row'};
  & .flex {
    display: flex;
    flex: 1;
  }
 }
`
Boxdiv.defaultProps = {
  bordered: 'y',
  pv: '16px'
}
export default function Titlelayout({title='', children, ...other}) {
  return (
    <Boxdiv title={title} {...other}> 
        {children}
    </Boxdiv>
  )
}
