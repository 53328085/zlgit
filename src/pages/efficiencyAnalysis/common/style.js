import styled,{keyframes} from "styled-components";
export  const Mainwrap = styled.div`
&& {
   flex:1;
   display: grid;
   grid-template-columns: 1fr;
   grid-template-rows: 48px minmax(817px, auto);
   row-gap: 16px;
   color: #303133;
  .contentwrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 377px);
    gap:16px;
    .innerlayout{
       flex:1;
       display: grid;
       grid-template-rows: 1fr 34px;
        gap: 8px;
       .sublayout {
         grid-template-columns: repeat(2, 1fr);
         grid-template-rows: repeat(2, 122px);
         display: grid;
         gap:8px;
         .sub{
          background-color: #E5ECF5;
          padding: 14px;
          overflow: hidden;
          display: flex;
         }
         
         .sub.rows{
          display: flex;  
          background: #E5ECF5;
          padding: 0;
          .scrollbox {
            flex:1;
            .ant-carousel {
              .slick-slider{
                height: 100%; 
                  .slick-list {
                    height: 100% !important
                  }
              }
            }
            .ant-carousel .slick-list .slick-slide>div>div.row {
              display: flex !important;
              padding: 0 10px;
              align-items: center;
              height:30px;
              justify-content: space-between;
              .ant-typography {
                margin-bottom: 0;
              }
              
            }
            .ant-carousel .slick-list .slick-slide:nth-of-type(even)>div>div.row{
              background:rgba(80, 200, 255, 0.08);
            }
          }
         // overflow: hidden;
         .row {
              display: flex !important;
              padding: 0 10px;
              align-items: center;
              height:30px;
              justify-content: space-between;
              .ant-typography {
                margin-bottom: 0;
              }
              &:nth-of-type(even) {
                background:rgba(80, 200, 255, 0.08);
              }
            }
        }
 
        .sub.text {
           display: flex;
           flex-direction: column;
           .title{
            display: flex;
            justify-content: space-between;
            height: 20px;
            align-items: center;
           }
           .num{
             font-size: 34px;
             color:#1E50E6;
             display: flex;
             align-items: center;
             justify-content: center;
             flex:1;
           }

        } 
        .sub.chart{
          padding: 0;
          position: relative;
          .range {
            position: absolute;
            right: 12px;
            display: flex;
            column-gap: 8px;
            .step1 {
              .ant-badge-status-text {
                color: rgba(255, 177, 43, 1);

              }
            }
            .step2 {
              .ant-badge-status-text {
                color: rgba(255, 96, 33, 1);

              }
            }
          }
        }
       }
       .line{
        background: #E5ECF5;
        display: flex;
        align-items: center;
        padding:  0px 10px;
        overflow: hidden;
        .ant-typography{
          min-width: 20px;
          margin: 0;
          min-width: 80px;
        }
        .formulate{
          width: calc(100% - 80px);
          padding-right:8px;
          margin: 0;
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
  color: #303133;
  font-size: 15px;
`;
 
 
