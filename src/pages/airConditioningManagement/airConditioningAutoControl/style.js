import styled from "styled-components";
export const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 288px minmax(1384px, 1fr);
   grid-template-rows: minmax(817px, 1fr);
   column-gap: 16px;
   .left {
     background-color: #fff;
     height: 817px;
     padding: 16px;
     display: flex;
     flex-direction: column;
     row-gap: 8px;
     border-radius: 8px;
     border: 1px solid #d7d7d7;
     .title{
        color: #515151;
        font-weight: bold;
     }
     overflow: auto;
   }
   .right {
     display: flex; 
     .scheme{
     display: grid;
     grid-template-columns:  1fr 421px;
     column-gap: 16px;
     margin-bottom: 16px;
     padding: 10px 16px 16px 16px;
     border: 1px solid #d7d7d7;
     border-radius: 8px;
     .scheme_left{
   .desc {
      overflow-y: scroll;
       display: flex;
       flex-direction: column;
       gap: 16px;
       scrollbar-width: thin; 
       margin-top: 5px;
       .item {
      background: rgba(229, 236, 245, 0.3);
      padding: 16px;
      border-radius: 4px;
         .title {
           display: flex;
           justify-content: space-between;
           align-items: center;
           height: 34px;
           border-bottom: 1px solid #CCCCCC;
           font-weight: 600;
           font-size: 15px;
           color: #303133;
           .controlNum{
           font-weight: 600;
           font-size: 14px;
           color: #909399;
           margin-left: 16px;
           }
          
         }
            .controlData{
              display: grid;
              grid-template-columns: 340px 1fr;
              column-gap: 16px;
          }
           .titleName{
           font-weight: 600;
           font-size: 14px;
           color: #909399;
           margin:8px 0px;
          
           }
           .time{
          padding-left: 16px;
           .day{
           display: flex;
           margin-top: 5px;
           .daybox{
           width: 48px;
           height: 24px;
           line-height: 24px;
           border-radius: 4px;
           text-align: center;
           margin-right: 10px;
           background: rgba(144,147,153,0.1);
           color: #909399;
           }
            .nomal-text{
           background: rgba(144,147,153,0.1);
           color: #909399;
           }
           .green-text{
           background: rgba(70,199,255,0.1);
           color: #46C7FF;
           }
           .blue-text{
          background: rgba(30,80,230,0.1);
          color: #1E50E6;
           }
          .legal-holidays{
           width: 148px;
          }
           }
           }
           .schemeName{
           display: flex;
           padding-left: 16px;
           margin-bottom: 5px;
           .schemeTitle{
           font-weight: 700;
           width: 80px;
           }
            .con{
           margin-left: 8px;
           white-space: pre-wrap;
           }
           }
       }
     } 
    } 
     .scheme_right{
     .empty{
     overflow-y: scroll;
      border-radius: 4px;
      background: rgba(229, 236, 245, 0.3);
       display: flex;
       flex-direction: column;
       scrollbar-width: thin; 
     }
    .desc{
     overflow-y: scroll;
      border-radius: 4px;
      background: rgba(229, 236, 245, 0.3);
       display: flex;
       flex-direction: column;
       scrollbar-width: thin; 
       padding:16px;
       margin-top: 5px;
       .schemeName{
       margin-bottom: 10px;
       .title{
       font-weight: 700;
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