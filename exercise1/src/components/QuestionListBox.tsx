import React from "react"
import { Question } from "../types/types"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { select_option } from "../features/question/questionSlice";


interface QuestionListBoxProps {
  list: Question[];
 /*  select: (index: number, side: string, isSelected: boolean) => void;
  side: string; */
}

 const QuestionListBox: React.FC<QuestionListBoxProps> = ({list}) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.questions);
  
    return <div className="list-box-container">
      
    <section className='list-box'>
        {typeof(list) !== 'undefined' && list.length > 0 ? list.map((question: Question, index: number) => {
        return  <div style={{
            color:  'black'
          }}key={index} className='list-item' 
          ><p>{question.question_text}</p>
          {question.options.map((option: string) => {
            return <button style={{backgroundColor: option === question.selected_answer ? "#15669d" : "#3498db"}} className="option-button" onClick={() => dispatch(select_option({selectedQuestion: question.id, selected: option}))}>{option}</button>
          })}
          </div>
          
        }): <p>No items added yet</p>}        
      </section>
      
      </div>
    
}

export default QuestionListBox;