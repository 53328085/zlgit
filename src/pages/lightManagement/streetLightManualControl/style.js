import styled from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 288px 1fr;
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
     height: 817px;
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
        min-height: 22px;
       }
       .lights {
         flex:1;
         display: grid;
         grid-template-columns: repeat(auto-fill,minmax(210px,1fr));
         grid-auto-rows: 200px;
         justify-content: space-between;
         gap:14px;
         overflow: auto;
        
         .light { 
     //   width: 170px;
      //  height: 201px;
        position: relative;
        border-radius: 16px;
        background: linear-gradient( 180deg, #88A2B5 0%, #3E6399 100%);
        color:#fff;
        padding: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        cursor: pointer;
         
        .ant-checkbox-wrapper {
          flex:1;
          display: flex;
          span:nth-of-type(2) {
            flex:1;
            display: flex;
             flex-direction: column;
             color: #fff;
             align-self: stretch;
             justify-content: space-between;
           
          } 
        }
        .imgbox { 
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          top:50%;
          left:0;
          transform: translateY(-50%);
          height: 86px;
          overflow: hidden; 
          .img {
           max-height: 100%;
        }
        }
        .offline {
           display: flex;
           flex:1;
           justify-content: center;
           align-items: center;
            font-size: 28px;
            text-align: center;
            color: #909399;
            font-weight: 500;
            padding-right: 12px;
          }
        .value {
              display: flex;
              justify-content: space-between;
              color:#F1F3F5;
              font-size: 13px;
             }
       }
       .light.close { 
         color:rgb(13, 12, 12);
         background: #ECF3FD;
         .ant-checkbox-wrapper {
          span {
            color:#303133;
          }
        }
       }
       }
       .light.line{
        .imgbox {
          padding-right: 0;
        }
        justify-content: space-between;
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