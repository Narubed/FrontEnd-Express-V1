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
  const { isSelectedMenu, setOpenUpdate, isOpenUpdate, dispatch, setLoading, fetcherWithToken, fetcherPartner } = props;

  const [isValue, setValue] = useState({
    ip_address: '',
    ip_note: 'ไม่มี',
  });

  useEffect(() => {
    if (isSelectedMenu)
      setValue({
        ip_address: isSelectedMenu.ip_address,
        ip_note: isSelectedMenu.ip_note,
      });
  }, [isSelectedMenu]);

  const handleClose = () => {
    setValue({
      ip_address: '',
      ip_note: 'ไม่มี',
    });

    setOpenUpdate(false);
  };

  const handleChange = (prop) => (event) => {
    setValue({ ...isValue, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    const urlIPAddress = `${process.env.REACT_APP_API_EXPRESS_V1}/ip-address/${isSelectedMenu._id}`;
    await fetcherWithToken(urlIPAddress, {
      method: 'PUT',
      body: JSON.stringify(isValue),
    }).then(async () => {
      await fetcherPartner();
      setValue({
        ip_address: '',
        ip_note: 'ไม่มี',
      });
      setOpenUpdate(false);
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
        <DialogTitle>{'กรุณากรอกรายละเอียดพาร์ตเนอร์ที่ต้องการเพิ่ม'}</DialogTitle>
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
    </div>
  );
}

export default edit;
