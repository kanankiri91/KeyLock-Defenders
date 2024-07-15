import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

function AlertMe() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptionError, setSelectedOptionError] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigateTo = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/token`);
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      if (decoded.role === 1) { // Jika role adalah admin, arahkan ke halaman admin
        navigateTo('/admin');
      }
    } catch (error) {
      if (error) {
        navigateTo('/login');
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get((`http://localhost:5000/token`));
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      if (decoded.role === 1) { // Jika role adalah admin, arahkan ke halaman admin
        navigateTo('/admin');
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailError(value ? '' : 'Email is required');
  };

  const handleChangeWhatsapp = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    setWhatsapp(numericValue);
    setWhatsappError(numericValue ? '' : 'WhatsApp number is required');
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setSelectedOption(value);
    setSelectedOptionError(value ? '' : 'Please select an option');
  };

  const handleSubmit = async () => {
    if (!email || !whatsapp || !selectedOption || !isAgreed) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosJWT.post(`http://localhost:5000/masukkan-data`, {
        email,
        whatsapp,
        selectedOption
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data.message);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data anda sudah terekam',
        icon: 'success',
        backdrop: `
          rgba(0,0,0,0.8)
          url("https://i.pinimg.com/originals/63/13/79/63137910e4cbb9097a81f6b8e6836623.gif")
          center center
          no-repeat
        `,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          navigateTo('/beranda');
        }
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message || 'Email anda sudah terdaftar');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <header className="w-100 min-vh-100 d-flex align-items-center overflow-hidden">
      <MDBContainer fluid className='UntukForm'>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
              <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                <h1 className="fw-bold m-0 mb-2 pb-3">
                  <Link to="/beranda" className="text-decoration-none text-light">KeyLock</Link>
                </h1>
                <p className="text-white-50 mb-5 mt-3 text-center fw-lighter">Masukkan email dan nomor telepon-mu untuk pemeriksaan!</p>

                <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formWhite' type='email' size="lg" value={email} onChange={handleChangeEmail} />
                {emailError && <div className="text-danger">{emailError}</div>}
                <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='WhatsApp' id='formWhite' type='tel' size="lg" value={whatsapp} onChange={handleChangeWhatsapp} />
                {whatsappError && <div className="text-danger">{whatsappError}</div>}

                <select className="form-select form-select-lg mb-3 bg-dark text-white" aria-label=".form-select-lg example" onChange={handleSelectChange} value={selectedOption}>
                  <option value="" disabled>Tentukan Rasio Pemeriksaan</option>
                  <option value="1">15 hari</option>
                  <option value="2">30 hari</option>
                  <option value="3">45 hari</option>
                </select>
                {selectedOptionError && <div className="text-danger">{selectedOptionError}</div>}

                <MDBValidation className='row g-3'>
                  <MDBValidationItem className='col-12' feedback='You must agree before submitting.' invalid>
                    <MDBCheckbox label='Agree to terms and conditions' id='invalidCheck' checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} required />
                  </MDBValidationItem>
                </MDBValidation>
                <MDBBtn outline className='mx-2 px-5 mt-5' color='light' size='lg' onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Kabari Aku!'}
                </MDBBtn>
                {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </header>
  );
}

export default AlertMe;
