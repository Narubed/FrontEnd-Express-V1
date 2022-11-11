import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// @mui

import { styled } from '@mui/material/styles';

import { setToken } from '../../lib/store/session';
// components
import Logo from '../../components/logo';

// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  const dispatch = useDispatch();

  console.log('SimpleLayout');

  useEffect(() => {
    console.log('SimpleLayout');
    const jwt = localStorage.getItem('jwt');
    console.log(jwt, "jwt");
    dispatch(setToken(jwt));
  }, []);
  return (
    <>
      <StyledHeader>
        <Logo />

      </StyledHeader>

      <Outlet />
    </>
  );
}
