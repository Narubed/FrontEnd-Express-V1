/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function TemporaryDrawer(props) {
  const { isOldState, isStatus, setStatus } = props;

  const [state, setState] = React.useState({
    right: false,
  });

  const newStatusState = [];
  isOldState.forEach((element) => {
    const idx = newStatusState.findIndex((item) => item === element.courier_status);
    if (idx === -1) {
      newStatusState.push(element.courier_status);
    }
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const headleCheckStatus = (props) => {
    const { event, item } = props;
    const newArray = [];
    if (event.target.checked) {
      isStatus.forEach((element) => {
        newArray.push(element);
      });
      newArray.push(item);
    } else {
      isStatus.forEach((element) => {
        if (element !== item) {
          newArray.push(element);
        }
      });
    }
    setStatus(newArray);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem key={1} disablePadding>
          <ListItemButton>
            <ListItemIcon>สถานะทั้งหมดของรายงานนี้</ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      {newStatusState.map((item) => (
        <List key={item}>
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FormGroup onChange={(event) => headleCheckStatus({ event, item })}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          isStatus.length !== 0
                            ? isStatus.find((value) => {
                                if (value === item) {
                                  return true;
                                }
                                return false;
                              })
                            : false
                        }
                      />
                    }
                    label={item}
                  />
                </FormGroup>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      ))}
      <Divider />
      <Button fullWidth variant="contained" onClick={() => setStatus([])}>
        clear
      </Button>
    </Box>
  );

  return (
    <div>
      <Tooltip title="Filter list">
        <Button variant="outlined" onClick={toggleDrawer('right', true)}>
          ค้นหาตามสถานะ
        </Button>
      </Tooltip>

      <Drawer anchor={'right'} open={state.right} onClose={toggleDrawer('right', false)}>
        {list('right')}
      </Drawer>
    </div>
  );
}
