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
  const { fetcherWithToken, fetcherAdmins, dispatch, setLoading } = props;
  const [open, setOpen] = useState(false);
  const [isValue, setValue] = useState({
    admin_email: '',
    admin_name: '',
    admin_password: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValue({
      admin_email: '',
      admin_name: '',
      admin_password: '',
    });
    setOpen(false);
  };

  const handleChange = (prop) => (event) => {
    setValue({ ...isValue, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    setOpen(false);
    dispatch(setLoading(true));
    const urlIPAddress = `${process.env.REACT_APP_API_EXPRESS_V1}/admins`;
    await fetcherWithToken(urlIPAddress, {
      method: 'POST',
      body: JSON.stringify({ ...isValue, admin_date_start: Date.now() }),
    }).then(async () => {
      await fetcherAdmins();
      setValue({
        admin_email: '',
        admin_name: '',
        admin_password: '',
      });
    });
    dispatch(setLoading(false));
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
        เพิ่ม Admin
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
        <DialogTitle>{'กรุณากรอกรายละเอียดผู้ดูแล ที่ต้องการเพิ่ม'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid item xs={12} sx={{ marginBottom: 3 }}>
              <ListItem disablePadding>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="admin_email" sx={{ fontSize: '16px' }}>
                    E-mail
                  </InputLabel>
                  <Input
                    sx={{ fontSize: '16px' }}
                    id="admin_email"
                    value={isValue.admin_email}
                    onChange={handleChange('admin_email')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="fxemoji:email" width="26px" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </ListItem>

              <ListItem disablePadding>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="admin_name" sx={{ fontSize: '16px' }}>
                    ชื่อผู้ใช้
                  </InputLabel>
                  <Input
                    sx={{ fontSize: '16px' }}
                    id="admin_name"
                    value={isValue.admin_name}
                    onChange={handleChange('admin_name')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="emojione:name-badge" width="26px" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </ListItem>
              <ListItem disablePadding>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="admin_password" sx={{ fontSize: '16px' }}>
                    รหัสผ่าน
                  </InputLabel>
                  <Input
                    sx={{ fontSize: '16px' }}
                    id="admin_password"
                    value={isValue.admin_password}
                    onChange={handleChange('admin_password')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="mdi:password-alert" width="26px" />
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
