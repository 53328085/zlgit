 
import styled, {css} from "styled-components";
import imgurl from './imgs'
export const   Mainbox = styled.div`
display: grid;
flex: 1;
grid-template-columns: 752px 1fr ;
column-gap: 16px;
align-content: stretch;
.left {
    background-color: ${props=> props.theme.imgbgcolor || "#ffffff"};
    display: flex;
.topology {
       position: relative;
      
       .zhanwei{
                  width: 750px;
                  height: 696px;
              }
              .storageMeter{
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  flex-direction: column;
                  position: absolute;
                  left: 202px;
                  top: 338px;
                  padding: 6px 12px;
                  width: 164px;
                  height: 80px;
                  border: 1px solid #41A4B9;
                  background-color: #003;
                 
              }
              .transformer{
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  flex-direction: column;
                  position: absolute;
                  right: 130px;
                  top: 163px;
                  padding: 4px 12px;
                  width: 164px;
                  height: 80px;
                  border: 1px solid #41A4B9;
                  background-color: #003;
                 
              }
              .batterys{
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  flex-direction: column;
                  position: absolute;
                  right:214px;
                  top: 338px;
                  padding: 4px 12px;
                  width: 164px;
                  height: 80px;
                  border: 1px solid #41A4B9;
                  background-color: #003;
              }
              .meterData{
                      display: flex;
                      align-items: center;
                      span{
                          display: inline-block;
                          text-align: right;
                          height: 20px;
                          line-height: 20px;
                          font-size: 12px;
                          color: #fff;
                      }
                      span:first-child{
                          width: 38px;
                          text-align: left;
                      }
                      span:nth-child(2){
                          width: 67px;
                          font-size: 14px;
                      }
                      span:last-child{
                          width: 32px;
                          color: #c9c9c9;
                      }
                  }
              .transPlaceholder{
                  position: absolute;
                  width: 136px;
                  height: 136px;
                  left: 76px;
                  top: 364px;
                  cursor: pointer;
              }
              .batteryPlaceholder{
                  position: absolute;
                  width: 136px;
                  height: 136px;
                  left: 76px;
                  top: 549px;
                  cursor: pointer;
              }
     }
    }
.right {
   display: grid;
   grid-template-rows:200px 1fr;
   row-gap: 16px;
   .rightup {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 16px;
      height: 200px;
      
       
   }
   .rightdown {
     display: flex;
      flex-direction: column;
      background-color: #fff;
      .chartbox {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .power {
            flex: 1;
             display: grid;
             grid-template-rows: repeat(2, 1fr);
             gap:16px;
             .down {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
             }
        }
      }
   }
}
`
export const Station =styled.div`
  display: grid;
  grid-template-columns:150px 1fr;
  gap: 16px;
  flex: 1;
  .imgbox { 
     width: 150px;
     height: inherit;
     background-image: url(${imgurl["bg"]});
     background-size: cover;
     overflow: hidden;
  }
`