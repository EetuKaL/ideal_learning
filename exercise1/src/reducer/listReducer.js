



export function listReducer(state, action) {

  const updateLocalStorage = (leftList, rightList) => {
    localStorage.setItem('leftList', JSON.stringify({
      leftList: leftList,
  }))
  localStorage.setItem('rightList', JSON.stringify({
    rightList: rightList,
}))
  }
    switch (action.type) {
      case 'set_initial_state_from_storage': {
        return {...state,
          leftList: action.leftList ? action.leftList.leftList : state.leftList,
          rightList: action.rightList ? action.rightList.rightList : state.rightList
        }
      }
      case 'switch_list': {
        switch (action.side) {
        
            case 'left': {
              let updatedRightList;
              let newLeftList;
                console.log('filtered left list on tyhjä: ', state.filteredLeftList.length === 0);
                console.log(state.filteredLeftList, state.filteredRightList);
                console.log('reading concat from' , state.rightList)
                updatedRightList = state.rightList.concat(
                  state.filteredLeftList.length === 0 ?
                    
                  state.leftList.filter(item => item.selected === true).map(item => ({
                        ...item,
                        selected: false
                    }))
                    :
                    state.filteredLeftList.filter(item => item.selected === true).map(item => ({
                        ...item,
                        selected: false
                    }))
                    );
    
                newLeftList = state.leftList.filter(item => item.selected !== true);
    
                const newState = {
                    ...state,
                    leftList: newLeftList,
                    rightList: updatedRightList,
                    searchNameInput: '',
                    filteredLeftList: [],
                    filteredRightList: []
                };
                
                updateLocalStorage(newLeftList, updatedRightList);
                newState.itemIsSelected_left = newState.leftList.some((i) => i.selected == true)
                newState.itemIsSelected_right = newState.rightList.some((i) => i.selected == true)
                return newState;
              }
            case 'right': {
                let updatedLeftList;
                let newRightList;
                console.log(state.filteredLeftList, state.filteredRightList);
                console.log('reading concat from' , state.rightListList)
                updatedLeftList = state.leftList.concat(
                  state.filteredRightList.length === 0 ?
                    state.rightList.filter(item => item.selected === true).map(item => ({
                        ...item,
                        selected: false
                      }))
                      :
                      state.filteredRightList.filter(item => item.selected === true).map(item => ({
                        ...item,
                        selected: false
                      }))
                
                      );
    
                newRightList = state.rightList.filter(item => item.selected !== true);
    
                const newState = {
                    ...state,
                    leftList: updatedLeftList,
                    rightList: newRightList,
                    searchNameInput: '',
                    filteredLeftList: [],
                    filteredRightList: []
                };
    
                newState.itemIsSelected_left = newState.leftList.some((i) => i.selected == true)
                newState.itemIsSelected_right = newState.rightList.some((i) => i.selected == true)
                updateLocalStorage(updatedLeftList, newRightList);
                return newState;
            }
            default:
                return state;
        }
    }
        
      case 'select_item': {
       const {isSelected, side, index} = action;
          let newState = Object.assign({}, state);
          let clickedList
          let oppositeSideList
          let situation 
          // Check which list will be processed.
          if (side === 'left') {
            if (newState.filteredLeftList.length === 0){
              situation = 'left-notFiltered'
              clickedList = newState.leftList;
              oppositeSideList = newState.rightList;
            } else {
              situation = 'left-filtered'
              clickedList = newState.filteredLeftList
              oppositeSideList = newState.filteredRightList
            }
          } else {
            if(newState.filteredRightList.length === 0){
              situation = 'right-notFiltered'
              clickedList = newState.rightList;
              oppositeSideList = newState.leftList;
            }
            else {
              situation = 'right-filtered'
              clickedList = newState.filteredRightList;
              oppositeSideList = newState.filteredLeftList;
            }
          }
          // Unclick all from opposite side
            oppositeSideList.forEach(item => {
              item.selected = false
            });
          // Select item from clickedlist.
            clickedList[index].selected = isSelected
         
       
          return {...newState,
          leftList: situation === 'left-notFiltered' ? clickedList : situation === 'right-notFiltered' ? oppositeSideList : newState.leftList,
          rightList: situation === 'right-notFiltered' ? clickedList : situation === 'left-notFiltered' ? oppositeSideList : newState.rightList,
          filteredLeftList: situation === 'left-filtered' ? clickedList : situation === 'right-filtered' ? oppositeSideList : newState.filteredLeftList,
          filteredRightList: situation === 'right-filtered' ? clickedList : situation === 'left-filtered' ? oppositeSideList : newState.filteredRightList,
          itemIsSelected_left: state.leftList.some((i) => i.selected == true),
          itemIsSelected_right: state.rightList.some((i) => i.selected == true)
          }
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
     updateLocalStorage(newState.leftList, newState.rightList)

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
      updateLocalStorage(newState.leftList, newState.rightList)
      return newState;
    }

    case 'search_name_input': {
      const newState = {
        ...state,
      searchNameInput : action.searchNameInput,
      }
      newState.filteredLeftList = newState.leftList.filter(item =>
        item.name.toLowerCase().includes(newState.searchNameInput.toLowerCase())
      );
      newState.filteredRightList = newState.rightList.filter(item =>
        item.name.toLowerCase().includes(newState.searchNameInput.toLowerCase())
      );
      return newState;
    }


    default: throw Error('Unknown action: ' + action.type);
    }
    
  }