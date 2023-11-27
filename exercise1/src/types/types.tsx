export type Question = {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    selected_answer?: string;

  };
  
  export type CreateQuestionItem = {
    description: string;
    value: any;
  }
  export type QuestionState = {
    questions: Question[];
    createQuestion: CreateQuestionItem[];
    allQuestionAnswered: boolean;
    showAddQuestionModal: boolean;
    createQuestionStep: number;
    createQuestionInput: string;
  };

  export enum Side {
    Left,
    Right
  }

  export enum Keys {
    Left = 'leftList',
    Right = 'rightList',
    FilteredLeft = 'filteredLeftList',
    FilteredRight = 'filteredRightList'
  }
  