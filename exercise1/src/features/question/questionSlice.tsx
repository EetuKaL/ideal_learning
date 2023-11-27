import { createSlice, PayloadAction } from '@reduxjs/toolkit';
/* import { RootState } from '../types';  */// Import your RootState type
import { v4 as uid } from 'uuid';
import { Keys, Question, QuestionState } from '../../types/types';
import { current } from '@reduxjs/toolkit'



const initialState: QuestionState = {
  questions: [
    
      {
        id: uid(),
        question_text: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Rome"],
        correct_answer: "Paris"
      },
      {
        id: uid(),
        question_text: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct_answer: "Leonardo da Vinci"
      },
      {
        id: uid(),
        question_text: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Mercury"],
        correct_answer: "Mars"
      },
        
    
    
  ],
  createQuestion: [
    {description: 'What is the question?', value: ''},
    {description: 'What is the options? ', value: []},
    {description: 'What is the correct option? ', value: ''}
  ],
  allQuestionAnswered: false,
  showAddQuestionModal: false,
  createQuestionStep: 0,
  createQuestionInput: '',
};

export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    select_option: (state, action: PayloadAction<{ selectedQuestion: string; selected: string; }>) => {
    const {selectedQuestion, selected} = action.payload
    const index = state.questions.findIndex((item) => item.id === selectedQuestion) 
    state.questions[index].selected_answer = selected 
    },
    toggle_add_question_modal: (state, action: PayloadAction<{toggleValue: boolean}>) => {
      state.showAddQuestionModal = action.payload.toggleValue;
      console.log('current state is: ',current(state))
    },
    next_create_question_step: (state, action: PayloadAction<{step: number}>) => {
      state.createQuestionStep = action.payload.step
      state.createQuestion[action.payload.step].value = state.createQuestionInput
      console.log('current state is: ',current(state))
    },
    handle_create_question_input: (state, action: PayloadAction<{input: string}>) => {
      state.createQuestionInput = action.payload.input
    },
  },
});

export const {
  select_option,
  toggle_add_question_modal,
  next_create_question_step,
  handle_create_question_input
} = questionSlice.actions;

export default questionSlice.reducer;
