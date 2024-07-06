import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullNameError, setFullNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleChangeFullName = (e) => {
    const { value } = e.target;
    setFullName(value);
    setFullNameError(value ? '' : 'Full name is required');
  };

  const handleChangeUsername = (e) => {
    const { value } = e.target;
    setUsername(value);
    setUsernameError(value ? '' : 'Username is required');
  };

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailError(value ? '' : 'Email is required');
  };

  const handleChangePassword = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordError(value ? '' : 'Password is required');
    setConfirmPasswordError(value === confirmPassword ? '' : 'Passwords do not match');
  };

  const handleChangeConfirmPassword = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setConfirmPasswordError(value === password ? '' : 'Passwords do not match');
  };

  const handleSubmit = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword || confirmPasswordError) {
      alert('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setApiSuccess('');

    try {
      const response = await fetch('http://localhost:5000/daftar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullName,
          username: username,
          email: email,
          password: password,
          confpassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.msg);
      } else {
        setApiSuccess(data.msg);
        setFullName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MDBContainer fluid className='UntukForm'>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '500px'}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <h1 className="fw-bold m-0 mb-2 pb-3">
                <Link to="/beranda" className="text-decoration-none text-light">KeyLock</Link>
              </h1>
              <p className="text-white-50 mb-5 text-center fw-lighter">Isi semua field yang dibutuhkan!</p>

              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Nama Lengkap' id='formWhite' type='text' size="lg" value={fullName} onChange={handleChangeFullName} />
              {fullNameError && <div className="text-danger">{fullNameError}</div>}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Username' id='formWhite' type='text' size="lg" value={username} onChange={handleChangeUsername} />
              {usernameError && <div className="text-danger">{usernameError}</div>}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formWhite' type='email' size="lg" value={email} onChange={handleChangeEmail} />
              {emailError && <div className="text-danger">{emailError}</div>}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formWhite' type='password' size="lg" value={password} onChange={handleChangePassword} />
              {passwordError && <div className="text-danger">{passwordError}</div>}
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Confirm Password' id='formWhite' type='password' size="lg" value={confirmPassword} onChange={handleChangeConfirmPassword} />
              {confirmPasswordError && <div className="text-danger">{confirmPasswordError}</div>}

              {apiError && <div className="text-danger">{apiError}</div>}
              {apiSuccess && <div className="text-success">{apiSuccess}</div>}

              <MDBBtn outline className='mx-2 px-5 mt-4' color='light' size='lg' onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Daftar'}
              </MDBBtn>

              <div>
                <p className="mb-3 mt-5">Sudah punya akun ? <Link to="/login" className="text-white-50 fw-bold">Masuk</Link></p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
