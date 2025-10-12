
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
import usePO from "../../hooks/usePO";

const Approve = ( {poId}) => {
    
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");
const {approveMutation} = usePO()

  const openModal = () => setOpen(true);

  const closeModal = () => {
    setOpen(false);
    setComment(""); 
    setError(false)
  };

  const handleConfirm = () => {
   
      console.log("Approved", { poId, comment });
      approveMutation.mutateAsync({id:poId,data:{comment}})
    closeModal();
  };

  return (
    <>
      <Button variant="contained" size="small" onClick={openModal} aria-label="open-approve-modal">
        Approve
      </Button>

      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm" aria-labelledby="approve-dialog">
        <DialogTitle id="approve-dialog">Approve Purchase Order</DialogTitle>

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
      
      </Dialog>
    </>
  );
};

export default Approve;
