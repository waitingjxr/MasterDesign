import login_info from "./login_info"

let user_reducer = (state = {...login_info.state}, action) => {

  console.log("执行了user_reducer")
  let newState = JSON.parse(JSON.stringify(state))

  for(let key in login_info.actionNames){
    if(action.type === login_info.actionNames[key]){
      login_info.actions[login_info.actionNames[key]](newState, action)
      break
    }
  }


  return newState
}

export default user_reducer