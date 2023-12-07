import { ApplicationState, Exam } from "../types/types";



export const getSelectedExam = (state: ApplicationState) => {
    const examIndex = state.exams!.findIndex(
        (exam: Exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      return exam
}