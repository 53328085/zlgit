import styled from "styled-components";
import {Tag} from 'antd'
export const Mainbox = styled.div`
display: flex;
flex:1;
flex-direction: column;
row-gap: 16px;
background-color: #fff;
padding: 16px;
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
`
export const Formbox = styled.div`
  .hander {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d7d7d7;
    column-gap: 2px;
    padding: 2px 4px;
    margin-bottom: 16px;
    .list {
      display: flex;
      align-items: center;
      flex:1;
      .ant-form-item {
       margin-bottom: 0px;
       width: 300px;
    }
      .tags {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
.formbox {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 128px;
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
  .active {
     color:${props => props.theme.primaryColor}
  }
 }
`