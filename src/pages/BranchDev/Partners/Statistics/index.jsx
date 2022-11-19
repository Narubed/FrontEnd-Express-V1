/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import dayjs from 'dayjs';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  Checkbox,
} from '@mui/material';
// components
import { setLoading } from '../../../../lib/store/loading';
import Scrollbar from '../../../../components/scrollbar';
import useCurrentUser from '../../../../hooks/useCurrentUser';
// sections

import { ListHead, ListToolbar } from '../../../../lib/tabel';

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
  const [isOldState, setOldState] = useState([]);
  const [isStatus, setStatus] = useState([]);

  const [dates, setDates] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetcherData();
    }
  }, [currentUser]);

  useEffect(() => {
    const newState = [];
    if (isStatus.length !== 0) {
      isStatus.forEach((element) => {
        const filterByStatus = isOldState.filter((item) => item.courier_status === element);
        if (filterByStatus.length !== 0) {
          filterByStatus.map((item) => newState.push(item));
        }
      });
      setState(newState);
    } else {
      setState(isOldState);
    }
  }, [isStatus]);

  const fetcherData = async () => {
    dispatch(setLoading(true));
    const urlPartners = `${process.env.REACT_APP_API_EXPRESS_DEV}/purchase/purchase-courier`;
    await fetcherWithToken(urlPartners, {
      method: 'GET',
    })
      .then(async (json) => {
        // setState(json.data);
        const filterStatus = json.data.filter((item) => item.purchase_status === 'paid');
        await filterAndfindTrackingCode(filterStatus);
      })
      .catch(() => setState([]));
    dispatch(setLoading(false));
  };
  const filterAndfindTrackingCode = (props) => {
    const filterPartnerById = props.filter((item) => item.partner_id === query);
    // filterStatus ของ Tracking ก่อนด้วย
    const newArray = [];
    filterPartnerById.forEach((element) => {
      const filterCourier = element.all;
      filterCourier.map((item) => newArray.push(item));
    });
    const filteredCutAround = [];
    newArray.forEach((element) => {
      if (element && !element.courier_cutarourd) {
        filteredCutAround.push(element);
      }
    });
    setOldState(filteredCutAround);
    setState(filteredCutAround);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.map((n) => n._id);
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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const onClickCurAround = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการตัดรอบรายการทั้งหมดนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: 'error',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(setLoading(true));

        const total = [];
        selected.forEach((element) => {
          const idx = isOldState.findIndex((item) => item._id === element);
          if (idx !== -1) {
            total.push(isOldState[idx].price);
            // isOldState[idx]
          }
        });

        const urlTax = `${process.env.REACT_APP_API_EXPRESS_DEV}/check/tax/cut-around`;
        const findTax = await fetcherWithToken(urlTax, {
          method: 'POST',
          body: JSON.stringify({ date: Date.now() }),
        });
        const postCutAround = {
          cut_id: findTax.tax,
          cut_parners_id: query,
          cut_status: 'ตัดรอบการชำระแล้ว',
          cut_total: total.reduce((sum, item) => sum + item, 0),
          cut_timestamp: [
            {
              name: 'ตัดรอบการชำระแล้ว',
              timestamp: Date.now(),
            },
          ],
        };
        const urlCutAround = `${process.env.REACT_APP_API_EXPRESS_DEV}/cut-around`;
        await fetcherWithToken(urlCutAround, {
          method: 'POST',
          body: JSON.stringify(postCutAround),
        });

        await fetcherWithToken(urlTax, {
          method: 'POST',
          body: JSON.stringify({ date: Date.now() }),
        });

        const url = `${process.env.REACT_APP_API_EXPRESS_DEV}/courier/update-cut-around`;
        const dataPostCutAround = {
          courier_id: selected,
          tax: findTax.tax,
        };
        await fetcherWithToken(url, {
          method: 'POST',
          body: JSON.stringify(dataPostCutAround),
        });
        dispatch(setLoading(false));
        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการทำรายการ',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(async () => {
          setSelected([]);
          setStatus([]);
          setDates(null);
          await fetcherData();
        }, 1500);
      }
    });
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
            Statistics (รายการที่ยังไม่ถูกตัดรอบทั้งหมด)
          </Typography>
        </Stack>

        <Card>
          <ListToolbar
            onClickCurAround={onClickCurAround}
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            isOldState={isOldState}
            isStatus={isStatus}
            setStatus={setStatus}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={isState.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

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
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>
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
