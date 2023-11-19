
import { useState, useReducer, useEffect } from 'react';
import './App.css';
import { listReducer } from './reducer/listReducer';
import ListBox from './components/ListBox';
import Axios from 'axios';

const initialState = {

      'leftList': [{'name': 'Mike', 'selected': false}, {'name': 'Hank', 'selected':false}],
      'rightList': [{'name': 'Mark', 'selected': false}, {'name': 'Dwayne', 'selected':false}, {'name':'Mark', 'selected':false},],
      'itemIsSelected_left': false,
      'itemIsSelected_right': false,
      'addNameInput': '',
      'searchNameInput' : '',
      'filteredLeftList': '',
      'filteredRightList': ''

}


function App() {
  const [state, dispatch] = useReducer(listReducer, initialState);
  

  const handleAddNameInput = (event)=>  {
    dispatch({type: 'add_name_input', addNameInput: event.target.value})
  }

  const handleSearchInput = (event) => {
    dispatch({type: 'search_name_input', searchNameInput: event.target.value})
  }

  useEffect(() => {
    const fetchLocalStorage = () => {
        const leftList = JSON.parse(localStorage.getItem("leftList"))
        const rightList = JSON.parse(localStorage.getItem("rightList"))
        if(rightList && leftList){
          dispatch({
            type: 'set_initial_state_from_storage',
            leftList: leftList,
            rightList: rightList
          });
        } 
    };

    fetchLocalStorage();
  }, []);

  return (
    <div className="App">

      <h2>Search</h2>
      <section>
        <input className='input-field' style={{width: '100%'}} type='text' value={state.searchNameInput} onChange={handleSearchInput}></input>
      </section>
        <h2>Add name</h2>
        <section className='new-name-container'>
        <input className='input-field' value={state.addNameInput} onChange={handleAddNameInput} type='text'></input>
        <input type='submit' className='submit-name' value="Add" onClick={() =>  dispatch({type: 'add_name', name:state.addNameInput})}></input>
        </section>
      <div className='col-container'>
      <ListBox list={state.searchNameInput.length > 0 ? state.filteredLeftList : state.leftList} dispatch={dispatch} side={'left'}/>
      <section className='button-section'>
        <a className='button-forward'  style={{
          borderColor: state.itemIsSelected_left ? 'green' : 'black'
        }}onClick={() => state.itemIsSelected_left && dispatch({type:'switch_list', side:'left'})}></a>
        <a className='button-reverse' 
        style={{ borderColor: state.itemIsSelected_right ? 'green' : 'black'}} onClick={() => state.itemIsSelected_right && dispatch({type:'switch_list', side:'right'})}></a>
      </section>
      <ListBox list={state.searchNameInput.length > 0 ? state.filteredRightList : state.rightList} dispatch={dispatch} side={'right'}/>
    </div>
      {<button onClick={() => dispatch({type:'delete_item'})} style={{backgroundColor: state.itemIsSelected_right || state.itemIsSelected_left ? '#3498db' : 'grey'}} className ='delete-button'>delete</button>}
      
    </div>
  );
}

export default App;
