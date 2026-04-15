import styled, {css} from "styled-components";
import {Menu} from 'antd'
export const Sdiv = styled.div`
    display: grid;
    grid-template-rows: 70px 1fr;
    row-gap: 10px;
    height: inherit;
    .sidecontent {
       display: grid;
       padding: 0 6px;
       grid-template-columns: 1fr;
       grid-template-rows: 24px 1fr;
       row-gap: 10px;
    }
    .btn {
      margin-left: 8px;
      justify-self: flex-start;
    }
`
const sty = css`
height: 28px;line-height: 28px; font-size: 12px;
`
const styopc = css`
  fill:  rgba(${props=> props.rgb[0]}, ${props=> props.rgb[1]}, ${props=> props.rgb[2]}, 0.7);
`
const styopca = css`
  fill:  rgba(${props=> props.rgba[0]}, ${props=> props.rgba[1]}, ${props=> props.rgba[2]}, 0.7);
`
export const Cmenu = styled(Menu)`
   background: ${props=> props.theme.isdark ? "dark" : "none"};
   && {
    border-right: ${props=> props.theme.isdark ? "dark" : "none"};
   }
   &&  {
    overflow-y: auto;
    overflow-x: hidden;
   }
  
   .ant-menu-item {
     padding-left: 10px !important;
     display: flex;
     align-items: center;
     transition: padding 0.1s, width  0.3s cubic-bezier(.215,.61,.355,1);
     &::after{
      content: none;
     }
     ${props => props.laptop ? sty : ''}
    
   }
   .def{
     path {
      background-color: transparent;
     }
     
   }
   .custicon path:nth-of-type(1){
   ${styopc}
   }
   .custicon.PCSMonitor,
   .control.custicon.runtimeMonitor,
   .deviceLedger.custicon.ledger,
   .region.custicon.runtimeEnergy,
   .meterReading.custicon.cabinets
   {
    g path{
      ${styopc}
    }
   }
   .quality.custicon.runtimeDistribution{
    g{
      path {
        ${styopc}
      }
      path:last-of-type{
        fill:transparent
      }
    }
   }
   .summary.custicon.runtimeSolar,.propare.custicon.runtimeSolar{

        g {
          path:nth-of-type(1){
           fill: transparent;
          }
          path:nth-of-type(2){
          ${styopc}
        }
        }
      }
   .ant-menu-item.ant-menu-item-selected,.ant-menu-item:active{    
      border-radius: 6px;
      background-color:${props =>  props.theme.isdark ? "dark" : (props.theme.asiderbgcolorA || "#3333cc")} ;
      ${props => props.laptop ? sty : ''}     
      .ant-menu-title-content {
        color: ${props => props.theme.isdark ? "dark" : (props.theme.asiderfontcolorA || "#33FF00")};
      }
      .custicon path:nth-of-type(1) {
        ${styopca}
      }
      .custicon.PCSMonitor,.control.custicon.runtimeMonitor,.deviceLedger.custicon.ledger,.region.custicon.runtimeEnergy {
        g path{
          ${styopca}
        }
        
      }
      .summary.custicon.runtimeSolar,.propare.custicon.runtimeSolar{
        g { 
          path:nth-of-type(1){
           fill: transparent;
          }
          path:nth-of-type(2){
          ${styopca}
        }
        }
      }
      .quality.custicon.runtimeDistribution{
    g{
      path {
        ${styopca}
      }
      path:last-of-type{
        fill:transparent
      }
    }
   }
    }
   .ant-menu-title-content  {
     color: ${props => props.theme.isdark ? "dark" : (props.theme.asiderfontcolor || "#ffffff")};;
     display: inline-block;   
     padding-left: 10px;
     transition: padding 0.1s, width 0.3s cubic-bezier(.215,.61,.355,1);

     ${props => props.theme.laptop ? sty : ''}
  
    
   }
   &.ant-menu-inline-collapsed {
     .ant-menu-title-content {
      opacity: 0;
      display: none;
     }
     .ant-menu-item {
       padding-left: 0px !important;
       padding-right: 0px !important;
       justify-content: center;
     }
   }
   .ant-menu-submenu.ant-menu-submenu-inline{
     padding-left:10px;
    .ant-menu-submenu-title{
       padding-left: 0px !important;
       .ant-menu-submenu-arrow{
        color: #fff;
       }
    }
    .ant-menu.ant-menu-sub.ant-menu-inline {
        background-color: transparent;
        margin-left:9px;
        padding-left: 19px;
        .ant-menu-item{
            width: 150px;
           .ant-menu-title-content {
             padding-left: 0px;
           }
        }
    }
   }
   .ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-active.ant-menu-submenu-selected {
   //  background-color:${props =>  props.theme.isdark ? "dark" : (props.theme.asiderbgcolorA || "#3333cc")} ;
    .ant-menu-submenu-title{ 
       .ant-menu-submenu-arrow{
        color: ${props => props.theme.primaryColor};
       }
    }
   }
`