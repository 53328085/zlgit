import styled from "styled-components";
import { Radio } from "antd";
export const Container = styled.div`
  display: flex;
  .tree-box {
    height: 864px;
    flex-shrink: 0;
    max-width: 210px;
    display: flex;
    flex-direction: column;
  }
  .right-box {
    flex: 1;
    margin-left: 18px;
    display: grid;
    grid-template-rows: 48px 1fr;
    row-gap: 16px;
    .lightData {
      margin-top: 16px;
      width: 100%;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  background-color: #fff;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dedede;
  padding-right: 18px;
  overflow: hidden;
  border-radius: 4px;
  }
`;
export const CardBox = styled.div`
  border: 1px solid #d7d7d7;
  padding: 14px;
  background-color: #fff;
  .watchNum{
   display: flex;
   justify-content: space-between;
   margin-bottom: 16px;
  }
   .airBox{    
    height: 680px;
    overflow-y: scroll;
    
         flex:1;
         display: grid;
         grid-template-columns: repeat(auto-fill,185px);
         grid-auto-rows: 220px;
         justify-content: space-between;
         gap:16px;
        .airIcon{
        width:30px;
        height:30px;
        }
   
       .cardCommon{
        width: 185px;
        height:220px;
        padding: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        cursor: pointer;
        .top{
        display: flex;
        align-items: baseline;
        .topInfo{
        margin-left: 16px;
        .address{
        font-size: 16px;
        font-weight: 500;
        }
        .sn{
        font-size: 12px;
        }
        }
        }
        .content{
        font-size: 25px;
        .temperature{
        font-size: 40px;
        margin-right: 5px;
        }
        }
       }
   .airCardCold{
       color: #FFFFFF;
       background: linear-gradient(180deg, rgba(0, 51, 204, 1) 0%, rgba(0, 51, 204, 1) 0%, rgba(51, 204, 255, 1) 100%, rgba(51, 204, 255, 1) 100%);
   }
   .airCardHot{
       color: #FFFFFF;
       background: linear-gradient(180deg, rgba(0, 51, 204, 1) 0%, rgba(255, 150, 1, 1) 0%, rgba(243, 203, 116, 1) 81%, rgba(255, 201, 109, 1) 100%);
   }
   .airCardWindy{
       background: linear-gradient(180deg, rgba(163, 255, 231, 1) 0%, rgba(247, 247, 247, 1) 100%);
   }
   .airCardDehumidification{
       background: linear-gradient(180deg, rgba(240, 179, 181, 1) 0%, rgba(247, 247, 247, 1) 100%);
   }
    .closeAir{
       color: #5D5D5D;
       background: linear-gradient(180deg, rgba(218, 218, 218, 1) 0%, rgba(247, 247, 247, 1) 100%);
   }
   }
`;
