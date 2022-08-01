import React, { PureComponent } from 'react'
export default function getUseinfo(Component) { // 属性代理
    return class extends PureComponent {
        state = {
            userInfo: {}
        }
        componentDidMount() {
            let user =localStorage.getItem('userInfo')
             this.setState({userInfo: JSON.parse(user)})
        }
        render() {
            console.log(this.props)
            return <Component {...this.props} userInfo={this.state.userInfo}></Component>
        }
    }
}
export function ChildComponent(Component) { // 反向继承
  return class extends Component {
      constructor(props) {
          super(props)
          this.state = {
              count: 1001
          }
      }
      componentDidMount() {
          console.log('高价组件被渲染')
      }
       render() {
        const el = super.render()
       // console.log(el)

        return  this.props.show && super.render()
       }
       
           
           
  }
}
