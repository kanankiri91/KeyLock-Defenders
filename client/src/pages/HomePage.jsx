import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { semua } from "../data.js";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TupaiImage from "../assets/Tupai.png";

const HomePage = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(''); // Tambahkan state untuk role
  const navigateTo = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      setRole(decoded.role); // Simpan role pengguna
      if (decoded.role === 1) { // Periksa apakah pengguna adalah admin
        navigateTo('/admin'); // Arahkan admin ke halaman admin
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
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      setRole(decoded.role); // Simpan role pengguna
      if (decoded.role === 1) { // Periksa apakah pengguna adalah admin
        navigateTo('/admin'); // Arahkan admin ke halaman admin
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosJWT.post('http://localhost:5000/cek-email', { email });
      const { message, data } = response.data;
      let alertText = `<div style="margin-top: 10px;">${message}</div>`;
      if (data && data.length > 0) {
        alertText += '<div style="margin-top: 20px; font-weight: bold;">Web yang terindikasi membocorkan data anda :</div>';
        alertText += '<div style="margin-top: 20px;" class="list_breach_web">';
        data.forEach(breach => {
          alertText += `<div style="margin-top: 20px;>${breach.Name}</div>`;
        });
        alertText += '</div>';
      }
      Swal.fire({
        title: 'Pengecekan selesai!',
        html: alertText,
        icon: 'success',
        backdrop: `rgba(0,0,0,0.8) url("https://i.pinimg.com/originals/63/13/79/63137910e4cbb9097a81f6b8e6836623.gif") center center no-repeat`,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          navigateTo('/beranda');
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Terjadi kesalahan saat pengecekan email.',
        icon: 'error',
      });
    }
  };
  
  return (
    <div className="homepage">
      <header className="w-100 min-vh-100 d-flex align-items-center overflow-hidden">
        <Container>
          <Row className="header-box d-flex align-items-center">
            <Col lg="6">
              <h1 className="mb-4 animate__animated animate__fadeInLeftBig animate__delay-1s">
                Apakah <br /> <span>Emailmu</span><br />Sudah Aman ?
              </h1>
              <p className="mb-4 animate__animated animate__fadeInLeftBig animate__delay-1s">
                Cari tahu apakah emailmu pernah bocor dengan KeyLock, website yang membantu mengidentifikasi kebocoran pada akunmu. 
              </p>
              <form onSubmit={handleSubmit} className="animate__animated animate__bounceInUp animate__delay-1s">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Masukkan Email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', height: '50px' }}
                  />
                </Form.Group>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-outline-dark btn-lg rounded-1 me-2 identifikasi-button" style={{ width: '30%', height: '45px' }}>
                    Identifikasi
                  </button>
                </div>
              </form>
            </Col>
            <Col lg="6" className="pt-lg-0 pt-5 " >
               <img src={TupaiImage} alt="hero_img" className="animate__animated animate__zoomInUp" />
             </Col>
          </Row>
        </Container>
      </header>
      <div className="kelas w-100 min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center fw-bold">Cara Mencegah Kebocoran Email</h1>
              <p className="text-center">Dengan langkah-langkah sederhana ini, Anda dapat mengamankan email Anda dari ancaman kebocoran dan penyalahgunaan data</p>
            </Col>
          </Row>
          <Row>
            {semua.map((kelas) => {
              const handleButtonClick = () => {
                window.location.href = kelas.url;
              };
              return (
                <Col key={kelas.id} data-aos="flip-left" data-aos-duration="1000" data-aos-delay={kelas.delay}>
                  <img src={kelas.image} alt="" className="mb-5 rounded-5" />
                  <h5 className="mb-3 px-3 text-center fw-bold">{kelas.title}</h5>
                  <p className="text-center ">{kelas.desc}</p>
                  <div className="ket d-flex justify-content-center">
                    <button className="btn btn-outline-dark rounded-3" onClick={handleButtonClick}>{kelas.buy}</button>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
