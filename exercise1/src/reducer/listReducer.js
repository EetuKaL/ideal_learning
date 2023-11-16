

export function listReducer(state, action) {
    switch (action.type) {
      case 'set_initial_state_from_storage': {
        return {...state,
          leftList: action.leftList.length() > 0 ? action.leftList.leftList : state.leftList,
          rightList: action.rightList.length() > 0 ? action.rightList.rightList : state.rightList
        }
      }
      case 'switch_list': {
        // Create later on one dynamic function to handle both sides.
        switch(action.side) {
            case 'left': {
              let newState = {
                ...state,
                leftList: state.leftList.filter(item => {
                    if (item.selected === true) {
                        state.rightList.push({ ...item, selected: false });
                        return false; // If selected, don't return back to leftlist.
                    }
                    return true; // If not selected, keep item in the leftList
                })
            };
            return newState;
            }
            case 'right' : {
              let newState = {
                ...state,
                rightList: state.rightList.filter(item => {
                    if (item.selected === true) {
                        state.leftList.push({ ...item, selected: false });
                        return false; // If selected, don't return back to rightlist.
                    }
                    return true; // If not selected, keep item in the rightList
                })
            };
            return newState;
            }
            default: break;
        }
    }
        
      case 'select_item': {
            
          const side = action.side
          const index = action.index
          let newState = Object.assign({}, state);
            
          if (side === 'left'){
            newState.rightList.forEach(item => {
              item.selected = false
            });
            newState.leftList[index].selected = !newState.leftList[index].selected
          } 
          else{
            newState.leftList.forEach(item => {
              item.selected = false
            });
            newState.rightList[index].selected = !state.rightList[index].selected
            
          }
          newState.itemIsSelected_left = newState.leftList.some((i) => i.selected == true)
          newState.itemIsSelected_right = newState.rightList.some((i) => i.selected == true)
          return newState
    } 

    case 'add_name_input': {
      
      
      const newState = {
        ...state,
        addNameInput: action.addNameInput
      }
      return newState;
    }
    case 'add_name': {
     
      const newState = {...state,
        leftList: [...state.leftList],
        rightList: [...state.rightList],
      addNameInput: ''
    }
    newState.leftList.push({name: action.name, selected: false})
    newState.rightList = [...state.rightList]
      localStorage.setItem('leftList', JSON.stringify({
          leftList: newState.leftList,
      }))
      localStorage.setItem('rightList', JSON.stringify({
        rightList: newState.rightList,
    }))

      return newState
    }
    
    case 'delete_item': {
      const newState = {
        ...state,
        leftList:  state.leftList.filter(i => i.selected === false),
        rightList: state.rightList.filter(i => i.selected === false),
        
      }
      newState.itemIsSelected_left = newState.leftList.some((i) => i.selected == true)
      newState.itemIsSelected_right = newState.rightList.some((i) => i.selected == true)
      localStorage.setItem('leftList', JSON.stringify({
        leftList: newState.leftList,
    }))
    localStorage.setItem('rightList', JSON.stringify({
      rightList: newState.rightList,
  }))
      return newState;
    }


    default: throw Error('Unknown action: ' + action.type);
    }
    
  }