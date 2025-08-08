import styled from "styled-components";
import {Slider,Tag} from 'antd'
export const Mainbox = styled.div`
display: flex;
flex:1;
flex-direction: column;
row-gap: 16px;
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border: 1px solid rgba(204,204,204,1);
  border-radius: 8px;
  background-color: #fff;
  padding: 0 16px;
  column-gap: 16px;
 
}
`
export const Frombox = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
column-gap: 128px;

`
export const Title= styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`
export const CSlider = styled(Slider)`
&&{
    .ant-slider-rail,.ant-slider-handle:focus,.ant-slider-track{
        background-color: transparent;
    }
    .ant-slider-handle {
      height: 20px;
      width: 20px;
    }
}
`
export const Scene = styled.div`
  height: 709px;
  overflow-y: auto;
 .scene {
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  margin-bottom: 24px;
 position: relative;
  .del {
    position: absolute;
    right: 16px;
    bottom: 16px;
    font-size: 28px;
    cursor: pointer;
  }
  .hander {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d7d7d7;
    column-gap: 2px;
    padding: 2px 4px;
    .list {
      display: flex;
      align-items: center;
      flex:1;
      .ant-form-item {
       margin-bottom: 0px;
       width: 300px;
    }
      .tags {
        flex:1;
        display: flex;
      }
    }
  }
  .contents {
     display: flex;
     flex-wrap: wrap;
     column-gap: 16px;
  }
  .content {
    padding: 16px 8px;
    flex: 1;
    .ant-form-item {
      margin-bottom: 12px;
    }
  }
}
`
export const CTag = styled(Tag)`
 && {
  height: 32px;
  width: 127px;
  display: flex;
  align-items: center;
  margin-right: 0px;
  
  justify-content: space-between;
  cursor: pointer;
 }
`
export const Bindwrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  .switch {
    height: 58px;
    border: 1px solid #dedede;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    .switchform {
      flex:1;
      display: flex;
      .layout {
        flex:1;
        display:grid;
        grid-template-columns: auto repeat(3, 1fr);
        column-gap: 16px;
        .val {
          color:#868686
        }
      }
    }
  }
 .inwrap {
   display: grid;
   grid-template-columns: 200px 1fr 90px 1fr ;
   column-gap: 16px;
   grid-template-rows: 520px;
   .tbwrap {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    border: 1px solid #dedede;
    padding: 8px;
   }
   .handler {
     display: flex;
     flex-direction: column;
     justify-content: center;
     row-gap: 32px;
    
   }
  }

`