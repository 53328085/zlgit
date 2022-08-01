import {legacy_createStore as createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk' // 异步action
import countReducer from './reducers/count'
import Person from './reducers/person'
const reducers = combineReducers({data: countReducer, persons: Person}) // 组合reducers, 返回总的状态对象
const store  = createStore(reducers, {data: {counter: 10, sum: 0}, persons: [{name: 'zl', age: 42, id: 'ddf'}]}, applyMiddleware(thunk))
export default store