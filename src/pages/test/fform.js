import { repeat } from 'lodash';
import { memo, useState, useMemo, forwardRef, useRef, useImperativeHandle } from 'react';

 
const createTodos = () => {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

 function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  const onhandler =useMemo(() => {
    return  () => console.log(tab)
  }, [])
  return (
    <>
    <div style={{display: "grid", gridTemplateColumns: 'repeat(8, 1fr)', columnGap: "16px"}}>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
    
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      </div>
      <hr />
      <TodoList
        
        tab={tab}
        theme={isDark}
        Aist={List}
      />
    </>
  );
}
 
const TodoList =memo(({tab, theme, Aist }) => {
   console.log('todolist')

  return (
    <div>
      <h4>{tab}</h4>
      <h5>{theme}</h5>
      <Aist/>
    </div>
  );
})


const List = function List() {
  console.log('List')

  return (
     <div>
      <h2>List</h2>
     </div>
  );
};




// 1. 多个组件间转发 ref 2. 暴露方法