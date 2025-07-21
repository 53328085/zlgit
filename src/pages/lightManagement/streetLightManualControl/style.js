import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 210px 1fr;
   grid-template-rows: 1fr;
   column-gap: 16px;
   .left {
     background-color: #fff;
     height: 817px;
     .title{
        color: #515151;
        font-weight: bold;
        padding: 8px;
        line-height: 2;
     }
     overflow: auto;
   }
   .right {
     display: grid;
     grid-template-rows: 65px 1fr;
     row-gap: 16px;
     .up {
        height: 65px;
        padding: 16px;
        background-color: #fff;
     } 
     .content {
       flex:1;
       display: flex;
       flex-direction: column;
       row-gap: 16px;
       .tip {
        display: flex;
        align-items: center;
        justify-content: space-between;
       }
       .lights {
         flex:1;
         display: grid;
         grid-template-columns: repeat(auto-fill,170px);
         grid-auto-rows: 201px;
         justify-content: space-between;
         .light { 
        width: 170px;
        height: 201px;
        background: linear-gradient(180deg, rgba(0, 51, 204, 1) 0%, rgba(0, 51, 204, 1) 0%, rgba(51, 204, 255, 1) 100%, rgba(51, 204, 255, 1) 100%);
        color:#fff;
        padding: 8px;
        overflow: hidden;
        .ant-checkbox-wrapper {
          span {
            color: #fff;
          }
        }
        .img {
          width: 50%;
        }
       }
       .light.close { 
         color:rgb(13, 12, 12);
         background: linear-gradient(180deg, rgba(218, 218, 218, 1) 0%, rgba(247, 247, 247, 1) 100%); 
         .ant-checkbox-wrapper {
          span {
            color: rgb(13, 12, 12);
          }
        }
       }
       }
   
     
     }
   }

}
`
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;