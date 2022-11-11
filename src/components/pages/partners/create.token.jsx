/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function edit(props) {
  const { isSelectedMenu, setOpenCreateToken, isOpenCreateToken, dispatch, setLoading, fetcherWithToken } = props;

  const [isValue, setValue] = useState('');

  useEffect(() => {
    if (isSelectedMenu) {
      fetcherCreateToken();
    }
  }, [isSelectedMenu]);

  const fetcherCreateToken = async () => {
    dispatch(setLoading(true));
    const urlPartners = `${process.env.REACT_APP_API_EXPRESS_V1}/partners/token/${isSelectedMenu._id}`;
    await fetcherWithToken(urlPartners, {
      method: 'GET',
    }).then(async (json) => {
      setValue(json.token);
      setOpenCreateToken(false);
    });
    dispatch(setLoading(false));
  };
  const handleClose = () => {
    setOpenCreateToken(false);
  };

  const handleSubmit = async () => {};

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={isOpenCreateToken}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'สร้าง Token สำหรับพาร์ตเนอร์คนนี้แล้ว'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{isValue}</DialogContentText>
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
