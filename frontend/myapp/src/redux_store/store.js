import { combineReducers, legacy_createStore, compose, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import handleUser from "./UserStatus/user_reducer"


// 组合各个模块的reducer
const reducers = combineReducers({
  handleUser,
})





// 为了让浏览器正常使用redux_devtools插件，添加下面这句
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 

// const store = legacy_createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && 
//   window.__REDUX_DEVTOOLS_EXTENSION__())


// 判断有没有__REDUX_DEVTOOLS_EXTENSION_COMPOSE__这个模块
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):compose
// 把仓库数据，浏览器redux-dev-tools和reduxThunk插件关联在store中
const store = legacy_createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))

export default store