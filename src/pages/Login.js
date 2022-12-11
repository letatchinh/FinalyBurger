import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
// import FormLoginPhone from '../components/FormLoginPhone';
import { LOCALSTORED_KEY } from '../constant/urlConstant';
import { auth } from '../firebaseConfig.js';
import axiosClient from '../MyAxios/Axios';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
export default function Login() {
  const schema = yup.object().shape({
    username: yup
      .string()
      .required('Required')
      .email("Invalid Email").typeError('you must specify a numbers'),
    password: yup
      .string()
      .required('Required')
  })
    const { register, handleSubmit, formState: { errors } } = useForm({resolver: yupResolver(schema)});
    const navigate = useNavigate()
    const {mutate , isLoading} = useMutation({
      mutationFn: account => {
        return axiosClient.post('api/users', account)
      },
      onSuccess : (data) => {
        localStorage.setItem(LOCALSTORED_KEY,JSON.stringify(data.data));
       navigate('/hamberger/')
      },
      onError : (data) => {
        alert(data.response.data.message)
      }
      
    })

  const onSubmit = (data) =>{
signInWithEmailAndPassword(auth, data.username, data.password)
  .then((userCredential) => {
    console.log(userCredential);
    mutate(JSON.stringify({
      username : data.username,
      password : data.password
    }))
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);
  });

 
  }
  
  const responseFacebook = (response) => {
    console.log(response);
  }

  return (
    <Paper sx={{width : '40%' , margin : '50px auto' }} elevation={3}>
<form  style={{padding : '10px'}} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} alignItems='center'>
        <Typography variant='h6'>Sign In</Typography>
      <TextField error={errors && errors.username !== undefined} helperText={errors.username && errors.username.message} fullWidth label='Username' variant="outlined"  {...register("username",{required : true})} />
      <TextField type='password' error={errors && errors.password !== undefined} helperText={errors.password && "Password must be Require"} fullWidth label='Password' variant="outlined" {...register("password",{required : true})} />
      {errors.exampleRequired && <span>This field is required</span>}
      {isLoading ? 
      <LoadingButton loading variant="outlined">
        Submit
      </LoadingButton> : <Button variant='contained' type="submit" >Login</Button>}
      <Stack direction='row' alignItems='center' spacing={1}>
          <div style={{width : '200px' , background : 'black' , height : '2px'}}></div>
          <Typography flex={1}>Or</Typography>
          <div style={{width : '200px' , background : 'black' , height : '2px'}}></div>
      </Stack>
      <Link to='/hamberger/register'>
      <Button variant='contained' >Register</Button>
      </Link>
      {/* <FacebookLogin
    appId={process.env.REACT_APP_APP_ID_FB}
    fields="name,email,picture"
    callback={responseFacebook} />
<GoogleLogin
  onSuccess={credentialResponse => {
    var decoded = jwt_decode(credentialResponse.credential);
    console.log(decoded);
  }}
  onError={() => {
    console.log('Login Failed');
  }}/> */}
      </Stack>
    </form>
    {/* <FormLoginPhone /> */}
    </Paper>
  )
}
