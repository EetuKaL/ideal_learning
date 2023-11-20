import { createSlice } from '@reduxjs/toolkit'
import { current } from '@reduxjs/toolkit'

const updateLocalStorage = (leftList, rightList) => {
    localStorage.setItem('leftList', JSON.stringify({
      leftList: leftList,
  }))
  localStorage.setItem('rightList', JSON.stringify({
    rightList: rightList,
}))
}

const initialState = 
    {

        'leftList': [{'name': 'Mike', 'selected': false}, {'name': 'Hank', 'selected':false}],
        'rightList': [{'name': 'Mark', 'selected': false}, {'name': 'Dwayne', 'selected':false}, {'name':'Mark', 'selected':false},],
        'itemIsSelected_left': false,
        'itemIsSelected_right': false,
        'addNameInput': '',
        'searchNameInput' : '',
        'filteredLeftList': [],
        'filteredRightList': [],
  
  }

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    select_item: (state, action) => {
        
        const {isSelected, side, index} = action.payload;

       
     
        console.log('state is when selecting: ', current(state))
      
        let clickedListKey
        let clickedList
        let oppositeSideListKey
        let oppositeSideList
   
        // Check which lists are processed.
        if (side === 'left') {
          if (state.filteredLeftList.length === 0){
            console.log('handling left')
            clickedListKey = 'leftList'
            oppositeSideListKey = 'rightList'
            clickedList = state.leftList;
            oppositeSideList = state.rightList;
        } else {
              console.log('handling left filtered')
              
              clickedListKey = 'filteredLeftList'
              oppositeSideListKey = 'filteredRightList'
              clickedList = state.filteredLeftList
              oppositeSideList = state.filteredRightList
       
            }
        } else {
            if(state.filteredRightList.length === 0){
                console.log('handling right')
                clickedListKey = 'rightList'
                oppositeSideListKey = 'leftList'    
                clickedList = state.rightList;
                oppositeSideList = state.leftList;
            }
            else {
              console.log('handling rightfiltered')
            
            clickedListKey = 'filteredRightList'
            oppositeSideListKey = 'filteredLeftList'
            clickedList = state.filteredRightList;
            oppositeSideList = state.filteredLeftList;
      

          }
        }
        // Unclick all from opposite side
          oppositeSideList.forEach(item => {
            item.selected = false
          });
        
        // Select item from clickedlist.
          clickedList[index].selected = isSelected
          

          state[clickedListKey] = clickedList
          state[oppositeSideListKey] = oppositeSideList
          state.itemIsSelected_left = state.leftList.some((i) => i.selected == true) || state.filteredLeftList.some((i) => i.selected == true)
          state.itemIsSelected_right = state.rightList.some((i) => i.selected == true) || state.filteredRightList.some((i) => i.selected == true)
         
          console.log('after selection state is', current(state))

         
          
    },
    set_initial_state_from_storage: (state, action) => {
        state.leftList = action.payload.leftList.leftList
        state.rightList = action.payload.rightList.rightList
        console.log('state is after initialing state from storage: ' , state.leftList)
    },
    switch_list: (state, action) => {
        const stateCopy = Object.assign({}, state);
        const side = action.payload.side;
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

          let newClickedList = clickedList.filter(item => item.selected !== true);
         

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
          return newState
    },

    add_name_input: (state, action) => {
        state.addNameInput = action.payload.addNameInput
    },
    add_name: (state,action) => {
        state.leftList.push({name: action.payload.name, selected: false})
        updateLocalStorage(state.leftList, state.rightList)
    },
    delete_item: (state, action) => {
        
        state.leftList = state.leftList.filter(i => i.selected === false)
        state.rightList = state.rightList.filter(i => i.selected === false)
        updateLocalStorage(state.leftList, state.rightList)
    },
    search_name_input: (state, action) => {
        state.searchNameInput = action.payload.searchNameInput
        
          
          state.filteredLeftList = state.leftList.filter(item =>
            item.name.toLowerCase().includes(state.searchNameInput.toLowerCase())
          );
          state.filteredRightList = state.rightList.filter(item =>
            item.name.toLowerCase().includes(state.searchNameInput.toLowerCase())
          );

          console.log('filtered lists are, ', current(state))
          
    }
  },
})

// Action creators are generated for each case reducer function
export const { select_item, search_name_input, 
    delete_item, add_name, add_name_input, set_initial_state_from_storage, switch_list } = listSlice.actions

export default listSlice.reducer