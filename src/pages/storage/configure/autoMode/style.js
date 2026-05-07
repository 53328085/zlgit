import styled , {css} from 'styled-components';
import {Calendar} from 'antd';
 const viesty = css`
   grid-template-columns: 1fr 1fr;
   padding: 16px;
 `
export  const CustCalendar = styled(Calendar)`
  && {
   
    .ant-picker-calendar-header {
        justify-content: flex-end !important;
    }
     .ant-picker-content th {
        border: 1px solid #d7d7d7;
        background-color: #f0f9ff;
        font-weight: bold;
        color:#515151;
        height: 64px;
    }
    .ant-picker-panel {
        border-top: none;
        .ant-picker-body {
            padding: 0px;
        }
        
    }
    .ant-picker-cell {
        border: 1px solid #d7d7d7;
        color:#ccc;
        background-color: #f2f2f2;
        cursor: default;
        padding: 0px;
      //  cursor: not-allowed

    }
    .ant-picker-cell.ant-picker-cell-in-view {
        background-color: #fff;
        color:#515151;
        span.el {
            color: ${props => props.theme.primaryColor};
        }
    }
  }

`
export const Viewbox = styled.div`
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 516px 1fr ;
  //  grid-template-rows: 405px;
   column-gap: 16px;
   padding: 16px 32px 32px 32px;
   align-items: stretch;
   flex:1;
    .detl {
      //  height: 365px;
      //  border: 1px solid rgba(215, 215, 215, 1); 
       // margin-top: 40px;

        display: flex;
        flex-direction: column;
       .title {
       
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f9ff;
        color: #fff;
        font-size: 16px;
       } 
       .content {
        padding: 16px;
        display: grid;
        grid-auto-rows: auto 4px 1fr;
        row-gap: 16px;
        flex: 1;
        .num {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color:#666;
           // width: 470px;
            line-height: 1.5;
        }
       }
       .item {
        width: 4px;
        height: 36px;
        background-color: rgba(0, 153, 51, 1);
        border: none;
        border-radius: 0px;
       }
       .list {
       /*  display: flex;
        justify-content: space-between; */
        display: grid;
        grid-template-columns: repeat(96, 4px);
        column-gap: 1px;
        border: 1px solid #d7d7d7;
        padding: 1px;
       }
       .dsitme {
      /*   display: flex;
        justify-content: space-between;
        align-items: center; */
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        line-height: 2;
        span:nth-of-type(2){
           justify-self: center;
        }
        span:last-child{
          justify-self: end;
        }
       }
       .dstrategy {
        flex: 1;
        overflow: auto;
       }
    }
   ${props=> props.theme.laptop ? viesty : null}
`
export const Sblock = styled.span`
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: ${props => props.bg};
    margin-right: 4px;
    &::after {
        content: attr(text);

    }
`