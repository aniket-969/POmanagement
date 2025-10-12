import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CreatePOForm from './createPOForm';



const CreatePO = () => {
   const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}variant='outlined' >Create PO</Button>
      <Modal sx={{
        p:3
      }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CreatePOForm handleClose={handleClose}/>
      </Modal>
    </div>
  );
}

export default CreatePO