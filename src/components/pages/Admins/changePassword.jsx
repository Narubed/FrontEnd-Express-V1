/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
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

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function edit(props) {
  const {
    isSelectedMenu,
    setOpenChangePassword,
    isOpenChangePassword,
    dispatch,
    setLoading,
    fetcherWithToken,
    fetcherAdmins,
  } = props;

  const [isValue, setValue] = useState({
    admin_password: '',
  });

  const handleClose = () => {
    setValue({
      admin_password: '',
    });

    setOpenChangePassword(false);
  };

  const handleChange = (prop) => (event) => {
    setValue({ ...isValue, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    setOpenChangePassword(false);
    dispatch(setLoading(true));
    const urlIPAddress = `${process.env.REACT_APP_API_EXPRESS_V1}/admins/${isSelectedMenu._id}`;
    await fetcherWithToken(urlIPAddress, {
      method: 'PUT',
      body: JSON.stringify(isValue),
    }).then(async () => {
      await fetcherAdmins();
      setValue({
        admin_password: '',
      });
    });
    dispatch(setLoading(false));
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={isOpenChangePassword}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'แก้ไขรหัสผ่าน'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid item xs={12} sx={{ marginBottom: 3 }}>
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
    </div>
  );
}

export default edit;
