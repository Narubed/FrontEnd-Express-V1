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
  const { isSelectedMenu, setOpenUpdate, isOpenUpdate, dispatch, setLoading, fetcherWithToken, fetcherAdmins } = props;

  const [isValue, setValue] = useState({
    admin_email: '',
    admin_name: '',
  });

  useEffect(() => {
    if (isSelectedMenu)
      setValue({
        admin_email: isSelectedMenu.admin_email,
        admin_name: isSelectedMenu.admin_name,
      });
  }, [isSelectedMenu]);

  const handleClose = () => {
    setValue({
      admin_email: '',
      admin_name: '',
    });

    setOpenUpdate(false);
  };

  const handleChange = (prop) => (event) => {
    setValue({ ...isValue, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    setOpenUpdate(false);
    dispatch(setLoading(true));
    const urlIPAddress = `${process.env.REACT_APP_API_EXPRESS_V1}/admins/${isSelectedMenu._id}`;
    await fetcherWithToken(urlIPAddress, {
      method: 'PUT',
      body: JSON.stringify(isValue),
    }).then(async () => {
      await fetcherAdmins();
      setValue({
        admin_email: '',
        admin_name: '',
      });
    });
    dispatch(setLoading(false));
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={isOpenUpdate}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'กรุณากรอกรายละเอียดผู้ดูแลที่ต้องการแก้ไข'}</DialogTitle>
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
