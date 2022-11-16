import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Modal } from "@mui/material";
import FocusTrap from "focus-trap-react";

import Loading from "./Loading";
import { ClickAwayListener } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function LoadingModal(props) {
  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <aside
          tag="aside"
          role="dialog"
          tabIndex="-1"
          aria-modal="true"
          className="modal-cover"
        >
          <Loading />
        </aside>
      </Modal>
    </div>
  );
}
