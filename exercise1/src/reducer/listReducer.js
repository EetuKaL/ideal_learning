

export function listReducer(state, action) {
    switch (action.type) {
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
            newState.leftList[index].selected = !state.leftList[index].selected
          } 
            else{
              newState.leftList.forEach(item => {
                item.selected = false
              });
            newState.rightList[index].selected = !state.rightList[index].selected
          }
          return newState
    } 

    case 'add_name': {
      const newState = {...state}
      newState.leftList.push({name: action.name, selected: false})
      return newState
    }
    
  

    default: break;
    }
    throw Error('Unknown action: ' + action.type);
  }