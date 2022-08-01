import React from "react";
class Divbox extends React.Component {
  
    render() {
      console.log(this.props)
      return(
        <div style={{position: 'absolute', left: this.props.mouse.x, top: this.props.mouse.y, height: '40px', width: '200px', transition: 'all 100ms'}}>
            <h1 style={{margin:0, padding:0}}>移动的文字</h1>
        </div>
        )
    }
}
class Mouse extends React.Component {
    constructor(props) {
      super(props);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.state = { x: 0, y: 0 };
      console.log(props)
    }
  
    handleMouseMove(event) {
      console.log(event)
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    }
  
    render() {
        //console.log(this.props)
      return (
        <div style={{ height: '100vh'}} onMouseMove={this.handleMouseMove}>
  
          {/* ...但我们如何渲染 <p> 以外的东西? */}
          {this.props.children(this.state)}
        </div>
      );
    }
  }
  
  /* class MouseTracker extends React.Component {
    render() {
      return (
        <>
          <h1>移动鼠标!</h1>
          <Mouse children={mouse=> <Divbox mouse={mouse} a='a' />} />
        </>
      );
    }
  } */
  function withMouse(Component) {
      return class extends React.Component {
          render() {
              return (
                  <Mouse children={mouse => <Component {...this.props} mouse={mouse}></Component>} ></Mouse>
              )
          }
      }
  }
  const MouseTracker = withMouse(Divbox)
  export default MouseTracker