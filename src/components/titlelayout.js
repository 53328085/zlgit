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
  border-radius: ${props => props.rad || "8px"};
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
    min-height: ${(props) =>  props.hv || (props.theme.laptop ? '24px' : '40px')};
  //  height: ${(props) =>  props.hv || (props.theme.laptop ? '24px' : '40px')};;
    height: ${(props) =>  props.theme.laptop ? '24px' : '40px'};
    padding-right: ${({pr}) => pr || '20px'};
    background-color:${({bg}) => bg || '#DEE7F2'};
    z-index:${({zd}) => zd || 100};
    position: relative;
          &::before {
            display: block;
            width:3px;
            height:13px;
            position: absolute;
            left: 20px;
            background-color: ${({bl, theme}) => bl  ?  bl=="none" ? "transparent" : bl : theme.primaryColor };
          }  
      }
    .ant-card-head-wrapper {
      flex:1;
      height: inherit;
      .ant-card-head-title {
         font-size: ${({fz}) => fz || '15px'};
         color: ${({fc}) => fc || '#303133'};
         padding: 0 0 0 11px;
        
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
   
  & .flex {
    display: flex;
    flex: 1;
  }
 
 }
  
`
Boxdiv.defaultProps = {
  bordered: 'y',
  pv: '20px',
  bodypad: '0px'
}
export default function Titlelayout({title='', children, ...other}) {
  return (
    <Boxdiv title={title} {...other}> 
        {children}
    </Boxdiv>
  )
}
