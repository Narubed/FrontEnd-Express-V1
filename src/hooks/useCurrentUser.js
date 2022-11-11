import { useSelector, useDispatch } from 'react-redux';
import useSWR from 'swr';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { setUser, resetAll } from '../lib/store/session';

export default function useCurrentUser() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.session.token);
  const currentUser = useSelector((state) => state.session.user);
  const fetcher = async (...args) => {
    if (args.length <= 1) {
      args.push({});
    }
    const options = args[1];
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['content-type'] = 'application/json';
    const response = await fetch(...args).catch((err) => console.log(err));
    const json = response.json();
    return json;
  };

  const fetcherWithToken = async (...args) => {
    if (args.length <= 1) {
      args.push({});
    }
    const options = args[1];
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['auth-token'] = `Bearer ${token}`;
    // eslint-disable-next-line no-return-await
    return await fetcher(...args);
  };

  const logout = async () => {
    // const url = "https://sakko-demo-api.herokuapp.com/api/v1/user/sign_out";
    // await fetcherWithToken(url, { method: "DELETE" });
    dispatch(resetAll());
    window.location = '/login';
  };

  const { data: userData } = useSWR(
    token && token.length > 0 ? `${process.env.REACT_APP_API_EXPRESS_V1}/admins/me` : null,
    fetcherWithToken
  );
  useEffect(() => {
    if (userData) {
      console.log(userData);
      if (userData.logout) {
        Swal.fire({
          icon: 'error',
          title: `${userData.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        dispatch(setUser(userData.user));
      }
    }
  }, [userData]);

  return { token, currentUser, fetcher, fetcherWithToken, logout };
}
