import styled from "styled-components";

export const Transbox  =styled.div`
  &&{
    flex:1;
    display: grid;
    grid-template-columns: 160px 1fr;
    grid-template-rows: 1fr;
    column-gap: 16px;
    .imgbox {
     overflow: hidden;
     .img {
        max-width: 100%;
     }
    }
    .list{
      font-size: 13px;
      color: rgba(96, 98, 102, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item {
        position: relative;
        padding-left: 16px;
        display: flex;
        column-gap: 8px;
        &&::before{
          position: absolute;
          content: " ";
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(30, 80, 230, 1);
          top: 50%;
          transform: scaleY(-3px);
        }
    
      .value{
        color: rgba(48, 49, 51, 1);
        font-weight: bold;
      }
    }
    }
  }


`