import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import SuccessIcon from "../components/icons/SuccessIcon";

export default function Alert({ show, onClose, message }) {
  const nodeRef = useRef(null);

  const closeOnEscapeKeyDown = (event) => {
    if ((event.charCode || event.keyCode) === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);

    return function cleanup() {
      document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    };
  });

  // Auto deletes the alert
  useEffect(() => {
    const interval = setInterval(() => {
      if (show) {
        onClose();
      }
    }, 750);

    return function cleanup() {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return createPortal(
    <CSSTransition
      nodeRef={nodeRef}
      in={show}
      unmountOnExit
      timeout={{ enter: 0, exit: 200 }}
    >
      <div className="alert" onClick={onClose} ref={nodeRef}>
        <div
          className="w-auto px-6 py-4 fixed bottom-[10%] bg-green-600 text-white rounded-lg truncate font-roboto"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-center">
            <SuccessIcon />
            <h3 className="ml-2">{message}</h3>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.body
  );
}
