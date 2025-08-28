import {Drawer} from "antd"
import styled from "styled-components"

export const CDrawer = styled(Drawer)`
&& {
  font-size: 14px;
  .ant-drawer-content-wrapper{
      top: 80px!important;
      width: 284px!important;
      height: calc(100% - 80px);
  //    height: 848px!important;
      // position: relative;
      margin-left: 48px;
      background: transparent;
      overflow: auto;
  }
  .ant-drawer-header{
      display: none;
  }
  .ant-drawer-content{
      background: transparent;
  }
  .ant-drawer-wrapper-body{
      background: transparent;
  }
  .ant-drawer-body{

      background-color: rgba(0, 0, 0, 0.6);
      padding: 16px!important;
  }
}

`