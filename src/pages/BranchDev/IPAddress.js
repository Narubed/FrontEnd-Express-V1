/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import { setLoading } from '../../lib/store/loading';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import useCurrentUser from '../../hooks/useCurrentUser';
import UpdateIPAddress from '../../components/pages/BranchDev/ipaddress/update';
import CreateIPAddress from '../../components/pages/BranchDev/ipaddress/create';
// sections
import { ListHead, ListToolbar } from '../../lib/tabel';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ip_address', label: 'IP Address', alignRight: false },
  { id: 'ip_note', label: 'หมายเหตุ', alignRight: false },
  { id: 'ip_timestamp', label: 'วันที่เพิ่ม', alignRight: false },

  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.ip_address.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.ip_note.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const dispatch = useDispatch();
  //   const loading = useSelector((state) => state.loading.loading);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isIPAddress, setIPAddress] = useState([]);

  const [isSelectedMenu, setSelectedMenu] = useState({});

  const [isOpenUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetcherPartner();
    }
  }, [currentUser]);

  const fetcherPartner = async () => {
    dispatch(setLoading(true));
    const urlIPAddress = `${process.env.REACT_APP_API_EXPRESS_DEV}/ip-address`;
    await fetcherWithToken(urlIPAddress, {
      method: 'GET',
    })
      .then((json) => {
        setIPAddress(json.data);
        console.log(json.data);
      })
      .catch(() => setIPAddress([]));
    dispatch(setLoading(false));
  };
  const handleOpenMenu = (props) => {
    const { event, row } = props;
    setSelectedMenu(row);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = isIPAddress.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const headleDeleteIPAddress = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(setLoading(true));
        const urlPartners = `${process.env.REACT_APP_API_EXPRESS_DEV}/ip-address/${isSelectedMenu._id}`;
        await fetcherWithToken(urlPartners, {
          method: 'DELETE',
        }).then(async () => {
          await fetcherPartner();
        });
        dispatch(setLoading(false));

        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการทำรายการ',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - isIPAddress.length) : 0;

  const filteredUsers = applySortFilter(isIPAddress, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> IP Address | NBADigitalservice </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            IP Address
          </Typography>
          <CreateIPAddress
            fetcherWithToken={fetcherWithToken}
            dispatch={dispatch}
            setLoading={setLoading}
            fetcherPartner={fetcherPartner}
          />
        </Stack>

        <Card>
          <ListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={isIPAddress.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, ip_address, ip_note, ip_timestamp } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox" />
                        <TableCell>{ip_address}</TableCell>
                        <TableCell>{ip_note}</TableCell>
                        <TableCell>
                          {dayjs(ip_timestamp).locale('th').add(543, 'year').format('DD MMM YYYY HH:mm')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu({ event, row })}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={isIPAddress.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOpen(false);
            setOpenUpdate(true);
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            headleDeleteIPAddress();
            setOpen(false);
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <UpdateIPAddress
        isSelectedMenu={isSelectedMenu}
        setOpenUpdate={setOpenUpdate}
        isOpenUpdate={isOpenUpdate}
        dispatch={dispatch}
        setLoading={setLoading}
        fetcherWithToken={fetcherWithToken}
        fetcherPartner={fetcherPartner}
      />
    </>
  );
}
