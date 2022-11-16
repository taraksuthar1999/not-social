import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Modal } from "@mui/material";
import FocusTrap from "focus-trap-react";
import ConnectedLogin from "./Login";
import ConnectedRegister from "./Register";
import { ClickAwayListener } from "@mui/material";
import { ModalContext } from "../../contexts/context";


export default function FromModal(props) {
  const {login,register,isShown,close} = useContext(ModalContext)
  const ref = React.useRef(null);
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      close()
    }
  };


  return (
    <div>
      <Modal
        open={isShown}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <aside
          tag="aside"
          role="dialog"
          tabIndex="-1"
          aria-modal="true"
          className="modal-cover"
          onClick={handleClickOutside}
        >
          <div ref={ref} className="modal-area">
            <button
              aria-label="Close Modal"
              aria-labelledby="close-modal"
              className="_modal-close"
              onClick={close}
            >
              <span id="close-modal" className="_hide-visual">
                Close
              </span>
              <svg className="_modal-close-icon" viewBox="0 0 40 40">
                <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
              </svg>
            </button>
            <div className="modal-body">
              {register && (
                <ConnectedRegister/>
              )}
              {login && (
                <ConnectedLogin/>
              )}
            </div>
          </div>
        </aside>
      </Modal>
    </div>
  );
}
