import React, { useState } from "react";
import { ConfirmType } from "../types/types";

type ConfirmationPopupProps = {
  onConfirm: Function;
  onClose: Function;
  type: ConfirmType;
};

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  onConfirm,
  onClose,
  type,
}) => {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal-content">
        <div className="close-container">
          <span onClick={() => onClose()} className="close-button">
            &times;
          </span>
        </div>
        <p>
          Are you sure you want to{" "}
          {type === ConfirmType.Delete ? "delete" : "publish"}?
        </p>
        <button
          style={{
            backgroundColor: type === ConfirmType.Delete ? "red" : "#3498db",
          }}
          className="submit-button"
          onClick={async () => await onConfirm()}
        >
          {type === ConfirmType.Delete ? "Delete" : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
