import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Disclaimermodal() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  return (
    
    <Box sx={{ flex: "1 1 100%", my: "1rem" }}>
      <Modal
        open={open}
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: '#FF7611', fontSize:"1.2rem" }}>
            Disclaimer
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Information provided on this website is for educational purposes only. The owner of this website shall not be held responsible for any actions you may take based on the information provided on this page. Nothing on this page should be construed as financial advice.
          </Typography>
          <Button onClick={handleClose} sx={{ backgroundColor: '#FF7611', color: 'white', mt: 2, '&:hover': { color: 'black', backgroundColor: '#FF7611' } }}>I understand.</Button>
        </Box>
        
      </Modal>
      </Box>
    
  );
}