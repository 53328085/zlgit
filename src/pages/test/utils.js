export function createTodos() {
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
  
  export function filterTodos(todos, tab) {
    console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
    let startTime = performance.now();
    while (performance.now() - startTime < 500) {
       for(let i =0; i<1000; i++) {
         console.log(Math.random()*100*i)
       }
      // Do nothing for 500 ms to emulate extremely slow code
    }
    console.log(performance.now - startTime)
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
  