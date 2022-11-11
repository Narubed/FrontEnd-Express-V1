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
  Box,
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
    partner_name: '',
    partner_percent: 0,
    partner_webhook: 'ไม่มี',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (prop) => (event) => {
    setValue({ ...isValue, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    const urlPartners = `${process.env.REACT_APP_API_EXPRESS_V1}/partners`;
    await fetcherWithToken(urlPartners, {
      method: 'POST',
      body: JSON.stringify(isValue),
    }).then(async () => {
      await fetcherPartner();
      setValue({
        partner_name: '',
        partner_percent: 0,
        partner_webhook: 'ไม่มี',
      });
      setOpen(false);
    });
    dispatch(setLoading(false));
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
        เพิ่มพาร์ตเนอร์
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'กรุณากรอกรายละเอียดพาร์ตเนอร์ที่ต้องการเพิ่ม'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Grid item xs={12} sx={{ marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItem disablePadding>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="partner_name" sx={{ fontSize: '16px' }}>
                      ชื่อพาร์ตเนอร์
                    </InputLabel>
                    <Input
                      sx={{ fontSize: '16px' }}
                      id="partner_name"
                      value={isValue.partner_name}
                      onChange={handleChange('partner_name')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="openmoji:european-name-badge" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="partner_percent" sx={{ fontSize: '16px' }}>
                      จำนวนที่บวกเพิ่ม นับเป็นเปอร์เซ็น
                    </InputLabel>
                    <Input
                      type="number"
                      sx={{ fontSize: '16px' }}
                      id="partner_percent"
                      value={isValue.partner_percent}
                      onChange={handleChange('partner_percent')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="mdi:ticket-percent" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="start">
                          <Icon icon="fa:percent" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </ListItem>
              </Box>
              <ListItem disablePadding>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="partner_webhook" sx={{ fontSize: '16px' }}>
                    web hook
                  </InputLabel>
                  <Input
                    sx={{ fontSize: '16px' }}
                    id="partner_webhook"
                    value={isValue.partner_webhook}
                    onChange={handleChange('partner_webhook')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="logos:webhooks" />
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
