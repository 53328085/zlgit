import { useReducer, useState, useContext } from 'react';
import  TaskCompleted, {useTask, useTaskDispatch} from './task'
 
const AddTask= ( ) => {
  const dispatch = useTaskDispatch()
  const tasks = useTask()

  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
           id: nextId++,
           text: text,
           type: 'added',
        })
      }}>Add</button>
    </>
  )
}


const TaskList = ({ 
}) => {
  const tasks = useTask()
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task} 
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTaskDispatch()
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
              
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              text: e.target.value
            }
            
          });
        }}
      />
      {taskContent}
      <button onClick={() => dispatch({
        type: 'deleted',
        id: task.id
      })}>
        Delete
      </button>
    </label>
  );
}

 

export default function TaskApp() {
  
  return (
    <TaskCompleted>
      <div>
      <h1>Day off in Kyoto</h1>
      <AddTask
       
      />
      <TaskList 
      />
      </div>
    </TaskCompleted>
  );
}




