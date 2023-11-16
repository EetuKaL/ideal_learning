
import { useState, useReducer, useEffect } from 'react';
import './App.css';
import { listReducer } from './reducer/listReducer';
import ListBox from './components/ListBox';


const initialState = {

      'leftList': [{'name': 'Mike', 'selected': false}, {'name': 'Hank', 'selected':false}],
      'rightList': [{'name': 'Mark', 'selected': false}, {'name': 'Dwayne', 'selected':false}, {'name':'Mark', 'selected':false},],
      'itemIsSelected_left': false,
      'itemIsSelected_right': false,
      'addNameInput': ''
  
}

function App() {
  const [state, dispatch] = useReducer(listReducer, initialState);
  const handleChange = (event)=>  {
    dispatch({type: 'add_name_input', addNameInput: event.target.value})
  }

  useEffect(() => {
    const fetchLocalStorage = () => {
        const leftList = JSON.parse(localStorage.getItem("leftList"))
        const rightList = JSON.parse(localStorage.getItem("rightList"))
        console.log('sadasda', leftList, rightList)
        if(leftList !== null && rightList !== undefined ){
          dispatch({
            type: 'set_initial_state_from_storage',
            leftList: leftList.leftList,
            rightList: rightList.rightList
          });
        } 
    };
    fetchLocalStorage();
  }, []);

  console.log('state on ', state)
  return (
    <div className="App">
      <h2>Add name</h2>
      <section className='new-name-container'>
      <input className='name-input' value={state.addNameInput} onChange={handleChange} type='text'></input>
      <input type='submit' className='submit-name' value="Add" onClick={() =>  dispatch({type: 'add_name', name:state.addNameInput})}></input>
      </section>
      <div className='col-container'>
      <ListBox list={state.leftList} dispatch={dispatch} side={'left'}/>
      <section className='button-section'>
        <a className='button-forward'  style={{
          borderColor: state.itemIsSelected_left ? 'green' : 'black'
        }}onClick={() => state.itemIsSelected_left && dispatch({type:'switch_list', side:'left'})}></a>
        <a className='button-reverse' 
        style={{ borderColor: state.itemIsSelected_right ? 'green' : 'black'}} onClick={() => state.itemIsSelected_right && dispatch({type:'switch_list', side:'right'})}></a>
      </section>
      <ListBox list={state.rightList} dispatch={dispatch} side={'right'}/>
    </div>
      {<button onClick={() => dispatch({type:'delete_item'})} style={{backgroundColor: state.itemIsSelected_right || state.itemIsSelected_left ? '#3498db' : 'grey'}} className ='delete-button'>delete</button>}
      
    </div>
  );
}

export default App;
