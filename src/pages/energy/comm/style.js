import styled from "styled-components";
import {Radio} from "antd"
export const  Pagelayout = styled.div`
&&{
   /*  flex:1;
    display: grid;
    grid-template-rows: 48px 1fr;
    row-gap: 16px;
    .search {
        display: flex;
        align-items: center;
        padding: 16px;
        border: 1px solid #dedede;
        background-color: #fff;
    }
    .mainlayout { */
        display: grid;
        grid-template-columns: 296px 1fr;
        gap:16px;
        .slider {
      
        }
        .content {
            display: grid;
            grid-template-rows: 248px 1fr ;
            gap:16px;
            .uparea{
                display: grid;
                grid-template-columns: 1fr 1fr;
                column-gap: 16px;
            }
            .down {
                display: flex;
                .chart {
                    flex:1;
                    position: relative;
                    .tbwrap {
                        position: absolute;
                        width: 100%;
                    }
                }
            }
        }
   // }
}
`
export const Radiogroup = styled(Radio.Group)`
  && {
    .ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
      width: 96px;
      text-align: center;
      &:first-child {
        border-radius: 16px 0 0 16px;
      }
     &:last-child {
      border-radius: 0 16px 16px 0;
     }
    }
  }

`