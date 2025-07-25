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
    height: 690px;
    overflow-y: scroll;
   .airIcon{
   width:30px;
   height:30px;
   }
   .airCardCold{
    border:none;
   color: #FFFFFF;
   background: linear-gradient(180deg, rgba(0, 51, 204, 1) 0%, rgba(0, 51, 204, 1) 0%, rgba(51, 204, 255, 1) 100%, rgba(51, 204, 255, 1) 100%);
   }
   .airCardHot{
        border:none;
       color: #FFFFFF;
       background: linear-gradient(180deg, rgba(0, 51, 204, 1) 0%, rgba(255, 150, 1, 1) 0%, rgba(243, 203, 116, 1) 81%, rgba(255, 201, 109, 1) 100%);
   }
   .airCardWindy{
       border:none;
       background: linear-gradient(180deg, rgba(163, 255, 231, 1) 0%, rgba(247, 247, 247, 1) 100%);
   }
   .airCardDehumidification{
       border:none;
       background: linear-gradient(180deg, rgba(240, 179, 181, 1) 0%, rgba(247, 247, 247, 1) 100%);
   }
    .closeAir{
      border:none;
       color: #5D5D5D;
       background: linear-gradient(180deg, rgba(218, 218, 218, 1) 0%, rgba(247, 247, 247, 1) 100%);
   }
   }
`;
