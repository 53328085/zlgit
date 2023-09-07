import {createContext, useReducer} from 'react'
export const TasksContext = createContext(null)
export const TasksDispatchContext = createContext(null)

export default  TasksProvider = ({children}) => {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)
    return (
       <TasksContext.Provider value={tasks}>
         <TasksDispatchContext.Provider>
            {children}
         </TasksDispatchContext.Provider>
       </TasksContext.Provider>
    )
}

function tasksReducer(tasks, action) {
    switch (action.type) {
      case 'added': {
        return [...tasks, {
          id: nextId++,
          text: action.text,
          done: false
        }];
      }
      case 'changed': {
        return tasks.map(t => {
          if (t.id === action.task.id) {
            return action.task;
          } else {
            return t;
          }
        });
      }
      case 'deleted': {
        return tasks.filter(t => t.id !== action.id);
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  
  let nextId = 3;
const initialTasks = [
    { id: 0, text: 'Philosopher’s Path', done: true },
    { id: 1, text: 'Visit the temple', done: false },
    { id: 2, text: 'Drink matcha', done: false }
  ];