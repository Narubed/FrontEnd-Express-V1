/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';

import { filter } from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import { setLoading } from '../../../lib/store/loading';
import Scrollbar from '../../../components/scrollbar';
import useCurrentUser from '../../../hooks/useCurrentUser';
// sections
import { ListHead } from '../../../lib/tabel';
import StateListToolbar from '../../../components/pages/cut-around/statistics/StateListToolbar';

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'purchase_id', label: 'เลขออเดอร์', alignRight: false },
  { id: 'tracking_code', label: 'tracking', alignRight: false },
  { id: 'courier_code', label: 'ขนส่ง', alignRight: false },
  { id: 'courier_status', label: 'สถานะ', alignRight: false },
  { id: 'price', label: 'ราคา', alignRight: false },
  { id: 'datetime_order', label: 'วันที่รับออเดอร์', alignRight: false },
  { id: 'datetime_shipping', label: 'วันที่ขนส่งเข้ารับ', alignRight: false },
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
        _user.tracking_code.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.courier_code.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.courier_status.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.datetime_order.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.datetime_shipping.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const componentToPrintFullA4 = useRef(null);
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = search.substring(1);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isState, setState] = useState([]);

  const [dates, setDates] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetcherData();
    }
  }, [currentUser]);

  const fetcherData = async () => {
    dispatch(setLoading(true));
    const urlCutAround = `${process.env.REACT_APP_API_EXPRESS_V1}/courier/tax/cutaround/${query}`;
    await fetcherWithToken(urlCutAround, {
      method: 'GET',
    })
      .then(async (json) => {
        console.log(json);
        setState(json.data);
      })
      .catch(() => setState([]));
    dispatch(setLoading(false));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const onChangeDatePicker = (event) => {
    setDates(event.value);
  };

  const newStates =
    dates !== null && dates.length >= 2
      ? isState.filter(
          (item) =>
            dayjs(item.datetime_shipping).format('DD MM YYYY') >= dayjs(dates[0]).format('DD MM YYYY') &&
            dayjs(item.datetime_shipping).format('DD MM YYYY') <= dayjs(dates[1]).format('DD MM YYYY')
        )
      : isState;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newStates.length) : 0;

  const filteredUsers = applySortFilter(newStates, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Statistics | NBADigitalservice </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            รายการที่ถูกตัดรอบแล้ว ({`${query}`})
          </Typography>
        </Stack>

        <Card>
          <StateListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            componentToPrintFullA4={componentToPrintFullA4}
          />

          <div style={{ padding: '0px 24px' }}>
            ค้นหาตามวันที่ ขนส่งเข้ารับออเดอร์ <br />
            {selected.length < 1 && (
              <Calendar id="range" value={dates} onChange={onChangeDatePicker} selectionMode="range" readOnlyInput />
            )}
            <Button onClick={() => setDates(null)}>RESET</Button>
          </div>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <div ref={(el) => (componentToPrintFullA4.current = el)}>
                <Table>
                  <ListHead order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onRequestSort={handleRequestSort} />

                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        _id,
                        courier_code,
                        courier_status,
                        tracking_code,
                        datetime_order,
                        datetime_shipping,
                        purchase_id,
                        price,
                      } = row;
                      const selectedUser = selected.indexOf(_id) !== -1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox" />
                          <TableCell>{purchase_id}</TableCell>
                          <TableCell>{tracking_code}</TableCell>
                          <TableCell>{courier_code}</TableCell>
                          <TableCell>{courier_status}</TableCell>
                          <TableCell>{numeral(price).format('0,0.00')}</TableCell>
                          <TableCell>{datetime_order}</TableCell>
                          <TableCell>{datetime_shipping}</TableCell>
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
              </div>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
