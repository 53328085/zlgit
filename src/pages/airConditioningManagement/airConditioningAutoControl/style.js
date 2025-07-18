import styled from "styled-components";
export const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 210px minmax(1462px, 1fr);
   grid-template-rows: 1fr;
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
     grid-template-columns:  1fr 600px;
     column-gap: 16px;
     .scheme_left{
   .desc {
      overflow-y: scroll;
      height: 320px;
      border-radius: 5px;
      border-bottom-right-radius: 0px;
       border-bottom-left-radius: 0px;
       border:1px solid rgba(215,215,215,1);
       display: flex;
       flex-direction: column;
       flex:1;
       margin-bottom: 16px;
       .item {
         .title {
           display: flex;
           align-items: center;
           height: 34px;
           background-color: rgba(236, 245, 255, 1);
           color:#515151;
           padding-left: 8px;
         }
           .titleName{
           color:var(--ant-primary-color);
           margin:6px 0px;
           padding-left: 8px;
          
           }
           .time{
           padding:15px 8px;
           border-radius: 3px;
           background-color: rgba(247, 251, 254, 0.752941176470588);
           border: none;
           .day{
           display: flex;
           .daybox{
           width: 46px;
           height: 22px;
           border-radius: 4px;
           border:1px solid rgba(81, 81, 81, 1);
           text-align: center;
           margin-right: 10px;
           }
           }
           }
           .schemeName{
           display: flex;
           lign-items: center;
           .schemeTitle{
           font-weight: 700;
           padding-left: 8px;
           width: 100px;
           }
            .con{
           margin-left: 8px;
           height: 28px;
           line-height: 28px;

           }
           }
       }
     } 
    } 
     .scheme_right{
    .desc{
     overflow-y: scroll;
      height: 320px;
      border-radius: 5px;
      border-bottom-right-radius: 0px;
       border-bottom-left-radius: 0px;
       border:1px solid rgba(215,215,215,1);
       display: flex;
       flex-direction: column;
       flex:1;
       padding:16px;
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