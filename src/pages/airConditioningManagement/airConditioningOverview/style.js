import styled from "styled-components";
export const Container = styled.div`
  display: flex;
  flex: 1;
  .tree-box {
    height: 864px;
    flex-shrink: 0;
    max-width: 210px;
    display: flex;
    flex-direction: column;
    width: 210px;
  }
  .right-box {
    flex: 1;
    margin-left: 18px;
    /* display: grid;
    grid-template-rows: 48px 233px 1fr; */
    
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
  padding-left:16px;
`;