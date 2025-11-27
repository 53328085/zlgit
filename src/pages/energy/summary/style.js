import styled from "styled-components";
import {Tag} from 'antd'
export const Mainbox = styled.div`
  && {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    .content {
      flex: 1;
      display: grid;
      grid-template-columns: 1250px 422px;
      column-gap: 16px;
      .right {
        display: grid;
        flex:1;
        grid-template-rows: auto 140px 278px minmax(278px, 1fr);
        row-gap: 16px;
        .ant-tabs-nav {
            margin-bottom: 0;
        }
        .itembox {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #dddfe6;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          column-gap: 14px;
          flex-direction: column;
          .up {
            display: flex;
            align-items: center;
            column-gap: 14px;
            .desc {
            flex: 1;
            display: flex;
            flex-direction: column;
            color: #303133;
            font-size: 16px;
            justify-content: space-between;
            .num {
              color: ${(props) => props.theme.primaryColor};
              font-size: 22px;
              font-weight: 400;
              line-height: 1.5;
            }
            .num2 {
              font-size: 13px;
              color:#606266;
            }
          }
          }
          .down{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
          }
        }
      }
    }
  }
`;
export const Ctag = styled(Tag)`
&&{
  position: absolute;
  left: ${props => props.left+'px'};
  top: ${props=> props.top+12+'px'};
  transform: translate(-50%, -50%);
  cursor: pointer;
}
`
export const TitP = styled.div`
  && {
    width: 291px;
    min-height: 172px;
    opacity: 0.8;
    background: rgba(29,51,116);
    color: #fff;
    border-radius: 8px;
    left: ${props => props.left+'px'};
    top: ${props=> props.top+32+'px'};
    position: absolute;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    z-index: 1;
    padding: 16px;
    row-gap: 8px;
    .title {     
      color: #fff;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px; 
    }
    .contentbox {
     // background-color: rgba(255,255,255,0.6);
     
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex:1;
      .tipcontent {
         display: flex;
         justify-content: space-between;
         align-items: center;
      }
    }
  }
`