import React, { useEffect } from 'react';
import './App.css';

import QuestionListBox from './components/QuestionListBox';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from './store';
import { Question } from './types/types';
import { handle_create_question_input, next_create_question_step, toggle_add_question_modal } from './features/question/questionSlice';

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.questions);
  const allQuestionAnswered = state.questions.some((question) => !question.selected_answer)

 const handleCreateQuestionClick = () => {
  dispatch(next_create_question_step({step: state.createQuestionStep + 1}))
}
  
  const handleCreateQuestionInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(handle_create_question_input({input: event.target.value}))
  }

  useEffect(() => {
    const fetchLocalStorage = () => {
      const leftList: Question[] = JSON.parse(localStorage.getItem('leftList') || 'null');
      const rightList: Question[] = JSON.parse(localStorage.getItem('rightList') || 'null');
    }
    fetchLocalStorage();
  }, []);

  useEffect(() => {


    const updateLocalStorage = (leftList: Question[]) => {
      localStorage.setItem('questions', JSON.stringify(
        leftList,
      ))
      
    }

    try {
      updateLocalStorage(state.questions)
    } catch (error) {
      console.log(error)
    }
  }, [state.questions])

  return (<div className="App"> 

    {state.showAddQuestionModal ? 
    <>
    <h1>Create new question</h1>
    {state.createQuestionStep +1 <= state.createQuestion.length ? <>
    <h4>Step {state.createQuestionStep + 1} / {state.createQuestion.length}</h4>
    <h2>{state.createQuestion[state.createQuestionStep].description}</h2>
    <div className='row-container'>
    <p>{state.createQuestion[state.createQuestionStep].value}</p>
    <input className='input-field' value={state.createQuestionInput} onChange={handleCreateQuestionInput} type='text'></input>
    <button onClick={() => handleCreateQuestionClick()} className='add-question-button'></button>
    </div> </>
    : <> 
    <h2>create question</h2>
      <h3>{state.createQuestion[0].description}</h3>
    </>
    
    }
    </>
    :
    <>
    <div className='row-container'>
    <h2 >Add Question</h2>
    <button className='add-button' onClick={() => dispatch(toggle_add_question_modal({toggleValue: !state.showAddQuestionModal}))}>+</button> 

    </div>
    <h2>Questions</h2>
    <QuestionListBox list={state.questions}/>
    <button style={{backgroundColor: allQuestionAnswered ? 'grey' : '#3498db'}} className='submit-button'>Submit</button>
    </>
    }
  </div>

  );
}

export default App;
