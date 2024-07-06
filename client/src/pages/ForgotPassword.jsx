import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigateTo = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // use environment variable

  const handleSubmit = async () => {
    if (!email || !otp || !newPassword) {
      if (!email) setEmailError('Email is required');
      if (!otp) setOtpError('OTP is required');
      if (!newPassword) setNewPasswordError('New password is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${backendUrl}/verify-otp`, { email, otp, newPassword });
      setIsSubmitting(false);
      navigateTo('/login');
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to reset password. Please check your email, OTP, and new password.');
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
              <p className="text-white-50 mb-5 mt-3 text-center fw-lighter">Masukkan Kode OTP dan Password baru anda</p>

              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formWhite' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
              {emailError && <div className="text-danger">{emailError}</div>}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Kode OTP' id='formWhite' type='text' size="lg" value={otp} onChange={(e) => setOtp(e.target.value)} />
              {otpError && <div className="text-danger">{otpError}</div>}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password Baru' id='formWhite' type='password' size="lg" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              {newPasswordError && <div className="text-danger">{newPasswordError}</div>}

              <p className="small mb-3 pb-lg-2">
                <Link to="/login" className="text-white-50">Kembali ke Masuk</Link>
              </p>
              <MDBBtn outline className='mx-2 px-5' color='light' size='lg' onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ForgotPassword;
