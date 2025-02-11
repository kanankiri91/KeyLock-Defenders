import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';

const MySwal = withReactContent(Swal);

function Login() {
  const navigateTo = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingOTP, setIsSubmittingOTP] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangeUsername = (e) => {
    const { value } = e.target;
    setUsername(value);
    setUsernameError(value ? '' : 'Username is required');
  };

  const handleChangePassword = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordError(value ? '' : 'Password is required');
  };

  const handleForgotPassword = async () => {
    const { value: email } = await MySwal.fire({
      title: 'Forgot Password',
      input: 'email',
      inputLabel: 'Enter your email address',
      inputPlaceholder: 'Email address',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Send OTP',
      preConfirm: async (email) => {
        try {
          setIsSubmittingOTP(true); // Mulai loading saat pengiriman OTP dimulai
          await axios.post('http://localhost:5000/request-otp', { email });
          setIsSubmittingOTP(false); // Berhenti loading setelah pengiriman OTP berhasil
          return email;
        } catch (error) {
          setIsSubmittingOTP(false); // Berhenti loading jika pengiriman OTP gagal
          if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error('Failed to send OTP. Please try again.');
          }
        }
      }
    });

    if (email) {
      navigateTo('/forgot-password');
    }
  };

  const handleSubmit = async () => {
    if (!username || !password) {
      alert('Username and password are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/masuk', { username, password });
      const { accessToken, msg } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setIsSubmitting(false);
      
      // Decode JWT token to get the role
      const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
      const userRole = decodedToken.role;

      if (userRole === 1) {
        navigateTo('/admin');
      } else if (userRole === 2) {
        navigateTo('/beranda');
      } else {
        alert('Unknown role');
      }
    } catch (error) {
      setIsSubmitting(false);
      alert('Login failed. Please check your username and password.');
      console.error(error);
    }
  };

  return (
    <MDBContainer fluid className='UntukForm'>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <h1 className="fw-bold m-0 mb-2 pb-3">
                <Link to="/beranda" className="text-decoration-none text-light">KeyLock</Link>
              </h1>
              <p className="text-white-50 mb-5 mt-3 text-center fw-lighter">Masukkan username dan password-mu!</p>

              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Username' id='formWhite' type='text' size="lg" value={username} onChange={handleChangeUsername} />
              {usernameError && <div className="text-danger">{usernameError}</div>}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formWhite' type='password' size="lg" value={password} onChange={handleChangePassword} />
              {passwordError && <div className="text-danger">{passwordError}</div>}

              <p className="medium mb-3 pb-lg-2">
                <Link onClick={handleForgotPassword} className="text-white-50 fw-bold">
                  Forgot Password ?
                </Link>
              </p>
              <MDBBtn outline className='mx-2 px-5' color='light' size='lg' onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Masuk'}
              </MDBBtn>

              {isSubmittingOTP && <p className="text-white mt-3">Sending OTP...</p>}

              <div>
                <p className="mb-3 mt-5">Belum punya akun ? <Link to="/register" className="text-white-50 fw-bold">Daftar</Link></p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
