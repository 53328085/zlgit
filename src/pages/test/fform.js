import { useState, useSyncExternalStore,useEffect } from 'react';
import { todosStore } from './todostore';
function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

export default function Index() {
  const [show, setShow] = useState(true);
  console.log(location);
  const changparams = () => {
 
   
 
    history.pushState({ page: 1 }, "title 1", "?page=1");
  }
  const onClick =() => {
     setShow(!show)
  }
  useEffect(()=> {
    window.onpopstate = function (event) {
      alert(
        "location: " +
          document.location +
          ", state: " +
          JSON.stringify(event.state),
      );
    };
  }, [])
   return (
    <div>
      <h1>订阅外部store</h1>
      <button onClick={changparams}>改变查询参数</button>
      <button onClick={() => history.back()}>back</button>
      <button onClick={() => history.go(-1)}>go</button>
      <button onClick={() => history.forward()}>forward</button>
      <div>
        <button onClick={onClick}>切换</button>
      </div>
      {show && <TodosApp />}
    </div>
   )
}