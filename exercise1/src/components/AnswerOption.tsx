import React from "react";
import { AnswerOption } from "../types/types";

type AnswerOptionProps = {
  option: AnswerOption;
  index: number;
  selected_answer?: string;
  onClickFunction: Function;
};

const AnswerOptionItem: React.FC<AnswerOptionProps> = ({
  option,
  index,
  selected_answer,
  onClickFunction,
}) => {
  return (
    <button
      key={"answer-option-button-" + index}
      style={{
        textDecoration: option.deleted ? "line-through" : "none",
        backgroundColor: option.deleted
          ? "grey"
          : option.answerOptionText === selected_answer
          ? "#15669d"
          : "#3498db",
      }}
      className="option-button"
      disabled={option.deleted}
      onClick={() => onClickFunction()}
    >
      {option.answerOptionText}
    </button>
  );
};

export default AnswerOptionItem;
