import React from 'react'
import {Card } from 'antd'
import styled,{css} from 'styled-components'
const custsty = css`
.ant-card-body{
  row-gap: ${props => props.dr ? (props.rgap || "16px") : 0 } 
}
  
`
const Boxdiv = styled(Card)`
 // padding: ${props => props.pv};
  border-radius: ${props => props.rad || props.theme.cardRadius+'px'};
  border:  ${(props) =>  props.bordered=='y' ? ' 1px solid #d7d7d7' : 'none'};  
  display: grid;
  grid-template-rows: ${(props) => props.title ? `auto 1fr` : '1fr'};
  flex:1;
  background-color: ${(props) =>  props.bgcolor || '#fff'};
  box-shadow: ${props => props.shadow=="y" ? `0px 2px 2px rgba(0, 0, 0, 0.349019607843137)` : 'none'} ;
  overflow: hidden;
  .ant-card-head {
    padding-left: ${({pl}) => pl || '20px'};
   // border-left:  ${({bl, theme}) => bl || `4px solid ${theme.primaryColor}`};
    display: flex;
    align-items: center;
    border-bottom: none;
    min-height: ${(props) =>  props.hv || props.theme.cardHeadHeight+'px'};
  //  height: ${(props) =>  props.hv || (props.theme.laptop ? '24px' : '40px')};;
    height: ${(props) =>  props.hv || props.theme.cardHeadHeight+'px'};
    padding-right: ${({pr}) => pr || '20px'};
    background-color:${(props) => props.bg || props.theme.cardHeadBg};
    z-index:${({zd}) => zd || 100};
    position: relative;
          &::before {
            display: block;
            width:3px;
            height:13px;
            position: absolute;
            left: ${({pt}) => pt || '20px'};
            background-color: ${({bl, theme}) => bl  ?  bl=="none" ? "transparent" : bl : theme.primaryColor };
          }  
      }
    .ant-card-head-wrapper {
      flex:1;
      height: inherit;
      .ant-card-head-title {
         font-size: ${({fz}) => fz || '15px'};
         color: ${({fc, theme}) => fc || theme.cardHeadlColor};
         padding: 0 0 0 11px;
        
    }
    .ant-card-extra {
      padding: 0px;
    }
  }
  .ant-card-type-inner .ant-card-head {
    background-color: transparent;
  }
 .ant-card-body {
  padding: ${props => props.pv || "20px"};
 //  padding: ${props => props.bodypad || "20px"};
  display: ${props => props.layout || 'block'};
  flex-direction: ${props => props.dr || 'row'};
  overflow: auto; 
  & .flex {
    display: flex;
    flex: 1;
  }
 
 }
 ${props=> props.custsty}
`
Boxdiv.defaultProps = {
  bordered: 'y',
  pv: '20px',
  bodypad: '0px'
}
export function TitlelayoutOv({title='', children, ...other}) { // 项目概述
  return (
    <Boxdiv title={title} pv="16px" hv="24px" pl="16px" pr="16px" pt="16px"  {...other} shadow={false}> 
        {children}
    </Boxdiv>
  )
}
export default function Titlelayout({title='', children, ...other}) {
  return (
    <Boxdiv title={title} {...other}> 
        {children}
    </Boxdiv>
  )
}
