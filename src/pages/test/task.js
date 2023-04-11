import { createContext, useReducer, useContext } from 'react';

 export const TasksContext = createContext(null);
 export const TasksDispatchContext = createContext(null);
 export function useTask() {
    return useContext(TasksContext)
 }
export function useTaskDispatch() {
    return useContext(TasksDispatchContext)
}
function tasksReducer(tasks, action) { // 创库 ， action 数据
    console.log(tasks)
    console.log(action)
    switch (action.type) {
      case 'added': {
        return [...tasks, {
          id: action.id,
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
  export default function TaskCompleted({children}) {
    const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)
    return (<TasksDispatchContext.Provider value={dispatch}>
           <TasksContext.Provider value={tasks}>
              {children}
           </TasksContext.Provider>
        
        </TasksDispatchContext.Provider>
    )
     
  }