import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';

import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../lib/hook-form';
import { setToken } from '../../../lib/store/session';

import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'aof@gmail.com',
    password: '987654321',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    const url = `${process.env.REACT_APP_API_EXPRESS_V1}/signin-admin`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: e.email,
        password: e.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (!json.status) {
      console.log('JOSN', json);
      Swal.fire({
        icon: 'info',
        title: `${json.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      console.log(json);
      await dispatch(setToken(json.token));
      Swal.fire({
        icon: 'success',
        title: `${json.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);

      // window.location.reload();
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} mb={5}>
          <RHFTextField name="email" label="Email address" />

          <RHFTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Login
        </LoadingButton>
      </FormProvider>
    </>
  );
}
