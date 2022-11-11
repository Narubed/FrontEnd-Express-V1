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
  Box,
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
    cod_email: '',
    cod_name: '',
    cod_bookbank: '',
    cod_bookbank_number: '',
  });

  useEffect(() => {
    if (isSelectedMenu)
      setValue({
        cod_email: isSelectedMenu.cod_email,
        cod_name: isSelectedMenu.cod_name,
        cod_bookbank: isSelectedMenu.cod_bookbank,
        cod_bookbank_number: isSelectedMenu.cod_bookbank_number,
      });
  }, [isSelectedMenu]);

  const handleClose = () => {
    setValue({
      cod_email: '',
      cod_name: '',
      cod_bookbank: '',
      cod_bookbank_number: '',
    });

    setOpenUpdate(false);
  };

  const handleChange = (prop) => (event) => {
    setValue({ ...isValue, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    const urlPartners = `${process.env.REACT_APP_API_EXPRESS_V1}/cod-express/${isSelectedMenu._id}`;
    await fetcherWithToken(urlPartners, {
      method: 'PUT',
      body: JSON.stringify(isValue),
    }).then(async () => {
      await fetcherPartner();
      setValue({
        cod_email: '',
        cod_name: '',
        cod_bookbank: '',
        cod_bookbank_number: '',
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItem disablePadding>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="cod_email" sx={{ fontSize: '16px' }}>
                      email ที่ลงทะเบียน
                    </InputLabel>
                    <Input
                      sx={{ fontSize: '16px' }}
                      id="cod_email"
                      value={isValue.cod_email}
                      onChange={handleChange('cod_email')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="fxemoji:email" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="cod_name" sx={{ fontSize: '16px' }}>
                      ชื่อผู้ลงทะเบียน
                    </InputLabel>
                    <Input
                      sx={{ fontSize: '16px' }}
                      id="cod_name"
                      value={isValue.cod_name}
                      onChange={handleChange('cod_name')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="openmoji:european-name-badge" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </ListItem>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItem disablePadding>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="cod_bookbank" sx={{ fontSize: '16px' }}>
                      ชื่อธนาคาร
                    </InputLabel>
                    <Input
                      sx={{ fontSize: '16px' }}
                      id="cod_bookbank"
                      value={isValue.cod_bookbank}
                      onChange={handleChange('cod_bookbank')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="emojione:bank" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="cod_bookbank_number" sx={{ fontSize: '16px' }}>
                      เลขบัญชีธนาคาร
                    </InputLabel>
                    <Input
                      sx={{ fontSize: '16px' }}
                      id="cod_bookbank_number"
                      value={isValue.cod_bookbank_number}
                      onChange={handleChange('cod_bookbank_number')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="fluent-emoji:input-numbers" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </ListItem>
              </Box>
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
