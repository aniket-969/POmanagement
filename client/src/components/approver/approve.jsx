
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
import { useApproverPO } from "../../hooks/usePO";

const Approve = ( {poId}) => {
    
  const [open, setOpen] = React.useState(false);
  const [reviewComment, setComment] = React.useState("");
const {approveMutation} = useApproverPO()

  const openModal = () => setOpen(true);

  const closeModal = () => {
    setOpen(false);
    setComment(""); 
  };

  const handleConfirm = () => {
   
      console.log("Approved", { poId, reviewComment });
      approveMutation.mutateAsync({id:poId,data:{reviewComment}})
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
            placeholder="Add a reviewComment"
            value={reviewComment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="approval-reviewComment"
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
