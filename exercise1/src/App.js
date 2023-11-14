
import { useState, useReducer, useEffect } from 'react';
import './App.css';
import { listReducer } from './reducer/listReducer';
import ListBox from './components/ListBox';

const initialState = {
  'leftList': [{'name': 'Mike', 'selected': false}, {'name': 'Hank', 'selected':false}],
  'rightList': [{'name': 'Mark', 'selected': false}, {'name': 'Dwayne', 'selected':false}, {'name':'Mark', 'selected':false}]
}

function App() {
  const [state, dispatch] = useReducer(listReducer, initialState);
  const [leftListItemSelected, setleftListItemSelected] = useState(false)
  const [rightListItemSelected, setrightListItemSelected] = useState(false)
  const [inputValue, setInputValue] = useState('')
  
  useEffect(() => {
    setleftListItemSelected(state.leftList.some((item) => item.selected === true))
    setrightListItemSelected(state.rightList.some((item) => item.selected === true))
  }, [state])

  const handleChange = (event)=>  {
    setInputValue(event.target.value)
  }

  const handleNameAdd = () => {
    inputValue.length > 3 && dispatch({type: 'add_name', name:inputValue})
    setInputValue('')
  }
  
  return (
    <div className="App">
      <h2>Add name</h2>
      <section className='new-name-container'>
      <input className='name-input' value={inputValue} onChange={handleChange} type='text'></input>
      <input type='submit' className='submit-name' value="Add" onClick={() => handleNameAdd()}></input>
      </section>
      <div className='col-container'>
      <ListBox list={state.leftList} dispatch={dispatch} side={'left'}/>
      <section className='button-section'>
        <a className='button-forward'  style={{
          borderColor: leftListItemSelected ? 'green' : 'black'
        }}onClick={() => leftListItemSelected === true && dispatch({type:'switch_list', side:'left'})}></a>
        <a className='button-reverse' 
        style={{ borderColor: rightListItemSelected ? 'green' : 'black'}} onClick={() => rightListItemSelected === true && dispatch({type:'switch_list', side:'right'})}></a>
      </section>
      <ListBox list={state.rightList} dispatch={dispatch} side={'right'}/>
    </div>
    </div>
  );
}

export default App;
