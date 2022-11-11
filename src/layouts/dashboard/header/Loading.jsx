import * as React from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { useSelector } from 'react-redux';
// import CircularProgress from '@mui/material/CircularProgress';
// import CatImage from '/assets/gif/loading-fast.gif';

// import { setLoading } from '../../../lib/store/loading';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AlertDialogSlide() {
  const loading = useSelector((state) => state.loading.loading);
  // const dispatch = useDispatch();

  // const handleClickOpen = () => {
  //   dispatch(setLoading(true));
  // };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button> */}
      <Dialog
        sx={{ background: 'transparent' }}
        open={loading}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent sx={{ p: 1, m: 0 }}>
          {/* <CircularProgress /> */}
          <img src="/assets/gif/loading-fast.gif" width="160px" height="160px" alt={123} />
          {/* <Button
            variant="outlined"
            onClick={() => dispatch(setLoading(false))}
          >
            Slide in alert dialog
          </Button> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
