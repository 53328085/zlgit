import styled from "styled-components";
import { Slider, Tag } from "antd";
export const Mainbox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 8px;
    background-color: #fff;
    padding: 0 16px;
    column-gap: 16px;
  }
`;
export const Frombox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 128px;
`;
export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const CSlider = styled(Slider)`
  && {
    .ant-slider-rail,
    .ant-slider-handle:focus,
    .ant-slider-track {
      background-color: transparent;
    }
    .ant-slider-handle {
      height: 20px;
      width: 20px;
    }
  }
`;
export const Scene = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  .scname {
  }
  .mainbox {
    display: grid;
    grid-template-columns: 802px 1fr;
    column-gap: 16px;
    height: 709px;
    flex: 1;
    overflow-y: auto;
    .leftlayout {
      display: flex;
      flex-direction: column;
      row-gap: 12px;
      padding: 4px;
      border:1px solid #dedede;
      .formboxwrap { 
        border-bottom: 1px solid ${props=>props.theme.primaryColor};
        .ant-form-item{
            margin-bottom: 12px;
          }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #d7d7d7;
          column-gap: 2px;
          padding: 2px 4px;
          margin-bottom: 12px;
          .list {
            display: flex;
            align-items: center;
            flex: 1;
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
          .ant-form-item{
            margin-bottom: 12px;
          }
        }
      }
    }
  }
`;
export const CTag = styled(Tag)`
  && {
    height: 24px;
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
`;
export const Bindwrap = styled.div`
  && {
    display: grid;
    grid-template-columns: 200px 1fr 90px 1fr;
    column-gap: 16px;
    grid-template-rows: 712px;
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
`;
