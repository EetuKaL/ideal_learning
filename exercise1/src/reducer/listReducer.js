



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
       
              const stateCopy = Object.assign({}, state);
              const side = action.side;
              let clickedListKey
              let clickedList
              let oppositeSideListKey
              let oppositeSideList
              let filteredList

              // Check which lists are processed.
              if (side === 'left') {
                clickedListKey = 'leftList'
                clickedList = stateCopy.leftList
                oppositeSideListKey = 'rightList'
                oppositeSideList = stateCopy.rightList
                filteredList = stateCopy.filteredLeftList
              } else {
                clickedListKey = 'rightList'
                clickedList = stateCopy.rightList
                oppositeSideListKey = 'leftList'
                oppositeSideList = stateCopy.leftList
                filteredList = stateCopy.filteredRightList
              }
             
     
                const updatedOppositeSideList = oppositeSideList.concat(
                  filteredList.length === 0 ?
                    
                  clickedList.filter(item => item.selected === true).map(item => ({
                        ...item,
                        selected: false
                    }))
                    :
                    filteredList.filter(item => item.selected === true).map(item => ({
                        ...item,
                        selected: false
                    }))
                    );
    
                const newClickedList = clickedList.filter(item => item.selected !== true);
    
                const newState = {
                    ...stateCopy,
                    [clickedListKey]: newClickedList,
                    [oppositeSideListKey]: updatedOppositeSideList,
                    searchNameInput: '',
                    filteredLeftList: [],
                    filteredRightList: [],
                
                };

                newState.itemIsSelected_left = newState.leftList.some((i) => i.selected == true)
                newState.itemIsSelected_right = newState.rightList.some((i) => i.selected == true)
                updateLocalStorage(newClickedList, updatedOppositeSideList);
                return newState;
              
         
        
    }
        
      case 'select_item': {
       const {isSelected, side, index} = action;
          let newState = Object.assign({}, state);
          let clickedListKey
          let clickedList
          let oppositeSideListKey
          let oppositeSideList          
          // Check which lists are processed.
          if (side === 'left') {
            if (newState.filteredLeftList.length === 0){
             
              clickedListKey = 'leftList'
              oppositeSideListKey = 'rightList'
              clickedList = newState.leftList;
              oppositeSideList = newState.rightList;
            } else {
            
              clickedListKey = 'filteredLeftList'
              oppositeSideListKey = 'filteredRightList'
              clickedList = newState.filteredLeftList
              oppositeSideList = newState.filteredRightList
            }
          } else {
            if(newState.filteredRightList.length === 0){
              clickedListKey = 'rightList'
              oppositeSideListKey = 'leftList'    
              clickedList = newState.rightList;
              oppositeSideList = newState.leftList;
            }
            else {
              
              clickedListKey = 'filteredRightList'
              oppositeSideListKey = 'filteredLeftList'
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
            [clickedListKey] : clickedList,
            [oppositeSideListKey] : oppositeSideList,
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