import { createSlice, PayloadAction } from '@reduxjs/toolkit';
/* import { RootState } from '../types';  */// Import your RootState type
import { v4 as uid } from 'uuid';
import { Keys, ListItem, ListState } from '../../types/types';
import { current } from '@reduxjs/toolkit'

const updateLocalStorage = (leftList: ListItem[], rightList: ListItem[]) => {
    localStorage.setItem('leftList', JSON.stringify(
      leftList,
))
  localStorage.setItem('rightList', JSON.stringify(
   rightList,
))
}

const initialState: ListState = {
  leftList: [
    { id: uid(), name: 'Mike', selected: false },
    { id: uid(), name: 'Hank', selected: false },
  ],
  rightList: [
    { id: uid(), name: 'Mark', selected: false },
    { id: uid(), name: 'Dwayne', selected: false },
  ],
  itemIsSelected_left: false,
  itemIsSelected_right: false,
  addNameInput: '',
  searchNameInput: '',
  filteredLeftList: [],
  filteredRightList: [],

};

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    select_item: (state, action: PayloadAction<{ isSelected: boolean; side: string; index: number }>) => {
      const { isSelected, side, index } = action.payload;  
      let clickedListKey: Keys
      let clickedList: ListItem[]
      let oppositeSideListKey: Keys
      let oppositeSideList: ListItem[]
 
      // Check which lists are processed.
      if (side === 'left') {
        if (state.filteredLeftList.length === 0){
          clickedListKey = Keys.Left
          oppositeSideListKey = Keys.Right
          clickedList = state.leftList;
          oppositeSideList = state.rightList;
      } else {
            clickedListKey = Keys.FilteredLeft
            oppositeSideListKey = Keys.FilteredRight
            clickedList = state.filteredLeftList
            oppositeSideList = state.filteredRightList
          }
      } else {
          if(state.filteredRightList.length === 0){
              clickedListKey = Keys.Right
              oppositeSideListKey = Keys.Left    
              clickedList = state.rightList;
              oppositeSideList = state.leftList;
          }
          else {
          clickedListKey = Keys.FilteredRight
          oppositeSideListKey = Keys.FilteredLeft
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
        state.itemIsSelected_left = state.leftList.some((i) => i.selected === true) || state.filteredLeftList.some((i) => i.selected === true)
        state.itemIsSelected_right = state.rightList.some((i) => i.selected === true) || state.filteredRightList.some((i) => i.selected === true)
     
    },
    set_initial_state_from_storage: (state, action: PayloadAction<{ leftList: ListItem[]; rightList: ListItem[] }>) => {
      state.leftList = action.payload.leftList;
      state.rightList = action.payload.rightList;
    },
    switch_list: (state, action: PayloadAction<{ side: string }>) => {
        const stateCopy = Object.assign({}, state);
        const side = action.payload.side
        let clickedListKey: Keys
        let clickedList: ListItem[]
        let oppositeSideListKey: Keys
        let oppositeSideList: ListItem[]
        let filteredList: ListItem[]

        // Check which lists are processed.
        if (side === 'left') {
          clickedListKey = Keys.Left
          clickedList = stateCopy.leftList
          oppositeSideListKey = Keys.Right
          oppositeSideList = stateCopy.rightList
          filteredList = stateCopy.filteredLeftList
        } else {
          clickedListKey = Keys.Right
          clickedList = stateCopy.rightList
          oppositeSideListKey = Keys.Left
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

          
          clickedList = clickedList.filter(item => item.selected !== true)
          clickedList = clickedList.filter(item => !filteredList.some(filteredItem => filteredItem.id === item.id && filteredItem.selected));
          const newState = {
              ...stateCopy,
              [clickedListKey]: clickedList,
              [oppositeSideListKey]: updatedOppositeSideList,
              searchNameInput: '',
              filteredLeftList: [],
              filteredRightList: [],
          
          };

          newState.itemIsSelected_left = newState.leftList.some((i) => i.selected === true)
          newState.itemIsSelected_right = newState.rightList.some((i) => i.selected === true)
          updateLocalStorage(newState.leftList, newState.rightList);
          return newState;
    },
    add_name_input: (state, action: PayloadAction<{ addNameInput: string }>) => {
      state.addNameInput = action.payload.addNameInput;
    },
    add_name: (state: ListState, action: PayloadAction<{ name: string }>) => {
      state.leftList.push({ id: uid(), name: action.payload.name, selected: false });
      state.addNameInput = '';
      updateLocalStorage(state.leftList, state.rightList)
    },
    delete_item: (state) => {
      state.leftList = state.leftList.filter((i) => !i.selected);
      state.rightList = state.rightList.filter((i) => !i.selected);
      state.itemIsSelected_left = false
      state.itemIsSelected_right = false
      updateLocalStorage(state.leftList, state.rightList)
    },
    search_name_input: (state, action: PayloadAction<{ searchNameInput: string }>) => {
      state.searchNameInput = action.payload.searchNameInput;

      state.filteredLeftList = state.leftList.filter((item) =>
        item.name.toLowerCase().includes(state.searchNameInput.toLowerCase())
      );
      state.filteredRightList = state.rightList.filter((item) =>
        item.name.toLowerCase().includes(state.searchNameInput.toLowerCase())
      );
    },
  },
});

export const {
  select_item,
  search_name_input,
  delete_item,
  add_name,
  add_name_input,
  set_initial_state_from_storage,
  switch_list,
} = listSlice.actions;

export default listSlice.reducer;
