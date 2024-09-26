// Create Dialog (Mui) https://mui.com/material-ui/react-dialog/#non-modal-dialog

import { Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../services/queries";

export default function LoginDialog({ onClose, open }) {
  const [username, setUsername] = useState("");
  const [termsApproval, setTermsApproval] = useState(false);
  const navigate = useNavigate();

  const login = useLogin();
  const isLoading = login.isPending;
  const onSubmit = (e) => {
    e.preventDefault();
    login.mutate(
      { username, termsApproval },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  const formValid = termsApproval && username != "";

  const handleClose = (e, reason) => {
    if (reason == "backdropClick") {
      return;
    }
    onClose();
    if (reason == "CloseClick") {
      navigate("/about");
      return;
    }
    navigate("/");
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{ p: 10 }}
      disableEscapeKeyDown
      PaperProps={{
        component: "form",
        onSubmit: onSubmit,
        disabled: !formValid || isLoading,
      }}
    >
      <DialogTitle>Please Login to view content</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={(e) => handleClose(e, "CloseClick")}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
        disabled={isLoading}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers={false}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <DialogContentText>
          Just state your name, no account needed yet.
        </DialogContentText>
        <TextField
          id="username"
          value={username || ""}
          label="Your name"
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          autoComplete="username"
          disabled={isLoading}
        />
        <FormControlLabel
          control={<Checkbox />}
          value={termsApproval}
          onChange={() => setTermsApproval(!termsApproval)}
          label="Accept terms"
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="outlined"
          disabled={!formValid || isLoading}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
