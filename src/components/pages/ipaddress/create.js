/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Grid,
  ListItem,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
} from '@mui/material';

import Iconify from '../../iconify';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function createPartner(props) {
  const { fetcherWithToken, fetcherPartner, dispatch, setLoading } = props;
  const [open, setOpen] = useState(false);
  const [isValue, setValue] = useState({
    ip_address: '',
    ip_note: 'ไม่มี',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValue({
      ip_address: '',
      ip_note: 'ไม่มี',
    });
    setOpen(false);
  };

  const handleChange = (prop) => (event) => {
    setValue({ ...isValue, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    setOpen(false);
    dispatch(setLoading(true));
    const urlIPAddress = `${process.env.REACT_APP_API_EXPRESS_V1}/ip-address`;
    await fetcherWithToken(urlIPAddress, {
      method: 'POST',
      body: JSON.stringify(isValue),
    }).then(async () => {
      await fetcherPartner();
      setValue({
        ip_address: '',
        ip_note: 'ไม่มี',
      });
    });
    dispatch(setLoading(false));
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
        เพิ่ม IP Address
      </Button>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'กรุณากรอกรายละเอียดไอพี ที่ต้องการเพิ่ม'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid item xs={12} sx={{ marginBottom: 3 }}>
              <ListItem disablePadding>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="ip_address" sx={{ fontSize: '16px' }}>
                    IP Address
                  </InputLabel>
                  <Input
                    sx={{ fontSize: '16px' }}
                    id="ip_address"
                    value={isValue.ip_address}
                    onChange={handleChange('ip_address')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="iconoir:ip-address" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </ListItem>

              <ListItem disablePadding>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="ip_note" sx={{ fontSize: '16px' }}>
                    NOTE
                  </InputLabel>
                  <Input
                    sx={{ fontSize: '16px' }}
                    id="ip_note"
                    value={isValue.ip_note}
                    onChange={handleChange('ip_note')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="arcticons:note" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </ListItem>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit}>ตกลง</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

createPartner.propTypes = {};
