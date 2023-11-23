import React, { useEffect } from 'react';
import './App.css';

import ListBox from './components/ListBox';
import { useSelector, useDispatch } from 'react-redux';
import {
  select_item,
  search_name_input,
  delete_item,
  add_name,
  add_name_input,
  set_initial_state_from_storage,
  switch_list,
} from './features/list/listSlice';
import { RootState } from './store';
import { ListItem } from './types/types';

function App() {
  const reduxState = useSelector((state: RootState) => state.list);
  const reduxDispatch = useDispatch();

  const handleAddNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    reduxDispatch(add_name_input({ addNameInput: event.target.value }));
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    reduxDispatch(search_name_input({ searchNameInput: event.target.value }));
  };

  useEffect(() => {
    const fetchLocalStorage = () => {
      const leftList: ListItem[] = JSON.parse(localStorage.getItem('leftList') || 'null');
      const rightList: ListItem[] = JSON.parse(localStorage.getItem('rightList') || 'null');
      if (rightList && leftList) {
        reduxDispatch(
          set_initial_state_from_storage({
            leftList,
            rightList,
          })
        );
      }
    };
    fetchLocalStorage();
  }, []);

  useEffect(() => {


    const updateLocalStorage = (leftList: ListItem[], rightList: ListItem[]) => {
      localStorage.setItem('leftList', JSON.stringify(
        leftList,
      ))
      localStorage.setItem('rightList', JSON.stringify(
        rightList,
      ))
    }


    try {
      updateLocalStorage(reduxState.leftList, reduxState.rightList)
    } catch (error) {
      console.log(error)
    }
  }, [reduxState.leftList, reduxState.rightList])

  return (<div className="App">
    <h2>Search</h2>
    <section>
      <input className='input-field' style={{ width: '100%' }} type='text' value={reduxState.searchNameInput} onChange={handleSearchInput}></input>
    </section>
    <h2>Add name</h2>
    <section className='new-name-container'>
      <input className='input-field' value={reduxState.addNameInput} onChange={handleAddNameInput} type='text'></input>
      <input type='submit' className='submit-name' value="Add" onClick={() => reduxDispatch(add_name({ name: reduxState.addNameInput }))}></input>
    </section>
    <div className='col-container'>
      <ListBox list={reduxState.searchNameInput.length > 0 ? reduxState.filteredLeftList : reduxState.leftList} select={(index, side, isSelected) =>
        reduxDispatch(select_item({ index: index, side: side, isSelected: isSelected }))
      }
        side={'left'} />
      <section className='button-section'>
        <a className='button-forward' style={{
          borderColor: reduxState.itemIsSelected_left ? 'green' : 'black'
        }} onClick={() => reduxState.itemIsSelected_left && reduxDispatch(switch_list({ side: 'left' }))}></a>
        <a className='button-reverse'
          style={{ borderColor: reduxState.itemIsSelected_right ? 'green' : 'black' }} onClick={() => reduxState.itemIsSelected_right && reduxDispatch(switch_list({ side: 'right' }))}></a>
      </section>
      <ListBox list={reduxState.searchNameInput.length > 0 ? reduxState.filteredRightList : reduxState.rightList} select={(index, side, isSelected) =>
        reduxDispatch(select_item({ index, side, isSelected }))
      }
        side={'right'} />
    </div>
    {<button onClick={() => reduxDispatch(delete_item())} style={{ backgroundColor: reduxState.itemIsSelected_right || reduxState.itemIsSelected_left ? '#3498db' : 'grey' }} className='delete-button'>delete</button>}

  </div>

  );
}

export default App;
