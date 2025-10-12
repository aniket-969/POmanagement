
import React from "react";
import { toast } from 'react-toastify';
 import {Button,
    Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const Reject = ( {poId}) => {
    
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");
 const [error,setError] = React.useState(false)

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setComment(""); 
  };

  const handleConfirm = () => {
   if(comment ===""){setError(true)
    return
   }
      console.log("Approved", { poId, comment });
    closeModal();
  };

  return (
    <>
      <Button variant="contained" size="small" onClick={openModal} aria-label="open-approve-modal">
        Reject
      </Button>

      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm" aria-labelledby="approve-dialog">
        <DialogTitle id="approve-dialog">Reject Purchase Order</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            multiline
            minRows={4}
            fullWidth
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="approval-comment"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} aria-label="cancel-approve">Cancel</Button>
          <Button variant="contained" onClick={handleConfirm} aria-label="confirm-approve">
            Confirm
          </Button>
        </DialogActions>
        {error && <Typography sx={{
            color:"red",
        }}>Comment is mandatory</Typography>}
      </Dialog>
    </>
  );
};

export default Reject;
