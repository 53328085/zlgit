import React from "react";
import  {render} from "react-dom";
import {s8, createDiv, rectangle} from '@topology/core'

const reactNodesData = {};
const reactNodes = (ReactComponent) => (ctx, node) => {
    console.log(ctx)
    console.log(node)
    rectangle(ctx, node);
    if(!ReactComponent) {
        return;
    }
    if(!node.elementId) {
        node.elementId = s8();
    }

    if (!node.elementLoaded) {
        // 创建一个div容器
        reactNodesData[node.id] = {
          div: createDiv(node)
        };
        node.elementLoaded = true;
        document.body.appendChild(reactNodesData[node.id].div);
        
        // 添加当前节点到div层，否则无法显示
        node.addToDiv();
     
        // 初始化 react 组件
        if(node && node.data && node.data.props) {
          reactNodesData[node.id].component = render(
            <ReactComponent {...node.data.props} />,
            reactNodesData[node.id].div
          );
        }
     
        node.elementRendered = false;
      }
     
      // 节点的elementRendered用于判断第三方图形库是否需要重绘
      // 绘画引擎需要重绘节点时，会把此属性设置为false
      if (!node.elementRendered) {
        // 初始化时，等待父div先渲染完成，避免初始图表控件太大。
        setTimeout(() => {
          // 重绘完成，避免不必要的重复重绘
          node.elementRendered = true;
        });
      }
     
 

}
export default reactNodes