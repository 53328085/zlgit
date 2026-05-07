import styled from "styled-components";

export const Treecontainer = styled.div`
  && {
    overflow: hidden;
    flex: 1;
    scrollbar-width: thin;
    color: #303133;
    .treeName {
      font-weight: bold;
      margin-bottom: 8px;
    }

    .treebox {
      display: grid;
      grid-template-rows: ${(props) =>
        props.showline == "false" ? "32px 32px 1fr" : "32px 32px 32px 556px"};
      row-gap: 16px;
      flex: 1;
      height: 100%;
      .allselect {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ant-checkbox-label {
              color: #303133;
        }
      }
      .ant-tree-title {
       color: #303133;
      }
    }
  }
`;
